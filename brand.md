# Brand — Obligor

_Status: active_

## Voice

Obligor is confidential two-party clearing for trading desks. Voice: precise, calm, honest. Short declarative sentences. Numbers do the persuading; no hype, no gradient hero copy. We name tradeoffs aloud ("TEE ≠ MPC"). Never overclaim.

## Palette — "Bullion" (gold on ink)

Design-owner's choice. Institutional wealth aesthetic: deep neutral ink, warm off-white text, single champagne-gold accent, silver-steel reserved for the TEE distinction. Light mode = warm paper.

| Token | Light value | Dark value |
| --- | --- | --- |
| background | #F6F4EF (warm paper) | #0A0B0D (ink) |
| surface (card) | #FFFFFF | #131417 |
| popover | #FFFFFF | #17181C |
| foreground | #211D16 | #F2EFE8 (warm white) |
| muted-foreground | #5D5648 | #A8A296 (warm gray) |
| border | #E3DDD0 | #26262B |
| **primary (gold)** | #8A6A1F (AA on white) | #E5B84B |
| primary-foreground | #FDFCF8 | #0A0B0D |
| ring | #8A6A1F | #E5B84B |
| success | #7A6420 | #E5B84B |
| steel (TEE marker) | #5C6F7A | #9FB6C4 |
| destructive | #B54236 | #E05E52 |

Rule: gold is the accent — CTAs (with hover sheen sweep), focus rings, savings numbers, the gold-text gradient wordmark and headline accent (italic serif). Steel = attested-TEE markers only. Red = destructive/leak. Never use a second warm accent.

## Typography

- Headlines: **Fraunces** (serif, next/font/google) — gives the "clearing house ledger" authority. Weights 500-600, tight tracking.
- UI/body: **Geist Sans**.
- Numbers/addresses/code: **Geist Mono** with `tabular-nums` always for currency; 2 decimals everywhere for USD.

Rule: never let serif set UI copy — headlines and wordmark only.

## Gradients & texture

None as decoration. Depth via surface steps (#0B0C0F → #14161B → #1A1D23), 1px borders `#262A31`, and a single radial jade tint at very low opacity behind the hero only.

## Motion

CSS transitions, 100–250ms, ease-out. Jade flash on margin numbers when they resolve. Respect `prefers-reduced-motion` everywhere.
