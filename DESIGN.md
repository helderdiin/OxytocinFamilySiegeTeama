---
name: Oxytocin Siege Teams
description: A defense-first tactical desk for fast, trusted Siege counter decisions.
colors:
  operations-bg: "#142428"
  surface-primary: "#1a2e32"
  surface-raised: "#223b40"
  surface-active: "#2b484e"
  border-subtle: "#365158"
  border-strong: "#58747a"
  text-primary: "#f0eee6"
  text-muted: "#9dacaf"
  text-muted-strong: "#c3cccb"
  safe-aqua: "#7fac9f"
  safe-aqua-deep: "#638f84"
  danger-copper: "#d47b58"
  caution-amber: "#d5a14c"
  proven-blue: "#7faec3"
  action-copper: "#b86749"
  action-copper-hover: "#ca7656"
  action-text: "#fffaf3"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(42px, 8vw, 64px)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(34px, 5vw, 54px)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "25px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "9px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.11em"
rounded:
  micro: "7px"
  control: "8px"
  search: "10px"
  card: "14px"
  dialog: "16px"
  pill: "999px"
spacing:
  xxs: "6px"
  xs: "8px"
  sm: "10px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "30px"
  4xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.action-copper}"
    textColor: "{colors.action-text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.action-copper-hover}"
    textColor: "{colors.action-text}"
    rounded: "{rounded.control}"
  button-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  input:
    backgroundColor: "{colors.operations-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "48px"
  card-strategy:
    backgroundColor: "{colors.surface-primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "18px 20px 0"
  chip-safe:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.safe-aqua}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
  chip-caution:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.caution-amber}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
  chip-proven:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.proven-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
---

# Design System: Oxytocin Siege Teams

## Overview

**Creative North Star: "Night Operations Desk"**

Night Operations Desk is a calm, high-readiness tactical workspace: deep petrol-blue surroundings, slate work surfaces, warm off-white type, and restrained semantic signals. It should feel like a shared guild station used during a live operation—not a game lobby, generic admin dashboard, or theatrical command center.

The interface is defense-first and decision-first. Enemy composition leads every matchup; fit, risk, validation, and turn order remain legible before expansion. Density is purposeful rather than cramped, monster artwork stays prominent as functional identification, and progressive disclosure keeps long-form playbook material available without slowing the first decision.

No gradients or neon effects belong in this world. Depth comes from tonal surface steps, thin borders, and controlled low-chroma shadows; color is reserved for operational meaning.

**Key Characteristics:**

- Deep petrol environment with layered slate/petrol surfaces.
- Copper actions and danger, aqua safe/counter signals, blue proven/fit signals, and amber caution.
- Defense-led matchup hierarchy with decision signals visible while collapsed.
- Compact operational density, warm text, and prominent monster portraits.
- Quiet depth, restrained motion, and no gradients or neon.

## Colors

The palette is a low-chroma night environment in which warm copper and cool status colors carry precise operational meaning.

### Primary

- **Action Copper** (`action-copper`): Primary actions, the O2 mark, selected filters, destructive emphasis, and the strongest focus cues. Its darker warmth creates urgency without reading as alarm-red.
- **Danger Copper** (`danger-copper`): Risk labels, warning focus, and defense-related danger states. Use it for consequence, not general decoration.

### Secondary

- **Safe Aqua** (`safe-aqua`): Safe counters, attack-team identity, successful sync, positive guidance, and counter-oriented emphasis.
- **Deep Safe Aqua** (`safe-aqua-deep`): Structural safe-state borders and quieter positive emphasis where the brighter aqua would be too loud.

### Tertiary

- **Proven Blue** (`proven-blue`): Proven validation, matchup fit, share actions, and evidence-backed status.
- **Caution Amber** (`caution-amber`): Conditional counters and warnings that require attention but are not immediate danger.

### Neutral

- **Operations Background** (`operations-bg`): The page-wide deep petrol field.
- **Primary Surface** (`surface-primary`): Strategy cards and primary containers.
- **Raised Surface** (`surface-raised`): Secondary buttons, media wells, chips, and nested controls.
- **Active Surface** (`surface-active`): Hovered or active neutral surfaces.
- **Subtle Border** (`border-subtle`): Default separators, card edges, and structural rules.
- **Strong Border** (`border-strong`): Hovered, open, or selected neutral boundaries.
- **Primary Text** (`text-primary`): Warm off-white headings and high-priority reading text.
- **Muted Text** (`text-muted`): Supporting copy, metadata, placeholders, and secondary labels.
- **Strong Muted Text** (`text-muted-strong`): Secondary copy that needs more presence than metadata.
- **Action Text** (`action-text`): Warm white used on copper action surfaces.

