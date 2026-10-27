# Oxytocin Siege Teams

POC interna da guilda Oxytocin para registrar e consultar ataques de três monstros contra defesas de três monstros no Siege de Summoners War: Sky Arena.

## Como executar

O projeto é estático e não precisa de instalação:

```bash
python3 -m http.server 4173 --directory dist
```

Abra `http://localhost:4173`.

## Escopo da POC

- identificação por nick, sem senha;
- catálogo normalizado com IDs internos, IDs Com2uS/SWARFARM, elementos, aliases e imagens;
- cadastro de ataque com três monstros e defesa com dois monstros fixos + um slot coringa `X`;
- observações opcionais;
- busca, filtro de autoria e exclusão dos próprios registros;
- persistência no `localStorage` do navegador;
- exportação e importação manual em JSON.

Os dados ainda não são compartilhados entre dispositivos. Uma evolução natural é substituir o `localStorage` por uma API com banco compartilhado e autenticação real.

## Dados

O catálogo em `dist/data/monsters.json` segue o modelo do projeto `SiegeTeamHelper`. Estratégias persistem somente os IDs internos dos monstros:

```json
{
  "schemaVersion": 3,
  "strategies": [
    {
      "attack": ["skogul", "chloe", "kahli"],
      "defense": ["conrad", "robo-r40", "*"],
      "safety": "safe",
      "status": "proven",
      "sections": {
        "gamePlan": "Preparar o Skogul e eliminar a maior ameaça.",
        "idealStats": "Chloe deve abrir o time.",
        "turnOrder": "Chloe → Kahli → Skogul.",
        "targetPriority": "Eliminar primeiro quem remove buffs.",
        "thirdVariations": "Funciona com terceiros sem sustain pesado.",
        "risks": "Nunca usar contra strip consistente e anti-crítico.",
        "substitutions": "A Kahli pode variar por outro nuker.",
        "evidence": "Vitória confirmada em Siege."
      }
    }
  ]
}
```

O valor `"*"` representa qualquer terceiro monstro na defesa; as condições, exceções e instruções ficam organizadas no objeto `sections`.

## Sincronização do catálogo

O catálogo é gerado a partir da API pública do SWARFARM e mantém somente monstros obtíveis e despertados, incluindo segundas evoluções. As imagens são baixadas para o próprio site, portanto a aplicação não consulta serviços externos durante o uso.

```bash
node scripts/sync-monsters.mjs
```

O sincronizador preserva IDs internos existentes, adiciona novas unidades por `externalIds.com2us`, evita duplicações e grava a data da sincronização em `metadata.synchronizedAt`.
