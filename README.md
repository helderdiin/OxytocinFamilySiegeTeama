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
- cadastro de ataque e defesa com três monstros cada;
- observações opcionais;
- busca, filtro de autoria e exclusão dos próprios registros;
- persistência no `localStorage` do navegador;
- exportação e importação manual em JSON.

Os dados ainda não são compartilhados entre dispositivos. Uma evolução natural é substituir o `localStorage` por uma API com banco compartilhado e autenticação real.
