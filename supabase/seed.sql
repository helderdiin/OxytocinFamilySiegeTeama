insert into public.strategies (
  source_key,
  owner_id,
  player_name,
  attack,
  attack_alternatives,
  defense,
  defense_alternatives,
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
    'LETHALX',
    array['juno', 'lucia', 'cayde'],
    '[[], [], []]'::jsonb,
    array['seara', 'robo-f29', '*'],
    '[[], ["lionel"], []]'::jsonb,
    'very_safe',
    'proven',
    jsonb_build_object(
      'gamePlan', 'Cayde desvia bombas e ataques individuais, Lucia sustenta o time e reduz pela metade os efeitos de redução de ATB, enquanto Juno limpa debuffs e vence a luta longa.',
      'idealStats', 'Cayde extremamente tanky. Lucia com bastante HP, DEF e RES para manter cura e escudo. Juno em Violent/Destroy ou Revenge/Destroy.',
      'turnOrder', 'Lucia → Juno → Cayde.',
      'targetPriority', 'Eliminar primeiro o maior DPS, depois a segunda ameaça e deixar Seara por último enquanto ela gastar bombas no Cayde.',
      'thirdVariations', 'Comprovado contra Seara + ROBO-F29 + Dover. Também venceu a variante Seara + Lionel + Light White Tiger Blade Master.',
      'risks', 'Evite Oblivion e incapacidade bem aplicados no Cayde. Contra o Tigre Branco Light, a S3 é AoE, não é desviada e aumenta cooldown. Cuidado com um DPS forte de Água: ele pode focar Juno ou Lucia, enquanto a ideia deste counter é usar Cayde como desvio de foco.',
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
    'LETHALX',
    array['fire-aragorn', 'racuni', 'gyomei-himejima'],
    '[[], [], ["windy"]]'::jsonb,
    array['sylvia', 'daphnis', 'wind-zenitsu'],
    '[["moore"], [], ["savannah"]]'::jsonb,
    'very_safe',
    'proven',
    jsonb_build_object(
      'gamePlan', 'Counter seguro de turn 2: usar a lead de RES do Aragorn, sobreviver à abertura com o cleanse e ciclo do Racuni e desmontar a defesa metodicamente com Gyomei.',
      'idealStats', 'O time foi montado para chegar a 100% RES contando a lead de 48% do Aragorn.',
      'videoUrl', 'https://youtu.be/4i-BoXLldhc',
      'builds', jsonb_build_array(
        jsonb_build_object(
          'monsterId', 'fire-aragorn',
          'slot', 0,
          'isAlternative', false,
          'runes', 'Revenge / Revenge / Will',
          'hp', 32000,
          'def', 500
        ),
        jsonb_build_object(
          'monsterId', 'racuni',
          'slot', 1,
          'isAlternative', false,
          'runes', 'Violent / Nemesis',
          'hp', 30000,
          'def', 600
        ),
        jsonb_build_object(
          'monsterId', 'gyomei-himejima',
          'slot', 2,
          'isAlternative', false,
          'runes', 'Violent / Seal',
          'hp', 30000,
          'def', 1200
        )
      ),
      'turnOrder', 'Fire Aragorn → Racuni → Gyomei Himejima.',
      'targetPriority', 'Wind Zenitsu primeiro, Daphnis depois e Sylvia ou Moore por último conforme o dano oferecido.',
      'thirdVariations', 'Vitória confirmada contra Sylvia + Daphnis + Wind Zenitsu. O conceito também foi criado para Moore + Daphnis + Zenitsu.',
      'risks', 'A proposta é sobreviver à abertura, não disputar um cleave. Confirme que as builds alcançam a resistência e a durabilidade esperadas.',
      'substitutions', 'Windy pode ocupar o slot do Gyomei Himejima somente quando o Gyomei não estiver disponível. É uma alternativa de disponibilidade, não a opção principal do counter.',
      'evidence', 'Muito seguro + comprovado. Vitória confirmada em Siege G2 contra Sylvia + Daphnis + Wind Zenitsu.'
    ),
    true,
    true,
    '2026-10-26T18:05:00.000Z'
  ),
  (
    'siege-team-helper:delphoi-triana-roid-vs-galleon-bernard',
    null,
    'LETHALX',
    array['delphoi', 'triana', 'roid'],
    '[[], [], []]'::jsonb,
    array['galleon', 'bernard', '*'],
    '[[], [], []]'::jsonb,
    'very_safe',
    'proven',
    jsonb_build_object(
      'gamePlan', 'Não disputar a corrida. A lead de 40% DEF da Delphoi fortalece os três Wind; Delphoi limpa o DEF Break, Triana cobre a primeira morte e Roid estabiliza com controle, sustain e Destroy.',
      'idealStats', 'Delphoi e Triana em Violent/Will e alta RES; Roid Violent/Destroy, com bastante HP e taxa crítica consistente.',
      'turnOrder', 'Triana → Delphoi → Roid. É um núcleo bruiser e não depende de jogar antes da defesa.',
      'targetPriority', 'Stripper primeiro, principal DPS depois e o restante por último.',
      'thirdVariations', 'Vitória confirmada contra Galleon + Bernard + Leah. Também indicado contra defesas de stripper + DPS e algumas variações de Dark Cookie.',
      'risks', 'Nunca use se a defesa puder apagar Roid antes do sustain estabilizar. Strip + controle pesado ou uma Leah muito forte aumentam bastante o risco.',
      'substitutions', 'Contra muito multi-hit, Briand pode substituir Triana e oferecer revive, segundo a análise original.',
      'evidence', 'Muito seguro + comprovado. Vitória confirmada contra Galleon + Bernard + Leah e validação externa de uma composição equivalente no SWGT.'
    ),
    true,
    false,
    '2026-10-26T18:10:00.000Z'
  ),
  (
    'siege-team-helper:chiwu-deborah-legolas-vs-tarnisha-miles',
    null,
    'LETHALX',
    array['chiwu', 'deborah', 'legolas-wind'],
    '[[], [], []]'::jsonb,
    array['tarnisha', 'miles', '*'],
    '[[], [], []]'::jsonb,
    'safe',
    'proven',
    jsonb_build_object(
      'gamePlan', 'Chiwu abre com strip e redução de ATB, Deborah aplica DEF Break amplificado e Legolas converte o setup em dano e controle antes que a defesa estabeleça sua rotação.',
      'idealStats', 'Chiwu em Swift/Will e boa ACC; Deborah resistente e próxima de 85% ACC; Legolas com SPD, taxa crítica, dano crítico e ATK.',
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
    'LETHALX',
    array['mihyang', 'windy', 'vigor'],
    '[[], [], []]'::jsonb,
    array['carcano', 'liu-mei', '*'],
    '[[], [], []]'::jsonb,
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
  ),
  (
    'guild:kobrasw-eladriel-leo-chow-vs-sylvia-daphnis-zenitsu',
    null,
    'KoBrAsw',
    array['eladriel', 'leo', 'chow'],
    '[["briand"], [], []]'::jsonb,
    array['sylvia', 'daphnis', 'wind-zenitsu'],
    '[["moore"], [], ["savannah"]]'::jsonb,
    'situational',
    'proven',
    jsonb_build_object(
      'gamePlan', 'Leo limita a velocidade da luta para retirar a vantagem da abertura inimiga. Eladriel ou Briand mantém o time de pé e recupera uma peça abatida, enquanto Chow sustenta o dano até desmontar a defesa.',
      'idealStats', 'O reviver precisa de bastante HP, DEF e RES para sobreviver ao primeiro ciclo. Leo deve ser montado como bruiser resistente, e Chow precisa equilibrar dano e sustain para conduzir a luta longa.',
      'turnOrder', 'Sem ordem rígida por causa da passiva do Leo. Priorize a recuperação com Eladriel ou Briand, use Leo para controlar o ritmo e deixe Chow converter a vantagem em abates.',
      'targetPriority', 'Daphnis primeiro para remover a maior ameaça de explosão. Depois elimine Zenitsu ou Savannah e deixe Sylvia ou Moore por último quando a luta estiver estabilizada.',
      'thirdVariations', 'Pensado para Sylvia ou Moore + Daphnis + Wind Zenitsu ou Savannah. Confirme o terceiro defensor antes de escolher a variação do reviver.',
      'risks', 'O plano perde muita segurança se Eladriel ou Briand cair antes de usar o revive. Evite quando o reviver não suportar a abertura ou quando a defesa tiver controle suficiente para impedir a recuperação.',
      'substitutions', 'Briand pode ocupar o slot do Eladriel apenas quando o Eladriel não estiver disponível. É uma alternativa de disponibilidade, não uma escolha por status ou build.',
      'evidence', 'Testado e comprovado por mais de um membro da guilda. KoBrAsw trouxe o counter a partir da recomendação de um youtuber conhecido.'
    ),
    true,
    true,
    '2026-10-27T14:00:00.000Z'
  ),
  (
    'guild:mittus-platy-shihwa-elucia-vs-morris-orion-trevor',
    null,
    'Mittus',
    array['platy', 'shihwa', 'elucia'],
    '[[], [], []]'::jsonb,
    array['morris', 'orion', 'trevor'],
    '[[], [], []]'::jsonb,
    'safe',
    'proven',
    jsonb_build_object(
      'gamePlan', 'Use a lead de 24% SPD da Platy para entrar no ciclo com segurança. Shihwa e Elucia 2A alternam sono e congelamento sobre Trevor, enquanto Platy sustenta o time com cura, aumento de ATB, strip, controle de cooldown e revive. Com Trevor fora da rotação, elimine Orion e depois Morris antes de finalizar Trevor.',
      'idealStats', 'Platy e Elucia 2A com bastante HP e DEF; Violent/Will funciona bem nas duas, e Swift/Will é uma alternativa para Elucia. Platy precisa de boa RES e ACC suficiente para strip, stun e aumento de cooldown. Shihwa pode usar Violent/Destroy, equilibrando dano, durabilidade e ACC para sustentar o controle. Não copie valores fixos de SPD: o trio precisa sobreviver à abertura e ciclar sem deixar Trevor agir livre.',
      'turnOrder', 'Platy → Shihwa → Elucia 2A como referência. Platy pressiona Orion com a S3 quando possível; Shihwa coloca Trevor para dormir e ganha o turno extra; Elucia mantém Trevor dormindo ou congelado, ou guarda a S2 para limpar e recuperar o aliado afetado pelo Orion. Mais importante que uma sequência rígida é nunca liberar Trevor.',
      'targetPriority', 'Orion → Morris → Trevor. Remover Orion reduz strip, DEF Break e a variação da abertura; depois elimine Morris para impedir sustain e revive. Trevor fica controlado e morre por último, evitando ativar cedo o pico da passiva e o contra-ataque da S2.',
      'thirdVariations', 'Registro validado especificamente contra Morris + Orion + Trevor em torre Nat4. O plano depende de Trevor ser a ameaça mantida sob controle; não extrapole automaticamente para uma defesa com imunidade, cleanse ou passivas anti-controle.',
      'risks', 'Não use se Shihwa e Elucia não tiverem velocidade e durabilidade para manter Trevor travado. Procs Violent de Orion ou Morris, uma falha de controle, imunidade inesperada ou Trevor saindo do sono já abaixo de 30% podem disparar a S2 e o contra-ataque e virar a luta. Evite dano incidental em Trevor enquanto ele estiver dormindo e não o deixe com pouca vida antes de Orion e Morris morrerem.',
      'substitutions', 'Sem substituição comprovada nesta variação. Há registros do núcleo Platy + Shihwa com Iona ou Betta, mas a troca muda sustain, controle e recuperação; não trate essas opções como equivalentes à Elucia 2A sem testar.',
      'evidence', 'Comprovado pela guilda. Uma base comunitária documenta a mesma defesa e confirma o núcleo Platy + Shihwa, o controle do Trevor e a ordem Orion → Morris → Trevor; bases de Siege G3 também registram Shihwa + Elucia 2A juntas em ataques.'
    ),
    true,
    true,
    '2026-10-27T15:00:00.000Z'
  )
on conflict (source_key) do update
set
  player_name = excluded.player_name,
  attack = excluded.attack,
  attack_alternatives = excluded.attack_alternatives,
  defense = excluded.defense,
  defense_alternatives = excluded.defense_alternatives,
  safety = excluded.safety,
  validation_status = excluded.validation_status,
  sections = excluded.sections,
  is_seed = true,
  is_active = excluded.is_active,
  updated_at = now();
