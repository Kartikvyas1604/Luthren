# Brand — Luthren

_Status: active_

## Voice

Luthren is confidential two-party clearing for trading desks. Voice: precise, calm, honest. Short declarative sentences. Numbers do the persuading; no hype, no gradient hero copy. We name tradeoffs aloud ("TEE ≠ MPC"). Never overclaim.

## Palette — "Ink & Jade"

Dark-first. Surfaces deepen as they elevate. No yellow, gold, or amber anywhere (hard user rule). Single accent: jade.

| Token | Light value | Dark value |
| --- | --- | --- |
| background | #FAFAF8 (warm paper) | #0B0C0F (ink) |
| surface (card) | #FFFFFF | #14161B |
| popover | #FFFFFF | #1A1D23 |
| foreground | #1A1C20 | #ECEDEF |
| muted-foreground | #5A5E66 | #9BA1AB |
| border | #E4E4E0 | #262A31 |
| **primary (jade)** | #0E8A6B (AA on white) | #3ECF9E |
| primary-foreground | #FFFFFF | #0B0C0F |
| ring | #0E8A6B | #3ECF9E |
| destructive | #C44A3E | #E05E52 |
| warning | #B45309 | #E8A33D *(chip text only, AA-checked)* |
| success | #0E8A6B | #3ECF9E |
| constructive (both-lost) | — | #C0638A (plum) |

Rule: jade appears only where meaning exists — the savings delta, trust chips, primary CTA. Semantic red = "both books leak". Semantic warning-text used sparingly, never as a decorative accent, never as page chrome. On ink, muted text ≥ #9BA1AB to pass 4.5:1.

## Typography

- Headlines: **Fraunces** (serif, next/font/google) — gives the "clearing house ledger" authority. Weights 500-600, tight tracking.
- UI/body: **Geist Sans**.
- Numbers/addresses/code: **Geist Mono** with `tabular-nums` always for currency; 2 decimals everywhere for USD.

Rule: never let serif set UI copy — headlines and wordmark only.

## Gradients & texture

None as decoration. Depth via surface steps (#0B0C0F → #14161B → #1A1D23), 1px borders `#262A31`, and a single radial jade tint at very low opacity behind the hero only.

## Motion

CSS transitions, 100–250ms, ease-out. Jade flash on margin numbers when they resolve. Respect `prefers-reduced-motion` everywhere.
