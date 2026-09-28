"use client";

import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { usd, type BackendKind, type NetMarginResult } from "@/lib/margin";

export function MarginHero({
  result,
  siloedCombined,
  backend,
  onReset,
}: {
  result: NetMarginResult;
  siloedCombined: number;
  backend: BackendKind;
  onReset: () => void;
}) {
  const pct = useMemo(
    () => (siloedCombined > 0 ? Math.round((result.savingsUsd / siloedCombined) * 100) : 0),
    [result.savingsUsd, siloedCombined],
  );
  const [announced, setAnnounced] = useState(false);

  const rows: Array<{ label: string; value: number; accent?: boolean }> = [
    { label: "Siloed A", value: result.siloedAUsd },
    { label: "Siloed B", value: result.siloedBUsd },
    { label: "Siloed combined", value: result.siloedCombinedUsd },
    { label: "Netted combined", value: result.nettedCombinedUsd },
  ];

  return (
    <section
      aria-label="Two-party margin result"
      className="rounded-lg border border-primary/40 bg-card p-6 md:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Combined net margin
          </p>
          <p
            className={`mt-2 font-mono text-4xl font-medium tabular-nums md:text-5xl flash-jade ${
              announced ? "" : "flash-jade"
            }`}
            onAnimationEnd={() => setAnnounced(true)}
          >
            {usd(result.nettedCombinedUsd, 0)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Capital freed</p>
          <p className="mt-1 font-mono text-2xl font-medium tabular-nums text-primary">
            {usd(result.savingsUsd, 0)}
          </p>
          <p className="font-mono text-xs tabular-nums text-primary">
            {pct}% vs siloed
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between border-t border-border pt-2 sm:block sm:border-0 sm:pt-0">
            <dt className="text-xs text-muted-foreground">{r.label}</dt>
            <dd
              className={`font-mono text-sm tabular-nums ${
                r.label === "Netted combined" ? "text-primary font-medium" : ""
              }`}
            >
              {usd(r.value, 0)}
            </dd>
          </div>
        ))}
      </dl>

      <details className="mt-6 rounded-md border border-border bg-background/50 px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Bucket breakdown
        </summary>
        <ul className="mt-3 space-y-2">
          {result.buckets.map((b) => (
            <li key={b.bucket} className="flex items-center justify-between gap-3 text-sm">
              <span className="font-mono text-xs uppercase text-muted-foreground">{b.bucket}</span>
              <span className="flex flex-1 items-center gap-2">
                <span className="text-xs text-muted-foreground tabular-nums">
                  exposure {usd(b.exposureUsd, 0)}
                </span>
              </span>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                h {(b.haircut * 100).toFixed(0)}%
              </span>
              <span className="font-mono text-sm tabular-nums">{usd(b.imUsd, 0)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Simplified bucket-haircut sketch — not SPAN/SIMM/CCP waterfall.
        </p>
      </details>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm transition-colors duration-100 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          New session
        </button>
        <Link
          href="/adversarial"
          className="inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm text-muted-foreground transition-colors duration-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Show the dangerous counterfactual
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
