"use client";

import { useState } from "react";
import { useCountUp } from "@/hooks/use-count-up";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const SILOED_A = 23_500;
const SILOED_B = 27_100;
const NETTED = 16_400;
const SAVINGS = SILOED_A + SILOED_B - NETTED;

export function NettingPreview() {
  const [netted, setNetted] = useState(false);
  const siloedTotal = SILOED_A + SILOED_B;

  const aPct = (SILOED_A / siloedTotal) * 100;
  const bPct = (SILOED_B / siloedTotal) * 100;
  const nettedPct = (NETTED / siloedTotal) * 100;
  const savingsPct = 100 - nettedPct;

  const shownSavings = useCountUp(SAVINGS, netted);
  const shownNetted = useCountUp(NETTED, netted);

  return (
    <div className="rounded-xl border border-border bg-card/80 p-5 backdrop-blur-sm md:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Live netting preview
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={netted}
          onClick={() => setNetted((v) => !v)}
          className="group relative inline-flex h-9 items-center rounded-full border border-border bg-background px-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={netted ? "Show siloed margin" : "Show netted margin"}
        >
          <span className="px-3 font-mono text-xs">siloed</span>
          <span
            className={`px-3 font-mono text-xs transition-colors duration-150 ${
              netted ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            netted
          </span>
          <span
            aria-hidden
            className={`absolute inset-y-1 right-1 -z-10 w-[calc(50%-4px)] rounded-full bg-primary transition-transform duration-250 ease-out ${
              netted ? "translate-x-0" : "-translate-x-[calc(100%-4px)]"
            }`}
          />
        </button>
      </div>

      <div className="mt-5 space-y-3" aria-live="polite">
        {/* Party A bar */}
        <div>
          <div className="flex items-baseline justify-between">
            <p className="text-xs text-muted-foreground">Party A — siloed IM</p>
            <p className="font-mono text-xs tabular-nums text-muted-foreground">{usd(SILOED_A)}</p>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary/70 transition-all duration-500 ease-out"
              style={{ width: netted ? `${aPct * 0.62}%` : `${aPct}%` }}
            />
          </div>
        </div>
        {/* Party B bar */}
        <div>
          <div className="flex items-baseline justify-between">
            <p className="text-xs text-muted-foreground">Party B — siloed IM</p>
            <p className="font-mono text-xs tabular-nums text-muted-foreground">{usd(SILOED_B)}</p>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary/45 transition-all duration-500 ease-out"
              style={{ width: netted ? `${bPct * 0.62}%` : `${bPct}%` }}
            />
          </div>
        </div>
        {/* Combined bar */}
        <div className="border-t border-border pt-3">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-medium">
              {netted ? "Netted combined" : "Siloed combined"}
            </p>
            <p
              className={`font-mono text-sm font-medium tabular-nums transition-colors duration-300 ${
                netted ? "text-primary" : "text-foreground"
              }`}
            >
              {usd(netted ? shownNetted : siloedTotal)}
            </p>
          </div>
          <div className="relative mt-1 h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-600 ease-out"
              style={{ width: netted ? `${nettedPct}%` : "100%" }}
            />
            {netted && (
              <div
                aria-hidden
                className="absolute inset-y-0 right-0 rounded-r-full border border-dashed border-success/60 bg-success/15"
                style={{ width: `${savingsPct}%` }}
              />
            )}
          </div>
        </div>
      </div>

      <div
        className={`mt-4 flex items-baseline justify-between rounded-lg border px-3 py-2 transition-all duration-300 ${
          netted ? "border-success/40 bg-success/10 opacity-100" : "border-transparent opacity-40"
        }`}
      >
        <p className="text-xs text-muted-foreground">Capital freed</p>
        <p className="font-mono text-sm font-medium tabular-nums text-success">
          {netted ? usd(shownSavings) : usd(0)}
        </p>
      </div>
    </div>
  );
}
