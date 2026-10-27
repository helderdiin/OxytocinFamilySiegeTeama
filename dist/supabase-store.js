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
      ownerId: row.owner_id,
      player: row.player_name,
      attack: row.attack,
      defense: row.defense,
      safety: row.safety,
      status: row.validation_status,
      sections: row.sections || {},
      isSeed: row.is_seed,
      createdAt: row.created_at,
    };
  }

  function toDatabase(strategy, userId, nick) {
    return {
      owner_id: userId,
      player_name: nick,
      attack: strategy.attack,
      defense: strategy.defense,
      safety: strategy.safety,
      validation_status: strategy.status,
      sections: strategy.sections,
      is_seed: false,
      created_at: strategy.createdAt || new Date().toISOString(),
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
      .select("id, owner_id, player_name, attack, defense, safety, validation_status, sections, is_seed, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data.map(fromDatabase);
  }

  async function createStrategy(strategy, userId, nick) {
    assertConfigured();
    const { data, error } = await client
      .from("strategies")
      .insert(toDatabase(strategy, userId, nick))
      .select("id, owner_id, player_name, attack, defense, safety, validation_status, sections, is_seed, created_at")
      .single();
    if (error) throw error;
    return fromDatabase(data);
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
    deleteStrategy,
  };
})();
