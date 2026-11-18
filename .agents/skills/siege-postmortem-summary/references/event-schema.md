# Eventos pós-Siege do SWEX-NG

## Identidade da partida

Cruze todos os eventos por `match_id`.

- `GetGuildSiegeParticipationInfo`: `participation_info.match_id` e `participation_info.guild_id`.
- `GetGuildSiegeMatchupInfoForFinished`: `match_info.match_id`.
- `getGuildSiegeMatchBattleLogSummary_v2`: `guild_list[].match_id`.
- `GetGuildSiegeBattleLog`: `log_list[].guild_info_list[].match_id`.
- `GetGuildSiegeMatchLog`: cada item de `guildsiege_match_log_list[]` possui seu `match_id`.

## Matchup final

`GetGuildSiegeMatchupInfoForFinished` fornece:

- `match_info`: Siege, partida, início, fim e tipo;
- `guild_list`: nomes, posição, colocação, placar, participantes e ataques;
- `setup_values`: pontuação máxima, limite de decks e unidades de ataque;
- `base_list`: posse e estado final das bases;
- `defense_deck_assign_list`: decks associados às bases;
- `defense_deck_status_list`: estado final de decks atacados.

Esse evento não contém necessariamente os monstros de cada defesa.

## Resumo espelhado

`getGuildSiegeMatchBattleLogSummary_v2` fornece jogadores, duas perspectivas por batalha e uso de unidades.

- `log_type == 1`: perspectiva ofensiva;
- `log_type == 2`: perspectiva defensiva;
- `win_lose == 1`: vitória da perspectiva da linha;
- `win_lose == 2`: derrota da perspectiva da linha.

Uma batalha pode aparecer como ataque perdido de A e defesa vencida de B. Conte somente a perspectiva necessária.

## Log detalhado de ataques próprios

Em `GetGuildSiegeBattleLog` com `log_type: 1`:

- `base_number`: base atacada;
- `wizard_name`: atacante;
- `opp_wizard_name`: defensor;
- `win_lose`: resultado;
- `view_battle_deck_info[0]`: trio atacante;
- `view_battle_deck_info[1]`: trio defensor.

Os membros dos trios são IDs Com2uS. Resolva-os por `dist/data/monsters.json` em `externalIds.com2us`.

## Log detalhado de defesas próprias

Em `GetGuildSiegeBattleLog` com `log_type: 2`, cada item contém dono da defesa, atacante, base e resultado. Na estrutura observada, `view_battle_deck_info` possui somente a chave `"1"`, correspondente ao trio defensor.

Não presuma que o trio atacante está disponível. Sem ele, não é possível identificar automaticamente qual counter inimigo foi usado.

## Histórico agregado

`GetGuildSiegeMatchLog` é adequado para tendências de colocação, placar, adversários, ataques, participantes, rating e recompensas. Ele não substitui os logs detalhados para analisar counters ou composições.

## Validações úteis

- Linhas ofensivas próprias devem normalmente coincidir com `attack_count` da própria guilda.
- Não use `attack_unit_count` sozinho como quantidade de ataques.
- Em `1×1×1`, os adversários também atacam um ao outro; seus ataques totais não equivalem aos ataques sofridos pela própria guilda.
