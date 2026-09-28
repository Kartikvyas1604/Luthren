# Foldclear — AGENT.md

> **Read this first — TWO CRITICAL PIVOTS (supersede all prior designs).**
>
> ### Pivot 1 — Two-party, not single-wallet (still load-bearing)
>
> An external review correctly identified that netting a *single user's own* positions across protocols does **NOT** need confidential compute: that user already holds all the data and can run the formula client-side. A product that only “protects a party from themselves” is privacy theater.
>
> **Foldclear is two-party / cross-counterparty netting.** Two distinct wallets or desks (agent desk vs counterparty) each submit their own position set into a confidential computation. The computation outputs a **combined net margin**. Neither party, and not the Foldclear operator, ever sees the other side’s full book in confidential mode.
>
> If you catch yourself building single-wallet self-netting, **stop and re-read this preamble.** That design is dead. Do not resurrect it under a new name.
>
> ### Pivot 2 — Pluggable confidential backends (NEW from review; dominates this rewrite)
>
> Prior AGENT.md treated netting as **Arcium-only** and Monad as a thin stretch port. That is wrong.
>
> **Foldclear = the two-party netting formula + a pluggable `ConfidentialBackend`.** Per chain, ship the **strongest honest backend** and label the trust model aloud:
>
> | Chain | Backend | Trust model | Role |
> | --- | --- | --- | --- |
> | **Solana** | **Arcium MXE** (real cryptographic MPC) | Cryptographic MPC — no single TEE operator | **Primary Colosseum** build |
> | **Monad / EVM** | **TEE** — AWS Nitro Enclaves **or** Marlin Oyster (SGX/Nitro) | Hardware-attested enclave; same `twoPartyNetted` code | **Expansion proof** for Metropolis — not a costume port |
> | **Ethereum (later)** | Same TEE + Aave/Morpho adapters | Pitch slide / post-hackathon | **Do not build this window** |
> | **Robinhood-style venues** | Do **not** build | Reframe `tAAPL` as **adapter-ready** for xStocks/Backed (Solana RO) and Robinhood-style venues; analytics never custody | Pitch language only |
>
> **What stays identical across backends:** `packages/margin` (formula), API shape, adversarial counterfactual screen, x402 flow, amber UI. **What changes per chain:** confidential backend implementation, position readers, and x402 network string.
>
> **Monad-native differentiator (not a costume port):** **parallel multi-pair clearing** — net **N desk pairs concurrently per epoch** (≥3 pairs on screen), using Monad parallelism/throughput. Judges must see concurrent pairs, not a solitary Solana clone.
>
> **Honest ceiling:** Medium–High confidentiality on Monad is **not** reachable in 2 weeks without Arcium-class crypto MPC. TEE delivers **solid Medium real confidentiality** (hardware-attested). Do **not** pretend TEE = MPC. README must state: **Solana = cryptographic MPC; Monad = hardware-attested TEE; both real confidentiality, different trust models.** Loose precedent that TEE-confidential compute exists in crypto (cite BlackBox / Crypto Dropcopy style projects loosely — do not claim they are Foldclear predecessors).
>
> **Colosseum remains primary** (bigger prize, judge fit). Win Colosseum; TEE-Monad = expansion proof. **Hard rule:** if Solana wobbles by day 9, **kill Monad without ceremony.**
>
> **Verify before commit (Monad x402):** Confirm Monad testnet USDC + x402 facilitator support at build time (`GET` facilitator `/supported`, Circle faucet USDC, network CAIP-2). Current public docs indicate support exists (facilitator `https://x402-facilitator.molandak.org`, testnet CAIP-2 `eip155:10143`, USDC `0x534b2f3A21130d7a60830c2Df862319e593943A3`) — **re-verify live before wiring**. If missing or broken at build time, x402 stays **Solana-only** on the Monad demo and document that honestly in README + Demo Law.
>
> Scope discipline: ~2 weeks. Colosseum Crypto World's Fair **Oct 12, 2026**; Monad Metropolis **Oct 13, 2026**. Prefer cutting scope aloud. Do not invent traction, TAM, securities compliance, or fake agent counts. You are not building a DEX, a lender, a dark pool, custom MPC/ZK, KYC/RWA custody, or a Robinhood clone.

---

## 1. One-Liner

**Foldclear** is confidential two-party clearing that nets distinct desks’ DeFi positions against each other via a **pluggable confidential backend** — **Arcium MPC on Solana** (primary), **attested TEE on Monad** (parallel multi-pair expansion) — so neither sees the other’s book; agents pay per call via x402.

---

## 2. Problem & Target User

### Problem

Siloed DeFi protocols demand full collateral even when positions economically offset **across counterparties**. Two desks that mutually offset (e.g. Desk A long SOL exposure via Kamino collateral; Desk B short SOL-PERP on Drift) still each post full initial margin because no trusted clearing house exists that both will feed their books into.

TradFi solves mutual offset with portfolio margining / CCP clearing under legal netting agreements. A centralized DeFi “prime” that sees **both** books creates a catastrophic privacy and front-running liability: the operator (or anyone who compromises the operator) can reconstruct strategies and trade against them.

Client-side self-netting of one wallet’s own legs does not need confidential compute and is not this product. The load-bearing case is **mutually distrusting parties** who will only share encrypted (or enclave-sealed) inputs into a joint computation.

On Monad specifically, desks do not clear one pair at a time in isolation — a clearing desk nets **many pairs per epoch**. Parallel multi-pair clearing is the native fit for Monad throughput; a solitary pair demo is a costume port.

### Target users (MVP)

1. **Primary — Agent desk (Party A):** an autonomous or semi-autonomous trading agent that holds a multi-venue book and wants a machine-payable **two-party** net-margin quote against a named counterparty without revealing its legs.
2. **Primary — Counterparty desk (Party B):** a second independent wallet/agent that likewise seals/encrypts its own book; receives only the combined net (or jointly observes the same scalar).
3. **Secondary — Demo operator / judge:** a human who runs the adversarial counterfactual screen to feel why plaintext joint clearing is dangerous, then watches the confidential path; on Monad, sees **≥3 pairs** clearing concurrently.
4. **Monad track judge:** evaluates parallel multi-pair + attested TEE honesty, not “we also deployed on Monad.”

### Explicit non-users (this hackathon)

- Anyone who only wants single-wallet portfolio dashboards (use a free client-side calculator).
- Institutions needing SEC-compliant securities clearing or real RWA custody.
- Users seeking order matching, dark-pool execution, or a new lending/perp venue.
- Anyone expecting TEE and MPC to be the same trust model.

---

## 3. Hackathon & Bounty Fit — Backend Matrix

Max three load-bearing partners. Do not spray sponsor logos. **Replace “two build targets” thinking with this backend matrix.**

### Backend matrix (dominates architecture)

