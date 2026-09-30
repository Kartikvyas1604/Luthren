<div align="center">

# <img src="public/logo.svg" alt="Obligor logo — two offset pill bars, a gold exposure bar netting into a steel counterparty bar" width="36" /> Obligor

**Confidential Two-Party Clearing**

*Two parties, one net margin, neither sees the other's book.*
Cryptographic MPC on Solana · attested TEE on Monad · x402 machine payments

<a href="#license"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-E5B84B" /></a>
<a href="#running-locally"><img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-0A0B0D" /></a>
<img alt="Status: demo" src="https://img.shields.io/badge/status-honest%20demo-9FB6C4" />

</div>

---

## What Obligor is

**Obligor** is confidential two-party clearing for trading desks. Two distinct wallets —
an agent desk and a counterparty — each submit their own set of DeFi positions into a
joint computation. The computation outputs a single number: the **combined net initial
margin**. Neither party ever sees the other side's full book, and neither does the
operator.

The name is borrowed from contract law: an *obligor* is the party bound by an obligation.
Here, both desks are bound to post margin — and Obligor's job is to make that obligation
as small as the math honestly allows, without asking either desk to surrender its book.

The logo says the same thing in one image: a gold exposure bar and a steel counterparty
bar, offset from each other, closing the gap — offsetting positions netting into one.

### The problem it solves

Siloed DeFi protocols demand full collateral even when positions economically offset
**across counterparties**. If Desk A is long SOL exposure via Kamino collateral and Desk B
is short SOL-PERP on Drift, both desks still post full initial margin, because no trusted
clearing house exists that both would feed their books into.

TradFi solves this with portfolio margining and CCP clearing under legal netting
agreements. A centralized DeFi "prime" that sees **both** books creates a catastrophic
privacy liability: whoever holds both books — or compromises the operator — can
reconstruct both strategies and trade against them.

That is the load-bearing insight of the product:

- **Single-wallet self-netting is not the product.** If one wallet holds all the data, it
  can run the formula client-side for free. A tool that only "protects a party from
  themselves" is privacy theater.
- **Mutually distrusting parties are the product.** Two desks who will only share
  encrypted (or enclave-sealed) inputs into a joint computation need a real confidential
  backend. That is what Obligor builds.

## How the netting formula works

The margin engine is deliberately legible. All values are USD. Every position leg carries
a **haircut** — a risk weight between 0 and 1 assigned per instrument class:

| Instrument class | Default haircut |
| --- | --- |
| Spot / lend collateral (SOL, USDC, MON) | 10% |
| Perpetual futures | 15% |
| Mock equity `tAAPL` | 25% |

### Step 1 — per-party siloed margin

Each party's initial margin, computed in isolation:

```
IM_siloed(P) = Σ haircut_i × |notional_i|
```

### Step 2 — combined siloed (no mutual recognition)

```
IM_siloed_combined = IM_siloed_A + IM_siloed_B
```

This is what both desks pay today, in aggregate, because no clearing house connects them.

### Step 3 — combined netted (the product)

1. Union all legs from both parties and bucket them by **underlying risk factor**
   (`SOL`, `BTC`, `AAPL`, `USD`, `MON`…). A SOL-PERP short and a Kamino SOL lend both
   land in the `SOL` bucket.
2. For each bucket, net the **signed exposure across both parties**:
   `E = Σ signedExposureUsd`
3. Bucket margin: `IM_b = max_haircut_in_bucket × |E|` — the most conservative haircut
   in the bucket wins.
4. Portfolio margin is the sum over buckets. **Savings** is the difference from the
   siloed combined figure, floored at zero.

### Worked example

Party A lends $45,000 of SOL (haircut 10%). Party B is short $95,000 of SOL-PERP
(haircut 15%).

- Siloed A: 10% × 45,000 = **$4,500**
- Siloed B: 15% × 95,000 = **$14,250**
- Siloed combined: **$18,750**
- Netted: the SOL bucket nets +45,000 − 95,000 = −50,000, haircut by the most
  conservative leg (15%) → 15% × 50,000 = **$7,500**
- **Capital freed: $11,250 — 60% less margin posted**, without either desk seeing the
  other's legs.

You can reproduce this exact case on the clearing page's live calculator: both a slider
and a typed dollar input drive each party's notional, and every number updates as you
drag.

This is intentionally a sketch, not a production risk engine. Real CCP margining needs
venue-specific initial margin, legal netting enforceability, oracle adversity, and a
default fund. The repo says so out loud rather than pretending otherwise.

## The four demo surfaces

### 1. Clearing session (`/clear`)

