---
name: siege-postmortem-summary
description: "Analisa e arquiva localmente capturas finais do SWEX/SWEX-NG de Summoners War Siege, preservando desempenho individual, batalhas, composições e eventos brutos para resumos e comparações futuras. Use após o encerramento de uma Siege; não use para sugerir ataques durante uma batalha ativa."
---

# Siege Postmortem Summary

Transforme os eventos finais da Siege em uma leitura objetiva da performance da guilda e preserve o conjunto localmente para análises futuras. O fluxo não cadastra counters nem modifica o Supabase; a única escrita autorizada é o arquivo histórico dentro do projeto.

## Limitar análise de vídeos

Se uma fonte complementar for um vídeo, tente obter a transcrição uma única vez. Se ela não bastar, faça no máximo uma verificação visual curta do trecho já indicado. Não procure quadro a quadro, não teste vários timestamps e não acompanhe a luta inteira. Registre a evidência como parcial ou não verificada e prossiga com os eventos estruturados.

## Coletar os eventos

No macOS com SWEX-NG, procure as capturas em `~/Library/Application Support/com.diegomn.swexng/profiles/captures/`.

Cruze os arquivos pelo `match_id`; não escolha arquivos apenas pelo horário quando houver mais de uma Siege capturada. Use:

- `GetGuildSiegeParticipationInfo`: identifica a própria guilda por `participation_info.guild_id`;
- `GetGuildSiegeMatchupInfoForFinished`: resultado, participantes, formato, placar, bases e limites;
- `getGuildSiegeMatchBattleLogSummary_v2`: jogadores e resultados espelhados de ataque e defesa;
- `GetGuildSiegeBattleLog` com `log_type: 1`: ataques da própria guilda, ambos os trios e resultado;
- `GetGuildSiegeBattleLog` com `log_type: 2`: ataques sofridos, trio defensor e resultado;
- `GetGuildSiegeMatchLog`: histórico agregado das últimas Sieges.

O filtro vale também dentro de cada JSON: `GetGuildSiegeBattleLog.log_list` pode misturar grupos da partida atual e de partidas anteriores. Inclua somente grupos cujo `guild_info_list[].match_id` corresponda à partida selecionada e, quando a linha tiver `match_id`, valide-o novamente antes de agregar.

Leia [references/event-schema.md](references/event-schema.md) quando precisar interpretar campos, validar contagens ou diagnosticar evento ausente.

## Normalizar os dados

Execute o analisador determinístico com arquivamento antes de redigir o resumo:

```bash
python .agents/skills/siege-postmortem-summary/scripts/analyze_siege.py --archive --format json
```

Use `--match-id` para selecionar uma Siege anterior, `--format markdown` para uma prévia direta e `--captures-dir` ou `--catalog` quando os caminhos padrão não servirem.

O analisador resolve IDs Com2uS em `dist/data/monsters.json`, preserva IDs desconhecidos e expõe assinaturas de `skillGroupId` para equivalências confirmadas.

## Arquivar antes de limpar

O histórico fica em `data/siege-history/`, indexado por `match_id`. Leia [references/archive-schema.md](references/archive-schema.md) quando precisar consultar, migrar ou validar arquivos antigos.

Cada partida deve preservar:

- `summary.json`: relatório normalizado completo, incluindo cada ataque e cada defesa disponível;
- `manifest.json`: completude, contagens, hashes e avisos;
- `raw/`: cópia apenas dos eventos SWEX usados para reconstruir a partida;
- `index.json`: catálogo das Sieges arquivadas.

Valide o `status` e as contagens do manifesto antes de considerar o arquivamento concluído. Não autorize nem sugira apagar os captures enquanto o manifesto estiver `partial` ou as contagens divergirem sem explicação.

Execute a verificação determinística após arquivar:

```bash
python .agents/skills/siege-postmortem-summary/scripts/verify_archive.py --match-id <match_id>
```

Somente considere o arquivo íntegro quando `valid` for `true`. O status `complete_with_warnings` é aceitável se os eventos essenciais e hashes estiverem íntegros e cada aviso estiver explicado ao usuário.

Quando os captures já tiverem sido apagados, não reconstrua batalhas ausentes por memória ou inferência. Um arquivo recuperado manualmente deve ser marcado como `partial` e declarar exatamente quais detalhes faltam. Um arquivamento completo futuro pode substituir o parcial, mas uma execução incompleta nunca deve rebaixar um arquivo completo.

Determine o formato pela quantidade real de guildas no evento:

- duas guildas: `1×1`;
- três guildas: `1×1×1`;
- qualquer outro número: informe a quantidade sem forçar um formato conhecido.

O período de torneio pode usar `1×1`; a Siege normal costuma usar `1×1×1`. Nunca fixe um desses formatos no código ou no texto.

## Interpretar sem duplicar