### Named Rules

**The Copper Means Act Rule.** Copper is reserved for action, enemy danger, destructive intent, and focus; never use it as ambient decoration.

**The Cool Signals Rule.** Aqua communicates safe counters, while blue communicates proven evidence or matchup fit; do not swap those meanings.

**The No Neon Rule.** Semantic colors stay desaturated and bounded by tonal surfaces or borders—never glow, bloom, or become fluorescent.

## Typography

**Display Font:** Space Grotesk (with sans-serif fallback)

**Body Font:** DM Sans (with sans-serif fallback)
**Label/Mono Font:** DM Sans (with sans-serif fallback)

**Character:** Space Grotesk gives headings and the O2 identity a compact, technical authority. DM Sans keeps operational copy, metadata, and form controls calm and highly readable at dense sizes.

### Hierarchy

- **Display** (600, fluid 42–64px, 0.96 line-height): Login identity and rare brand-scale statements.
- **Headline** (600, fluid 34–54px, 1.04 line-height): The command-center question or primary page task.
- **Title** (600, 25px, 1.2 line-height): Results groups and major in-page sections; compact to 22px on narrow screens.
- **Body** (400, 16px, 1.6 line-height): Explanations and comfortable long-form reading; dense operational copy may step down to 12–14px while retaining generous line-height.
- **Label** (700, 9px, 0.11em letter-spacing, uppercase): Team roles, decision categories, field labels, and compact status metadata.

### Named Rules

**The Two-Speed Type Rule.** Space Grotesk names the mission; DM Sans carries the decision. Do not introduce a third display voice.

**The Labels Scan, Body Explains Rule.** Uppercase tracking belongs to short operational labels only; never apply it to paragraphs, monster names, or user-entered content.

## Layout

The desktop workspace uses a centered content rail capped at 1200px with 24px side clearance. A 76px sticky top bar anchors identity and actions; the command center leads with the primary task, followed by a 62px high full-width defense search and a compact filter row. Results use a one-column stack of strategy records with 12px gaps so each matchup reads as a complete decision unit.

Within a strategy, defense and attack occupy balanced columns around a narrow directional arrow. The decision strip follows immediately in three columns—fit, risk, and turn order—before any expanded documentation. Cards use roughly 18–20px internal padding, while nested decision and detail cells tighten to 14–18px.

At 900px, decision cells stack vertically and filters wrap. At 620px, the content rail narrows to 14px side clearance, the top bar becomes 66px high, the defense search becomes a 56px sticky control, matchups become a single vertical sequence, monster teams become a three-column grid, and forms collapse to one column. Interactive targets remain at least 44px wherever primary interaction occurs.

**The Defense Leads Rule.** Enemy composition appears before the proposed attack in reading order, visual emphasis, and mobile stacking.

**The Decision Before Documentation Rule.** Fit, risk, and turn order must be visible before builds, substitutions, evidence, or the full game plan.

**The Collapsed Utility Rule.** A closed strategy card must still answer whether the counter fits, how safe it is, what can fail, and what moves first.

## Elevation & Depth

The system uses a restrained hybrid of tonal layering and low-chroma shadow. Most hierarchy comes from stepping through the petrol surface tokens and reinforcing edges with 1px borders. Shadows are reserved for sticky chrome, primary search, cards, dialogs, toasts, and shared-strategy emphasis; they create separation, never spectacle. There are no gradients, colored glows, or ambient light blobs.

### Shadow Vocabulary

- **Search Lift** (`0 12px 32px rgba(4,13,15,.17)`): Separates the primary defense search from the command-center field.
- **Card Lift** (`0 9px 26px rgba(4,13,15,.16)`): Keeps strategy records distinct against the operations background.
- **Chrome Lift** (`0 8px 26px rgba(4,13,15,.22)`): Anchors the sticky top bar during scrolling.
- **Dialog Lift** (`0 30px 95px rgba(3,10,12,.5)`): Establishes modal priority over the darkened backdrop.
- **Toast Lift** (`0 14px 40px rgba(4,13,15,.34)`): Holds transient confirmation above the active workspace.

### Named Rules

**The Layer, Then Lift Rule.** Establish hierarchy with surface tone and borders first; add shadow only when an element must detach from its current plane.

**The Quiet Shadow Rule.** Shadows remain dark, diffuse, and low-chroma. They never become a colored glow.

## Shapes

The form language is compact and gently curved: 8px controls, 10px search and grouped fields, 14px strategy cards, 16px dialogs, and 999px status chips. One-pixel borders carry most structure. Monster imagery uses 7–8px corners and a 2px elemental border so identification remains crisp. Circular geometry is limited to avatars and status dots; dashed borders identify optional or empty states.

