#!/usr/bin/env python3
"""Normalize finished Summoners War Siege captures from SWEX-NG."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable


EVENTS = {
    "participation": "GetGuildSiegeParticipationInfo",
    "matchup": "GetGuildSiegeMatchupInfoForFinished",
    "summary": "getGuildSiegeMatchBattleLogSummary_v2",
    "battle": "GetGuildSiegeBattleLog",
    "history": "GetGuildSiegeMatchLog",
}


def load_json(path: Path) -> dict[str, Any] | None:
    try:
        with path.open("r", encoding="utf-8") as handle:
            value = json.load(handle)
        return value if isinstance(value, dict) else None
    except (OSError, json.JSONDecodeError):
        return None


def event_files(directory: Path, event: str) -> list[tuple[Path, dict[str, Any]]]:
    records = []
    for path in directory.glob(f"*-{event}.json"):
        data = load_json(path)
        if data is not None:
            records.append((path, data))
    return sorted(records, key=lambda item: item[0].stat().st_mtime, reverse=True)


def first_match_id(data: dict[str, Any]) -> int | None:
    direct = [
        (data.get("match_info") or {}).get("match_id"),
        (data.get("participation_info") or {}).get("match_id"),
    ]
    for value in direct:
        if value is not None:
            return int(value)
    for key in ("guild_list", "guildsiege_match_log_list"):
        values = data.get(key) or []
        if values and values[0].get("match_id") is not None:
            return int(values[0]["match_id"])
    for group in data.get("log_list") or []:
        guilds = group.get("guild_info_list") or []
        if guilds and guilds[0].get("match_id") is not None:
            return int(guilds[0]["match_id"])
    return None


def contains_match(data: dict[str, Any], match_id: int) -> bool:
    if first_match_id(data) == match_id:
        return True
    return any(
        int(item.get("match_id", -1)) == match_id
        for item in data.get("guildsiege_match_log_list") or []
    )


def latest_for_match(
    records: Iterable[tuple[Path, dict[str, Any]]], match_id: int
) -> tuple[Path, dict[str, Any]] | None:
    return next((item for item in records if contains_match(item[1], match_id)), None)


def choose_match_id(
    requested: int | None, *record_groups: list[tuple[Path, dict[str, Any]]]
) -> int:
    if requested is not None:
        return requested
    for records in record_groups:
        for _, data in records:
            match_id = first_match_id(data)
            if match_id is not None:
                return match_id
    raise ValueError("nenhuma partida finalizada foi encontrada")


def load_catalog(path: Path) -> dict[int, dict[str, Any]]:
    data = load_json(path)
    if data is None:
        raise ValueError(f"catálogo inválido: {path}")
    result = {}
    for monster in data.get("monsters") or []:
        com2us_id = (monster.get("externalIds") or {}).get("com2us")
        if com2us_id is not None:
            result[int(com2us_id)] = monster
    return result


def percentage(successes: int, total: int) -> float | None:
    return round(successes * 100 / total, 1) if total else None


def extract_deck(info: Any, index: int) -> list[int]:
    value = None
    if isinstance(info, list) and index < len(info):
        value = info[index]
    elif isinstance(info, dict):
        value = info.get(str(index), info.get(index))
    if not isinstance(value, list):
        return []
    return [int(item) for item in value]


def make_team(ids: list[int], catalog: dict[int, dict[str, Any]]) -> dict[str, Any]:
    names, signature = [], []
    for com2us_id in ids:
        monster = catalog.get(com2us_id)
        if monster is None:
            names.append(f"ID {com2us_id}")
            signature.append(f"id:{com2us_id}")
        else:
            names.append(monster.get("canonicalName") or monster.get("name") or f"ID {com2us_id}")
            signature.append(str(monster.get("skillGroupId") or f"id:{com2us_id}"))
    return {
        "display": " / ".join(names) if names else "Trio indisponível",
        "names": names,
        "com2us_ids": ids,
        "skill_group_signature": signature,
    }


def battle_rows(data: dict[str, Any] | None, match_id: int) -> list[dict[str, Any]]:
    rows = []
    for group in (data or {}).get("log_list") or []:
        group_match_ids = {
            int(guild["match_id"])
            for guild in group.get("guild_info_list") or []
            if guild.get("match_id") is not None
        }
        if group_match_ids and match_id not in group_match_ids:
            continue
        for row in group.get("battle_log_list") or []:
            row_match_id = row.get("match_id")
            if row_match_id is not None and int(row_match_id) != match_id:
                continue
            rows.append(row)
    return rows


def normalize_attacks(
    rows: list[dict[str, Any]], guild_id: int, catalog: dict[int, dict[str, Any]]
) -> list[dict[str, Any]]:
    output = []
    for row in rows:
        if int(row.get("guild_id", -1)) != guild_id or int(row.get("log_type", 0)) != 1:
            continue
        output.append(
            {
                "player": row.get("wizard_name") or "Desconhecido",
                "opponent": row.get("opp_wizard_name") or "Desconhecido",
                "base": row.get("base_number"),
                "result": "win" if int(row.get("win_lose", 0)) == 1 else "loss",
                "timestamp": row.get("log_timestamp"),
                "attack": make_team(extract_deck(row.get("view_battle_deck_info"), 0), catalog),
                "defense": make_team(extract_deck(row.get("view_battle_deck_info"), 1), catalog),
            }
        )
    return output


def normalize_defenses(
    rows: list[dict[str, Any]], guild_id: int, catalog: dict[int, dict[str, Any]]
) -> list[dict[str, Any]]:
    output = []
    for row in rows:
        if int(row.get("guild_id", -1)) != guild_id or int(row.get("log_type", 0)) != 2:
            continue
        output.append(
            {
                "owner": row.get("wizard_name") or "Desconhecido",
                "opponent": row.get("opp_wizard_name") or "Desconhecido",
                "base": row.get("base_number"),
                "result": "hold" if int(row.get("win_lose", 0)) == 1 else "loss",
                "timestamp": row.get("log_timestamp"),
                "defense": make_team(extract_deck(row.get("view_battle_deck_info"), 1), catalog),
            }
        )
    return output


def totals(rows: list[dict[str, Any]], success: str) -> dict[str, Any]:
    wins = sum(row["result"] == success for row in rows)
    return {
        "battles": len(rows),
        "wins" if success == "win" else "holds": wins,
        "losses": len(rows) - wins,
        "rate": percentage(wins, len(rows)),
    }


def composition_groups(
    rows: list[dict[str, Any]], team_key: str, success: str, owner_key: str | None = None
) -> list[dict[str, Any]]:
    groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        groups[row[team_key]["display"]].append(row)
    result = []
    for display, items in groups.items():
        wins = sum(item["result"] == success for item in items)
        record: dict[str, Any] = {
            "composition": display,
            "battles": len(items),
            "wins" if success == "win" else "holds": wins,
            "losses": len(items) - wins,
            "rate": percentage(wins, len(items)),
            "skill_group_signature": items[0][team_key]["skill_group_signature"],
        }
        if owner_key:
            record["owners"] = sorted({str(item[owner_key]) for item in items})
        result.append(record)
    success_key = "wins" if success == "win" else "holds"
    return sorted(result, key=lambda item: (item["battles"], item[success_key]), reverse=True)


def matchup_groups(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    groups: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        groups[(row["defense"]["display"], row["attack"]["display"])].append(row)
    result = []
    for (defense, attack), items in groups.items():
        wins = sum(item["result"] == "win" for item in items)
        result.append(
            {
                "defense": defense,
                "attack": attack,
                "battles": len(items),
                "wins": wins,
                "losses": len(items) - wins,
                "rate": percentage(wins, len(items)),
                "players": sorted({str(item["player"]) for item in items}),
                "defense_skill_group_signature": items[0]["defense"]["skill_group_signature"],
            }
        )
    return sorted(result, key=lambda item: (item["battles"], item["wins"]), reverse=True)


def player_groups(summary: dict[str, Any] | None, guild_id: int) -> list[dict[str, Any]]:
    if not summary:
        return []
    names = {
        int(item["wizard_id"]): item.get("wizard_name") or "Desconhecido"
        for item in summary.get("wizard_info_list") or []
        if int(item.get("guild_id", -1)) == guild_id
    }
    stats = {
        wizard_id: {"player": name, "attacks": 0, "attack_wins": 0, "defenses": 0, "holds": 0}
        for wizard_id, name in names.items()
    }
    for row in summary.get("wizard_battle_log_list") or []:
        if int(row.get("guild_id", -1)) != guild_id:
            continue
        item = stats.get(int(row.get("wizard_id", -1)))
        if item is None:
            continue
        if int(row.get("log_type", 0)) == 1:
            item["attacks"] += 1
            item["attack_wins"] += int(row.get("win_lose", 0)) == 1
        elif int(row.get("log_type", 0)) == 2:
            item["defenses"] += 1
            item["holds"] += int(row.get("win_lose", 0)) == 1
    output = []
    for item in stats.values():
        item["attack_losses"] = item["attacks"] - item["attack_wins"]
        item["attack_rate"] = percentage(item["attack_wins"], item["attacks"])
        item["defense_losses"] = item["defenses"] - item["holds"]
        item["hold_rate"] = percentage(item["holds"], item["defenses"])
        output.append(item)
    return sorted(output, key=lambda item: (item["attack_wins"], item["attacks"]), reverse=True)


def history_rows(data: dict[str, Any] | None, guild_id: int) -> list[dict[str, Any]]:
    output = []
    for item in (data or {}).get("guildsiege_match_log_list") or []:
        guilds = item.get("guild_info") or []
        own = next((guild for guild in guilds if int(guild.get("guild_id", -1)) == guild_id), None)
        if own is None:
            continue
        output.append(
            {
                "match_id": item.get("match_id"),
                "start": item.get("match_start"),
                "finish": item.get("match_finish"),
                "format": match_format(len(guilds)),
                "rank": own.get("match_rank"),
                "score": own.get("match_score"),
                "attacks": own.get("attack_count"),
                "opponents": [
                    guild.get("guild_name")
                    for guild in guilds
                    if int(guild.get("guild_id", -1)) != guild_id
                ],
            }
        )
    return output


def match_format(guild_count: int) -> str:
    return {2: "1x1", 3: "1x1x1"}.get(guild_count, f"{guild_count} guildas")


def pt_number(value: int | None) -> str:
    return "?" if value is None else f"{value:,}".replace(",", ".")


def pt_percentage(value: float | None) -> str:
    return "?" if value is None else str(value).replace(".", ",")


def render_markdown(report: dict[str, Any]) -> str:
    match, guild = report["match"], report["guild"]
    offense, defense = report["offense"], report["defense"]
    opponents = ", ".join(item["name"] for item in guild["opponents"]) or "desconhecido"
    attack = offense["summary"]
    defend = defense["summary"]
    lines = [
        f"🏰 PÓS-SIEGE — {guild['name']} × {opponents}",
        f"Formato: {match['format']} | Colocação: {guild.get('rank', '?')}º | Placar: {pt_number(guild.get('score'))}",
        "",
        "⚔️ ATAQUE",
        f"• {attack['wins']} vitórias / {attack['losses']} derrotas — {pt_percentage(attack['rate'])}%",
        "",
        "🛡️ DEFESA",
        f"• {defend['holds']} holds / {defend['losses']} derrotas — {pt_percentage(defend['rate'])}%",
    ]
    ranked_defenses = sorted(
        defense["compositions"], key=lambda item: (item["holds"], item["battles"]), reverse=True
    )[:3]
    if ranked_defenses:
        lines.extend(["", "🔥 DESTAQUES DEFENSIVOS"])
        for item in ranked_defenses:
            lines.append(
                f"• {item['composition']} — {item['holds']}/{item['battles']} ({pt_percentage(item['rate'])}%)"
            )
    successful = [item for item in offense["matchups"] if item["wins"] > 0][:3]
    if successful:
        lines.extend(["", "✅ COUNTERS OBSERVADOS"])
        for item in successful:
            lines.append(
                f"• {item['attack']} vs {item['defense']} — {item['wins']}/{item['battles']} vitórias"
            )
    if report["data_quality"]["warnings"]:
        lines.extend(["", "⚠️ DADOS"])
        lines.extend(f"• {warning}" for warning in report["data_quality"]["warnings"])
    lines.extend(
        ["", "Legenda: ✅ counter observado | 🔥 destaque da amostra | ⚠️ limitação ou divergência"]
    )
    return "\n".join(lines)


def archive_report(report: dict[str, Any], archive_root: Path) -> dict[str, Any]:
    match_id = str(report["match"]["match_id"])
    destination = archive_root.expanduser().resolve() / match_id
    raw_destination = destination / "raw"
    raw_destination.mkdir(parents=True, exist_ok=True)

    copied_sources: dict[str, str | None] = {}
    source_events = []
    for event_name, source_value in report["data_quality"]["sources"].items():
        if not source_value:
            copied_sources[event_name] = None
            continue
        source = Path(source_value)
        if not source.is_file():
            copied_sources[event_name] = None
            continue
        target = raw_destination / source.name
        shutil.copy2(source, target)
        relative = str(target.relative_to(destination))
        copied_sources[event_name] = relative
        source_events.append(
            {
                "event": event_name,
                "file": relative,
                "sha256": file_sha256(target),
                "bytes": target.stat().st_size,
            }
        )

    required = ["matchup", "summary", "battle_log_type_1", "battle_log_type_2"]
    missing_required = [name for name in required if not copied_sources.get(name)]
    archived_at = datetime.now(timezone.utc).isoformat()
    status = "partial" if missing_required else "complete_with_warnings" if report["data_quality"]["warnings"] else "complete"
    existing_manifest = load_json(destination / "manifest.json")
    status_rank = {"partial": 0, "complete_with_warnings": 1, "complete": 2}
    if existing_manifest and status_rank.get(existing_manifest.get("status"), -1) > status_rank[status]:
        return {
            "schemaVersion": 1,
            "status": existing_manifest["status"],
            "writeStatus": "preserved_higher_quality_archive",
            "attemptedStatus": status,
            "path": match_id,
        }
    archive_metadata = {
        "schemaVersion": 1,
        "status": status,
        "writeStatus": "written",
        "path": match_id,
        "archivedAt": archived_at,
        "summary": "summary.json",
        "manifest": "manifest.json",
        "rawDirectory": "raw",
        "missingRequiredEvents": missing_required,
        "enemyAttackTeamsAvailable": False,
    }

    archived_report = json.loads(json.dumps(report, ensure_ascii=False))
    archived_report["data_quality"]["sources"] = copied_sources
    archived_report["archive"] = archive_metadata
    manifest = {
        **archive_metadata,
        "match": archived_report["match"],
        "guild": {
            "name": archived_report["guild"]["name"],
            "opponents": [item["name"] for item in archived_report["guild"]["opponents"]],
        },
        "recordCounts": {
            "players": len(archived_report["players"]),
            "offensiveBattles": len(archived_report["offense"]["battles"]),
            "defensiveBattles": len(archived_report["defense"]["battles"]),
            "rawEvents": len(source_events),
        },
        "sourceEvents": source_events,
        "warnings": archived_report["data_quality"]["warnings"],
    }
    write_json_atomic(destination / "summary.json", archived_report)
    write_json_atomic(destination / "manifest.json", manifest)
    update_archive_index(archive_root.expanduser().resolve(), manifest)
    return archive_metadata


def update_archive_index(archive_root: Path, manifest: dict[str, Any]) -> None:
    index_path = archive_root / "index.json"
    index = load_json(index_path) or {"schemaVersion": 1, "archives": []}
    match_id = manifest["match"]["match_id"]
    entry = {
        "matchId": match_id,
        "siegeId": manifest["match"].get("siege_id"),
        "path": f"{match_id}/summary.json",
        "manifest": f"{match_id}/manifest.json",
        "status": manifest["status"],
        "archivedAt": manifest["archivedAt"],
        "guild": manifest["guild"]["name"],
        "opponents": manifest["guild"]["opponents"],
        "format": manifest["match"]["format"],
        "finish": manifest["match"].get("finish"),
    }
    index["archives"] = [item for item in index.get("archives", []) if item.get("matchId") != match_id]
    index["archives"].append(entry)
    index["archives"].sort(key=lambda item: str(item.get("finish") or ""), reverse=True)
    index["updatedAt"] = manifest["archivedAt"]
    write_json_atomic(index_path, index)


def write_json_atomic(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def build_report(args: argparse.Namespace) -> dict[str, Any]:
    capture_dir = Path(args.captures_dir).expanduser().resolve()
    if not capture_dir.is_dir():
        raise ValueError(f"diretório de capturas não encontrado: {capture_dir}")
    catalog = load_catalog(Path(args.catalog).expanduser().resolve())
    records = {key: event_files(capture_dir, name) for key, name in EVENTS.items()}
    match_id = choose_match_id(args.match_id, records["matchup"], records["history"], records["summary"])
    selected = {
        key: latest_for_match(value, match_id)
        for key, value in records.items()
        if key != "battle"
    }

    battles: dict[int, tuple[Path, dict[str, Any]]] = {}
    for item in records["battle"]:
        if contains_match(item[1], match_id):
            log_type = int(item[1].get("log_type", 0))
            if log_type in (1, 2) and log_type not in battles:
                battles[log_type] = item

    participation = selected.get("participation")
    own_guild_id = args.guild_id
    if own_guild_id is None and participation:
        own_guild_id = (participation[1].get("participation_info") or {}).get("guild_id")

    matchup = selected["matchup"][1] if selected.get("matchup") else None
    summary = selected["summary"][1] if selected.get("summary") else None
    history = selected["history"][1] if selected.get("history") else None
    history_match = next(
        (
            item
            for item in (history or {}).get("guildsiege_match_log_list") or []
            if int(item.get("match_id", -1)) == match_id
        ),
        {},
    )
    guilds = (
        (matchup or {}).get("guild_list")
        or (summary or {}).get("guild_list")
        or history_match.get("guild_info")
        or []
    )
    if own_guild_id is None and history_match.get("guild_id") is not None:
        own_guild_id = history_match["guild_id"]
    if own_guild_id is None and args.guild_name:
        own = next((item for item in guilds if item.get("guild_name") == args.guild_name), None)
        own_guild_id = own.get("guild_id") if own else None
    if own_guild_id is None:
        raise ValueError("não foi possível identificar a própria guilda; use --guild-id ou --guild-name")
    own_guild_id = int(own_guild_id)
    own = next((item for item in guilds if int(item.get("guild_id", -1)) == own_guild_id), {})
    opponents = [item for item in guilds if int(item.get("guild_id", -1)) != own_guild_id]

    attack_data = battles.get(1, (None, None))[1]
    defense_data = battles.get(2, (None, None))[1]
    attacks = normalize_attacks(battle_rows(attack_data, match_id), own_guild_id, catalog)
    defenses = normalize_defenses(battle_rows(defense_data, match_id), own_guild_id, catalog)

    warnings = []
    expected_attacks = own.get("attack_count")
    if expected_attacks is not None and attacks and int(expected_attacks) != len(attacks):
        warnings.append(f"Ataques detalhados: {len(attacks)}; total agregado: {expected_attacks}.")
    if len(opponents) == 1 and defenses:
        expected_defenses = opponents[0].get("attack_count")
        if expected_defenses is not None and int(expected_defenses) != len(defenses):
            warnings.append(
                f"Ataques sofridos detalhados: {len(defenses)}; ataques agregados do adversário: {expected_defenses}."
            )
    missing = []
    if not matchup:
        missing.append(EVENTS["matchup"])
    if not summary:
        missing.append(EVENTS["summary"])
    if not attack_data:
        missing.append(f"{EVENTS['battle']} log_type 1")
    if not defense_data:
        missing.append(f"{EVENTS['battle']} log_type 2")
    if missing:
        warnings.append("Eventos ausentes: " + ", ".join(missing) + ".")
    if defense_data:
        warnings.append("O log defensivo não expõe o trio atacante inimigo na estrutura observada.")

    match_info = (matchup or {}).get("match_info") or {}
    sources = {key: str(value[0]) if value else None for key, value in selected.items()}
    sources["battle_log_type_1"] = str(battles[1][0]) if 1 in battles else None
    sources["battle_log_type_2"] = str(battles[2][0]) if 2 in battles else None
    return {
        "match": {
            "match_id": match_id,
            "siege_id": match_info.get("siege_id") or history_match.get("siege_id"),
            "format": match_format(len(guilds)),
            "guild_count": len(guilds),
            "start": match_info.get("match_start_time") or history_match.get("match_start"),
            "finish": match_info.get("match_finish_time") or history_match.get("match_finish"),
            "match_type": match_info.get("match_type"),
        },
        "guild": {
            "name": own.get("guild_name") or args.guild_name or "Guilda própria",
            "rank": own.get("match_rank"),
            "score": own.get("match_score"),
            "players": own.get("play_member_count"),
            "aggregated_attacks": expected_attacks,
            "opponents": [
                {
                    "name": item.get("guild_name"),
                    "rank": item.get("match_rank"),
                    "score": item.get("match_score"),
                    "players": item.get("play_member_count"),
                    "attacks": item.get("attack_count"),
                }
                for item in opponents
            ],
        },
        "players": player_groups(summary, own_guild_id),
        "history": history_rows(history, own_guild_id),
        "offense": {
            "summary": totals(attacks, "win"),
            "by_defense": composition_groups(attacks, "defense", "win"),
            "matchups": matchup_groups(attacks),
            "battles": attacks,
        },
        "defense": {
            "summary": totals(defenses, "hold"),
            "compositions": composition_groups(defenses, "defense", "hold", "owner"),
            "battles": defenses,
        },
        "data_quality": {"warnings": warnings, "sources": sources},
    }


def parse_args() -> argparse.Namespace:
    project_root = Path(__file__).resolve().parents[4]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--captures-dir",
        default="~/Library/Application Support/com.diegomn.swexng/profiles/captures",
    )
    parser.add_argument("--catalog", default=str(project_root / "dist/data/monsters.json"))
    parser.add_argument("--match-id", type=int)
    parser.add_argument("--guild-id", type=int)
    parser.add_argument("--guild-name")
    parser.add_argument("--format", choices=("json", "markdown"), default="markdown")
    parser.add_argument(
        "--archive",
        action="store_true",
        help="Salva resumo normalizado, manifesto e eventos brutos no histórico local.",
    )
    parser.add_argument(
        "--archive-dir",
        default=str(project_root / "data/siege-history"),
        help="Diretório local do histórico de Sieges.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        report = build_report(args)
        if args.archive:
            report["archive"] = archive_report(report, Path(args.archive_dir))
    except ValueError as error:
        print(f"erro: {error}", file=sys.stderr)
        return 2
    if args.format == "json":
        json.dump(report, sys.stdout, ensure_ascii=False, indent=2)
        print()
    else:
        print(render_markdown(report))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
