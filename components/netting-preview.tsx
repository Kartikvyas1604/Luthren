"use client";

import { useMemo, useState } from "react";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const MAX = 150_000;

export function NettingPreview() {
  const [exposureA, setExposureA] = useState(90_000);
  const [exposureB, setExposureB] = useState(95_000);

  const { siloed, netted, savings } = useMemo(() => {
    // Party A: Kamino SOL lend (haircut 10%), Party B: Drift SOL-PERP short (haircut 15%)
    const siloedIm = 0.1 * exposureA + 0.15 * exposureB;
    const netExposure = exposureA - exposureB;
    const nettedIm = 0.15 * Math.abs(netExposure);
    return {
      siloed: siloedIm,
      netted: nettedIm,
      savings: Math.max(0, siloedIm - nettedIm),
    };
  }, [exposureA, exposureB]);

  const maxBar = Math.max(siloed, 1);

  return (
    <div className="rounded-xl border border-border bg-card/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Live netting calculator
        </p>
        <span className="rounded-full border border-primary/40 bg-accent px-2.5 py-0.5 font-mono text-[10px] uppercase text-primary">
          try it
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="preview-a" className="text-xs text-muted-foreground">
              Party A — SOL lend <span className="font-mono text-[10px]">h 10%</span>
            </label>
            <span className="font-mono text-xs tabular-nums text-foreground">{usd(exposureA)}</span>
          </div>
          <input
            id="preview-a"
            type="range"
            min={0}
            max={MAX}
            step={5_000}
            value={exposureA}
            onChange={(e) => setExposureA(Number(e.target.value))}
            className="mt-2 h-6 w-full cursor-pointer"
            aria-valuetext={usd(exposureA)}
          />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="preview-b" className="text-xs text-muted-foreground">
              Party B — SOL-PERP short <span className="font-mono text-[10px]">h 15%</span>
            </label>
            <span className="font-mono text-xs tabular-nums text-foreground">{usd(exposureB)}</span>
          </div>
          <input
            id="preview-b"
            type="range"
            min={0}
            max={MAX}
            step={5_000}
            value={exposureB}
            onChange={(e) => setExposureB(Number(e.target.value))}
            className="mt-2 h-6 w-full cursor-pointer"
            aria-valuetext={usd(exposureB)}
          />
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-border pt-4">
        <div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-muted-foreground">Siloed combined</span>
            <span className="font-mono tabular-nums text-muted-foreground">{usd(siloed)}</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-muted-foreground/40 transition-[width] duration-300 ease-out"
              style={{ width: `${(siloed / maxBar) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-foreground">Netted combined</span>
            <span className="font-mono tabular-nums text-foreground">{usd(netted)}</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${(netted / maxBar) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between rounded-lg border border-primary/40 bg-accent px-3 py-2.5">
        <p className="text-xs text-muted-foreground">Capital freed</p>
        <p className="font-mono text-sm font-medium tabular-nums text-primary">
          {usd(savings)}
        </p>
      </div>
      <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground/70">
        drag the sliders — offsetting books collapse
      </p>
    </div>
  );
}