**The Nested Radius Rule.** Inner controls are always tighter than their container: controls at 8–10px sit inside cards at 14px and dialogs at 16px.

**The Shape Has Meaning Rule.** Pills are reserved for compact status and filters; circles are reserved for identity or point status; dashed edges mean optional, wildcard, or empty.

## Components

### Buttons

Buttons are sturdy, readable controls with restrained state changes and a 44px minimum touch height.

- **Shape:** Gently curved control corners (8px) with horizontal padding of 18px.
- **Primary:** Copper surface with warm action text and bold DM Sans; used for the single strongest action in a local context.
- **Hover / Focus:** Hover shifts to the brighter copper; keyboard focus uses a visible copper boundary or 3px low-opacity copper ring. State transitions run in 160ms and disappear under reduced motion.
- **Secondary / Ghost:** Raised petrol surface with a 1px border; hover moves one tonal step brighter and strengthens the border. Ghost actions remain text-led until hover.

### Chips

Chips are compact semantic evidence, not decoration.

- **Style:** Fully rounded pills (999px), 1px semantic border, 4px by 8px padding, 8px uppercase bold label with measured tracking.
- **State:** Safe uses aqua, caution uses amber, and proven uses blue. Neutral sync and metadata chips stay within the petrol/gray palette; selected filter chips may use solid copper.

### Cards / Containers

Strategy cards are compact decision records whose collapsed state carries the essential matchup.

- **Corner Style:** Gently rounded strategy corners (14px); nested detail surfaces use tighter corners or shared grid edges.
- **Background:** Primary petrol surface over the deeper operations background; expanded detail areas step darker or cooler to separate documentation from the decision layer.
- **Shadow Strategy:** Use Card Lift at rest; shared-link emphasis may add a 1px aqua keyline and a slightly deeper dark shadow.
- **Border:** Default 1px subtle border, strengthened on hover or open state.
- **Internal Padding:** 18–20px for the summary shell; 14–18px for decision and detail cells.

### Inputs / Fields

Inputs feel embedded in the desk until focused, when their operational importance becomes explicit.

- **Style:** Deep petrol field, 1px slate border, 8px corners, warm text, muted placeholder, and a 44–48px control height. The primary defense search expands to 62px on desktop and 56px on mobile.
- **Focus:** Copper border plus a 3px translucent copper ring; the primary search retains its dark lift while focused.
- **Error / Disabled:** Danger uses copper sparingly in border or helper text. Disabled and secondary states remain muted but legible; never rely on opacity alone for meaning.

### Navigation

The sticky top bar is a 76px petrol slab with a subtle lower border and Chrome Lift. The copper O2 mark anchors the left; guild identity uses Space Grotesk with a small uppercase DM Sans descriptor. Actions and user state sit at right. On narrow screens the bar becomes 66px, nonessential status and user copy disappear, and the add action keeps a concise text label or accessible name.

### Strategy Record

The signature component presents semantic badges, defense-versus-attack composition with prominent 40px monster portraits, then a three-part decision strip for fit, risk, and turn order. Expansion reveals the playbook, builds, substitutions, and evidence on quieter nested surfaces. The defense label and surface carry copper; the attack side carries aqua; fit remains blue. The entire summary is keyboard focusable, and the disclosure arrow rotates 90 degrees in the open state.

**The One Signal per Meaning Rule.** Within a strategy record, copper means enemy/risk, aqua means counter/safe, blue means fit/proven, and amber means caution—never encode two different meanings with the same accent.

**The Portraits Are Data Rule.** Monster artwork is functional identification, not decoration; keep it visible, consistently sized, and element-bordered.

## Do's and Don'ts

### Do:

- **Do** lead every result with the enemy defense, then show the proposed attack and its decision signals.
- **Do** use the real petrol surface ladder, thin slate borders, and quiet dark shadows to create depth.
- **Do** reserve copper for action, defense danger, destructive intent, and focus.
- **Do** keep safe/counter aqua, proven/fit blue, and caution amber semantically distinct.
- **Do** keep minimum 44px touch targets, visible keyboard focus, and reduced-motion behavior.
- **Do** preserve prominent monster artwork and elemental borders as identification aids.

### Don't:

- **Don't** use gradients, neon colors, colored glow, or pure-black gaming surfaces.
- **Don't** hide fit, risk, validation, or turn order behind expansion.
- **Don't** let long-form guidance outrank the collapsed decision layer.
- **Don't** use copper as a decorative accent or apply semantic colors without a status meaning.
- **Don't** turn every label into a pill; reserve pills for statuses and compact filters.
- **Don't** add a third typeface or use uppercase tracked labels for prose.
