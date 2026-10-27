# Prompt-mestre — imagem de referência de counter

Use este padrão sempre que o pedido for **“monte uma imagem de referência para o counter X”**.

## Contrato do artefato

- Saída final: PNG com **1536 × 1024 px** (proporção 3:2 horizontal).
- Idioma: português do Brasil.
- Uso: consulta rápida no celular durante a Siege.
- Fonte dos dados: somente o counter salvo no projeto/Supabase e o catálogo local de monstros.
- Não inventar estatísticas, runas, ordem de turno, riscos, alternativas, validação ou resultados.
- Retratos só podem vir dos arquivos originais do catálogo local e devem ser inseridos sem redesenho.
- Quando a imagem original de um monstro não puder ser usada, exibir apenas seu nome e elemento; nunca gerar um substituto visual.
- Se um dado não existir, omitir o bloco correspondente em vez de preencher com conteúdo genérico.
- Nomes de monstros e números devem ser reproduzidos literalmente.

## Prompt fixo

```text
Use case: infographic-diagram
Asset type: card tático de referência para um counter de Siege de Summoners War: Sky Arena

Input images:
{{ORIGINAL_MONSTER_ASSETS}}
Cada imagem listada é um asset original de catálogo. Ela pode ser enquadrada e redimensionada, mas nunca redesenhada, estilizada ou usada apenas como inspiração para uma nova ilustração.

Primary request:
Crie uma única imagem de referência operacional, legível em poucos segundos no celular, para ajudar um membro da guilda a confirmar o matchup, montar o time e executar o counter antes de atacar. O resultado deve parecer um guia tático premium e consistente, não uma captura de tela, pôster promocional ou fan art solta.

Scene/backdrop:
Mesa tática noturna abstrata em azul-petróleo profundo, com superfícies discretamente estratificadas e textura fosca muito sutil. Sem cenário figurativo, sem paisagem e sem efeitos neon. A informação deve dominar a composição.

Visual system:
- Identidade “Night Operations Desk” do Oxytocin Siege Teams.
- Fundo azul-petróleo profundo; superfícies em petróleo/slate.
- Cobre apenas para defesa, risco e ações críticas.
- Aqua dessaturado para o counter e sinais de segurança.
- Azul dessaturado para informação comprovada.
- Âmbar apenas para condição ou cautela.
- Texto principal em off-white quente; texto secundário em cinza azulado claro.
- Bordas finas, sombras escuras difusas e cantos discretamente arredondados.
- Sem gradientes chamativos, brilho neon, vidro, hologramas, partículas, texturas gamer genéricas ou excesso de decoração.

Composition/framing:
- Canvas horizontal 3:2, preparado para saída final em 1536 × 1024 px.
- Margem segura de 64 px em todos os lados.
- Cabeçalho compacto no topo com “COUNTER DE SIEGE”, segurança e validação.
- Logo O₂ pequeno e discreto, sem competir com os dados.
- Primeira faixa: defesa inimiga, visualmente marcada em cobre, com nomes e alternativas por slot ligadas por “OU”. Usar retrato quadrado somente quando ele for o arquivo original do catálogo fornecido como asset; sem asset original, usar um slot tipográfico com nome e elemento.
- Segunda faixa: time do counter, maior e mais proeminente, em aqua, com três slots ordenados e nomes. Usar retrato quadrado somente quando ele for o arquivo original do catálogo fornecido como asset; sem asset original, usar um slot tipográfico com nome e elemento.
- Terceira área: grade de consulta rápida com ordem de turno, prioridade de alvo, risco crítico e builds mínimas.
- Quando houver dados de artefatos no counter, mostrar uma linha ou nota de “ARTEFATOS” dentro da área de build, com a recomendação correspondente a cada monstro e alternativa. Esse conteúdo é obrigatório quando estiver presente na fonte e deve ser omitido quando não existir.
- Rodapé curto com autoria e observação sobre substituições, apenas quando existirem.
- Hierarquia inequívoca: DEFESA → COUNTER → COMO USAR → BUILD.
- Muito espaço entre grupos; conteúdo relacionado permanece próximo.
- Retratos são dados funcionais, não ilustração: preservar os pixels e a identidade do arquivo original, usando apenas enquadramento, escala e borda elemental consistente. Nunca desenhar, reinterpretar ou substituir um monstro.

Typography:
- Sans-serif geométrica e legível, com aparência técnica e sóbria.
- Títulos fortes; labels curtas em caixa alta; corpo em peso regular.
- Não usar fonte decorativa, medieval, futurista extrema ou condensada demais.
- Texto grande o suficiente para leitura em uma tela de celular após redução da imagem.

Required data — reproduce verbatim:
- Defesa: “{{DEFENSE_TEAM}}”
- Counter: “{{ATTACK_TEAM}}”
- Segurança: “{{SAFETY}}”
- Validação: “{{STATUS}}”
- Ordem de turno: “{{TURN_ORDER}}”
- Prioridade de alvo: “{{TARGET_PRIORITY}}”
- Risco crítico: “{{RISKS}}”
- Builds: “{{BUILDS}}”
- Artefatos: “{{ARTIFACTS}}”
- Alternativas: “{{SUBSTITUTIONS}}”
- Evidência: “{{EVIDENCE}}”
- Autor: “{{AUTHOR}}”

Text rules:
- Renderize os textos fornecidos literalmente, sem corrigir nomes próprios e sem acrescentar frases.
- Não repita informação em blocos diferentes.
- Não inclua parágrafos longos: preserve o sentido e a redação fornecida, mas use quebras de linha claras.
- Não crie stats, porcentagens, ícones de runa ou resultados que não estejam nos dados.
- Não omita os artefatos quando `{{ARTIFACTS}}` tiver conteúdo; preserve a associação correta entre monstro e recomendação.
- Não use texto minúsculo, texto decorativo, pseudoescrita ou letras ilegíveis.

Constraints:
- Mostrar exatamente os monstros e alternativas informados, sem trocar elemento, aparência ou ordem dos slots.
- O time atacante deve ser o foco visual; a defesa deve continuar claramente identificável.
- PROIBIDO gerar, ilustrar, redesenhar, estilizar, completar ou reinterpretar qualquer monstro.
- Um retrato só pode aparecer quando for a imagem original fornecida pelo catálogo do projeto, preservada sem alteração de identidade.
- Na ausência do asset original, usar somente nome, elemento e moldura vazia discreta; nunca criar rosto, silhueta, avatar, personagem ou arte substituta.
- Não adicionar personagens, mascotes, armas, runas, atributos ou efeitos não fornecidos.
- Não usar marcas externas, publicidade, placar, interface de celular, mockup de dispositivo ou watermark.
- Não inventar conteúdo para preencher espaços vazios.
- Não cortar retratos, nomes, números ou o logo O₂.

Output intent:
Infográfico tático premium, consistente com os demais cards da série, imediatamente compreensível e pronto para ser compartilhado no WhatsApp da guilda.
```

