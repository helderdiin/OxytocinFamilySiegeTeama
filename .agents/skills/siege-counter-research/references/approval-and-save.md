# Aprovação, Guia Visual e persistência

Execute este fluxo somente após aprovação inequívoca do preview vigente.

## 1. Revalidar o destino

- Consulte novamente a defesa e counters existentes para evitar duplicação ou sobrescrita acidental.
- Confirme o usuário autenticado e o nick/autoria exigidos pelo Supabase.
- Prefira reutilizar a defesa exata já cadastrada pelo mecanismo normal do aplicativo.
- Nunca altere seed data para simular autoria e nunca fabrique um owner.

Se não houver autenticação/autoria válida, pare antes da gravação. Ainda é permitido preparar os artefatos locais aprovados, mas relate que o banco não foi alterado.

## 2. Gerar o Guia Visual

Leia e siga integralmente `prompts/counter-reference-image.md` e as instruções vigentes do `AGENTS.md` do projeto.

Requisitos mínimos:

- composição determinística em HTML/CSS;
- canvas e captura exatamente `1536 × 1024 px`;
- PNGs originais do catálogo local, sem redesenho generativo;
- badges oficiais de elemento no canto superior direito de todos os retratos;
- imagens oficiais de Leader Skill no canto inferior esquerdo de cada possível líder, inclusive alternativas;
- badges legíveis e proporcionais, sem ocultar a área central do retrato ou o nome;
- somente escala, enquadramento e borda elemental nos retratos;
- nome e elemento sem retrato substituto quando o asset original não existir;
- dados de artefatos quando aprovados e existentes;
- nenhum conteúdo inventado;
- HTML e PNG em `dist/assets/counter-references/`, com nomes correspondentes e descritivos.

Valide no DOM:

- largura e altura exatas do documento;
- ausência de overflow;
- todas as imagens carregadas;
- nenhum texto cortado.

Inspecione visualmente o PNG e confira defesa, ataque, alternativas, elementos, Leader Skills, ordem, stats, runas, artefatos, riscos e autoria. Se a correção exigir mudar dados do preview, pare e solicite nova aprovação.

## 3. Preparar metadados do asset

Inclua em `sections.referenceImage`:

- `path`: `assets/counter-references/<slug>.png`;
- `alt`: descrição objetiva do counter;
- `width`: `1536`;
- `height`: `1024`;
- `version`: inteiro, incrementado quando substituir uma referência já existente.

Não confunda a criação local do asset com publicação. O caminho pode depender de commit/deploy posterior para aparecer em produção.

## 4. Salvar o counter

- Use o fluxo autenticado do aplicativo/Supabase.
- Grave exatamente ataque, defesa, alternativas, classificação, builds e seções aprovados.
- Para um counter novo desta pesquisa, confirme `safety: experimental` e `status: needs_testing` antes de gravar.
- Mantenha os textos dos campos abertos curtos, simples e diretos, como no preview aprovado.
- Omita campos não documentados em vez de preencher placeholders.
- Preserve dados existentes que não façam parte da edição aprovada.
- Anexe `sections.referenceImage` ao registro. Como o formulário visual pode não expor esse campo, faça a associação por um update autenticado e restrito ao registro recém-criado/editado, depois do fluxo normal de criação/resolução da defesa.
- Não integre código, não faça commit, push ou deploy.

## 5. Verificar após a gravação

Leia o registro novamente e valide:

- trio de ataque e alternativas;
- defesa resolvida e alternativas;
- `safety` e `status`;
- builds e artefatos;
- todas as seções;
- autoria;
- metadados `referenceImage`;
- identificador do counter.

Considere o trabalho salvo somente se essa releitura confirmar os dados. Em caso de falha parcial, não afirme sucesso; preserve os artefatos locais e descreva exatamente o que ficou pendente.

## 6. Relatório final

Informe:

- ID/short ID do counter;
- defesa e ataque salvos;
- caminhos locais do HTML e PNG;
- resultado da verificação no banco;
- limitações ou lacunas remanescentes;
- que não houve commit nem deploy.
