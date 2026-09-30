# Brand — Obligor

_Status: active_

## Voice

Obligor is confidential two-party clearing for trading desks. Voice: precise, calm, honest. Short declarative sentences. Numbers do the persuading; no hype, no gradient hero copy. We name tradeoffs aloud ("TEE ≠ MPC"). Never overclaim.

## Palette — "Monochrome" (launch-grade, #131316 base)

Locked base: near-black #131316, pure white text. Light theme is the exact reverse: near-white #FAFAFA base, #131316 text. No brand accent color at all — white-on-black (and black-on-white) CTAs carry the interface. Color appears only where it carries meaning: green = success/savings, red = destructive, neutral gray = TEE/secondary. Focus rings follow the theme foreground with background-matched offset. Discipline: no gradient text, no glow shadows, no sheen, no colored borders except semantic.

| Token | Light (reversed) | Dark (locked base) |
| --- | --- | --- |
| background | #FAFAFA | **#131316** |
| surface (card) | #FFFFFF | #19191D |
| popover | #FFFFFF | #1E1E23 |
| foreground | #131316 | #FFFFFF |
| muted-foreground | #6B6B74 | #A1A1AA |
| border | #E4E4E7 | #27272A |
| **primary (CTA)** | #131316 (black button) | #FFFFFF (white button) |
| primary-foreground | #FAFAFA | #131316 |
| ring | #131316 | #FFFFFF |
| success | #079455 | #3FB950 |
| steel (TEE marker) | #6F7C88 | #8A95A1 |
| destructive | #D92D20 | #F04438 |

Rule: the interface is monochrome; motion and typography do the branding. Green/red/gray are semantic only — never decorative.

## Typography

- **Headings:** Geist (display sans, tight tracking).
- **Body/UI:** Inter.
- **Numbers/pricing only:** Geist Mono with `tabular-nums` — balances, margins, addresses.

## Typography

Superseded by the user-directed typography section above: Geist headings, Inter body, Geist Mono numbers. Serif removed.
- UI/body: **Geist Sans**.
- Numbers/addresses/code: **Geist Mono** with `tabular-nums` always for currency; 2 decimals everywhere for USD.

Rule: Geist (headings) and Inter (body) share the neutral sans family look — headings use tighter tracking and medium weight to differentiate. Numbers always Geist Mono.

## Gradients & texture

None as decoration. Depth via surface steps (#0B0C0F → #14161B → #1A1D23), 1px borders `#262A31`, and a single radial jade tint at very low opacity behind the hero only.

## Motion

CSS transitions, 100–250ms, ease-out. Jade flash on margin numbers when they resolve. Respect `prefers-reduced-motion` everywhere.
