# Oxytocin Siege Teams

## What this product is

Oxytocin Siege Teams is an internal web tool for the Oxytocin Family guild in Summoners War: Sky Arena. It maps enemy Siege defenses to attack compositions the guild has tested or recommends.

The product is used in a time-critical moment: a member sees an enemy base, searches by the defending monsters, and needs to decide quickly whether a saved counter fits that exact situation.

## Primary users

- Oxytocin Family guild members participating in Siege.
- Members may use the tool on mobile or desktop while the battle is active.
- Identification is intentionally lightweight for the current guild rollout: the player enters their in-game nickname while the data model remains ready for authenticated ownership later.

## Core user job

Given an enemy defense, find a relevant counter and understand, at a glance:

1. Whether the matchup applies to the observed defense.
2. How reliable and validated the counter is.
3. The main reason it can fail.
4. The required turn order.
5. How to build and pilot the composition.

## Current capabilities

- Shared strategies stored in Supabase.
- Search and filters for safety and validation status.
- Defenses are shared records that can have several independent counters.
- Two required monsters and an optional third monster on both attack and defense.
- Up to four alternative monsters can be attached to each occupied attack or defense slot without duplicating a counter.
- A new counter can be started from a defense with its monsters and alternatives already linked, while keeping its own plan, builds, risks, author, feedback, and validation status.
- Monster catalog with images, external IDs, elements, aliases, preferred 2A variants, and localized Leader Skill data.
- Structured strategy guidance: game plan, recommended stats/builds, turn order, target priority, third-slot variations, risks, substitutions, and battle evidence.
- Expandable strategy records and direct share links.
- Collaborative comments with an optional +1 or -1 result attached to each feedback entry; authors can edit their own feedback, reaction, and video afterward.
- Inactive strategies remain stored but are hidden from the member-facing UI.

## Product positioning

This is not a general team builder or a public database. It is a defense-first, guild-curated decision tool. Its value is reducing hesitation during Siege by turning accumulated guild experience into a fast, repeatable pre-attack check.

## Evidence and data

- Existing entries imported from the guild's previous SiegeTeamHelper project.
- Reliability and validation labels are attached to each strategy.
- Monster data and artwork are sourced from the existing local catalog.

## Brand and visual commitments

- Use the Oxytocin name and O2 mark.
- Preserve the dark tactical “war room” visual world without falling into pure-black or neon-gaming conventions.
- Use deep petrol blue as the primary environment, copper for actions and danger, and desaturated aqua for safe counters.
- Monster artwork is functional identification and should stay prominent.

## Design principles

1. **Defense first.** The enemy team is the member's starting point and must lead search and card hierarchy.
2. **Decision before documentation.** Match, safety, risk, and turn order appear before long-form guidance.
3. **Useful while collapsed.** A strategy row must answer the first decision questions without opening it.
4. **Progressive detail.** Builds, full plan, substitutions, and evidence are available on expansion.
5. **Fast under pressure.** Search should tolerate monster order, work well with two names, and remain easy to reach on small screens.
6. **Trust is visible.** Proven/recommended/experimental status and evidence must be easy to distinguish.
7. **Knowledge is preserved.** Strategies can be hidden without being deleted.

## Accessibility and interaction constraints

- Strong contrast, visible focus, and minimum 44px touch targets.
- All important actions must have text or accessible labels, not icon-only meaning.
- Respect reduced-motion preferences.
- The experience must remain usable by keyboard and on narrow mobile screens.

## Known unknowns

- Exact distribution of mobile versus desktop usage has not been measured.
- The guild has not yet defined a formal review/approval workflow for strategies.
- Base/tower metadata and Siege rank context are not currently stored.