Em `getGuildSiegeMatchBattleLogSummary_v2`, cada batalha aparece pela perspectiva do atacante e do defensor. Para a própria guilda:

- ataque: `guild_id` próprio e `log_type == 1`;
- defesa: `guild_id` próprio e `log_type == 2`;
- `win_lose == 1`: vitória da perspectiva da linha;
- `win_lose == 2`: derrota da perspectiva da linha.

Não some as duas perspectivas. Compare a contagem detalhada de ataques próprios com `guild_list[].attack_count` e sinalize divergências. Em `1×1×1`, não compare ataques totais dos adversários diretamente com ataques sofridos pela própria guilda, pois eles também atacam entre si.

O `log_type: 1` revela trio atacante e defensor. Use-o para medir aproveitamento ofensivo, defesas inimigas problemáticas e evidência de counters reais. Preserve vitórias e derrotas.

O `log_type: 2` normalmente revela apenas o trio defensor. Use-o para medir holds, derrotas, amostra e donos da composição. Não invente o ataque inimigo nem declare qual counter venceu uma defesa quando esse trio não estiver no payload.

## Consolidar equivalências

Mostre primeiro cada composição exatamente como apareceu no jogo. Quando versões de colaboração e substitutos permanentes tiverem o mesmo `skillGroupId`, acrescente um consolidado de família se isso melhorar a leitura. Preserve também a quebra por variante.

Resultados reais podem sustentar a base interna, mas esta skill não cadastra counters; ela salva somente o histórico observado. Classifique apenas no resumo:

- `✅ Evidência forte`: múltiplas vitórias e nenhuma derrota relevante na amostra;
- `🟡 Evidência inicial`: uma vitória ou amostra pequena;
- `🔴 Resultado negativo`: derrotas registradas, sem concluir que o trio é universalmente inviável;
- `⚠️ Divergência`: contagens incompletas, evento ausente ou dado incompatível.

Sempre inclua uma legenda dos marcadores utilizados.

## Produzir o resumo

Entregue primeiro um bloco curto e copiável para WhatsApp contendo:

1. adversários, formato, colocação e placar;
2. ataques, vitórias, derrotas e aproveitamento ofensivo;
3. ataques sofridos, holds, derrotas e aproveitamento defensivo;
4. destaques ofensivos com amostra suficiente;
5. defesas que mais seguraram e defesas que pedem revisão;
6. counters observados mais úteis, com placar do confronto;
7. limitações e divergências relevantes;
8. legenda.

Depois do bloco, ofereça detalhes somente quando ajudarem a decisão: tabela completa por jogador, todas as composições, histórico entre Sieges ou evidências de um confronto específico.

Não transforme amostra pequena em ranking definitivo. Prefira números absolutos junto da porcentagem, como `5/8 (62,5%)`. Diferencie ausência de ataques de desempenho ruim.

## Encerrar com próximos passos

Termine sempre a resposta da skill com `Próximos passos possíveis`, contendo de três a cinco sugestões curtas e específicas para os dados daquela Siege. Misture ações que o usuário pode pedir com perguntas que ajudem a escolher a próxima análise.

Priorize somente opções sustentadas pelo arquivo atual, como:

- cruzar counters vencedores observados com a base interna e pesquisar evidência adicional antes de propor cadastro no Supabase;
- listar participantes com ataques não utilizados ou participação baixa, separando ausência de desempenho ruim;
- revisar individualmente um integrante, mostrando todos os confrontos, escolhas e resultados disponíveis;
- investigar defesas inimigas que mais causaram derrotas e preparar pesquisas de counter;
- revisar nossas defesas com maior e menor número de holds, respeitando o tamanho da amostra;
- comparar esta Siege com partidas arquivadas anteriormente para identificar padrões recorrentes;
- recapturar ou complementar eventos quando o manifesto apontar dados ausentes.

Adapte as sugestões ao resultado: não ofereça comparação histórica quando houver somente uma Siege, nem análise de um campo que o payload não expõe. Não repita uma lista genérica fixa.

Quando mencionar Supabase, diferencie claramente `pesquisar/auditar candidatos` de `cadastrar`. Nunca cadastre automaticamente; apresente o que foi observado e peça autorização explícita antes de qualquer persistência.

Formato recomendado:

```text
Próximos passos possíveis
• Quer que eu cruze os counters vencedores desta Siege com a base interna e pesquise quais merecem cadastro futuro?
• Posso listar quem deixou ataques sem usar e separar quem não participou de quem teve baixa utilização.
• Quer escolher um integrante para uma revisão individual de todos os ataques?
```

## Limites

- Não grave counters nem altere o Supabase; persista somente o histórico local solicitado.
- Não exponha IDs internos no resumo compartilhável.
- Não recomende punições ou mudanças de membro apenas pelos números.
- Não atribua derrota a runas, velocidade, IA ou erro humano sem evidência adicional.
- Não confunda hold defensivo com vitória ofensiva.
