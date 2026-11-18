#!/usr/bin/env python3
"""Verify a locally archived Summoners War Siege."""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ValueError(f"JSON inválido ou ausente: {path}: {error}") from error
    if not isinstance(value, dict):
        raise ValueError(f"JSON deve conter um objeto: {path}")
    return value


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def verify(archive_root: Path, match_id: str | None) -> dict[str, Any]:
    archive_root = archive_root.expanduser().resolve()
    index = load_json(archive_root / "index.json")
    archives = index.get("archives") or []
    if not archives:
        raise ValueError("o índice não contém Sieges arquivadas")
    entry = next((item for item in archives if str(item.get("matchId")) == str(match_id)), None) if match_id else archives[0]
    if entry is None:
        raise ValueError(f"match_id não encontrado no índice: {match_id}")

    destination = archive_root / str(entry["matchId"])
    manifest = load_json(destination / "manifest.json")
    summary = load_json(destination / "summary.json")
    errors = []

    for source in manifest.get("sourceEvents") or []:
        path = (destination / source["file"]).resolve()
        if destination not in path.parents:
            errors.append(f"caminho bruto fora do arquivo: {source['file']}")
            continue
        if not path.is_file():
            errors.append(f"evento bruto ausente: {source['file']}")
            continue
        if path.stat().st_size != source["bytes"]:
            errors.append(f"tamanho divergente: {source['file']}")
        if sha256(path) != source["sha256"]:
            errors.append(f"hash divergente: {source['file']}")

    expected = manifest.get("recordCounts") or {}
    actual = {
        "players": len(summary.get("players") or []),
        "offensiveBattles": len((summary.get("offense") or {}).get("battles") or []),
        "defensiveBattles": len((summary.get("defense") or {}).get("battles") or []),
        "rawEvents": len(manifest.get("sourceEvents") or []),
    }
    for key, value in actual.items():
        if expected.get(key) != value:
            errors.append(f"contagem divergente em {key}: manifesto={expected.get(key)} resumo={value}")
    if str(summary.get("match", {}).get("match_id")) != str(entry["matchId"]):
        errors.append("match_id do resumo não coincide com o índice")

    return {
        "matchId": entry["matchId"],
        "status": manifest.get("status"),
        "valid": not errors,
        "counts": actual,
        "errors": errors,
        "warnings": manifest.get("warnings") or [],
        "path": str(destination),
    }


def parse_args() -> argparse.Namespace:
    project_root = Path(__file__).resolve().parents[4]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive-dir", default=str(project_root / "data/siege-history"))
    parser.add_argument("--match-id")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        result = verify(Path(args.archive_dir), args.match_id)
    except ValueError as error:
        print(f"erro: {error}", file=sys.stderr)
        return 2
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
