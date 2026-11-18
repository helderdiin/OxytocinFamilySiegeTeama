# Generalização de builds

Use este procedimento quando prints, vídeos, exports ou fontes externas mostrarem uma build completa. O objetivo é transformar uma conta específica em uma recomendação mínima rápida de ler, sem perder os requisitos que fazem o counter funcionar.

## Separar observação de recomendação

- **Build observada** é o conjunto literal de runas, stats e artefatos encontrado na fonte. Preserve-o nas notas de pesquisa e vincule-o à evidência correspondente.
- **Build mínima recomendada** é a síntese operacional que irá para o preview, Supabase e Guia Visual após aprovação.
- Uma única build bem-sucedida prova que aquela configuração foi usada; não prova que todos os seus números são necessários.
- Não chame uma aproximação de valor observado. Quando a recomendação ultrapassar o print ou depender de julgamento, trate-a explicitamente como alvo proposto.

## Descobrir os requisitos reais

Antes de copiar números, identifique o papel do monstro e a condição de vitória do time. Inclua um atributo somente quando ele alterar uma destas decisões:

- sobreviver à abertura: HP, DEF, redução de dano ou RES;
- disputar, cortar ou preservar ordem de turno: SPD, tick e speed tune;
- aplicar o efeito central do plano: ACC da skill relevante;
- causar o dano que encerra a luta: ATK, CR ou CD;
- sustentar a equipe: recuperação da skill relevante;
- cumprir um limite explícito de uma passiva, Leader Skill ou mecânica.

Omita ATK, CR, CD, RES, ACC ou SPD quando forem apenas resíduos da build observada e não participarem do plano. Não preencha um campo só porque o print mostra um número.

## Simplificar os mínimos

Use os números observados como teto de evidência, não como molde literal. Prefira limites fáceis de montar e conferir:

- HP bônus: arredonde para baixo em passos de `5k` quando a margem permitir. Exemplo: `+31.268 HP` pode virar `≥ +30k HP`.
- DEF bônus: arredonde para baixo em passos de `100`. Exemplo: `+708 DEF` pode virar `≥ +700 DEF`.
- ATK bônus: use passos de `100` apenas quando o dano de ATK for importante.
- SPD: prefira ordem, tick ou função (`abre o time`, `joga depois de X`). Preserve um total exato somente quando ele for necessário para reproduzir o tune documentado. Não reduza uma disputa de velocidade por simples arredondamento.
- CR, CD, RES e ACC: use limites convencionais e fáceis de conferir somente quando forem funcionais, como `50% ACC`, `85% RES`, `100% RES` ou `85% CR`. Não arredonde para cima sem justificativa mecânica ou fonte adicional; se fizer isso como alvo de consistência, rotule como recomendação proposta.
- Quando várias builds equivalentes tiverem o mesmo papel, procure um mínimo comum. Por padrão, não use um limite maior que a amostra bem-sucedida mais fraca, salvo requisito mecânico documentado.

Se a amostra estiver perto demais do limite, houver apenas um caso duvidoso ou os resultados entrarem em conflito, não generalize à força. Mostre o valor como observado, marque a incerteza e peça validação no preview.

## Destilar artefatos

Mantenha somente linhas com impacto direto no matchup ou na função do monstro:

- redução de dano dos elementos que realmente ameaçam o monstro;
- Precisão da skill central para controle, strip, bomba ou debuff;
- recuperação da skill principal de sustain;
- dano de bomba, dano adicional ou outro modificador quando ele for parte da condição de vitória;
- efeito de aumento de SPD, ATK ou DEF quando for relevante para o plano.

Remova linhas incidentais, mesmo que apareçam no print: dano contra elemento irrelevante, dano crítico do primeiro ataque em suporte, Precisão de skill não usada, pequenas linhas ofensivas sem relação com a execução e percentuais exatos que não sejam um threshold.

Prefira descrições funcionais como `Redução de dano de Água / Precisão da S2 / Dano de bomba`. Preserve porcentagens apenas quando o valor for necessário para atingir uma condição documentada.

## Mostrar a transformação no preview

Na seção de builds, apresente primeiro a **build mínima recomendada**. Quando houve simplificação relevante, acrescente uma nota curta de derivação, por exemplo:

`Derivada de uma build observada com +31.268 HP e +708 DEF; ATK, CR e CD foram omitidos porque não são requisitos do plano.`

Não despeje novamente todos os stats brutos quando isso prejudicar a leitura. A tabela de evidências deve continuar apontando a fonte da build completa.

## Persistência e Guia Visual

- Grave no Supabase somente a recomendação mínima aprovada, não a reprodução integral do print.
- Use a mesma recomendação simplificada no Guia Visual.
- Preserve runas, ordem, thresholds e artefatos aprovados sem reintroduzir campos descartados durante a geração da arte.
- Se o usuário editar a build depois, consulte novamente o registro antes de regenerar o Guia Visual.
