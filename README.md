# Obligor — Confidential Two-Party Clearing

> Two parties, one net margin, neither sees the other's book. MPC on Solana, attested TEE on
> Monad. TEE ≠ MPC, and we say so.

## What this frontend does

This is the Next.js UI for the Obligor demo: two-party clearing sessions, the siloed-vs-netted
margin comparison, the adversarial plaintext counterfactual, Monad parallel multi-pair clearing,
and the two-agent x402 payment replay.

- **Margin engine** (`lib/margin.ts`): per-party siloed IM, combined siloed, bucket-netted
  combined, savings. Pure functions, single source of truth for the formula shape.
- **Fixtures** (`lib/fixtures.ts`): labeled books — one Kamino leg marked `live` read-only, the
  rest `mock`. Mock equity `tAAPL` is adapter-ready for xStocks/Backed; analytics never custody.
- **Adversarial counterfactual** (`/adversarial`): explicit DANGEROUS plaintext view of both
  books with a 20s auto-return — pitch contrast only, never the default path.
- **Monad parallel panel** (`/monad`): three desk pairs clearing concurrently per epoch.
- **Agents** (`/agents`): replayed x402 call flow (402 → pay → 200) with independent keys.

## Honest status (frontend demo window)

| Piece | Status |
| --- | --- |
| Two-party netting formula | **Real** code, simplified bucket haircuts, runs in-browser |
| Position books | 1 leg labeled `live` (Kamino, read-only); rest labeled `mock` |
| Confidential backends (Arcium / TEE) | **Not wired here** — UI replays the flow; wire from the repo's API/packages |
| x402 payments | Recorded call flow replayed; wire scripts ship with the API |
| Liquidation / capital movement | Not built — numbers only |

Trust models: **Solana = cryptographic MPC; Monad = hardware-attested TEE. Both real
confidentiality, different trust models.** See `/trust` in the app for the full table.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # typecheck + lint via next build
npm run lint
```

Full product spec (backend matrix, API, Arcium/enclave plans): `docs/AGENT.md`.
Brand tokens, palette, typography rules: `brand.md` — jade accent, no yellow/gold/amber.
