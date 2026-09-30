import Link from "next/link";
import { ArrowRight, EyeOff, ShieldCheck, Zap, BookLock, Cpu, Banknote } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NettingPreview } from "@/components/netting-preview";
import { RevealSection } from "@/components/reveal-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid-backdrop"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[480px] anim-pulse-glow bg-[radial-gradient(ellipse_55%_45%_at_50%_-5%,var(--accent),transparent)]"
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 md:px-6 md:pb-28 md:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="anim-fade-up">
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Confidential two-party clearing
              </p>
              <h1 className="mt-5 max-w-2xl font-serif text-4xl font-medium leading-[1.08] tracking-tight md:text-6xl">
                Two parties, one net margin,{" "}
                <span className="gold-text italic">neither sees the other&rsquo;s book.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Luthren nets distinct desks&rsquo; DeFi positions against each other under MPC on
                Solana and attested TEE on Monad — offsetting collateral frees up without anyone,
                including the operator, reading the full book.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/clear"
                  className="sheen btn-press inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Run the clearing demo
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/trust"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 font-medium transition-colors duration-150 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  What&rsquo;s real vs mocked
                </Link>
              </div>
              <p className="mt-6 font-mono text-xs text-muted-foreground">
                MPC on Solana · attested TEE on Monad · x402 machine payments
              </p>
            </div>

            <div className="anim-fade-up" style={{ animationDelay: "120ms" }}>
              <NettingPreview />
            </div>
          </div>
        </section>

        <section aria-label="How Luthren works" className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
            <RevealSection>
              <h2 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
                Built for mutually distrusting desks
              </h2>
              <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                Three properties that make two-party clearing work — and the honesty to say
                what each one is.
              </p>
            </RevealSection>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: EyeOff,
                  title: "Sealed inputs",
                  body: "Each desk seals its own book. Only the combined net margin leaves the confidential path — not your legs, not theirs, not the operator's.",
                  tag: "cryptographic MPC on Solana",
                },
                {
                  icon: ShieldCheck,
                  title: "Honest backends",
                  body: "Arcium MPC on Solana; attested Nitro/Oyster TEE on Monad. Same formula, labeled trust models — TEE is not MPC and we say so.",
                  tag: "pluggable per chain",
                },
                {
                  icon: Zap,
                  title: "Machine-payable",
                  body: "Agents pay per clearing call with disposable keys on devnet USDC via x402. No API accounts, no operator custody of either book.",
                  tag: "$0.01 per call wedge",
                },
              ].map(({ icon: Icon, title, body, tag }, i) => (
                <RevealSection key={title} delay={i * 80}>
                  <article className="group h-full rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] focus-within:border-primary/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary transition-colors duration-200 group-hover:border-primary/40">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <h3 className="mt-5 text-lg font-medium">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                    <p className="mt-4 font-mono text-xs text-muted-foreground/80 transition-colors duration-200 group-hover:text-muted-foreground">
                      {tag}
                    </p>
                  </article>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="The demo path" className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
          <RevealSection>
            <h2 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
              The four-minute judge path
            </h2>
          </RevealSection>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              {
                step: "01",
                icon: BookLock,
                title: "Two sealed books",
                body: "Party A and Party B each submit encrypted legs into the same computation.",
                href: "/clear",
              },
              {
                step: "02",
                icon: Cpu,
                title: "Confidential compute",
                body: "MPC or attested TEE nets the books; only aggregate scalars decrypt out.",
                href: "/clear",
              },
              {
                step: "03",
                icon: EyeOff,
                title: "The dangerous twin",
                body: "See the plaintext counterfactual — why a central operator is the attack surface.",
                href: "/adversarial",
              },
              {
                step: "04",
                icon: Banknote,
                title: "Agents pay per call",
                body: "Two independent x402 agents, each with its own key, 402 → pay → 200.",
                href: "/agents",
              },
            ].map(({ step, icon: Icon, title, body, href }, i) => (
              <RevealSection key={step} delay={i * 70}>
                <Link
                  href={href}
                  className="group relative block h-full rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">{step}</span>
                    <Icon className="h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-primary" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-sm font-medium">{title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
                  <span
                    aria-hidden
                    className="mt-4 inline-flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  >
                    Open <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </RevealSection>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
