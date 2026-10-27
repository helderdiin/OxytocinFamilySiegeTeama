# Oxytocin Family Siege Teams

## Imagens de referência de counters

Quando o usuário pedir **“monte uma imagem de referência para o counter X”** ou uma variação claramente equivalente:

1. Leia e use `prompts/counter-reference-image.md` como prompt-mestre.
2. Resolva os dados do counter no projeto/Supabase; nunca invente campos ausentes.
3. Monte a arte de forma determinística em HTML/CSS, usando o sistema visual do prompt e um canvas fixo de **1536 × 1024 px**. Não peça a uma IA generativa para redesenhar a composição ou os personagens.
4. Insira diretamente os PNGs originais do catálogo local, preservando seus pixels; permita apenas escala, enquadramento e borda elemental.
5. Renderize o HTML no navegador com viewport de **1536 × 1024 px** e capture o PNG final no mesmo tamanho.
6. Se o asset original não puder ser usado, mostre apenas nome e elemento. Nunca gere um monstro substituto.
7. Rejeite qualquer saída que invente, reinterprete ou estilize a aparência de um monstro.
8. Valide no DOM que não existe overflow, que todas as imagens carregaram e que o documento mede exatamente **1536 × 1024 px**.
9. Inspecione visualmente o PNG e valide nomes, elementos, stats, runas, ordem, riscos, alternativas, retratos e autoria antes de entregar.
10. Salve o HTML-fonte e o PNG final em `dist/assets/counter-references/`, com nomes descritivos e correspondentes.
11. Não integre a imagem à UI, faça commit ou deploy sem um pedido explícito.
