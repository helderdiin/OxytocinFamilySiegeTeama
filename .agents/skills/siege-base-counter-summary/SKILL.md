---
name: siege-base-counter-summary
description: "Analisa uma ou várias bases capturadas pelo SWEX/SWEX-NG em Summoners War Siege, ignora aliadas e repetidas, combina counters da base interna com pesquisa externa e produz resumos curtos para WhatsApp. Use para leitura rápida ou batch de torres; não use para builds, Guia Visual ou cadastro de counters."
---

# Siege Base Counter Summary

Transforme a captura de uma torre de Siege em uma mensagem curta, confiável e pronta para compartilhar com a guilda. Este fluxo é somente leitura: ele termina no resumo e não salva counters, não altera o Supabase e não gera Guia Visual.

## Localizar o contexto do evento

No macOS com SWEX-NG, procure as capturas em `~/Library/Application Support/com.diegomn.swexng/profiles/captures/`.

Use, quando disponíveis:

- `GetGuildSiegeBaseDefenseUnitList`: clique em uma base durante a Siege.
- `GetGuildSiegeBaseDefenseUnitListPreset`: bases aliadas em modo de preset; aceite apenas para testes ou quando o usuário pedir.
- `GetGuildSiegeParticipationInfo`: identifica o `guild_id` da própria guilda.
- `GetGuildSiegeMatchupInfo`: identifica participantes, posse das bases, lado/cor e restrição da torre durante uma Siege ativa.

Cada captura possui timestamp no nome. Preserve os eventos anteriores, escolha o clique solicitado ou o arquivo mais recente e trate capturas logicamente idênticas como duplicatas.

Isole obrigatoriamente uma única partida pelo `match_id` do `GetGuildSiegeMatchupInfo` ativo. Um mesmo arquivo, especialmente `GetGuildSiegeBattleLog`, pode conter grupos de partidas anteriores; nunca agregue grupos internos cujo `guild_info_list[].match_id` seja diferente. Se não houver `match_id` ativo confiável, não processe as bases.

### Modo batch com estado persistente

Quando o usuário disser que abriu várias bases ou pedir para analisar as novas capturas, execute primeiro:

```bash
npm run siege:batch -- --json
```

Leia somente `actionableBases` do relatório. O comando mantém `.siege-batch/state.json`, ignora bases aliadas, cliques já processados, estados idênticos e trocas limitadas a monstros com o mesmo `skillGroupId`. Bases novas ou materialmente alteradas permanecem em `pending` e reaparecem nas execuções seguintes até serem confirmadas.

Para cada base pendente, conclua o fluxo inteiro desta skill — base interna, pesquisa externa e mensagem final — antes de confirmar a fila. Não divida a resposta em uma parte imediata e outra pesquisada, salvo pedido explícito do usuário.

Depois que todos os resumos pendentes tiverem sido entregues com sucesso, execute:

```bash
npm run siege:batch -- --ack-all
```

Não confirme a fila quando a pesquisa falhar, for interrompida ou alguma base ficar sem análise. O relatório normalizado da última varredura fica em `.siege-batch/latest.json`.

## Classificar a base

Extraia o número interno da base de `defense_deck_assign_list[].base_number` ou do contexto do matchup, mas não o apresente automaticamente como o número visível no mapa. Quando `visible_base_number_list` estiver disponível, a base principal (`base_type == 1`) é a base visível 1 e cada item dessa lista corresponde, em ordem, às bases visíveis 2 em diante. Preserve o número interno apenas para identidade/deduplicação e use o número visível no resumo. Se o mapeamento não puder ser provado, exponha que o número é interno em vez de inventar a conversão.

Determine a posse comparando o `guild_id` da defesa com `participation_info.guild_id`:

- igualdade: base aliada;
- diferença: base inimiga;
- dados ausentes ou conflitantes: posse desconhecida.

Em uso real, ignore bases aliadas. Continue com uma base aliada somente quando o usuário estiver testando o fluxo. Não exponha `guild_id`, `wizard_id` ou nomes de jogadores no resumo, salvo pedido explícito.

Para inimigos, resolva amarelo/vermelho cruzando o `guild_id` com `GetGuildSiegeMatchupInfo`. Se o matchup não estiver disponível, informe apenas `inimiga`; não deduza a cor pelo número da base.

Determine a restrição da torre nesta ordem:

1. campo explícito do matchup ou metadado da base;
2. presença de qualquer Nat5 confirma `aberta`;
3. somente Nat4 ou menores não confirma `Nat4`, pois uma base aberta também pode usar esses monstros.

Quando não houver prova suficiente, use `restrição desconhecida`. Nunca transforme essa ausência em `Nat4`.

## Reconstruir as defesas

Para cada `deck_id` atribuído à base:

1. reúna os registros de `defense_unit_list` do deck;
2. ordene os monstros por `pos_id`;
3. resolva `unit_master_id` no catálogo `dist/data/monsters.json`;
4. preserve o primeiro slot como líder;
5. agrupe composições idênticas e preserve os números dos slots e a quantidade de ocorrências.

