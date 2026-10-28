---
name: siege-counter-research
description: "Pesquisa counters de Summoners War Siege para uma defesa específica ou a partir do top 10 trending do SWGT, cruza evidências externas, prepara um preview com os campos do formulário do Oxytocin Family Siege Teams e, somente após aprovação explícita, gera o Guia Visual determinístico e salva o counter no Supabase. Use quando o usuário pedir para encontrar, avaliar, cadastrar ou atualizar counters de Siege, consultar defenses trending ou preparar um counter para aprovação."
---

# Siege Counter Research

Conduza o trabalho em duas fases: primeiro pesquisa e preview sem alterações; depois, apenas se o usuário aprovar o preview vigente, geração do Guia Visual e persistência.

## Escolher o modo de entrada

- Se o usuário informar uma defesa, normalize os três monstros usando o catálogo do projeto e pesquise essa defesa imediatamente.
- Se pedir trending defenses, consulte o ranking atual do SWGT e apresente as dez primeiras com os filtros e a data da consulta. Pare para o usuário escolher uma, salvo se ele pedir expressamente pesquisa de várias.
- Não trate nomes ambíguos como resolvidos. Confirme somente quando o catálogo não permitir desambiguar com segurança.

Ao trabalhar com trending ou fontes externas, siga [research-workflow.md](references/research-workflow.md).

## Inspecionar o projeto antes de propor

Antes da pesquisa externa detalhada:

1. Leia o catálogo local para resolver nomes, elementos, IDs e retratos.
2. Consulte os dados atuais do projeto/Supabase para detectar a defesa exata, variações próximas e counters já cadastrados.
3. Preserve nomes e IDs canônicos. Nunca invente um monstro, build, artefato, estatística ou resultado.

## Montar o preview

Consolide a melhor proposta no formato definido em [form-preview.md](references/form-preview.md). O preview deve espelhar os campos reais do formulário e começar com `PREVIEW — NÃO SALVO`.

- Diferencie evidência da defesa exata de evidência de uma variação.
- Explicite dados ausentes como `não documentado`; não converta ausência em recomendação.
- Para counters novos vindos desta pesquisa, use sempre `safety: experimental` e `status: needs_testing` (`Precisa de testes`). As evidências servem para explicar a proposta, não para promover esses campos antes dos testes da equipe.
- Escreva os campos abertos com palavras simples, frases curtas e instruções diretas. Evite parágrafos longos, termos difíceis e repetir a mesma ideia em vários campos.
- Inclua URLs, data/frescor, faixa/rank quando disponível, amostra e resultado observado.
- Mostre o plano do Guia Visual, inclusive assets localizados e ausentes.

Finalize perguntando exatamente se o usuário aprova aquele preview para gerar o Guia Visual e salvar o counter. Até essa aprovação, não grave no banco, não altere registros e não gere uma versão final integrada.

## Tratar revisão e aprovação

- Se o usuário pedir ajustes, incorpore-os e apresente um novo preview completo. Uma aprovação anterior não vale para um preview modificado.
- Considere aprovação apenas uma resposta inequívoca ao preview vigente, como “aprovado”, “pode salvar” ou equivalente.
- A aprovação autoriza a geração local do HTML/PNG e a gravação daquele counter no Supabase. Não autoriza commit, push, integração na UI ou deploy.

Depois da aprovação, siga [approval-and-save.md](references/approval-and-save.md). Se surgir qualquer conflito que mude o conteúdo aprovado, interrompa a persistência e apresente um preview revisado.

## Encerrar

Após salvar, informe o identificador do registro, os caminhos do HTML e PNG, o resultado da releitura do banco e qualquer pendência. Diga explicitamente que não houve commit nem deploy, salvo pedido separado do usuário.
