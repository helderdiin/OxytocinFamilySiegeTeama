(function initializeSupabaseStore() {
  const config = window.OXYTOCIN_SUPABASE;
  const configured = Boolean(config?.url && config?.publishableKey && window.supabase?.createClient);
  const client = configured
    ? window.supabase.createClient(config.url, config.publishableKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      })
    : null;

  function assertConfigured() {
    if (!client) throw new Error("Supabase não configurado.");
  }

  function fromDatabase(row) {
    return {
      id: row.id,
      shortId: row.short_id,
      defenseId: row.defense_id,
      ownerId: row.owner_id,
      player: row.player_name,
      attack: row.attack,
      defense: row.defense,
      attackAlternatives: row.attack_alternatives || [[], [], []],
      defenseAlternatives: row.defense_alternatives || [[], [], []],
      safety: row.safety,
      status: row.validation_status,
      comments: [],
      sections: row.sections || {},
      isSeed: row.is_seed,
      isActive: row.is_active !== false,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  function toDatabase(strategy, userId, nick, defenseId) {
    return {
      defense_id: defenseId,
      owner_id: userId,
      player_name: nick,
      attack: strategy.attack,
      defense: strategy.defense,
      attack_alternatives: strategy.attackAlternatives,
      defense_alternatives: strategy.defenseAlternatives,
      safety: strategy.safety,
      validation_status: strategy.status,
      sections: strategy.sections,
      is_seed: false,
      is_active: true,
      created_at: strategy.createdAt || new Date().toISOString(),
    };
  }

  function commentFromDatabase(row) {
    return {
      id: row.id,
      strategyId: row.strategy_id,
      authorId: row.author_id,
      author: row.author_name,
      body: row.body,
      videoUrl: row.video_url || "",
      reaction: row.reaction === 1 || row.reaction === -1 ? row.reaction : null,
      createdAt: row.created_at,
    };
  }

  function editFromDatabase(row) {
    return {
      id: row.id,
      strategyId: row.strategy_id,
      editorId: row.editor_id,
      editor: row.editor_name,
      editedAt: row.edited_at,
    };
  }

  async function ensureUser(nick) {
    assertConfigured();
    let { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw sessionError;

    if (!sessionData.session) {
      const { data, error } = await client.auth.signInAnonymously();
      if (error) throw error;
      sessionData = { session: data.session };
    }

    const userId = sessionData.session?.user?.id;
    if (!userId) throw new Error("Não foi possível criar a sessão anônima.");

    const { error: profileError } = await client
      .from("profiles")
      .upsert({ id: userId, nick }, { onConflict: "id" });
    if (profileError) throw profileError;
    return userId;
  }

  async function listStrategies() {
    assertConfigured();
    const { data, error } = await client
      .from("strategies")
      .select("id, short_id, defense_id, owner_id, player_name, attack, defense, attack_alternatives, defense_alternatives, safety, validation_status, sections, is_seed, is_active, created_at, updated_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data.map(fromDatabase);
  }

  async function createStrategy(strategy, userId, nick) {
    assertConfigured();
    let defenseId = strategy.defenseId;
    if (!defenseId) {
      const { data: resolvedId, error: defenseError } = await client.rpc("resolve_defense", {
        p_monsters: strategy.defense,
        p_alternatives: strategy.defenseAlternatives,
      });
      if (defenseError) throw defenseError;
      defenseId = resolvedId;
    }

    const { data, error } = await client
      .from("strategies")
      .insert(toDatabase(strategy, userId, nick, defenseId))
      .select("id, short_id, defense_id, owner_id, player_name, attack, defense, attack_alternatives, defense_alternatives, safety, validation_status, sections, is_seed, is_active, created_at, updated_at")
      .single();
    if (error) throw error;
    return fromDatabase(data);
  }

  async function findSimilarDefenses(monsters, alternatives, limit = 3) {
    assertConfigured();
    const { data, error } = await client.rpc("find_similar_defenses", {
      p_monsters: monsters,
      p_alternatives: alternatives,
      p_limit: limit,
    });
    if (error) throw error;
    return (data || []).map((row) => ({
      id: row.id,
      defense: row.monsters,
      defenseAlternatives: row.alternatives || [[], [], []],
      counterCount: Number(row.counter_count) || 0,
      matchingSlots: Number(row.matching_slots) || 0,
      exactSlots: Number(row.exact_slots) || 0,
    }));
  }

  async function listStrategyEdits() {
    assertConfigured();
    const { data, error } = await client
      .from("strategy_edits")
      .select("id, strategy_id, editor_id, editor_name, edited_at")
      .order("edited_at", { ascending: true });
    if (error) throw error;
    return data.map(editFromDatabase);
  }

  async function updateStrategy(strategy, expectedUpdatedAt) {
    assertConfigured();
    const { data, error } = await client.rpc("update_strategy_collaboratively", {
      p_strategy_id: strategy.id,
      p_expected_updated_at: expectedUpdatedAt || null,
      p_attack: strategy.attack,
      p_attack_alternatives: strategy.attackAlternatives,
      p_defense: strategy.defense,
      p_defense_alternatives: strategy.defenseAlternatives,
      p_safety: strategy.safety,
      p_validation_status: strategy.status,
      p_sections: strategy.sections,
    });
    if (error) {
      if (error.code === "40001" || error.message?.includes("strategy_conflict")) {
        const conflict = new Error("strategy_conflict");
        conflict.code = "STRATEGY_CONFLICT";
        throw conflict;
      }
      throw error;
    }
    return {
      strategy: fromDatabase(data.strategy),
      edit: editFromDatabase(data.edit),
    };
  }

  async function listComments() {
    assertConfigured();
    const { data, error } = await client
      .from("strategy_comments")
      .select("id, strategy_id, author_id, author_name, body, video_url, reaction, created_at")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data.map(commentFromDatabase);
  }

  async function createComment(comment, userId, nick) {
    assertConfigured();
    const { data, error } = await client
      .from("strategy_comments")
      .insert({
        strategy_id: comment.strategyId,
        author_id: userId,
        author_name: nick,
        body: comment.body,
        video_url: comment.videoUrl || null,
        reaction: comment.reaction,
        created_at: comment.createdAt || new Date().toISOString(),
      })
      .select("id, strategy_id, author_id, author_name, body, video_url, reaction, created_at")
      .single();
    if (error) throw error;
    return commentFromDatabase(data);
  }

  async function deleteStrategy(id, userId) {
    assertConfigured();
    const { error } = await client.from("strategies").delete().eq("id", id).eq("owner_id", userId);
    if (error) throw error;
  }

  window.oxytocinDb = {
    isConfigured: () => configured,
    ensureUser,
    listStrategies,
    createStrategy,
    findSimilarDefenses,
    listStrategyEdits,
    updateStrategy,
    listComments,
    createComment,
    deleteStrategy,
  };
})();
