import Link from "next/link";
import { ArrowRight, EyeOff, ShieldCheck, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--accent),transparent)] opacity-30"
          />
          <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 md:px-6 md:pb-28 md:pt-28 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Confidential two-party clearing
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-medium leading-[1.1] tracking-tight md:text-6xl">
              Two parties, one net margin, neither sees the other&rsquo;s book.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Luthren nets distinct desks&rsquo; DeFi positions against each other under MPC on
              Solana and attested TEE on Monad — so offsetting collateral frees up without
              anyone, including the operator, reading the full book.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/clear"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 font-medium text-primary-foreground transition-colors duration-100 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Run the clearing demo
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/clear"
                className="inline-flex h-12 items-center justify-center rounded-md border border-border px-6 font-medium transition-colors duration-100 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Load two-party fixture
              </Link>
              <Link
                href="/agents"
                className="inline-flex h-12 items-center justify-center rounded-md px-4 font-medium text-muted-foreground transition-colors duration-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Two-agent x402 demo
              </Link>
            </div>
          </div>
        </section>

        <section aria-label="How Luthren works" className="border-b border-border">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-3 md:px-6 lg:px-8">
            {[
              {
                icon: EyeOff,
                title: "Sealed inputs, mutual distrust",
                body: "Each desk seals its own book. Only the combined net margin leaves the confidential path — not your legs, not theirs.",
              },
              {
                icon: ShieldCheck,
                title: "Pluggable honest backends",
                body: "Arcium MPC on Solana. Attested Nitro/Oyster TEE on Monad. Same formula, labeled trust models. TEE is not MPC and we say so.",
              },
              {
                icon: Zap,
                title: "Machine-payable via x402",
                body: "Agents pay per clearing call with disposable keys on devnet USDC. No API accounts, no operator custody of either book.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col gap-3">
                <Icon className="h-5 w-5 text-primary" aria-hidden />
                <h2 className="text-lg font-medium">{title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="The margin math" className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            What the demo shows a judge
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Siloed
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Each desk posts full initial margin in isolation. Two offsetting books pay twice.
              </p>
            </div>
            <div className="rounded-lg border border-primary/40 bg-card p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-primary">Netted</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Bucket netting across both parties collapses offsetting exposure before the
                haircut. The savings delta is the product.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
