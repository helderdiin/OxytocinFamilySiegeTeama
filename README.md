# Oxytocin Siege Teams

Aplicação interna da guilda Oxytocin para registrar, validar e consultar counters contra defesas no Siege de Summoners War: Sky Arena.

## Como executar

O projeto é estático e não precisa de instalação:

```bash
python3 -m http.server 4173 --directory dist
```

Abra `http://localhost:4173`.

## Capacidades

- identificação por nick, sem senha;
- catálogo normalizado com IDs internos, IDs Com2uS/SWARFARM, elementos, aliases e imagens; quando existe 2A, a forma antiga é ocultada e seus IDs são redirecionados para a Segunda Despertada;
- defesas são registros compartilhados e cada uma pode reunir vários counters independentes;
- cadastro exige pelo menos dois monstros no counter e dois na defesa; o terceiro slot de cada lado é opcional e usa o coringa `X` quando não informado;
- plano de jogo, ordem de turno, prioridades, variações, riscos, substituições e evidências ficam estruturados por counter;
- builds recomendadas podem ser informadas por monstro em uma tabela opcional, incluindo runas e metas mínimas de status para titulares e alternativas;
- cada counter pode incluir um vídeo opcional do YouTube, exibido dentro do próprio guia;
- cada counter pode incluir uma imagem de referência opcional, versionada no projeto e exibida abaixo do vídeo;
- alternativas por slot no counter e na defesa, sem duplicar registros;
- um novo counter pode partir de uma defesa existente, mantendo a composição inimiga bloqueada e preenchendo somente a nova proposta;
- busca por monstros do counter ou da defesa, conteúdo textual e filtros de segurança/status;
- compartilhamento de uma composição por link, abrindo o card correspondente já expandido;
- comentários colaborativos por ataque, com reação opcional `+1` ou `-1` vinculada ao comentário;
- estratégias podem ser mantidas no banco como inativas sem aparecer na UI;
- persistência compartilhada no Supabase, com fallback local para desenvolvimento sem configuração remota;

Enquanto a configuração do Supabase não estiver preenchida, os dados continuam somente no `localStorage` do navegador.

## Supabase

A primeira migration e o seed oficial estão em:

- `supabase/migrations/20261027020000_initial_schema.sql`
- `supabase/migrations/20261027130000_optional_third_slots.sql`
- `supabase/migrations/20261027160000_strategy_activation.sql`
- `supabase/migrations/20261027180000_strategy_comments.sql`
- `supabase/migrations/20261027210000_strategy_slot_alternatives.sql`
- `supabase/migrations/20261027230000_defenses_and_multiple_counters.sql`
- `supabase/migrations/20261028000000_strategy_build_recommendations.sql`
- `supabase/migrations/20261028010000_strategy_youtube_video.sql`
- `supabase/migrations/20261028020000_windy_alternative_for_gyomei.sql`
- `supabase/seed.sql`

O desenho usa sessões anônimas do Supabase Auth para manter a entrada por nick. Todos os membros autenticados podem ler os dados; cada sessão pode alterar ou excluir somente os próprios counters. As sete entradas oficiais do seed são protegidas. A defesa é normalizada em uma entidade própria, permitindo vários counters com autores, validações, instruções e feedback independentes.

No navegador deve ser usada somente a chave pública `publishable`, nunca uma chave `secret` ou a antiga `service_role`. O formato esperado está em `dist/supabase-config.example.js`.

### Configuração inicial

1. No painel do Supabase, abra **Authentication → Providers → Anonymous Sign-Ins** e habilite o login anônimo.
2. Abra o **SQL Editor** e execute, em ordem, os arquivos de `supabase/migrations`.
3. Ainda no **SQL Editor**, execute `supabase/seed.sql` para cadastrar as sete comps iniciais. O seed é idempotente e pode ser executado novamente sem duplicá-las.
4. Copie `dist/supabase-config.example.js` para `dist/supabase-config.js` e preencha a URL e a chave `publishable` do projeto.
5. Inicie o servidor local e acesse `http://localhost:4173`.

```bash
cp dist/supabase-config.example.js dist/supabase-config.js
python3 -m http.server 4173 --directory dist
```

O arquivo `dist/supabase-config.js` é ignorado pelo Git. Em um novo computador, ele precisa ser criado novamente.

## Deploy na Vercel

O projeto usa um build mínimo que gera `dist/supabase-config.js` a partir de duas variáveis públicas configuradas na Vercel:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

O diretório publicado é `dist`. Com a integração Git conectada, pushes na branch `main` atualizam a produção automaticamente.

## Dados

O catálogo em `dist/data/monsters.json` segue o modelo do projeto `SiegeTeamHelper`. Estratégias persistem somente os IDs internos dos monstros:

```json
{
  "schemaVersion": 9,
  "strategies": [
    {
      "defenseId": "defense-fingerprint-or-uuid",
      "attack": ["skogul", "chloe", "kahli"],
      "defense": ["conrad", "robo-r40", "*"],
      "attackAlternatives": [[], [], ["covenant"]],
      "defenseAlternatives": [[], [], []],
      "safety": "safe",
      "status": "proven",
      "sections": {
        "gamePlan": "Preparar o Skogul e eliminar a maior ameaça.",
        "videoUrl": "https://youtu.be/4i-BoXLldhc",
        "referenceImage": {
          "path": "assets/counter-references/fire-aragorn-racuni-gyomei-v3-original-assets.png",
          "alt": "Guia visual do counter",
          "width": 1536,
          "height": 1024,
          "version": 1
        },
        "idealStats": "Chloe deve abrir o time.",
        "builds": [
          {
            "monsterId": "skogul",
            "slot": 0,
            "isAlternative": false,
            "runes": "Vampire / Will",
            "hp": 30000,
            "def": 800
          }
        ],
        "turnOrder": "Chloe → Kahli → Skogul.",
        "targetPriority": "Eliminar primeiro quem remove buffs.",
        "thirdVariations": "Funciona com terceiros sem sustain pesado.",
        "risks": "Nunca usar contra strip consistente e anti-crítico.",
        "substitutions": "A Kahli pode variar por outro nuker.",
        "evidence": "Vitória confirmada em Siege."
      }
    }
  ]
}
```

O valor `"*"` representa a ausência do terceiro atacante ou qualquer terceiro monstro na defesa; as condições, exceções e instruções ficam organizadas no objeto `sections`. No Supabase, `defenseId` referencia `public.defenses`; as colunas legadas de defesa em `strategies` são mantidas sincronizadas para compatibilidade durante a transição.

## Sincronização do catálogo

O catálogo é gerado a partir da API pública do SWARFARM e mantém somente monstros obtíveis e despertados, incluindo segundas evoluções. As imagens são baixadas para o próprio site, portanto a aplicação não consulta serviços externos durante o uso.

```bash
node scripts/sync-monsters.mjs
```

O sincronizador preserva IDs internos existentes, adiciona novas unidades por `externalIds.com2us`, evita duplicações e grava a data da sincronização em `metadata.synchronizedAt`.
