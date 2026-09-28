export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <p className="text-xs leading-relaxed text-muted-foreground max-w-prose">
          Demo build. Mock equity (tAAPL) and fixture books are labeled and adapter-ready; analytics
          never custody. Simplified bucket-haircut margin, not SPAN/SIMM or a CCP. Solana path runs
          the same formula as the Monad path with different trust models: cryptographic MPC versus
          hardware-attested TEE — TEE ≠ MPC. Per-call fee is a wedge, not the moat. Open source.
          Not investment advice. Not a securities product.
        </p>
      </div>
    </footer>
  );
}
