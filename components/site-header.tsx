import Link from "next/link";

export function SiteHeader({ chain = "solana" }: { chain?: "solana" | "monad" }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          <span className="font-serif text-xl font-medium tracking-tight">Luthren</span>
          <span className="hidden sm:inline text-xs text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
            two-party clearing
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link
            href="/clear"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors duration-100 hover:text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Clear
          </Link>
          <Link
            href="/monad"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors duration-100 hover:text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Monad
          </Link>
          <Link
            href="/agents"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors duration-100 hover:text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Agents
          </Link>
          <Link
            href="/trust"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors duration-100 hover:text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Trust
          </Link>
          <span
            className="ml-2 flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
            aria-label={`Network: ${chain === "solana" ? "Solana devnet" : "Monad testnet"}`}
          >
            <span className={`h-2 w-2 rounded-full ${chain === "solana" ? "bg-primary" : "bg-slate-400"}`} aria-hidden />
            {chain === "solana" ? "devnet" : "testnet"}
          </span>
        </nav>
      </div>
    </header>
  );
}
