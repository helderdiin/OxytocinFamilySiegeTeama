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
      'idealStats', 'Juno e Lucia devem alcançar o tick 5 de SPD. Juno precisa de pelo menos 50% ACC total. Lucia precisa de pelo menos 50% RES total. Cayde não depende de SPD; qualquer ACC adicional é bem-vinda para aumentar a consistência da S2.',
      'referenceImage', jsonb_build_object(
        'path', 'assets/counter-references/juno-lucia-cayde-v1-original-assets.png',
        'alt', 'Counter de Juno, Lucia e Cayde contra Seara, ROBO-F29 ou Lionel e qualquer terceiro',
        'width', 1536,
        'height', 1024,
        'version', 1
      ),
      'builds', jsonb_build_array(
        jsonb_build_object(
          'monsterId', 'juno',
          'slot', 0,
          'isAlternative', false,
          'runes', 'Violent / Destroy',
          'speedTune', 'Tick 5',
          'hp', 30000,
          'atk', 700,
          'def', 600,
          'acc', 50,
          'artifacts', 'Redução de dano / dano adicional'
        ),
        jsonb_build_object(
          'monsterId', 'lucia',
          'slot', 1,
          'isAlternative', false,
          'runes', 'Violent / Will',
          'speedTune', 'Tick 5',
          'hp', 30000,
          'def', 600,
          'res', 50,
          'artifacts', 'Redução de dano / recuperação da S2'
        ),
        jsonb_build_object(
          'monsterId', 'cayde',
          'slot', 2,
          'isAlternative', false,
          'runes', 'Sem set obrigatório',
          'speedTune', 'SPD não é prioridade',
          'hp', 38000,
          'def', 800,
          'res', 50,
          'artifacts', 'Redução de dano / precisão da S2'
        )
      ),
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
      'referenceImage', jsonb_build_object(
        'path', 'assets/counter-references/fire-aragorn-racuni-gyomei-v3-original-assets.png',
        'alt', 'Counter de Fire Aragorn, Racuni e Gyomei Himejima contra Sylvia ou Moore, Daphnis e Zenitsu Agatsuma ou Savannah',
        'width', 1536,
        'height', 1024,
        'version', 1
      ),
      'builds', jsonb_build_array(
        jsonb_build_object(
          'monsterId', 'fire-aragorn',
          'slot', 0,
          'isAlternative', false,
          'runes', 'Revenge / Revenge / Will',
          'hp', 32000,
          'def', 500,
          'artifacts', 'Redução de dano de Água / recuperação da S3'
        ),
        jsonb_build_object(
          'monsterId', 'racuni',
          'slot', 1,
          'isAlternative', false,
          'runes', 'Violent / Nemesis',
          'hp', 30000,
          'def', 600,
          'artifacts', 'Redução de dano de Água / recuperação da S3'
        ),
        jsonb_build_object(
          'monsterId', 'gyomei-himejima',
          'slot', 2,
          'isAlternative', false,
          'runes', 'Violent / Seal',
          'hp', 30000,
          'def', 1200,
          'artifacts', 'Redução de dano de Fogo / precisão da S2'
        ),
        jsonb_build_object(
          'monsterId', 'windy',
          'slot', 2,
          'isAlternative', true,
          'artifacts', 'Redução de dano de Fogo / dano adicional por DEF'
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
      'idealStats', 'Use a lead de HP do Eladriel. Os valores da tabela são um piso para este matchup. Priorize artefato de dano recebido de Fogo no Eladriel e no Leo; no Chow, dano recebido de Vento. CD da S2 é valioso nos dois Dragon Knights, e recuperação da S2 ajuda o Eladriel.',
      'referenceImage', jsonb_build_object(
        'path', 'assets/counter-references/eladriel-leo-chow-v1-original-assets.png',
        'alt', 'Counter de Eladriel ou Briand, Leo e Chow contra Sylvia ou Moore, Daphnis e Zenitsu Agatsuma ou Savannah',
        'width', 1536,
        'height', 1024,
        'version', 1
      ),
      'builds', jsonb_build_array(
        jsonb_build_object(
          'monsterId', 'eladriel',
          'slot', 0,
          'isAlternative', false,
          'runes', 'Violent / Will · HP% / HP% / RES%',
          'hp', 28000,
          'def', 850,
          'spd', 40,
          'res', 85,
          'acc', 25,
          'artifacts', 'Redução de dano de Fogo / recuperação da S2'
        ),
        jsonb_build_object(
          'monsterId', 'briand',
          'slot', 0,
          'isAlternative', true,
          'artifacts', 'Redução de dano de Fogo / precisão da S2'
        ),
        jsonb_build_object(
          'monsterId', 'leo',
          'slot', 1,
          'isAlternative', false,
          'runes', 'Vampire / Destroy · ATK% / CD% / HP%',
          'hp', 18000,
          'atk', 700,
          'def', 450,
          'cr', 85,
          'cd', 150,
          'acc', 25,
          'artifacts', 'Redução de dano de Fogo / dano crítico da S2'
        ),
        jsonb_build_object(
          'monsterId', 'chow',
          'slot', 2,
          'isAlternative', false,
          'runes', 'Violent / Destroy · ATK% / CD% / HP%',
          'hp', 20000,
          'atk', 700,
          'def', 550,
          'cr', 85,
          'cd', 150,
          'artifacts', 'Redução de dano de Vento / dano crítico da S2'
        )
      ),
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
      'idealStats', 'Use a lead de 24% SPD da Platy e mantenha o trio no tick 5, na ordem Platy → Shihwa → Elucia 2A. Os valores da tabela são pisos de referência para este matchup: Platy e Elucia precisam sobreviver à abertura e Shihwa não pode sacrificar toda a durabilidade para causar dano.',
      'referenceImage', jsonb_build_object(
        'path', 'assets/counter-references/platy-shihwa-elucia-v1-original-assets.png',
        'alt', 'Counter de Platy, Shihwa e Elucia 2A contra Morris, Orion e Trevor',
        'width', 1536,
        'height', 1024,
        'version', 1
      ),
      'builds', jsonb_build_array(
        jsonb_build_object(
          'monsterId', 'platy',
          'slot', 0,
          'isAlternative', false,
          'runes', 'Violent / Will · SPD / HP% / RES%',
          'speedTune', 'Tick 5 · referência +149 SPD',
          'hp', 30000,
          'def', 700,
          'res', 100,
          'acc', 45,
          'artifacts', 'Redução de dano de Água / recuperação da S2'
        ),
        jsonb_build_object(
          'monsterId', 'shihwa',
          'slot', 1,
          'isAlternative', false,
          'runes', 'Violent / Destroy · SPD / CR% / HP%',
          'speedTune', 'Tick 5 · referência +144 SPD',
          'hp', 20000,
          'atk', 1000,
          'def', 700,
          'acc', 45,
          'artifacts', 'Redução de dano de Água / dano da S3'
        ),
        jsonb_build_object(
          'monsterId', 'elucia',
          'slot', 2,
          'isAlternative', false,
          'runes', 'Violent / Will · SPD / HP% / HP%',
          'speedTune', 'Tick 5 · referência +141 SPD',
          'hp', 25000,
          'atk', 500,
          'def', 700,
          'res', 70,
          'artifacts', 'Redução de dano de Água / recuperação da S2'
        )
      ),
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
