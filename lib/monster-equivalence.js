function read(monster, camelKey, snakeKey) {
  return monster?.[camelKey] ?? monster?.[snakeKey] ?? null;
}

function normalizedElement(monster) {
  return String(read(monster, "element", "element") || "").toLowerCase();
}

function leaderSkillSignature(monster) {
  const leader = read(monster, "leaderSkill", "leader_skill");
  if (!leader) return null;
  return [
    leader.attribute || null,
    Number(leader.amount) || null,
    leader.area || null,
    leader.element ? String(leader.element).toLowerCase() : null,
  ];
}

export function monsterBattleSignature(monster) {
  return JSON.stringify([
    Number(read(monster, "naturalStars", "natural_stars")) || null,
    Number(read(monster, "awakenLevel", "awaken_level")) || null,
    Number(read(monster, "baseHp", "base_hp")) || null,
    Number(read(monster, "baseAttack", "base_attack")) || null,
    Number(read(monster, "baseDefense", "base_defense")) || null,
    Number(read(monster, "speed", "speed")) || null,
    Number(read(monster, "critRate", "crit_rate")) || null,
    Number(read(monster, "critDamage", "crit_damage")) || null,
    Number(read(monster, "resistance", "resistance")) || null,
    Number(read(monster, "accuracy", "accuracy")) || null,
    Number(read(monster, "skillUpsToMax", "skill_ups_to_max")) || null,
    leaderSkillSignature(monster),
  ]);
}

export function detectEquivalentMonsterGroups(monsters) {
  const candidates = new Map();

  for (const monster of monsters) {
    const skillGroupId = Number(read(monster, "skillGroupId", "skill_group_id"));
    const familyId = Number(read(monster, "familyId", "family_id"));
    const com2usId = Number(monster?.externalIds?.com2us ?? read(monster, "com2usId", "com2us_id"));
    const element = normalizedElement(monster);
    if (!skillGroupId || !familyId || !com2usId || !element) continue;
    const key = `${skillGroupId}:${element}:${monsterBattleSignature(monster)}`;
    if (!candidates.has(key)) candidates.set(key, []);
    candidates.get(key).push({ monster, skillGroupId, familyId, com2usId, element });
  }

  const groups = [];
  for (const candidatesForSignature of candidates.values()) {
    if (candidatesForSignature.length !== 2) continue;
    const collab = candidatesForSignature.filter((item) => item.familyId === item.skillGroupId);
    const originals = candidatesForSignature.filter((item) => item.familyId !== item.skillGroupId);
    if (collab.length !== 1 || originals.length !== 1) continue;
    const canonical = originals[0];
    groups.push({
      key: `skill-${canonical.skillGroupId}-${canonical.element}`,
      skillGroupId: canonical.skillGroupId,
      element: canonical.element,
      canonicalCom2usId: canonical.com2usId,
      variantCom2usIds: [canonical.com2usId, collab[0].com2usId],
    });
  }

  return groups.sort((left, right) => left.skillGroupId - right.skillGroupId || left.element.localeCompare(right.element));
}
