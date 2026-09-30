"use client";

import { useState } from "react";
import { useCountUp } from "@/hooks/use-count-up";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

function Stat({ value, decimals = 0, prefix = "", suffix = "", label }: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  const v = useCountUp(value, true, 1200);
  const display =
    prefix === "$"
      ? usd(v)
      : v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="font-mono text-2xl font-medium tabular-nums md:text-3xl">
        {prefix === "$" ? display : `${display}${suffix}`}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function StatsBand() {
  return (
    <section aria-label="Product constants" className="border-y border-border bg-card/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4 md:px-6 lg:px-8">
        <Stat value={2} label="sealed parties per session" />
        <Stat value={8} label="max legs per encrypted book" />
        <Stat value={3} suffix="+" label="pairs cleared per Monad epoch" />
        <Stat value={0.01} decimals={2} prefix="$" label="per clearing call (x402)" />
      </div>
    </section>
  );
}

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Why does netting need confidential compute?",
    a: "Netting one wallet's own positions is client-side math — a spreadsheet, not a product. Luthren exists for the harder case: two mutually distrusting desks who will only clear if neither, nor the operator, can read the other's book.",
  },
  {
    q: "Why MPC on Solana but TEE on Monad?",
    a: "We ship the strongest honest backend per chain. Arcium MXE gives cryptographic MPC on Solana. Monad gets hardware-attested TEE (Nitro/Oyster). Both are real confidentiality with different trust models — TEE is not MPC, and every screen labels which one ran.",
  },
  {
    q: "What does Luthren actually see?",
    a: "Only the combined net margin. In confidential mode, per-leg plaintext never reaches the other party, the operator, or the logs. Adversarial plaintext views exist only as an explicitly labeled demo mode.",
  },
  {
    q: "Is this a DEX, a lender, or a dark pool?",
    a: "No. Luthren is clearing compute and margin analytics. It never custodies assets, matches orders, or lends. Simplified bucket haircuts stand in for venue-specific IM in the demo.",
  },
  {
    q: "Why $0.01 per call?",
    a: "Wedge pricing to make clearing machine-payable for agents via x402 — not venture-scale revenue math. The durable value is the two-party confidentiality property itself.",
  },
];

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-0">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-medium transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {q}
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-45" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M8 3v10M3 8h10" strokeLinecap="round" />
          </svg>
        </button>
      </h3>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-muted-foreground max-w-2xl">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section aria-label="Frequently asked questions" className="mx-auto max-w-3xl px-4 py-16 md:px-6 lg:px-8">
      <h2 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
        Objections, answered
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The five questions judges and desk leads always ask.
      </p>
      <div className="mt-8 border-t border-border">
        {FAQS.map((f, i) => (
          <FaqItem
            key={f.q}
            q={f.q}
            a={f.a}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_100%,var(--accent),transparent)] opacity-60"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center md:px-6 lg:px-8">
        <h2 className="font-serif text-2xl font-medium tracking-tight md:text-4xl">
          Clear both books. Leak neither.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Run the two-party demo, or hand your agents the x402 snippet — no account, no plaintext books.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="/clear"
            className="btn-press inline-flex h-12 items-center rounded-lg bg-primary px-7 font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Start clearing session
          </a>
          <a
            href="/agents"
            className="inline-flex h-12 items-center rounded-lg border border-border px-7 font-medium transition-colors duration-150 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Agent payment demo
          </a>
        </div>
      </div>
    </section>
  );
}
