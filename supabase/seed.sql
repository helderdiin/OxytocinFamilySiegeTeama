insert into public.strategies (
  source_key,
  owner_id,
  player_name,
  attack,
  defense,
  safety,
  validation_status,
  sections,
  is_seed,
  is_active,
  created_at
)
values
  (
    'siege-team-helper:juno-lucia-cayde-vs-seara-robo-f29',
    null,
    'Base SiegeTeamHelper',
    array['juno', 'lucia', 'cayde'],
    array['seara', 'robo-f29', '*'],
    'very_safe',
    'proven',
    jsonb_build_object(
      'gamePlan', 'Cayde desvia bombas e ataques individuais, Lucia sustenta o time e reduz pela metade os efeitos de redução de ATB, enquanto Juno limpa debuffs e vence a luta longa.',
      'idealStats', 'Cayde extremamente tanky. Lucia com bastante HP, DEF e RES para manter cura e escudo. Juno em Violent/Destroy ou Revenge/Destroy.',
      'turnOrder', 'Lucia (291 SPD) → Juno (286 SPD) → Cayde (157 SPD).',
      'targetPriority', 'Eliminar primeiro o maior DPS, depois a segunda ameaça e deixar Seara por último enquanto ela gastar bombas no Cayde.',
      'thirdVariations', 'Comprovado contra Seara + ROBO-F29 + Dover. Também venceu a variante Seara + Lionel + Light White Tiger Blade Master.',
      'risks', 'Evite Oblivion e incapacidade bem aplicados no Cayde. Contra o Tigre Branco Light, a S3 é AoE, não é desviada e aumenta cooldown.',
      'substitutions', 'Sem substituição validada no registro original; Cayde é a peça central da manipulação de alvo.',
      'evidence', 'Muito seguro + comprovado. Counters confirmados em Siege contra duas variações de Seara.'
    ),
    true,
    true,
    '2026-10-26T18:00:00.000Z'
  ),
  (
    'siege-team-helper:aragorn-racuni-gyomei-vs-sylvia-daphnis',
    null,
    'Base SiegeTeamHelper',
    array['fire-aragorn', 'racuni', 'gyomei-himejima'],
    array['sylvia', 'daphnis', '*'],
    'very_safe',
    'proven',
    jsonb_build_object(
      'gamePlan', 'Counter seguro de turn 2: usar a lead de RES do Aragorn, sobreviver à abertura com o cleanse e ciclo do Racuni e desmontar a defesa metodicamente com Gyomei.',
      'idealStats', 'Aragorn 300 SPD, Racuni 286 SPD e Gyomei 222 SPD. O time foi montado para chegar a 100% RES contando a lead de 48% do Aragorn.',
      'turnOrder', 'Fire Aragorn → Racuni → Gyomei Himejima.',
      'targetPriority', 'Wind Zenitsu primeiro, Daphnis depois e Sylvia ou Moore por último conforme o dano oferecido.',
      'thirdVariations', 'Vitória confirmada contra Sylvia + Daphnis + Wind Zenitsu. O conceito também foi criado para Moore + Daphnis + Zenitsu.',
      'risks', 'A proposta é sobreviver à abertura, não disputar um cleave. Confirme que as builds alcançam a resistência e a durabilidade esperadas.',
      'substitutions', 'Sem substituições comprovadas; lead de RES, cleanse e tanque Wind formam o núcleo do counter.',
      'evidence', 'Muito seguro + comprovado. Vitória confirmada em Siege G2 contra Sylvia + Daphnis + Wind Zenitsu.'
    ),
    true,
    true,
    '2026-10-26T18:05:00.000Z'
  ),
  (
    'siege-team-helper:delphoi-triana-roid-vs-galleon-bernard',
    null,
    'Base SiegeTeamHelper',
    array['delphoi', 'triana', 'roid'],
    array['galleon', 'bernard', '*'],
    'very_safe',
    'proven',
    jsonb_build_object(
      'gamePlan', 'Não disputar a corrida. A lead de 40% DEF da Delphoi fortalece os três Wind; Delphoi limpa o DEF Break, Triana cobre a primeira morte e Roid estabiliza com controle, sustain e Destroy.',
      'idealStats', 'Triana 291 SPD, Delphoi 290 SPD e Roid 247 SPD. Delphoi e Triana em Violent/Will e alta RES; Roid Violent/Destroy, cerca de 30k HP e 100% CR.',
      'turnOrder', 'Triana → Delphoi → Roid. É um núcleo bruiser e não depende de jogar antes da defesa.',
      'targetPriority', 'Stripper primeiro, principal DPS depois e o restante por último.',
      'thirdVariations', 'Vitória confirmada contra Galleon + Bernard + Leah. Também indicado contra defesas de stripper + DPS e algumas variações de Dark Cookie.',
      'risks', 'Nunca use se a defesa puder apagar Roid antes do sustain estabilizar. Strip + controle pesado ou uma Leah muito forte aumentam bastante o risco.',
      'substitutions', 'Contra muito multi-hit, Briand pode substituir Triana e oferecer revive, segundo a análise original.',
      'evidence', 'Muito seguro + comprovado. Vitória confirmada contra Galleon + Bernard + Leah e validação externa de uma composição equivalente no SWGT.'
    ),
    true,
    true,
    '2026-10-26T18:10:00.000Z'
  ),
  (
    'siege-team-helper:chiwu-deborah-legolas-vs-tarnisha-miles',
    null,
    'Base SiegeTeamHelper',
    array['chiwu', 'deborah', 'legolas-wind'],
    array['tarnisha', 'miles', '*'],
    'safe',
    'proven',
    jsonb_build_object(
      'gamePlan', 'Chiwu abre com strip e redução de ATB, Deborah aplica DEF Break amplificado e Legolas converte o setup em dano e controle antes que a defesa estabeleça sua rotação.',
      'idealStats', 'Chiwu 355 SPD em Swift/Will e boa ACC; Deborah 342 SPD, resistente e próxima de 85% ACC; Legolas 340 SPD com SPD/CR/CD/ATK.',
      'turnOrder', 'Chiwu S3 → Deborah S2 → Legolas S2 → turno instantâneo → Legolas S3.',
      'targetPriority', 'Eliminar a principal ameaça que receber DEF Break. Se Deborah resistir no alvo prioritário, reavalie antes de gastar o S3 do Legolas.',
      'thirdVariations', 'Vitória confirmada contra Tarnisha + Miles + Shahat. Também venceu Louise + Miles + Rakan e Bolverk + Josephine + Amelia.',
      'risks', 'Evitar defesas com muita ameaça Fire. O time quase não tem sustain e perde grande parte da explosão se Deborah falhar o DEF Break.',
      'substitutions', 'Foi usado com sucesso quando não havia uma segunda cópia de Ashour + Racuni + Nickel para a mesma defesa.',
      'evidence', 'Seguro + comprovado, avaliação 8,5/10. Três famílias de counters confirmadas, incluindo Tarnisha + Miles + Shahat em Siege G2.'
    ),
    true,
    false,
    '2026-10-26T18:15:00.000Z'
  ),
  (
    'siege-team-helper:mihyang-windy-vigor-vs-carcano-liu-mei',
    null,
    'Base SiegeTeamHelper',
    array['mihyang', 'windy', 'vigor'],
    array['carcano', 'liu-mei', '*'],
    'safe',
    'proven',
    jsonb_build_object(
      'gamePlan', 'Usar a lead de 28% SPD da Mihyang para ganhar a abertura. Windy absorve a pressão do Carcano e cria escudos; Vigor mantém SPD buff, cura e anti-crítico enquanto Mihyang sustenta e remove buffs.',
      'idealStats', 'A segurança depende do diferencial real de SPD. Mihyang e Vigor precisam disputar a abertura do Eshir; Windy deve ser robusto o bastante para funcionar como tanque do Carcano.',
      'turnOrder', 'A ordem exata não foi registrada, mas o ataque precisa ganhar a primeira rotação com a lead da Mihyang e manter Vigor e Mihyang sincronizados.',
      'targetPriority', 'Carcano → Liu Mei → Eshir.',
      'thirdVariations', 'Vitória confirmada contra Carcano + Liu Mei + Eshir em torre Nat4. O slot X representa Eshir ou outro booster/stripper rápido equivalente.',
      'risks', 'Não usar às cegas se o Eshir puder vencer a corrida. Se a defesa jogar primeiro, Liu Mei pode remover buffs e controlar ATB em múltiplos hits.',
      'substitutions', 'Nenhuma substituição foi comprovada para esta defesa; o trio foi considerado mais estável que as alternativas Nat4 avaliadas.',
      'evidence', 'Seguro + comprovado. Vitória confirmada contra Carcano + Liu Mei + Eshir em disputa de velocidade durante Siege G2.'
    ),
    true,
    false,
    '2026-10-26T18:20:00.000Z'
  )
on conflict (source_key) do update
set
  player_name = excluded.player_name,
  attack = excluded.attack,
  defense = excluded.defense,
  safety = excluded.safety,
  validation_status = excluded.validation_status,
  sections = excluded.sections,
  is_seed = true,
  is_active = excluded.is_active,
  updated_at = now();
