# Arquivo local de histórico da Siege

O histórico vive em `data/siege-history/` e nunca depende do Supabase.

```text
data/siege-history/
├── index.json
└── <match_id>/
    ├── manifest.json
    ├── summary.json
    └── raw/
        └── <timestamp>-<evento>.json
```

## `summary.json`

Contém o relatório normalizado e portátil:

- identificação, formato, horários, placar e guildas;
- desempenho agregado e individual;
- cada ataque próprio com atacante, adversário, base, resultado e os dois trios;
- cada defesa própria com dono, atacante, base, resultado e trio defensor;
- agrupamentos por defesa e por matchup;
- histórico agregado disponível;
- avisos e caminhos relativos dos eventos brutos.

O trio atacante inimigo em nossas defesas fica ausente quando o evento não o expõe. Não invente esse campo.

## `manifest.json`

Registra:

- `status`: `complete`, `complete_with_warnings` ou `partial`;
- contagens de jogadores, ataques, defesas e eventos brutos;
- hashes SHA-256 e tamanho dos eventos copiados;
- limitações conhecidas.

`complete_with_warnings` significa que todos os eventos essenciais foram arquivados, mas existe uma divergência ou limitação documentada. `partial` significa que faltou pelo menos um evento essencial.

## Eventos essenciais

- `GetGuildSiegeMatchupInfoForFinished`;
- `getGuildSiegeMatchBattleLogSummary_v2`;
- `GetGuildSiegeBattleLog` com `log_type: 1`;
- `GetGuildSiegeBattleLog` com `log_type: 2`.

`GetGuildSiegeParticipationInfo` e `GetGuildSiegeMatchLog` também devem ser preservados quando disponíveis.

## Política de atualização

- Reexecutar o arquivamento para o mesmo `match_id` pode completar dados faltantes.
- Uma versão mais completa substitui uma parcial.
- Uma execução parcial não deve substituir uma versão já completa.
- Nunca apague `raw/` automaticamente.
