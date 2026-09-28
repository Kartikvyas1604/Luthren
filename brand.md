# Brand — Luthren

_Status: active_

## Voice

Luthren is confidential two-party clearing for trading desks. Voice: precise, calm, honest. Short declarative sentences. Numbers do the persuading; no hype, no gradient hero copy. We name tradeoffs aloud ("TEE ≠ MPC"). Never overclaim.

## Palette — "Graphite & Azure"

Dark-first, professional fintech grade. Neutral graphite surfaces (no color tint), near-white text, one refined azure accent. Savings/success uses a separate semantic green. No yellow, gold, or amber anywhere (hard user rule).

| Token | Light value | Dark value |
| --- | --- | --- |
| background | #F7F8F9 (cool paper) | #0C0D10 (graphite) |
| surface (card) | #FFFFFF | #131519 |
| popover | #FFFFFF | #17191E |
| foreground | #17181B | #E7E9ED |
| muted-foreground | #565B64 | #9BA3AF |
| border | #E3E5E8 | #24272E |
| **primary (azure)** | #1D5FD1 (AA on white) | #5C93F5 |
| primary-foreground | #FFFFFF | #0C0D10 |
| ring | #1D5FD1 | #5C93F5 |
| destructive | #C44A3E | #E05E52 |
| success | #0E7A5A | #4CC38A |
| TEE/secondary marker | muted gray | slate-300/400 |

Rule: azure appears on CTAs, focus rings, trust chips, and the Monad progress states. Green (`success`) is semantic only — savings delta and "freed" numbers. Red = destructive/leak. Neutral slate marks the Monad TEE distinction. On ink, muted text ≥ #9BA3AF to pass 4.5:1.

## Typography

- Headlines: **Fraunces** (serif, next/font/google) — gives the "clearing house ledger" authority. Weights 500-600, tight tracking.
- UI/body: **Geist Sans**.
- Numbers/addresses/code: **Geist Mono** with `tabular-nums` always for currency; 2 decimals everywhere for USD.

Rule: never let serif set UI copy — headlines and wordmark only.

## Gradients & texture

None as decoration. Depth via surface steps (#0B0C0F → #14161B → #1A1D23), 1px borders `#262A31`, and a single radial jade tint at very low opacity behind the hero only.

## Motion

CSS transitions, 100–250ms, ease-out. Jade flash on margin numbers when they resolve. Respect `prefers-reduced-motion` everywhere.
