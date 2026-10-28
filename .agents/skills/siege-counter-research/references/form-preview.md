# Preview alinhado ao formulário

Apresente um único counter principal por preview, salvo pedido explícito em contrário.

## Estrutura obrigatória

### PREVIEW — NÃO SALVO

#### Defesa

- Slot 1: nome canônico e alternativas do slot.
- Slot 2: nome canônico e alternativas do slot.
- Slot 3: nome canônico, alternativas ou wildcard quando realmente aplicável.
- Informe se a defesa exata já existe e será reutilizada.

Os dois primeiros slots não podem ser wildcard. O terceiro pode ser `*` somente quando a proposta representar de fato uma família de defesas.

#### Ataque

- Slot 1: nome canônico e alternativas.
- Slot 2: nome canônico e alternativas.
- Slot 3: nome canônico, alternativas ou vazio quando permitido pelo formulário.

#### Classificação

- `safety`: use `experimental`.
- `status`: use `needs_testing` (`Precisa de testes`).
- Mantenha esses valores em counters novos até a equipe testá-los no jogo.

#### Builds do ataque

Para cada monstro do ataque, mostre apenas os dados documentados:

- runas;
- speed tune;
- bônus de HP, ATK, DEF e SPD;
- totais de CR, CD, RES e ACC;
- artefatos.

No preview, escreva `não documentado` nos campos ausentes para tornar a lacuna visível. Na persistência, omita dados ausentes; nunca salve o texto como se fosse build.

#### Seções estratégicas

- Observações de build (`idealStats`).
- Plano de jogo (`gamePlan`) — obrigatório.
- Ordem de turno (`turnOrder`).
- Prioridade de alvo (`targetPriority`).
- Variações do terceiro monstro (`thirdVariations`).
- Riscos (`risks`).
- Substituições (`substitutions`).
- Evidências (`evidence`).
- URL de vídeo (`videoUrl`), se houver e for válida.

Escreva os campos abertos de forma curta e prática:

- use palavras comuns;
- prefira uma ou duas frases por campo;
- diga primeiro o que fazer;
- evite introduções, explicações longas e repetição;
- só use mais texto quando ele evitar um erro importante no combate.

Exemplos de tom:

- Plano de jogo: `Abra com controle no Byungchul. Depois foque o suporte.`
- Ordem de turno: `Clara > Sonia > Adriana.`
- Risco: `Pode falhar se a Clara perder a disputa de velocidade.`

#### Evidências

Use uma tabela com:

| Fonte | Correspondência | Rank/contexto | Resultado/amostra | Frescor | Confiança | URL |
|---|---|---|---|---|---|---|

`Correspondência` deve ser `exata`, `variação de 1 slot`, `família` ou outra descrição inequívoca.

#### Guia Visual planejado

- slug e nomes previstos para HTML e PNG;
- canvas `1536 × 1024 px`;
- retratos locais encontrados;
- retratos ausentes;
- badges de elemento e imagens de Leader Skill resolvidos para cada slot e alternativa;
- dados que aparecerão na arte;
- versão prevista do asset.

#### Lacunas e conflitos

Liste apenas as lacunas e conflitos que mudam a decisão ou o teste. Use frases curtas.

## Pedido de aprovação

Encerre com:

> Você aprova este preview para eu gerar o Guia Visual e salvar este counter no Supabase?

Não combine essa pergunta com execução antecipada. Se o usuário aprovar com alterações, trate como pedido de revisão e apresente outro preview antes de salvar.