Use nome canônico e elemento quando houver ambiguidade. Para pesquisa, expanda equivalências confirmadas pelo mesmo `skillGroupId`, como versões de colaboração e seus substitutos permanentes. Não trate apenas semelhança de nome ou função como equivalência.

Mantenha uma representação de trabalho equivalente a:

```text
base_number
ownership: ally | enemy | unknown
enemy_side: yellow | red | unknown
restriction: nat4 | open | unknown
defenses[]:
  slots[]
  monsters[]: canonical name, element, com2us id, skill group
  occurrences
```

## Buscar counters nas duas fontes

Consulte a base interna e a pesquisa externa de forma independente. A ausência ou presença em uma fonte não impede a consulta da outra.

### Base interna

Consulte os dados atuais do projeto/Supabase em modo somente leitura. Separe:

- defesa exata;
- variação próxima;
- counter comprovado pela guilda;
- counter ainda em teste;
- data da última validação, quando existir.

### Pesquisa externa

Use a skill `siege-counter-research` somente pelo motor descrito em [`research-workflow.md`](../siege-counter-research/references/research-workflow.md): defesa exata primeiro, nomes equivalentes confirmados, depois variações claramente rotuladas. Não entre nas fases de preview, builds, Guia Visual, aprovação ou persistência.

Quando surgir uma fonte em vídeo, tente a transcrição uma única vez. Se ela não resolver, permita apenas uma verificação visual curta do trecho já indicado. Não faça busca quadro a quadro, não tente vários timestamps e não assista à luta inteira; marque a evidência como parcial ou não verificada e continue.

Para este resumo, não pesquise nem retorne stats, sets de runas, artefatos ou builds completas. Capture apenas o trio de ataque e, quando mudar a decisão, uma instrução mínima como alvo inicial ou necessidade de abrir a luta.

## Unificar e ordenar

Una o mesmo trio encontrado em fontes diferentes em uma única sugestão e preserve todas as origens. Ordene os candidatos por:

1. counter interno comprovado contra a defesa exata;
2. counter interno em teste contra a defesa exata;
3. counter externo contra a defesa exata, considerando avaliação, amostra, resultado e frescor;
4. counter contra variação próxima, sempre marcado como `variação` e abaixo dos exatos.

Um counter interno também sustentado externamente mantém a prioridade e recebe as duas origens. Considere balance patches e a data da última validação; sinalize material possivelmente desatualizado.

Retorne no máximo três counters por defesa. Não force um top 2 ou top 3: se houver somente um counter exato com evidência, mostre somente um. Não preencha lacunas com sugestões de IA ou variações apresentadas como exatas.

Use marcadores compactos:

- `🟢 Guilda`: base interna;
- `🌐 Pesquisa`: fonte externa;
- `🟢🌐`: encontrado nas duas;
- `🧪`: pouca evidência ou precisa de teste; combine com `Guilda` quando for um registro interno ainda não comprovado;
- `⚠️ Variação`: não corresponde ao trio exato.

## Produzir a mensagem para WhatsApp

Entregue primeiro um bloco copiável, sem tabelas, URLs longas ou explicações extensas:

```text
🏰 BASE 11 — ABERTA — INIMIGA AMARELA
5 defesas | 4 composições únicas

1️⃣ Defesa A / Defesa B / Defesa C
• Ataque A / Ataque B / Ataque C 🟢🌐
• Ataque D / Ataque E / Ataque F 🌐

2️⃣ + 5️⃣ Defesa D / Defesa E / Defesa F — 2x
• Ataque G / Ataque H / Ataque I 🧪

⚠️ Confirmar disponibilidade e qualidade das runas antes do ataque.

Legenda: 🟢 Guilda = base interna | 🌐 Pesquisa = fonte externa | 🟢🌐 = ambas | 🧪 = pouca evidência/precisa de teste | ⚠️ Variação = não é o trio exato
```

Encerre sempre o bloco copiável com essa legenda, mantendo apenas os marcadores que aparecem no resumo quando isso deixar a mensagem mais curta. A legenda deve explicar os emojis por extenso; não presuma que o leitor conhece o significado deles.

Inclua uma nota curta quando:

- houver menos de dois counters exatos;
- o melhor resultado for apenas uma variação;
- a origem estiver desatualizada ou tiver amostra muito pequena;
- a posse, a cor ou a restrição da base não puder ser confirmada.

Depois do bloco, resuma em poucas linhas as limitações relevantes e forneça links das fontes externas usadas. Não apresente preview de cadastro e não peça aprovação para salvar.

## Limites

- Não grave no banco nem altere registros.
- Não gere HTML, PNG ou Guia Visual.
- Não recomende stats, runas ou artefatos neste fluxo.
- Não invente counters para atingir uma quantidade fixa.
- Não esconda que a evidência é de uma variação.
- Não trate avaliação comunitária como garantia de vitória.