## Dados do teste — Fire Aragorn + Racuni + Gyomei Himejima

```text
{{DEFENSE_TEAM}} = Sylvia ou Moore + Daphnis + Zenitsu Agatsuma ou Savannah
{{ATTACK_TEAM}} = Fire Aragorn (L) + Racuni + Gyomei Himejima
{{SAFETY}} = MUITO SEGURO
{{STATUS}} = TESTADO E COMPROVADO · SIEGE G2
{{TURN_ORDER}} = Fire Aragorn → Racuni → Gyomei Himejima
{{TARGET_PRIORITY}} = Wind Zenitsu primeiro, Daphnis depois e Sylvia ou Moore por último
{{RISKS}} = Sobreviva à abertura. Confirme 100% RES com a liderança de 48% do Aragorn e a durabilidade mínima indicada.
{{BUILDS}} = Fire Aragorn — Revenge / Revenge / Will, ≥ +32k HP, ≥ +500 DEF | Racuni — Violent / Nemesis, ≥ +30k HP, ≥ +600 DEF | Gyomei Himejima — Violent / Seal, ≥ +30k HP, ≥ +1,2k DEF
{{ARTIFACTS}} = Fire Aragorn — redução de dano de Água / recuperação da S3 | Racuni — redução de dano de Água / recuperação da S3 | Gyomei Himejima — redução de dano de Fogo / precisão da S2 | Windy — redução de dano de Fogo / dano adicional por DEF
{{SUBSTITUTIONS}} = Windy somente quando Gyomei Himejima não estiver disponível
{{EVIDENCE}} = Vitória confirmada contra Sylvia + Daphnis + Wind Zenitsu
{{AUTHOR}} = LETHALX
{{ORIGINAL_MONSTER_ASSETS}} = Sylvia (Escuridão): assets/monsters/sylvia.png | Moore (Água): assets/monsters/moore.png | Daphnis (Fogo): assets/monsters/daphnis.png | Zenitsu Agatsuma (Vento): assets/monsters/wind-zenitsu.png | Savannah (Vento): assets/monsters/savannah.png | Fire Aragorn (Fogo): assets/monsters/aragorn-fire.png | Racuni (Fogo): assets/monsters/racuni.png | Gyomei Himejima (Vento): assets/monsters/gyomei.png | Windy (Vento): assets/monsters/windy.png
```

## Procedimento de geração

1. Resolver o counter solicitado nos dados do projeto.
2. Localizar no catálogo os arquivos originais dos monstros que serão exibidos.
3. Preencher os placeholders sem inferir informações ausentes, incluindo `{{ARTIFACTS}}` sempre que houver recomendações de artefatos salvas.
4. Implementar uma única composição determinística em HTML/CSS, em canvas fixo de 1536 × 1024 px, seguindo o prompt visual.
5. Inserir diretamente os retratos originais do catálogo, sem redesenho; se algum arquivo não existir, manter o slot tipográfico.
6. Renderizar o HTML em viewport de 1536 × 1024 px e validar no DOM dimensões, carregamento das imagens e ausência de overflow.
7. Capturar o PNG final em 1536 × 1024 px e inspecioná-lo visualmente.
8. Conferir nomes, elementos, números, runas, artefatos, ordem visual, retratos e ausência de dados inventados.
9. Rejeitar qualquer saída que contenha um monstro inventado ou reinterpretado.
10. Corrigir apenas defeitos objetivos encontrados.
11. Entregar e arquivar o HTML-fonte e o PNG final em `dist/assets/counter-references/`.
