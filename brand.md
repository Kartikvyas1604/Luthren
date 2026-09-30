# Brand — Luthren

_Status: active_

## Voice

Luthren is confidential two-party clearing for trading desks. Voice: precise, calm, honest. Short declarative sentences. Numbers do the persuading; no hype, no gradient hero copy. We name tradeoffs aloud ("TEE ≠ MPC"). Never overclaim.

## Palette — "Verdant Slate" (Coolors user palette)

User-specified palette: `#006400 · #008000 · #70E000 · #EDF2F4 · #9BACB6 · #394A4D`.
Dark-first. Deep slate-teal surfaces derived from #394A4D, near-white #EDF2F4 text, single bright green #70E000 accent. No yellow, gold, or amber anywhere (hard user rule).

| Token | Light value | Dark value |
| --- | --- | --- |
| background | #EDF2F4 (palette off-white) | #0F1618 (darkened #394A4D) |
| surface (card) | #FFFFFF | #172023 |
| popover | #FFFFFF | #1C2629 |
| foreground | #394A4D | #EDF2F4 |
| muted-foreground | #4E5F63 (AA-darkened #9BACB6) | #9BACB6 |
| border | #D4DDE0 | #2A3539 |
| **primary (green)** | #006400 (AA on white) | #70E000 |
| primary-foreground | #EDF2F4 | #0F1618 |
| ring | #006400 | #70E000 |
| destructive | #C44A3E | #E05E52 |
| success | #008000 | #70E000 |
| TEE/secondary marker | muted gray | #9BACB6 (slate) |

Rule: bright green #70E000 is the accent — CTAs, focus rings, trust chips, savings numbers. #9BACB6 slate marks the Monad TEE distinction. Red = destructive/leak. Muted text never lighter than #9BACB6 on dark.

## Typography

- Headlines: **Fraunces** (serif, next/font/google) — gives the "clearing house ledger" authority. Weights 500-600, tight tracking.
- UI/body: **Geist Sans**.
- Numbers/addresses/code: **Geist Mono** with `tabular-nums` always for currency; 2 decimals everywhere for USD.

Rule: never let serif set UI copy — headlines and wordmark only.

## Gradients & texture

None as decoration. Depth via surface steps (#0B0C0F → #14161B → #1A1D23), 1px borders `#262A31`, and a single radial jade tint at very low opacity behind the hero only.

## Motion

CSS transitions, 100–250ms, ease-out. Jade flash on margin numbers when they resolve. Respect `prefers-reduced-motion` everywhere.