| Surface | Confidential backend | Readers | x402 network | Differentiator | Deadline |
| --- | --- | --- | --- | --- | --- |
| **Solana — Colosseum (PRIMARY)** | `ArciumBackend` — Arcis MXE, cryptographic MPC | Drift + Kamino + mock `tAAPL` | Solana devnet CAIP-2 `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` | Two-party MPC + adversarial counterfactual | **Oct 12, 2026** |
| **Monad — Metropolis Track 01 (EXPANSION)** | `EnclaveBackend` — AWS Nitro Enclaves **or** Marlin Oyster; hardware attestation | One Monad venue **or** fixtures (honest labels) | Monad testnet `eip155:10143` **if** facilitator `/supported` confirms; else Solana-only x402 + honest README | **Parallel multi-pair ≥3** concurrent nets per epoch | **Oct 13, 2026** (only if Solana green by day 9) |
| **Ethereum (later)** | Same TEE + Aave/Morpho adapters | Pitch only | — | Post-hackathon slide | **Do not build** |
| **Robinhood / equity venues** | No backend this window | `tAAPL` stays mock; **adapter-ready** naming for xStocks/Backed (Solana RO) and Robinhood-style venues | — | Analytics never custody | **Do not build** |

### Partner table

| Priority | Partner / track | Why it fits | Deadline |
| --- | --- | --- | --- |
| **Primary** | **Colosseum Crypto World's Fair — Solana Ecosystem** ($100k, 10×$10k) + general awards; accelerator path. [colosseum.com/worldsfair](https://colosseum.com/worldsfair). Sep 14–Oct 12, 2026. | Native Solana: Anchor/Arcium MXE + Drift/Kamino two-wallet readers + Privy + x402. Two-party cryptographic MPC is on-theme. | **Oct 12, 2026** |
| **Load-bearing tech (Solana)** | **Arcium** | Privacy is the product **because** two parties’ books meet under MPC. [docs.arcium.com](https://docs.arcium.com/developers); Arcis `Enc<Shared, T>`: [Arcis](https://docs.arcium.com/developers/arcis). | Demoable by ~2/3 window or labeled simulation |
| **Expansion** | **Monad Metropolis — Track 01 Onchain Finance & Trading** ($30k / 3). [monad.xyz/developers/hackathons/metropolis](https://www.monad.xyz/developers/hackathons/metropolis). Sep 1–Oct 13, 2026. | TEE enclave + **parallel multi-pair** — not a thin port. | **Oct 13, 2026** (kill if Solana wobbles day 9) |
| **TEE infra** | AWS Nitro Enclaves **or** Marlin Oyster | 3–4 day integrable hello-world → attested `twoPartyNetted`. Prefer whichever has faster attested hello-world this week. | Days 1–2 spike in parallel with Arcium |

**Wallet auth:** Privy for Solana connect / embedded wallets ([Privy Solana recipe](https://docs.privy.io/recipes/solana/getting-started-with-privy-and-solana)). Monad UI may reuse Privy EVM connectors or a thin walletconnect path — do not block Colosseum on Monad wallet polish.

---

## 4. Market Validation Summary

**Honest wedge (no invented TAM):**

- Cross-counterparty margin fragmentation is a real TradFi product category (CCP / prime brokerage). DeFi has no equivalent that mutually distrusting desks will use without leaking books.
- Single-party self-netting is **not** the wedge — it needs no confidential compute and will eventually be free client-side software. Pitching that as Foldclear is a category error.
- The durable moat is the **mutually-distrusting two-party case**: both sides seal inputs; only combined net margin leaves the confidential path.
- **Pluggable backends are the distribution strategy:** strongest honest confidentiality per chain (MPC where available; TEE where MPC isn’t). Different trust models, same formula, same API.
- Agent commerce via **x402** makes per-call clearing quotes machine-payable without API-key accounts ([Solana x402](https://solana.com/docs/payments/agentic-payments/x402), [Monad x402 guide](https://docs.monad.xyz/guides/x402), [docs.x402.org](https://docs.x402.org)).
- **Business-model honesty:** a `$0.01`/call fee is a **wedge / demo monetization**, not venture-scale revenue. Do not multiply by invented agent counts. Durable value is the two-party confidentiality property; client-side single-party netting could eventually be free.
- **Equity / Robinhood honesty:** mock `tAAPL` demonstrates cross-asset texture and **adapter readiness** for tokenized-equity rails (xStocks/Backed on Solana RO; Robinhood-style venues later). Foldclear is **analytics / clearing compute**, never custody, never a securities exchange.
- **Unknown / do not fabricate:** addressable market size, multi-desk pair counts, LOIs, waitlists. Pitch the demo and the sink-question answers (“why MPC?” / “why TEE on Monad?”), not fake TAM slides.

---

## 5. MVP vs Stretch User Stories

### MVP — Colosseum / Solana (must ship by Oct 12)

1. As the system, I read positions for **two wallets** — Party A and Party B — with ≥1 adapter hitting a **real labeled mainnet read-only** account (not all fixtures). Preferred: Kamino lend for one wallet, Drift perps for the other.
2. As a demo operator, I can attach a **mock equity** leg `tAAPL` (SPL + mocked price; adapter-ready naming) to either party’s book without real RWA custody.
3. As a judge, I see **per-party siloed IM** for A and for B, plus **combined siloed** and **combined netted IM** under bucket haircuts — the hero visual.
4. As the system, **two-party Arcium** netting runs via `ArciumBackend`: both parties’ encrypted legs enter the MXE; only combined net margin (+ aggregates that do not reconstruct the other book) exits. If Arcium is blocked by ~2/3 window, a **clearly labeled** simulated path still runs the same formula (`SimulatedBackend` with banner).
5. As agents, **two independent x402-paying agents** each call the gated API on Solana **devnet USDC** via x402 V2.
6. As a judge, I experience the **adversarial counterfactual** (~20s): plaintext view of **both** books with a “operator could front-run” annotation **before** the confidential result — labeled **DANGEROUS / plaintext operator view**.
7. As a judge, I complete **Demo Law — Colosseum** in ≤4 minutes (one-liner: **two-party MPC**).
8. As a contributor, the repo is OSS with real-vs-mocked table, TEE≠MPC honesty paragraph, and business-model honesty.

### MVP — Monad expansion (only if Solana green by day 9; ship by Oct 13)

9. As the system, `EnclaveBackend` runs the **same** `twoPartyNetted` formula inside an attested Nitro/Oyster enclave; attestation evidence is shown (or linked) in UI/README.
10. As a Monad judge, I see **N≥3 desk pairs netting concurrently** in one epoch/screen (parallel multi-pair clearing) — not a single-pair costume port.
11. As agents, x402 works on Monad testnet USDC **if** facilitator support verifies; otherwise Solana-only x402 remains and Monad demo documents that honestly.
12. As a judge, I complete **Demo Law — Monad** in ≤4 minutes (one-liner: **parallel clearing** under attested TEE).

### Stretch (only after respective MVPs)

13. Confidential venue haircut / risk-weight table **inside** the circuit/enclave — **ONLY after** two-party netting works.
14. Optional options-leg reader — skip unless SDK path is trivial.
15. Ethereum TEE + Aave/Morpho adapters — **pitch slide only**.
16. Spend-cap / policy wrappers for production agent keys beyond disposable demo keys.
17. Real xStocks/Backed RO adapter replacing mock `tAAPL` price — only if free and labeled.

### Explicitly NOT building

- Real securities exchange or RWA custody; Robinhood product.
- Custom MPC or ZK (use Arcium on Solana; TEE on Monad).
- New perp or lending venue; dark pool / order matching.
- Fake traction numbers; fake TAM.
- Privacy that only protects a party from themselves.
- **Pretending TEE = MPC** (README non-goal / honesty rule).
- Dual-building Monad at the expense of Colosseum.

---

## 6. Non-Functionals

| Concern | Requirement |
| --- | --- |
| **Latency** | Solana confidential two-party call ≤30s including Arcium wait; simulated ≤2s; enclave call ≤5s typical. Adversarial counterfactual ~20s paced. Monad parallel batch of ≥3 pairs completes in one visible epoch/refresh. UI stays responsive with progress. |
| **Privacy (load-bearing)** | In confidential mode: neither party’s per-leg plaintext is returned to the other party or logged by the operator outside the backend trust boundary. Only combined net-margin scalar (+ optional aggregates that do not reconstruct the other book) leaves the confidential path. `ArciumBackend` = cryptographic MPC. `EnclaveBackend` = hardware-attested TEE (inputs sealed to enclave; attestation shown). Simulated banners `SIMULATED — not MPC / not attested`. Adversarial UI mode is a **separate explicit demo mode** that intentionally shows plaintext for pitch contrast only. |
| **Honesty** | README + pitch state real vs mocked **and** trust models: Solana = cryptographic MPC; Monad = hardware-attested TEE; both real confidentiality, different trust models. No SEC/RWA claims. Business-model honesty required. No TEE=MPC theater. |
| **Security** | No mainnet funds for demo payments. Devnet/testnet USDC for x402. Privy secrets server-side. No committing private keys. Mainnet/testnet position reads are **read-only** and labeled. Enclave attestation verified or clearly labeled unverified-dev. |
| **Reliability** | If one party’s venue RPC fails, that party’s legs degrade with warnings; combined net still runs on available legs with explicit warning. If Arcium fails, fall back to simulated with banner (Solana). If enclave fails, fail closed with error — do not silently plaintext-net on Monad confidential path. |
| **OSS** | Public GitHub, MIT or Apache-2.0, reproducible `pnpm` + `arcium` (+ enclave) build. |
| **Stack constraint** | Rust/Anchor + Arcis on Solana; **enclave code in Rust** (constraint holds); TypeScript/Next.js/React for frontend + API. No new languages beyond that. |

---

## 7. Architecture & Stack

### High-level flow (pluggable backend)

```
Party A wallet/agent          Party B wallet/agent
        │                              │
        │  seal/encrypt own legs       │  seal/encrypt own legs
        ▼                              ▼
   Position readers (TS) —— two wallets —— Position readers (TS)
        │  Solana: Drift / Kamino / mock tAAPL
        │  Monad: one venue or fixtures
        ▼                                  ▼
   BookA (never shown to B)          BookB (never shown to A)
        │                                  │
        └────────────┬─────────────────────┘
                     ▼
         ConfidentialBackend.netTwoParty(bookA, bookB)
              │
    ┌─────────┼──────────────────────────────┐
    ▼         ▼                              ▼
ArciumBackend  EnclaveBackend           SimulatedBackend
(Solana MXE)   (Nitro / Oyster TEE)     (labeled fallback)
    │         │                              │
    └─────────┴──────────────┬───────────────┘
                             ▼
                  Combined NetMarginResult
               (same schema every backend)
         (siloed_A, siloed_B, siloed_sum,
          netted_combined, savings,
          backend: "arcium"|"enclave"|"simulated",
          attestation?: ...)
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
   Next.js UI           x402 API            Adversarial demo
   (Privy; amber)    (two agents;          (plaintext BOTH books,
                      network string         labeled DANGEROUS)
                      per chain)
                             │
                    Monad-only path:
              ParallelMultiPairOrchestrator
              nets ≥3 pairs concurrently / epoch
```

### `ConfidentialBackend` interface (required)

```ts
// packages/confidential/src/types.ts
export type BackendKind = "arcium" | "enclave" | "simulated";

export interface NetMarginResult {
  siloedAUsd: number;
  siloedBUsd: number;
  siloedCombinedUsd: number;
  nettedCombinedUsd: number;
  savingsUsd: number;
  grossNotionalUsd: number;
  netExposureUsd: number;
  backend: BackendKind;
  trustModel: "cryptographic_mpc" | "hardware_attested_tee" | "simulated_plaintext_compute";
  computationId?: string;
  attestation?: {
    quote?: string;          // Nitro/Oyster attestation blob or hash
    verified: boolean;       // true only if verification ran
    provider: "nitro" | "oyster" | "none";
  };
  // NEVER include other party's legs here in confidential mode
}

export interface ConfidentialBackend {
  readonly kind: BackendKind;
  readonly trustModel: NetMarginResult["trustModel"];
  /** Run the SAME twoPartyNetted / siloed formula; only transport+trust differs. */
  netTwoParty(bookA: PositionBook, bookB: PositionBook): Promise<NetMarginResult>;
}
```

**Implementations (all in `packages/confidential/`):**

1. **`ArciumBackend`** — encrypt both padded leg arrays → queue Arcis `two_party_portfolio_net` → await → decrypt outputs only. Primary Colosseum path.
2. **`EnclaveBackend`** — seal both books into Nitro/Oyster enclave; enclave runs **identical** Rust (or FFI-called) `two_party_netted` mirroring `packages/margin`; returns result + attestation quote. Primary Monad path.
3. **`SimulatedBackend`** — runs `packages/margin` in-process; banners `SIMULATED`; Solana fallback only when Arcium blocked. Never the silent default on Monad confidential demo.

**Invariant:** `packages/margin` is the single source of formula truth. Arcis circuit and enclave Rust **mirror** it in fixed-point; golden fixtures must match across TS / Arcis / enclave.

### Stack (pinned intent)

| Layer | Choice | Docs / notes |
| --- | --- | --- |
| Solana chain | **devnet** for payments + MXE; **mainnet read-only** for ≥1 labeled live wallet | Prefer RO mainnet for realism of one book |
| Solana MXE | **Arcium** via `arcium` CLI + Arcis encrypted ix | [docs.arcium.com/developers](https://docs.arcium.com/developers) |
| TS Arcium client | `@arcium-hq/client`, `@arcium-hq/reader` | [ts.arcium.com](https://ts.arcium.com/) |
| Monad chain | Monad **testnet** for demo UI + optional x402 | Parallel multi-pair is the differentiator |
| TEE | AWS Nitro Enclaves **or** Marlin Oyster | [Marlin Oyster](https://www.marlin.org/oyster); Nitro attestation docs. Pick one in days 1–2 spike. **Enclave code: Rust.** |
| Confidential pkg | `packages/confidential` — interface + arcium + enclave + simulated | Same output schema |
| Margin formula | `packages/margin` — pure TS; mirrored in Arcis + enclave Rust | Shared golden fixtures |
| Solana perps | **Drift** `@drift-labs/sdk` | |
| Solana lending | **Kamino Lend** `@kamino-finance/klend-sdk` | [Kamino Build](https://kamino.com/docs/build) |
| Monad readers | One venue adapter **or** labeled fixtures | Honesty > empty RPC heroics |
| Payments | **x402 V2** `@x402/core`, `@x402/express`, `@x402/svm`, `@x402/evm`, `@x402/fetch` | Solana: [guide](https://solana.com/docs/payments/agentic-payments/x402). Monad: [docs.monad.xyz/guides/x402](https://docs.monad.xyz/guides/x402) — verify `/supported` before wiring |
| Wallet | Privy React + Solana (+ optional EVM) | Agents: disposable signing keys with spend limits |
| Frontend | Next.js App Router + React + TypeScript | Near-black, one amber accent; chain toggle Solana / Monad |
| API | Express sidecar **or** Next Route Handlers behind x402 middleware | Prefer Express if `@x402/express` is the happy path |

### Repo layout

```
foldclear/
  AGENT.md                 # this file
  README.md                # honest real-vs-mocked + TEE≠MPC + business-model honesty
  apps/
    web/                   # Next.js UI (two-party + adversarial + Monad multi-pair)
    api/                   # x402-gated API + two-party orchestrator + backend selector
  packages/
    positions/             # Drift + Kamino + mock equity (+ Monad fixture/venue)
    margin/                # per-party siloed + combined two-party netting (SINGLE formula source)
    confidential/          # ConfidentialBackend + arcium + enclave + simulated
    config/                # env schema, haircuts, demo wallets, chain network strings
  programs/
    foldclear-mxe/         # arcium init: Arcis two_party_portfolio_net + Anchor
  enclave/
    foldclear-enclave/     # Rust Nitro/Oyster enclave: same two_party_netted + attestation
  scripts/
    seed-mock-equity.ts
    demo-agent-a.ts        # x402 client — Party A (Solana)
    demo-agent-b.ts        # x402 client — Party B (independent key)
    demo-agent-monad.ts    # optional Monad x402 agent if facilitator verified
    verify-x402-networks.ts # hits Solana + Monad facilitator /supported; fails loud
  .env.example
```

**Assumption (stated, not invented):** Arcium Arcis accepts multiple encrypted inputs in one instruction (documented pattern: `add_private(a: Enc<Shared, u64>, b: Enc<Shared, u64>)`). Foldclear pads each party’s legs to fixed `N` (e.g. 8) and passes `Enc` arrays for A and B. If current docs require a different ownership / Shared pattern for multi-submitter flows, follow Hello World + Input/Output docs exactly and document the adaptation in README — do not invent fake Arcis APIs.

**TEE assumption:** Nitro or Oyster can accept two sealed inputs, run pure netting, and return attestation + scalar outputs within 3–4 days of integration for a hello-world-shaped workload. Prefer the provider whose attested hello-world works first in the days 1–2 spike.

---

## 8. Data Model

### Normalized leg (`PositionLeg`)

```ts
type Venue = "drift" | "kamino" | "mock_equity" | "monad_fixture" | "monad_venue";
type Side = "long" | "short" | "lend" | "borrow" | "flat";
type PartyId = "A" | "B";
type ChainId = "solana" | "monad";

interface PositionLeg {
  party: PartyId;
  venue: Venue;
  instrument: string;       // e.g. "SOL-PERP", "SOL", "tAAPL"
  side: Side;
  qty: number;
  notionalUsd: number;      // abs mark * qty
  signedExposureUsd: number; // + long/lend asset, − short/borrow (document in code)
  haircut: number;          // 0–1 risk weight for siloed IM
  markUsd: number;
  asOfSlot?: number;
  source: "live" | "mock";
}
```

### Per-party book

```ts
interface PositionBook {
  party: PartyId;
  wallet: string;
  chain: ChainId;
  legs: PositionLeg[];
  fetchedAt: string; // ISO
  warnings: string[];
}
```

### Two-party session

```ts
interface TwoPartySession {
  sessionId: string;
  partyA: PositionBook; // server may hold only sealed/encrypted form in confidential path
  partyB: PositionBook;
  backend: BackendKind;
  mode: "confidential" | "adversarial_plaintext";
}
```

### Desk pair (Monad parallel)

```ts
interface DeskPair {
  pairId: string;
  label: string;           // e.g. "Desk A↔B SOL", "Desk C↔D ETH", "Desk E↔F tAAPL"
  partyA: PositionBook;
  partyB: PositionBook;
}

interface ParallelEpochResult {
  epochId: string;
  pairs: Array<{ pairId: string; margin: NetMarginResult }>;
  concurrency: number;     // must be ≥3 for Monad MVP
  backend: "enclave" | "simulated";
}
```

### Margin result (two-party) — same schema every backend

See `NetMarginResult` in §7. UI must show: siloed A, siloed B, siloed combined, netted combined, savings, **backend badge**, **trust-model label**.

### MVP two-party netting formula (document in UI + README)

All values USD. Haircuts `h_i` are protocol-agnostic demo weights (configurable):

| Instrument class | Default haircut `h` |
| --- | --- |
| Spot / lend collateral (SOL, USDC, MON) | 0.10 |
| Perp | 0.15 |
| Mock equity `tAAPL` | 0.25 |

**Per-party siloed initial margin**

\[
IM^{siloed}_{P} = \sum_{i \in P} h_i \cdot |N_i|
\]

**Combined siloed** (no mutual recognition)

\[
IM^{siloed}_{combined} = IM^{siloed}_{A} + IM^{siloed}_{B}
\]

**Combined netted (MVP sketch — not production risk engine)**

1. Union all legs from A and B. Bucket by **underlying risk factor** (e.g. `SOL`, `AAPL`, `USD`, `MON`). Map `SOL-PERP` and Kamino SOL lend/borrow → `SOL`; `tAAPL` → `AAPL`.
2. For each bucket \(b\), net signed exposure across **both** parties: \(E_b = \sum_{i \in b} signedExposureUsd_i\).
3. Bucket IM: \(IM_b = h_b^{eff} \cdot |E_b|\) where \(h_b^{eff}\) = **max** haircut among legs in that bucket (conservative).
4. Portfolio IM: \(IM^{net}_{combined} = \sum_b IM_b\).
5. **Savings** = \(IM^{siloed}_{combined} - IM^{net}_{combined}\) (floor at 0).

**UI must show:** siloed A, siloed B, siloed combined, netted combined, savings.

This is intentionally legible for judges: offsetting A long + B short in the same bucket collapses notionals before haircut. It is **not** SPAN/SIMM/CCP waterfall. Production still needs venue-specific IM, legal netting enforceability, oracle adversity, default fund — say so in the writeup.

### Fake vs real boundary

| Piece | Status |
| --- | --- |
| ≥1 Solana wallet position read | **Real** labeled mainnet read-only account required |
| Other wallet / missing venues | Fixture legs allowed if labeled `mock` |
| Drift / Kamino adapters | **Real** SDK code paths |
| Equity `tAAPL` | **Mock** SPL + mocked price; adapter-ready for xStocks/Backed / Robinhood-style — **not** Apple stock, **not** custodied RWA |
| Two-party netting formula | **Real code**, simplified economics; identical across backends |
| Arcium MPC (Solana) | **Real** when MXE works; else **simulated** with banner |
| TEE enclave (Monad) | **Real** attested Nitro/Oyster when spike succeeds; never claim = MPC |
| Parallel multi-pair (Monad) | **Real** ≥3 concurrent pairs on screen |
| x402 Solana | **Real** V2 on **devnet USDC**; two independent agent scripts |
| x402 Monad | **Real** only if facilitator `/supported` + testnet USDC verify; else Solana-only + honest docs |
| Adversarial counterfactual | **Demo-only** plaintext mode; never the default confidential path |
| Liquidation / capital release | **Not built** — numbers only; no withdraw from venues |
| Confidential haircut table in-circuit | **Stretch** |
| Options venue | **Out of MVP** |
| Ethereum / Aave / Morpho | **Pitch only** |
| Robinhood product | **Not built** |

---

## 9. API / Program Spec

### HTTP API (`apps/api`)

Base URL: `http://localhost:4021` (demo).

#### `GET /health`

Unauthenticated. Returns:

```json
{
  "ok": true,
  "twoParty": true,
  "chains": {
    "solana": { "cluster": "devnet", "backend": "arcium"|"simulated", "x402": true },
    "monad":  { "cluster": "testnet", "backend": "enclave"|"unavailable", "x402": true|false, "parallelPairs": true }
  }
}
```

#### `GET /v1/positions?wallet=<id>&party=A|B&chain=solana|monad`

Debug/demo. Returns that party’s `PositionBook` to the **caller who owns the session for that party**. Do not expose Party B’s legs to Party A’s client in confidential flows.

#### `POST /v1/net-margin`  **(x402-gated) — TWO PARTY**

Accepts **both** party identifiers / sealed-or-encrypted inputs. Never returns the other party’s legs in plaintext in confidential mode.

**Request**

```json
{
  "chain": "solana",
  "backend": "arcium",
  "partyA": { "wallet": "<id>", "legsOverride": null },
  "partyB": { "wallet": "<id>", "legsOverride": null },
  "sessionId": "<optional uuid>"
}
```

`legsOverride` only when `DEMO_ALLOW_FIXTURES=true`. `backend` may be omitted → server picks chain default (`arcium` on Solana, `enclave` on Monad).

**Encrypted/sealed path:** clients may POST ciphertext / sealed blobs under `partyA.sealedLegs` / `partyB.sealedLegs` per backend docs (Arcium TS client shape; enclave seal API). Do not invent fields — mirror provider Hello World helpers.

**Without payment:** `402` + `PAYMENT-REQUIRED` (x402 V2):

**Solana**

- scheme: `exact`
- network: `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`
- asset: devnet USDC mint `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
- price: `$0.01` (10_000 base units) **per paying agent call**
- `payTo`: `SOLANA_PAY_TO`

**Monad** (only if verified)

- scheme: `exact`
- network: `eip155:10143`
- asset: Monad testnet USDC `0x534b2f3A21130d7a60830c2Df862319e593943A3` (re-verify)
- facilitator: `https://x402-facilitator.molandak.org` (re-verify `/supported`)
- price: `$0.01`
- `payTo`: `MONAD_PAY_TO`

If Monad facilitator check fails at boot, `/health.chains.monad.x402=false` and Monad UI routes payments to Solana or skips paid agent demo with banner.

**With valid `PAYMENT-SIGNATURE`:** `200`

```json
{
  "sessionId": "...",
  "chain": "solana",
  "partyAWallet": "...",
  "partyBWallet": "...",
  "bookSummary": {
    "legCountA": 2,
    "legCountB": 2,
    "venues": ["drift", "kamino", "mock_equity"],
    "grossNotionalUsd": 240000,
    "netExposureUsd": 12000
  },
  "margin": {
    "siloedAUsd": 9000,
    "siloedBUsd": 9500,
    "siloedCombinedUsd": 18500,
    "nettedCombinedUsd": 7200,
    "savingsUsd": 11300,
    "backend": "arcium",
    "trustModel": "cryptographic_mpc",
    "computationId": "..."
  },
  "disclaimer": "Two-party demo. Mock equity and simplified haircuts. Not investment advice. Not a securities product. Other party's legs omitted by design. Backend trust model labeled in margin.trustModel."
}
```

**Privacy rule (hard):** confidential response must **not** echo per-leg plaintext for either party. `bookSummary` stays aggregate. Full legs appear only: (a) in each party’s own local UI session for their own book, or (b) in explicit adversarial demo endpoint.

#### `POST /v1/net-margin/parallel`  **(Monad; x402-gated if Monad x402 live)**

```json
{
  "chain": "monad",
  "pairs": [ { "pairId": "p1", "partyA": {...}, "partyB": {...} }, "...≥3" ]
}
```

Returns `ParallelEpochResult` with `concurrency ≥ 3`. Backend must be `enclave` (or labeled simulated only if enclave spike failed — and then Monad submission is questionable; prefer shipping attested path).

#### `POST /v1/demo/adversarial-plaintext`  **(demo only, not default)**

Returns **both** books in plaintext plus annotation payload for the counterfactual screen. Must:

- Require explicit flag `iUnderstandThisLeaksBothBooks: true`
- Response field `danger: "DANGEROUS / plaintext operator view"`
- Never be used by the confidential agent path
- Be rate-limited and disabled when `ALLOW_ADVERSARIAL_DEMO=false`

#### `POST /v1/demo/fixture-two-party`

Dev-only. Seeds known offsetting books for A and B (e.g. A: Kamino SOL lend + tAAPL; B: Drift SOL-PERP short).

#### `POST /v1/demo/fixture-parallel-pairs`

Dev-only. Seeds ≥3 offsetting Monad desk pairs for the parallel clearing screen.

### Arcium program (`programs/foldclear-mxe`)

Follow Arcium Hello World lifecycle ([docs](https://docs.arcium.com/developers/hello-world.md)):

1. Arcis circuit `two_party_portfolio_net` in `encrypted-ixs/`:
   - Inputs: fixed-length arrays for Party A and Party B (pad to `N≤8` each) of `(bucket_id: u8, signed_exposure_scaled: i64, haircut_bps: u16)`, each side as `Enc<Shared, …>` (or equivalent per current Arcis Input/Output docs).
   - Output: `(im_siloed_a, im_siloed_b, im_net_combined)` as scaled `u64` integers (1e6 USD scale). Same formula as §8.
2. Solana `#[arcium_program]` instructions: init comp def, queue two-party computation, callback.
3. Client(s) encrypt with X25519 + RescueCipher via `@arcium-hq/client`, queue, await finalization, decrypt **outputs only**.

**Assumptions (verify against current Arcis docs before coding):**

- Prefer integer fixed-point; no floats in circuit.
- Keep `N` small; fixed circuit structure (no dynamic Vec).
- Multi-input Shared encryption follows documented `Enc<Shared, T>` patterns.
- If full formula is too heavy, compute per-party siloed outside MPC and only run **combined bucket net** inside MPC — still valuable for the two-party privacy claim; document the split.
- Output must stay compact (Solana callback size limits).

### Enclave (`enclave/foldclear-enclave`) — Rust

1. Hello-world day 1–2: accept two sealed inputs (bytes), compute `siloedIm` sum of two fixed arrays, return result + attestation.
2. Production-shaped: deserialize fixed-N leg arrays for A and B; run `two_party_netted` mirroring `packages/margin` in i64 fixed-point; return `NetMarginResult` fields + attestation quote.
3. Host (TS `EnclaveBackend`) verifies attestation when verification libs are available; if verification is stubbed in demo, UI badge reads `Attested (quote shown; verify stub)` — never `MPC`.
4. Parallel path: host may invoke enclave N times concurrently or batch N pairs in one enclave call — either is fine if UI shows ≥3 concurrent results per epoch.

### Env / config keys

```bash
# Chains
SOLANA_RPC_URL=
SOLANA_CLUSTER=devnet
MAINNET_RPC_URL=                 # read-only for labeled live wallet
POSITIONS_USE_MAINNET_READ_ONLY=true
DEMO_PARTY_A_WALLET=
DEMO_PARTY_B_WALLET=
MONAD_RPC_URL=
MONAD_CHAIN_ID=10143

# Privy
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=

# x402 V2 — Solana
SOLANA_PAY_TO=
FACILITATOR_URL_SOLANA=
X402_PRICE_USD=0.01
X402_ASSET_MINT_SOLANA=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
X402_NETWORK_SOLANA=solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1
AGENT_A_SECRET_KEY=
AGENT_B_SECRET_KEY=

# x402 V2 — Monad (populate only after verify-x402-networks passes)
MONAD_PAY_TO=
FACILITATOR_URL_MONAD=https://x402-facilitator.molandak.org
X402_ASSET_MINT_MONAD=0x534b2f3A21130d7a60830c2Df862319e593943A3
X402_NETWORK_MONAD=eip155:10143
X402_MONAD_ENABLED=false         # flip true only after /supported verify
AGENT_MONAD_SECRET_KEY=

# Protocols
DRIFT_ENV=mainnet-beta
KAMINO_MARKET_PUBKEY=            # confirm from Kamino docs; do not invent

# Mock equity (adapter-ready; not Robinhood, not custody)
MOCK_EQUITY_MINT=
MOCK_EQUITY_SYMBOL=tAAPL
MOCK_EQUITY_PRICE_USD=190.00
MOCK_EQUITY_ADAPTER_NOTE=adapter-ready for xStocks/Backed (Solana RO) / Robinhood-style venues

# Arcium
ARCIUM_CLUSTER_OFFSET=
FOLD_CLEAR_PROGRAM_ID=
SOLANA_BACKEND_DEFAULT=arcium
FORCE_SIMULATED_NETTING=false

# TEE / Enclave
ENCLAVE_PROVIDER=nitro           # or oyster
ENCLAVE_ENDPOINT=
ENCLAVE_ATTESTATION_VERIFY=true
MONAD_BACKEND_DEFAULT=enclave
MONAD_PARALLEL_MIN_PAIRS=3

# Demo
DEMO_ALLOW_FIXTURES=true
ALLOW_ADVERSARIAL_DEMO=true
API_PORT=4021
NEXT_PUBLIC_API_BASE=http://localhost:4021
NEXT_PUBLIC_DEFAULT_CHAIN=solana
```

---

## 10. UX Flow

1. **Landing** — Near-black full bleed. Serif wordmark “Foldclear”. One sentence: *two parties, one net margin, neither sees the other’s book — MPC on Solana, attested TEE on Monad.* CTAs: `Connect` (Privy), `Run two-agent demo`, chain pill `Solana | Monad`.
2. **Party setup** — Assign Party A and Party B wallets (connect + paste counterparty, or load two-party judge fixture). Label which is mainnet-RO live vs fixture. Backend badge: `Arcium MPC` or `TEE (Nitro/Oyster)`.
3. **Per-party books** — Two columns. Each shows that party’s legs only. Never show B’s legs inside A’s column in confidential mode.
4. **Siloed vs netted hero** — Show **siloed A**, **siloed B**, **siloed combined**, **netted combined**, **savings**. Amber accent on savings delta. Trust-model chip under savings.
5. **Adversarial counterfactual (~20s)** — Explicit button: `Show plaintext operator view (DANGEROUS)`. Reveal both books side-by-side with annotation: *“If a centralized clearer saw this, they could front-run either desk.”* Auto-advance or require dismiss before confidential compute. Not the default path. Ships on **both** chain demos.
6. **Compute confidential** — `Compute two-party confidential net margin`. Progress while backend runs. Badge `Arcium MPC` / `TEE attested` / honest `Simulated`.
7. **Monad parallel panel** (Monad chain only) — Grid of **≥3 desk pairs** clearing concurrently; each card shows that pair’s siloed combined vs netted + savings; epoch timestamp. One-liner on panel: *parallel clearing*.
8. **Agent panel** — Two terminals / tabs on Solana: `demo-agent-a` and `demo-agent-b` each hitting 402 → pay → 200 with **independent** keys. Monad: show Monad agent **or** honest “x402 Solana-only on this demo” banner.
9. **Footer** — Mock equity / adapter-ready, not a securities exchange, simplified margin, **TEE ≠ MPC**, OSS, business-model honesty one-liner.

**Visual system:** background `#0A0A0B`, text `#F5F2EB`, muted `#8A8580`, **single accent amber `#F0B429`**. Serif headlines (Newsreader / Fraunces), monospace numbers (IBM Plex Mono / JetBrains Mono). No purple gradients, no glassmorphism spam, no generic SaaS cards.

---

## 11. Success Metrics

| Metric | Target |
| --- | --- |
| Live two-wallet demo (Solana) | Two distinct wallets wired; ≥1 real labeled mainnet RO read |
| Hero comparison | Per-party siloed + combined siloed vs combined netted visible without explanation |
| Confidential Solana path | Genuine two-party Arcium **or** honest labeled simulation of the same formula |
| Confidential Monad path | Attested enclave running same formula; trust model labeled TEE not MPC |
| Parallel multi-pair | Monad judge sees **N≥3** pairs concurrently |
| Adversarial counterfactual | Screen ships and is in **both** Demo Laws |
| x402 Solana | ≥1 successful paid call on camera; **ideally two independent agents** |
| x402 Monad | Live if verified; else documented Solana-only — no silent fake |
| Sink questions | Rehearsed: “Why MPC?” (two-party mutual distrust) and “Why TEE on Monad?” (strongest honest backend + parallel clearing) |
| Honesty | Real-vs-mocked + TEE≠MPC + business-model honesty |
| OSS | Public repo before submission |
| Time | Each Demo Law ≤4 minutes |
| Non-goals avoided | No single-wallet-only product; no TEE=MPC theater; no fake users/revenue; no KYC/RWA custody; no dark pool; no Robinhood build |
| Priority discipline | Colosseum submitted Oct 12; Monad only if Solana green by day 9 |

---

## 12. Launch & First-Customer Plan

1. **Hackathon submission (Oct 12):** Colosseum project page — demo video, repo, writeup, Solana Ecosystem track. Lead with two-party MPC + adversarial counterfactual. Submit **first**.
2. **Hackathon submission (Oct 13):** Monad Metropolis Track 01 — only if Solana shipped. Lead with **parallel multi-pair** + attested TEE honesty (Medium confidentiality, not Medium–High crypto MPC).
3. **Immediate users:** pairs of agent hackers / desks already multi-venue who will **not** send plaintext books to each other or to an operator. Share the two-agent x402 snippet, not a sales deck.
4. **First design-partner ask:** two desks (or one desk + a simulated counterparty bot) to validate that the **combined net number** is decision-useful even before capital mobility exists.
5. **Post-hackathon pitch only:** Ethereum TEE + Aave/Morpho; equity adapter toward xStocks/Backed / Robinhood-style venues — analytics never custody.
6. **Do not:** claim waitlists of thousands, forge LOIs, file as a securities product, pitch `$0.01 × N agents` as venture math, or claim TEE = MPC.

---

## 13. Risks

| Risk | Mitigation |
| --- | --- |
| **“Why MPC?” sink question** | Two-party mutual distrust + adversarial counterfactual are the answer. Rehearse aloud. If the answer sounds like single-wallet privacy, you shipped the wrong product. |
| **“Isn’t TEE just MPC?”** | No. README + UI trust chips: Solana = cryptographic MPC; Monad = hardware-attested TEE; different trust models, both real. Rehearse one sentence. |
| Arcium integration / circuit limits | Start Hello World day 1–2; integer ops; fixed `N`; **FORCE_SIMULATED_NETTING** with loud banner by ~2/3 window if needed |
| TEE spike slips | Days 1–2 Nitro/Oyster hello-world in **parallel** with Arcium; if enclave not attested by day 10, kill or label Monad harshly — never fake attestation |
| Scope creep (options, Ethereum, in-circuit haircuts, Robinhood, liquidation txs) | Cut aloud; Ethereum/Robinhood = pitch only; haircut table only after two-party E2E |
| Costume Monad port | Parallel multi-pair ≥3 is mandatory for Monad MVP; solitary pair = fail |
| Solana wobble + Monad distraction | **Hard rule: day 9 Solana red → kill Monad without ceremony** |
| Monad x402 missing/broken | `scripts/verify-x402-networks.ts`; if fail, `X402_MONAD_ENABLED=false` and document Solana-only |
| Empty / mismatched venue data | Require ≥1 real Solana mainnet RO wallet; fixtures for the rest; Monad may be fixtures if labeled |
| Regulatory misread | Pitch as **compute / margin analytics**, mock equity, no custody movement, no KYC, two-party demo not a CCP |
| Business-model dishonesty | Per-call fee is wedge not moat; single-party client-side netting could be free; say it in README |
| Privacy theater | Refuse features that show both books to the server “for convenience” in confidential mode; adversarial mode is labeled DANGEROUS only |
| Medium–High overclaim on Monad | Honest ceiling = **Medium** real confidentiality via TEE in 2 weeks; Medium–High needs Arcium-class crypto MPC |

---

## 14. Time-scoped Build Roadmap

Calendar anchor: **Sun Sep 27 → Mon Oct 13, 2026**. Colosseum **Oct 12**; Monad **Oct 13**. Cut from the bottom. **Protect Colosseum.**

### Days 1–2 (Sep 28–29): Parallel spikes (siloed)

- **Track S:** Arcium two-encryptor spike — Hello World with **two** `Enc` inputs → sum/net toy → decrypt. Prove multi-input path.
- **Track M:** TEE hello-world — Nitro **or** Oyster: two sealed inputs + `siloedIm`-shaped compute + attestation quote out. Pick winner by end of day 2.
- Init monorepo skeleton (`apps/*`, `packages/margin`, `packages/confidential` stubs). Do **not** deep-build UI yet.
- Run `scripts/verify-x402-networks.ts` draft against Solana + Monad facilitators; record results in README stub.

### Days 3–5 (Sep 30–Oct 2): Shared core

- `packages/margin` complete with golden two-party fixtures (offsetting A/B → netted < siloed sum).
- Position readers: Solana Drift + Kamino (≥1 labeled mainnet RO); Monad one venue **or** fixtures.
- Mock `tAAPL` module (adapter-ready note in config).
- Next.js amber UI: two columns, siloed A/B/combined, adversarial counterfactual screen wired.
- API scaffolding: `/health`, `/v1/positions`, `/v1/net-margin`, adversarial + fixture endpoints. Backend selector stubbed.

### Days 6–9 (Oct 3–6): **Colosseum freeze** — Arcium real, x402 Solana, two agents

- `ArciumBackend` wired end-to-end; circuit mirrors margin formula; simulated fallback with banner.
- x402 V2 on Solana; `demo-agent-a` + `demo-agent-b` independent keys; paid calls on camera.
- Adversarial counterfactual polished into Demo Law — Colosseum.
- **Day 9 gate:** If Solana E2E (readers + formula + (Arcium|simulated) + x402 + adversarial) is **red**, **kill Monad without ceremony** and spend remaining days on Colosseum polish/video/submit. If **green**, proceed to Monad.

### Days 10–11 (Oct 7–8): Monad expansion (only if day 9 green)

- `EnclaveBackend` runs real `twoPartyNetted` inside attested enclave; UI trust chip = TEE.
- Parallel multi-pair orchestrator: **≥3 pairs** on screen concurrently per epoch.
- x402 Monad **if** `X402_MONAD_ENABLED=true` after verify; else Solana-only banner on Monad demo.
- Monad readers/fixtures labeled honestly.

### Day 12 (Oct 9): Rehearse **BOTH** Demo Laws

- Different one-liners: **Colosseum = two-party MPC**; **Monad = parallel clearing** (attested TEE).
- Sink-question drills: why MPC? why TEE≠MPC? why parallel on Monad?
- Timing ≤4 min each. Cut anything that breaks either story.

### Days 13–14 (Oct 10–11): Videos, honesty tables, submit prep

- Record two videos (or one split clearly).
- Two **real-vs-mocked** tables (Solana table + Monad table) in README.
- TEE≠MPC paragraph + business-model honesty + production-still-needs.
- OSS license, `.env.example`, attestation notes.

### Submit window

- **Oct 12:** Submit **Colosseum** first.
- **Oct 13:** Submit **Monad** only if expansion path shipped.

---

## 15. Build Instructions for Codegen

Imperative. Follow in order. **Two-party everywhere. Pluggable backend everywhere.**

1. **Create** the monorepo layout in §7. Use `pnpm` workspaces. TypeScript strict. Copy this file to repo root as `AGENT.md`.
2. **Create** `packages/margin` with pure functions:
   - `siloedIm(legs: PositionLeg[]): number`
   - `twoPartySiloed(bookA, bookB): { siloedA, siloedB, siloedCombined }`
   - `twoPartyNetted(bookA, bookB): { nettedCombined, savings, buckets }`
   - Golden fixtures where A and B offset in the same bucket → `nettedCombined < siloedCombined`.
3. **Create** `packages/confidential`:
   - Export `ConfidentialBackend`, `NetMarginResult`, `BackendKind`.
   - Implement `SimulatedBackend` first (wraps `packages/margin`, sets trustModel simulated).
   - Stub `ArciumBackend` and `EnclaveBackend` with `not implemented` until spikes land.
4. **Days 1–2 spikes (parallel):**
   - Arcium: two-encryptor Hello World.
   - TEE: Nitro or Oyster hello-world with two inputs + attestation (Rust enclave).
5. **Create** Drift adapter + Kamino adapter for Solana; wire ≥1 labeled mainnet RO wallet; `fetchBooks(walletA, walletB)`.
6. **Create** Monad position path: one venue adapter **or** fixtures with `source: "mock"` labels; `fixture-parallel-pairs` with ≥3 pairs.
7. **Create** mock equity module: config-driven `tAAPL`; `source: "mock"`; adapter-ready note; attachable to A and/or B. Do **not** build Robinhood.
8. **Create** Next.js app: `#0A0A0B` bg, accent `#F0B429`, serif headlines, mono numerals. No purple. Implement UX §10 including chain toggle, two columns, adversarial mode, Monad parallel grid.
9. **Wire** Privy Solana provider; Party A connect; Party B connect or paste.
10. **Create** API with `/health`, `/v1/positions`, `/v1/net-margin`, `/v1/net-margin/parallel`, adversarial + fixture endpoints. Backend selected by `chain` + env defaults.
11. **Enforce privacy:** confidential response DTOs **omit** per-leg arrays; TypeScript should make including `legs` a compile error in that DTO.
12. **Write** `scripts/verify-x402-networks.ts` — GET Solana + Monad facilitator `/supported`; print pass/fail; set documented env flags. **Do not** enable Monad x402 without a pass.
13. **Wire** x402 V2 exact scheme for Solana per [Solana x402 guide](https://solana.com/docs/payments/agentic-payments/x402). Conditionally wire Monad per [Monad x402 guide](https://docs.monad.xyz/guides/x402) only after verify.
14. **Init** Arcium project with `arcium init`; implement `two_party_portfolio_net` mirroring margin formula in fixed-point; wire `ArciumBackend`; on error fall back to `SimulatedBackend` with UI banner.
15. **Implement** `enclave/foldclear-enclave` in **Rust**; wire `EnclaveBackend` with attestation fields; UI badge must say TEE / attested, never MPC.
16. **Implement** parallel orchestrator: accept ≥3 `DeskPair`s; run enclave nets concurrently; return `ParallelEpochResult`.
17. **Build** adversarial screen calling `/v1/demo/adversarial-plaintext` only after explicit DANGEROUS confirm — shared across chains.
18. **Write** `scripts/demo-agent-a.ts` and `scripts/demo-agent-b.ts` (Solana, independent keys). Optional `demo-agent-monad.ts` if x402 Monad enabled.
19. **Write** README with:
    - Quickstart
    - **Two** real-vs-mocked tables (Solana, Monad)
    - Explicit: **Solana = cryptographic MPC; Monad = hardware-attested TEE; both real confidentiality, different trust models. TEE ≠ MPC.**
    - Business-model honesty: per-call fee is wedge; moat is mutually-distrusting two-party case; client-side single-party netting could be free
    - Production-still-needs: legal CCP/enforceability, venue IM, oracle adversity, default fund, attestation verification hardening
    - Equity honesty: `tAAPL` mock / adapter-ready; analytics never custody
20. **Record** both Demo Laws; cut anything that breaks the 4-minute stories.
21. **Refuse** any PR that (a) reintroduces single-wallet-only netting as the product, (b) labels TEE as MPC, (c) ships Monad as a solitary-pair costume port, or (d) prioritizes Monad over a red Solana path after day 9.

---

## 16. Demo Law (≤4 minutes each)

### Demo Law — Colosseum (Solana) — one-liner: **two-party MPC**

1. **Open UI** (15s). One-liner: two parties, neither sees the other’s book — **cryptographic MPC via Arcium**.
2. **Load two-party fixture** (or connect A + B) (20s). Point at two wallets — note which is live mainnet RO.
3. **Adversarial counterfactual** (20s). Click DANGEROUS plaintext operator view. Show **both** books. Say: *“A centralized clearer who sees this can front-run either desk. That is why single-operator clearing fails — and why self-netting one wallet does not need MPC.”*
4. **Dismiss → Compute confidential** (60–90s). **Arcium MPC** badge or honest Simulated. Point at siloed A, siloed B, siloed combined vs **netted combined** savings.
5. **Two agents** (45s). Run `pnpm demo:agent-a` and `pnpm demo:agent-b` — each independent key, each 402 → paid 200.
6. **Close** (20s). Mock equity, simplified haircuts, OSS, business-model honesty, what production needs. Mention Monad TEE expansion only if asked.

### Demo Law — Monad — one-liner: **parallel clearing**

1. **Open UI → Monad** (15s). One-liner: **parallel multi-pair clearing** under **hardware-attested TEE** — same formula as Solana, different trust model.
2. **Show ≥3 desk pairs** (20s). Grid loads; say Monad throughput lets a clearer net many pairs per epoch.
3. **Adversarial flash** (15s). Optional short DANGEROUS reminder — plaintext operator still toxic.
4. **Compute epoch** (60–90s). Enclave badge **TEE attested** (never “MPC”). Cards flip to siloed vs netted per pair concurrently.
5. **x402** (30s). Monad paid call **if enabled**; else honest “payments on Solana this demo; Monad facilitator not wired.”
6. **Close** (20s). *TEE ≠ MPC. Medium real confidentiality. Colosseum is the MPC primary; this is expansion proof.*

**Hard rules:** No live coding. No single-wallet-only story. No fabricated traction. No calling TEE “MPC.” Always answer “why confidential compute?” with two-party + counterfactual. Always answer “why Monad?” with parallel multi-pair + honest TEE.

---

## 17. Disappear Test

If **two-party confidential netting** (two mutually distrusting parties submitting sealed/encrypted books into a joint computation that reveals only combined net margin) is removed, Foldclear dies.

- Single-wallet self-netting without confidential compute is a spreadsheet — not Foldclear.
- A portfolio dashboard of one user’s legs is not Foldclear.
- x402 without two-party netting is a paid API facade.
- A new perp DEX or dark pool is out of scope and not Foldclear.
- If Arcium is temporarily replaced by a **labeled** simulation of the **same two-party formula**, the Solana product is wounded but still demoable for Colosseum.
- If the Monad path cannot show **attested TEE** and **≥3 parallel pairs**, it is a costume port — do not submit Monad; protect Colosseum.
- If README or pitch **equates TEE with MPC**, honesty is broken — fix before submit.
- If the **adversarial counterfactual** disappears, the sink-question answer weakens — keep it.
- If `packages/margin` diverges from Arcis / enclave mirrors without golden-fixture lock, backends lie — keep one formula source.

---

## Appendix — Concrete decisions (locked)

| Decision | Value |
| --- | --- |
| Product name | **Foldclear** |
| Core thesis | Two-party / cross-counterparty netting (NOT single-wallet self-netting) |
| Architecture | **Pluggable `ConfidentialBackend`** — formula shared; trust transport per chain |
| Solana backend | **Arcium MXE** — cryptographic MPC (primary Colosseum) |
| Monad backend | **TEE** — AWS Nitro Enclaves or Marlin Oyster; hardware-attested; Rust enclave |
| Monad differentiator | **Parallel multi-pair clearing ≥3 pairs / epoch** — not a thin port |
| Honest ceiling (Monad) | **Medium** real confidentiality via TEE in 2 weeks; Medium–High needs crypto MPC |
| TEE ≠ MPC | README + UI mandatory honesty |
| Venues (Solana) | Kamino + Drift |
| Venues (Monad) | One venue or fixtures |
| Mock equity | `tAAPL` — adapter-ready for xStocks/Backed / Robinhood-style; never custody; do not build Robinhood |
| Ethereum / Aave / Morpho | Pitch slide / post-hackathon only |
| Accent | `#F0B429` on `#0A0A0B` |
| Formula | Per-party siloed; combined siloed = sum; combined netted = union book under bucket haircuts — **identical** across backends |
| API | Accepts party A + party B; no other-party legs in confidential responses; same schema every backend |
| Adversarial mode | Explicit DANGEROUS plaintext both-books demo only |
| x402 Solana | V2, devnet USDC, **two** demo agent scripts |
| x402 Monad | Enable only after facilitator `/supported` + USDC verify; else Solana-only + honest docs |
| Options | Out of MVP |
| Confidential haircut table in-circuit/enclave | Stretch only after two-party works |
| MarginFi | Rejected (deprecated client / migration noise) |
| Priority | **Win Colosseum**; Monad = expansion proof; day-9 Solana red → kill Monad |
| Business model | Per-call fee = wedge; moat = mutually-distrusting two-party case |
| Stack constraint | Enclave code **Rust**; TS/Next for app; Arcis/Anchor on Solana |
