# Brand — Obligor

_Status: active_

## Voice

Obligor is confidential two-party clearing for trading desks. Voice: precise, calm, honest. Short declarative sentences. Numbers do the persuading; no hype, no gradient hero copy. We name tradeoffs aloud ("TEE ≠ MPC"). Never overclaim.

## Palette — "Phantom Violet" (wallet-native)

User-directed: Phantom wallet aesthetic. Neutral dark surfaces, single periwinkle-violet accent, cool steel reserved for TEE markers. Light mode = neutral gray-white.

| Token | Light value | Dark value |
| --- | --- | --- |
| background | #F5F5F7 | #131316 (Phantom dark) |
| surface (card) | #FFFFFF | #1B1B1F |
| popover | #FFFFFF | #202024 |
| foreground | #1C1C1E | #F3F2F7 |
| muted-foreground | #67636F | #9C9AA7 |
| border | #E2E2E7 | #2A2A30 |
| **primary (violet)** | #6C4FE0 (AA on white) | #AB9FF2 (Phantom periwinkle) |
| primary-foreground | #FDFCFE | #131316 |
| ring | #6C4FE0 | #AB9FF2 |
| success | #0F8A5F | #5ED39A |
| steel (TEE marker) | #5F7D9C | #8FA3BF |
| destructive | #D6455C | #E05E6E |

Rule: violet is the sole accent, used with restraint — primary CTAs, focus rings, active-nav underline, small trust chips, and the italic headline accent (solid violet, no gradient). Everything else stays neutral monochrome. Green = semantic success/savings only. Steel = attested-TEE markers. Red = destructive/leak. No gradient text, no glow shadows, no sheen effects — the app should read like a serious wallet product, not a brand landing page. Wordmark is plain violet text.

## Typography (user-directed)

- **Headings:** Geist (`font-serif` token remapped to Geist var — display sans, tight tracking).
- **Body/UI:** Inter (first in the list; neutral, wallet-native).
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
