# Contributing to Obligor

Thank you for considering a contribution. Obligor is a small, opinionated codebase with
two architectural rules that are not up for debate — everything else is negotiable.

## Before you start

Read the honesty rules first, because they shape every pull request:

1. **This is a two-party product.** The load-bearing case is mutually distrusting desks
   sharing sealed inputs into a joint computation. Patches that reintroduce
   single-wallet self-netting as the product will be declined, however well they work.
2. **TEE is not MPC.** Solana runs cryptographic MPC via Arcium; Monad runs a
   hardware-attested enclave. Both are real confidentiality with different trust models.
   Patches that blur, soften, or mislabel that distinction will be declined. The same
   goes for anything that hides a simulated path behind real-sounding language — every
   backend kind (`arcium`, `enclave`, `simulated`) must stay visibly labeled.

## Getting set up

```bash
git clone https://github.com/Kartikvyas1604/Luthren.git
cd Luthren
npm install
npm run dev
```

Then open `http://localhost:3000/clear`. You don't need a wallet, API keys, or
environment variables — every fixture is labeled and every computation runs locally in
the browser.

Before opening a pull request, run:

```bash
npm run lint        # eslint must pass clean
npm run build       # production build must succeed
npx tsc --noEmit    # types must pass
```

## How to contribute

1. **Find or raise an issue.** Good first contributions: accessibility fixes, copy
   tightening, additional fixture books, a new instrument bucket with a defensible
   haircut, or adapter work toward a real position reader.
2. **Fork, branch, commit.** Branch names like `feat/live-kamino-reader` or
   `fix/adversarial-focus-trap`. Keep commits small and imperative ("Add Buckets option
   to calculator", not "added some stuff").
3. **Open the pull request with context.** What changed, why, and which page it
   affects. Screenshots for anything visual. If you touched the margin formula, include
   a worked example with expected numbers — see the worked example in the README for
   the format.

## Code conventions

- **TypeScript strict.** No `any` where a real type will do. Types for positions live
  with the margin engine and are shared, not redeclared.
- **The formula has one source of truth.** `lib/margin.ts` is the single home of the
  netting math. Never reimplement the formula in a component, a fixture, or a test
  helper — import it. If a confidential backend mirrors the formula in another language
  (Arcis circuit, Rust enclave), it must match golden fixtures exactly.
- **Tokens, not magic values.** Colors, spacing, and radii come from the design tokens
  in `globals.css` (backed by `brand.md` — the Bullion palette: ink, warm white,
  champagne gold, steel for attestation markers, red for destructive paths). Never
  hardcode a hex value in a component. Gold is for money and CTAs; steel is exclusively
  for attested-TEE markers; introducing a second warm accent is a decline.
- **Numbers are typed in mono.** Any USD figure renders through the shared `usd`
  formatter with two decimals and `tabular-nums` — no digit jitter, no ad-hoc
  formatting.
- **Accessibility is part of the definition of done.** Real `<button>`/`<a>` elements,
  visible focus rings, labels on inputs, hit targets at 40px on touch, contrast at WCAG
  AA, and `prefers-reduced-motion` respected on every animation.
- **Honesty is a code review category.** Any new surface that touches trust — backends,
  payments, live reads — ships with its label (`Arcium MPC`, `TEE attested`, or
  `Simulated`) visible in the same view, not buried in a tooltip.

## What the project will not accept

- Single-wallet-only netting presented as the product (see rule 1).
- Any copy or badge that equates TEE with MPC (see rule 2).
- Fake traction, invented TAM, or fabricated agent counts in README, pitch, or UI copy.
- Custody, matching, lending, or securities-exchange features — Obligor is compute and
  analytics only.
- Drive-by dependency additions for problems the standard library already solves.

## Reporting a security issue

Do not open a public issue. Email **vkartik013@gmail.com** with details and a
reproduction path. Given what this product claims about confidentiality, reports about
data leakage — anything that would let one party, or the operator, reconstruct the other
party's book — are the highest priority.

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](LICENSE).
