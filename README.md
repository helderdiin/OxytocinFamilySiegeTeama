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
- catálogo normalizado com IDs internos, IDs Com2uS/SWARFARM, elementos, aliases e imagens;
- cadastro de ataque com três monstros e defesa com dois monstros fixos + um slot coringa `X`;
- observações opcionais;
- busca, filtro de autoria e exclusão dos próprios registros;
- persistência no `localStorage` do navegador;
- exportação e importação manual em JSON.

Os dados ainda não são compartilhados entre dispositivos. Uma evolução natural é substituir o `localStorage` por uma API com banco compartilhado e autenticação real.

## Dados

O catálogo em `dist/data/monsters.json` segue o modelo do projeto `SiegeTeamHelper`. Estratégias persistem somente os IDs internos dos monstros:

```json
{
  "schemaVersion": 2,
  "strategies": [
    {
      "attack": ["skogul", "chloe", "kahli"],
      "defense": ["conrad", "robo-r40", "*"]
    }
  ]
}
```

O valor `"*"` representa qualquer terceiro monstro na defesa; as condições e exceções devem ser registradas em `notes`.
