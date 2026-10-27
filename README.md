# Oxytocin Siege Teams

POC interna da guilda Oxytocin para registrar e consultar ataques de três monstros contra defesas de três monstros no Siege de Summoners War: Sky Arena.

## Como executar

O projeto é estático e não precisa de instalação:

```bash
python3 -m http.server 4173 --directory dist
```

Abra `http://localhost:4173`.

## Escopo da POC

- identificação por nick, sem senha;
- catálogo normalizado com IDs internos, IDs Com2uS/SWARFARM, elementos, aliases e imagens; quando existe 2A, a forma antiga é ocultada e seus IDs são redirecionados para a Segunda Despertada;
- cadastro de ataque com três monstros e defesa com dois monstros fixos + um slot coringa `X`;
- observações opcionais;
- busca por texto, filtros de segurança/status e exclusão dos próprios registros;
- persistência no `localStorage` do navegador;

Enquanto a configuração do Supabase não estiver preenchida, os dados continuam somente no `localStorage` do navegador.

## Supabase

A primeira migration e o seed oficial estão em:

- `supabase/migrations/20261027020000_initial_schema.sql`
- `supabase/seed.sql`

O desenho usa sessões anônimas do Supabase Auth para manter a entrada por nick. Todos os membros autenticados podem ler a base compartilhada; cada sessão pode alterar ou excluir somente as próprias estratégias. As cinco comps oficiais do seed são protegidas.

No navegador deve ser usada somente a chave pública `publishable`, nunca uma chave `secret` ou a antiga `service_role`. O formato esperado está em `dist/supabase-config.example.js`.

### Configuração inicial

1. No painel do Supabase, abra **Authentication → Providers → Anonymous Sign-Ins** e habilite o login anônimo.
2. Abra o **SQL Editor** e execute `supabase/migrations/20261027020000_initial_schema.sql`.
3. Ainda no **SQL Editor**, execute `supabase/seed.sql` para cadastrar as cinco comps iniciais. O seed é idempotente e pode ser executado novamente sem duplicá-las.
4. Copie `dist/supabase-config.example.js` para `dist/supabase-config.js` e preencha a URL e a chave `publishable` do projeto.
5. Inicie o servidor local e acesse `http://localhost:4173`.

```bash
cp dist/supabase-config.example.js dist/supabase-config.js
python3 -m http.server 4173 --directory dist
```

O arquivo `dist/supabase-config.js` é ignorado pelo Git. Em um novo computador, ele precisa ser criado novamente.

## Dados

O catálogo em `dist/data/monsters.json` segue o modelo do projeto `SiegeTeamHelper`. Estratégias persistem somente os IDs internos dos monstros:

```json
{
  "schemaVersion": 3,
  "strategies": [
    {
      "attack": ["skogul", "chloe", "kahli"],
      "defense": ["conrad", "robo-r40", "*"],
      "safety": "safe",
      "status": "proven",
      "sections": {
        "gamePlan": "Preparar o Skogul e eliminar a maior ameaça.",
        "idealStats": "Chloe deve abrir o time.",
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

O valor `"*"` representa qualquer terceiro monstro na defesa; as condições, exceções e instruções ficam organizadas no objeto `sections`.

## Sincronização do catálogo

O catálogo é gerado a partir da API pública do SWARFARM e mantém somente monstros obtíveis e despertados, incluindo segundas evoluções. As imagens são baixadas para o próprio site, portanto a aplicação não consulta serviços externos durante o uso.

```bash
node scripts/sync-monsters.mjs
```

O sincronizador preserva IDs internos existentes, adiciona novas unidades por `externalIds.com2us`, evita duplicações e grava a data da sincronização em `metadata.synchronizedAt`.
