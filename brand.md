# Brand — Obligor

_Status: active_

## Voice

Obligor is confidential two-party clearing for trading desks. Voice: precise, calm, honest. Short declarative sentences. Numbers do the persuading; no hype, no gradient hero copy. We name tradeoffs aloud ("TEE ≠ MPC"). Never overclaim.

## Palette — "Spectral" (launch-grade, #131316 base)

Locked base: near-black #131316. Accent: refined indigo — institutional, Linear/Stripe-tier, market-launch ready. Light mode = neutral gray-white. Restraint discipline retained from the Phantom pass: no gradient text, no glow shadows, no sheen.

| Token | Light value | Dark value |
| --- | --- | --- |
| background | #F7F7FA | **#131316** (locked) |
| surface (card) | #FFFFFF | #19191D |
| popover | #FFFFFF | #1E1E23 |
| foreground | #1B1B1F | #F2F2F5 |
| muted-foreground | #6B6B74 | #9B9BA3 |
| border | #E5E5EA | #26262B |
| **primary (indigo)** | #5244C9 (AA on white) | #7A6FF0 |
| primary-foreground | #F8F8FC | #131316 |
| ring | #5244C9 | #7A6FF0 |
| success | #0F8A5F | #4CC38A |
| steel (TEE marker) | #5F7D9C | #8FA3BF |
| destructive | #D6455C | #E05E6E |

Rule: indigo is the sole accent — CTAs, focus rings, active-nav underline, trust chips, headline accent. Everything else neutral monochrome. Green = semantic success/savings. Steel = attested-TEE markers. Red = destructive/leak. No gradient text, no glow shadows, no sheen — the product reads like serious financial software.

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
