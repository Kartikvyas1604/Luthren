import Link from "next/link";
import { LogoMark } from "@/components/logo-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <LogoMark size={22} className="translate-y-0.5" />
            <span className="font-serif text-base font-medium tracking-tight brand-gradient">
              Obligor
            </span>
          </Link>
          <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
            two-party clearing · MPC on Solana · attested TEE on Monad
          </p>
        </div>
        <p className="mt-6 max-w-prose text-xs leading-relaxed text-muted-foreground">
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