The main flow. Assign Party A and Party B, review each book, then compute the combined
net margin. Includes:

- **Live netting calculator** — slider + typed input per party, siloed vs netted vs
  capital-freed updating in real time.
- **Wallet connect** — Phantom and Solflare via the Solana wallet standard, no extension
  dependencies bundled. Connecting populates Party A's wallet address; position reads
  stay on labeled fixtures.
- **Fixture loading** — a judge fixture (one live read-only leg, rest mock) and an
  offsetting fixture that maximizes savings.
- A simulated confidential compute sequence with explicit `SIMULATED` labeling.

### 2. The adversarial counterfactual (`/adversarial`)

The dangerous twin. A gate screen requires explicit confirmation — *"I understand this
leaks both books"* — then shows **both books in plaintext** with an annotation of what a
centralized clearer could do with them: reconstruct both strategies, front-run either
desk. It exists purely to demonstrate why single-operator clearing fails. It is never
the confidential path, and it auto-returns you to the safe session.

### 3. Monad parallel clearing (`/monad`)

The expansion proof. Monad throughput lets a clearing desk net many desk pairs
**concurrently per epoch** — not one pair at a time. The page runs three desk pairs
through one epoch under the `TEE attested` badge. Same formula as Solana, different
trust model.

### 4. Agent payments (`/agents`)

Two independent terminals replay the x402 V2 payment flow: each agent holds its own
disposable key, hits the gated API, receives `402 PAYMENT-REQUIRED`, pays $0.01 in
devnet USDC, and gets `200` with aggregate-only output — no legs in the response. This
is what machine-payable clearing looks like: no API accounts, no operator custody.

## Trust models — and the honesty rule

Obligor ships a **pluggable confidential backend**. The formula is identical everywhere;
what changes per chain is the trust transport:

| Chain | Backend | Trust model |
| --- | --- | --- |
| Solana (primary) | Arcium MXE | **Cryptographic MPC** — no single TEE operator, inputs encrypted end to end |
| Monad (expansion) | AWS Nitro / Marlin Oyster | **Hardware-attested TEE** — inputs sealed to an enclave, attestation shown |

And the rule the project will not break: **TEE ≠ MPC.** Both deliver real
confidentiality with different trust models. Every surface in this UI labels which one
you're looking at, and the simulated fallback is labeled `SIMULATED` in the same
typographic weight as the real thing. A backend that hides its trust model is the one
feature Obligor will never ship.

## Real vs. mocked — the honest table

| Piece | Status |
| --- | --- |
| Two-party netting formula | **Real** — pure TypeScript, single source of truth, runs on every path |
| Position books (Solana demo) | **Partial** — one Kamino lend leg marked live read-only; rest labeled mock |
| Mock equity `tAAPL` | **Mock** — fixture price; adapter-ready for xStocks/Backed; never custody |
| Arcium MPC path | **Simulated in UI** — same formula, no MPC; wire backend ships separately |
| TEE attestation (Monad) | **Simulated in UI** — badge shown for the fixture demo; enclave ships separately |
| Parallel multi-pair | **Real** — three pair cards clear concurrently per epoch |
| x402 payment flow | **Partial** — recorded call flow replayed; agent scripts ship with the API |
| Liquidation / capital movement | **Not built** — numbers only, no venue withdrawals |

## Design system

The visual identity is documented in `brand.md`: the **Bullion** palette — deep ink,
warm off-white, a single champagne-gold accent, steel reserved for attested-TEE markers —
with Fraunces serif for headlines and wordmark, Geist Sans for UI, and Geist Mono with
`tabular-nums` for every number. Gold marks the money and the CTAs; steel marks trust
attestation; red marks destructive and leak paths. No purple gradients, no glassmorphism,
no second warm accent.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000/clear](http://localhost:3000/clear). No API keys, no
environment variables, no wallet required to explore — every fixture is labeled and
every computation runs locally in your browser.

```bash
npm run build   # production build
npm run lint    # eslint
```

## Scope and non-goals

Obligor is **analytics and clearing compute**. It is never custody, never a securities
exchange, never a new perp or lending venue, and never a dark pool. The per-call fee is
a demo wedge, not the moat — the durable value is the mutually-distrusting two-party
confidentiality property. The repo will not invent traction, TAM, or agent counts.

What production would still need: legal netting enforceability, venue-specific initial
margin, oracle adversity assumptions, a default fund, and hardened attestation
verification.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for the setup, the
code conventions, and the two architectural rules the project will not bend on.

## License

[MIT](LICENSE) — © 2026 Kartik Vyas. Use it, fork it, ship it.
