import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavLinks } from "@/components/nav-links";

export function SiteHeader({ chain = "solana" }: { chain?: "solana" | "monad" }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="font-serif text-xl font-medium tracking-tight gold-text">Luthren</span>
          <span className="hidden text-xs text-muted-foreground border border-border rounded-full px-2.5 py-0.5 sm:inline">
            two-party clearing
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <NavLinks />
          <span
            className="ml-1 hidden items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground md:flex"
            aria-label={`Network: ${chain === "solana" ? "Solana devnet" : "Monad testnet"}`}
          >
            <span className={`h-2 w-2 rounded-full ${chain === "solana" ? "bg-primary" : "bg-steel"}`} aria-hidden />
            {chain === "solana" ? "devnet" : "testnet"}
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
