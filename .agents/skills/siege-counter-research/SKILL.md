---
name: siege-counter-research
description: "Pesquisa counters de Summoners War Siege para uma defesa específica ou a partir do top 10 trending do SWGT, cruza evidências, transforma builds completas em recomendações mínimas práticas, prepara um preview do Oxytocin Family Siege Teams e, somente após aprovação explícita, gera o Guia Visual e salva no Supabase. Use ao encontrar, avaliar, cadastrar ou atualizar counters, consultar defenses trending ou preparar um counter para aprovação."
---

# Siege Counter Research

Conduza o trabalho em duas fases: primeiro pesquisa e preview sem alterações; depois, apenas se o usuário aprovar o preview vigente, geração do Guia Visual e persistência.

## Escolher o modo de entrada

- Se o usuário informar uma defesa, normalize os três monstros usando o catálogo do projeto e pesquise essa defesa imediatamente.
- Se pedir trending defenses, consulte o ranking atual do SWGT e apresente as dez primeiras com os filtros e a data da consulta. Pare para o usuário escolher uma, salvo se ele pedir expressamente pesquisa de várias.
- Não trate nomes ambíguos como resolvidos. Confirme somente quando o catálogo não permitir desambiguar com segurança.

Ao trabalhar com trending ou fontes externas, siga [research-workflow.md](references/research-workflow.md).

## Limitar análise de vídeos

Quando uma fonte for YouTube ou outro vídeo, tente obter a transcrição uma única vez. Se ela não bastar, faça no máximo uma verificação visual curta do trecho já indicado pela fonte. Não procure quadro a quadro, não teste vários timestamps e não acompanhe a luta inteira. Se a confirmação continuar insuficiente, registre o vídeo como evidência não verificada ou parcial e prossiga com as demais fontes.

## Inspecionar o projeto antes de propor

Antes da pesquisa externa detalhada:

1. Leia o catálogo local para resolver nomes, elementos, IDs e retratos.
2. Consulte os dados atuais do projeto/Supabase para detectar a defesa exata, variações próximas e counters já cadastrados.
3. Preserve nomes e IDs canônicos. Nunca invente um monstro, build, artefato, estatística ou resultado.

## Montar o preview

Consolide a melhor proposta no formato definido em [form-preview.md](references/form-preview.md). O preview deve espelhar os campos reais do formulário e começar com `PREVIEW — NÃO SALVO`.

Quando uma fonte trouxer uma build completa, leia e aplique [build-generalization.md](references/build-generalization.md) antes de preencher as builds do preview. Trate o print ou export completo como evidência observada; no campo de recomendação, priorize mínimos arredondados e somente os atributos que fazem o counter funcionar.

- Diferencie evidência da defesa exata de evidência de uma variação.
- Diferencie build observada de build mínima recomendada. Nunca apresente todos os números de uma conta específica como requisitos sem justificar cada um.
- Explicite dados ausentes como `não documentado`; não converta ausência em recomendação.
- Para counters novos vindos desta pesquisa, use sempre `safety: experimental` e `status: needs_testing` (`Precisa de testes`). As evidências servem para explicar a proposta, não para promover esses campos antes dos testes da equipe.
- Escreva os campos abertos com palavras simples, frases curtas e instruções diretas. Evite parágrafos longos, termos difíceis e repetir a mesma ideia em vários campos.
- Inclua URLs, data/frescor, faixa/rank quando disponível, amostra e resultado observado.
- Mostre o plano do Guia Visual, inclusive assets localizados e ausentes.

### Decidir entre alternativa e counter separado

Não agrupe composições apenas porque dois dos três monstros são iguais. Avalie se a troca preserva a estratégia completa.

- Cadastre o monstro como alternativa de um slot somente quando ele cumprir essencialmente a mesma função, mantiver a mesma condição de vitória e não exigir mudanças relevantes de ordem de turnos, prioridade de alvo, pilotagem, riscos ou build do restante do time.
- Cadastre um counter separado quando a troca alterar a condição de vitória, a função do slot, a ordem de turnos, a prioridade de alvo, a pilotagem, os riscos, as builds necessárias ou a força/tipo da evidência.
- Quando houver um núcleo de dois monstros compartilhado, trate as composições como uma mesma família para fins de explicação, mas não force alternativas se os campos `gamePlan`, `turnOrder`, `targetPriority`, `risks`, `builds` ou `evidence` precisarem contar histórias diferentes.
- Antes do preview, compare explicitamente as composições candidatas por esses critérios. Se a distinção não estiver clara, apresente a dúvida ao usuário em vez de perder informação ao consolidar.

### Analisar reuso entre defesas diferentes

Ao encontrar o mesmo ataque já cadastrado contra outra defesa, não o trate automaticamente como duplicado nem crie um novo registro sem comparação.

- Compare as duas defesas e os dois counters por condição de vitória, função de cada monstro, ordem de turnos, prioridade de alvo, pilotagem, riscos, builds, artefatos e força/tipo da evidência.
- Reuse um único counter para variações da defesa somente quando a mudança preservar esses pontos ou puder ser explicada com clareza sem instruções condicionais conflitantes.
- Se alvo, risco, build, artefato, pilotagem ou evidência mudar de forma relevante, mantenha registros separados, mesmo que ataque e ordem básica sejam iguais. Eles podem ser descritos como counters relacionados ou pertencentes à mesma família.
- Antes de adicionar alternativas a uma defesa existente, inspecione todos os counters ligados ao mesmo `defense_id`. No modelo atual, as alternativas pertencem ao dossiê da defesa e são propagadas para todos esses counters; nunca faça um merge que passe a apresentar outro counter como válido contra uma variação sem evidência.
- Não apague nem consolide registros existentes durante essa análise. Apresente a recomendação e seus impactos ao usuário e aguarde aprovação explícita antes de qualquer mudança.

Finalize perguntando exatamente se o usuário aprova aquele preview para gerar o Guia Visual e salvar o counter. Até essa aprovação, não grave no banco, não altere registros e não gere uma versão final integrada.

## Tratar revisão e aprovação

- Se o usuário pedir ajustes, incorpore-os e apresente um novo preview completo. Uma aprovação anterior não vale para um preview modificado.
- Considere aprovação apenas uma resposta inequívoca ao preview vigente, como “aprovado”, “pode salvar” ou equivalente.
- A aprovação autoriza a geração local do HTML/PNG e a gravação daquele counter no Supabase. Não autoriza commit, push, integração na UI ou deploy.

Depois da aprovação, siga [approval-and-save.md](references/approval-and-save.md). Use uma sessão autenticada do dashboard do Supabase para inserir ou atualizar o registro diretamente no banco: tente primeiro o navegador interno do Codex e, se a autenticação falhar, use a sessão autenticada do Chrome. Não preencha o formulário público campo a campo. Se surgir qualquer conflito que mude o conteúdo aprovado, interrompa a persistência e apresente um preview revisado.

## Encerrar

Após salvar, informe o identificador do registro, os caminhos do HTML e PNG, o resultado da releitura do banco e qualquer pendência. Diga explicitamente que não houve commit nem deploy, salvo pedido separado do usuário.
