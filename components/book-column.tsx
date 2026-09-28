"use client";

import { useMemo, useState } from "react";
import { Check, Copy, EyeOff } from "lucide-react";
import { siloedIm, usd, type PositionBook, type PositionLeg } from "@/lib/margin";

function truncateAddress(address: string, chars = 4) {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

function CopyAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(address);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          setCopied(false);
        }
      }}
      className="relative inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors duration-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring after:absolute after:-inset-2"
      aria-label={copied ? "Address copied" : `Copy address ${truncateAddress(address)}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden />
      )}
    </button>
  );
}

function LegRow({ leg }: { leg: PositionLeg }) {
  const negative = leg.signedExposureUsd < 0;
  return (
    <li className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {leg.instrument}
          <span className="ml-2 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
            {leg.venue}
          </span>
          {leg.source === "live" && (
            <span className="ml-1.5 rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-primary">
              live
            </span>
          )}
        </p>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground tabular-nums">
          {leg.qty.toLocaleString("en-US", { maximumFractionDigits: 4 })} @ {usd(leg.markUsd)} · haircut{" "}
          {(leg.haircut * 100).toFixed(0)}%
        </p>
      </div>
      <p
        className={`font-mono text-sm tabular-nums ${negative ? "text-destructive" : "text-foreground"}`}
      >
        {negative ? "−" : "+"}
        {usd(Math.abs(leg.notionalUsd), 0)}
      </p>
    </li>
  );
}

export function BookColumn({
  title,
  wallet,
  legs,
  hidden,
}: {
  title: string;
  wallet: string;
  legs: PositionBook["legs"];
  hidden: boolean;
}) {
  const im = useMemo(() => siloedIm(legs), [legs]);

  if (hidden) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Sealed. This party&rsquo;s legs stay encrypted through the computation — that is the
          whole point.
        </p>
        <div className="mt-4 space-y-2" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 rounded bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground tabular-nums">
            {truncateAddress(wallet)}
            <CopyAddress address={wallet} />
          </div>
        </div>
      </div>
      {legs.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="text-sm font-medium">No legs yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Load a fixture or connect a wallet to populate this book.
          </p>
        </div>
      ) : (
        <ul>
          {legs.map((l) => (
            <LegRow key={`${l.party}-${l.venue}-${l.instrument}`} leg={l} />
          ))}
        </ul>
      )}
      <div className="flex items-baseline justify-between border-t border-border px-4 py-3">
        <p className="text-xs text-muted-foreground">Siloed initial margin</p>
        <p className="font-mono text-sm font-medium tabular-nums">{usd(im, 0)}</p>
      </div>
    </div>
  );
}
