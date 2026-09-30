"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { monadPairs } from "@/lib/fixtures";
import { twoPartyNetted, twoPartySiloed, usd } from "@/lib/margin";

const EPOCH_STAGES = ["Sealing 6 books", "Enclave batch scheduled", "Netting N pairs concurrently", "Attestation attached"];

export default function MonadPage() {
  const [epoch, setEpoch] = useState<"idle" | "running" | "done">("idle");
  const [stage, setStage] = useState(-1);
  const [concurrency, setConcurrency] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const results = useMemo(
    () =>
      monadPairs.map((p) => ({
        pairId: p.pairId,
        label: p.label,
        siloed: twoPartySiloed(p.a, p.b).siloedCombined,
        net: twoPartyNetted(p.a, p.b),
      })),
    [],
  );

  function computeEpoch() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setEpoch("running");
    setStage(0);
    setConcurrency(0);
    EPOCH_STAGES.forEach((_, i) =>
      timersRef.current.push(setTimeout(() => setStage(i), i * 600)),
    );
    monadPairs.forEach((_, i) =>
      timersRef.current.push(
        setTimeout(() => setConcurrency((c) => Math.max(c, i + 1)), 2400 + i * 400),
      ),
    );
    timersRef.current.push(
      setTimeout(() => setEpoch("done"), 2400 + monadPairs.length * 400 + 300),
    );
  }

  return (
    <PageShell chain="monad">
      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-steel">
              Monad · parallel multi-pair clearing
            </p>
            <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight md:text-4xl">
              Many pairs, one epoch
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Monad throughput lets a clearing desk net many desk pairs concurrently. Same formula
              as the Solana path, attested TEE trust model — TEE ≠ MPC.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-steel/40 px-2.5 py-1 font-mono text-xs text-steel">
            <span className="h-1.5 w-1.5 rounded-full bg-steel" aria-hidden />
            TEE attested · fixture books
          </span>
        </div>

        {epoch === "idle" && (
          <button
            type="button"
            onClick={computeEpoch}
            className="inline-flex h-11 items-center gap-2 self-start rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity duration-100 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Compute epoch
          </button>
        )}

        {epoch === "running" && (
          <section aria-label="Epoch progress" aria-busy="true" className="anim-fade-up rounded-xl border border-steel/30 bg-card p-6">
            <p className="flex items-center gap-2 text-sm font-medium">
              <LoaderCircle className="h-4 w-4 animate-spin text-primary motion-reduce:animate-none" aria-hidden />
              Clearing epoch in progress
              <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground" aria-live="polite">
                {concurrency}/{monadPairs.length} pairs
              </span>
            </p>
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-secondary" aria-hidden>
              <div className="anim-shimmer h-full w-full rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
            <ol className="mt-4 space-y-2">
              {EPOCH_STAGES.map((s, i) => (
                <li
                  key={s}
                  className={`flex items-center gap-2 font-mono text-xs transition-colors duration-200 ${
                    i < stage ? "text-primary" : i === stage ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span aria-hidden className="w-4">
                    {i < stage ? "✓" : i === stage ? "→" : "·"}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </section>
        )}

        {epoch === "done" && (
          <p className="flex items-center gap-2 font-mono text-sm text-primary" role="status">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Epoch cleared — {monadPairs.length} pairs, peak concurrency {concurrency}
          </p>
        )}

        <section aria-label="Desk pairs" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((r, i) => {
            const cleared = epoch === "done" || (epoch === "running" && concurrency > i);
            return (
              <article
                key={r.pairId}
                className={`anim-fade-up rounded-xl border bg-card p-5 transition-[border-color,box-shadow,opacity] duration-300 ease-out ${
                  cleared
                    ? "border-primary/40 shadow-[0_0_30px_rgba(171,159,242,0.07)]"
                    : "border-border opacity-60"
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
                aria-live="polite"
              >
                <header className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-medium">{r.label}</h2>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase transition-[border-color,color] duration-300 ${
                      cleared
                        ? "anim-flip border-primary/40 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {cleared ? "cleared" : "queued"}
                  </span>
                </header>
                <dl className="mt-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <dt className="text-xs text-muted-foreground">Siloed combined</dt>
                    <dd className="font-mono text-sm tabular-nums">{usd(r.siloed)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-xs text-muted-foreground">Netted</dt>
                    <dd
                      className={`font-mono text-sm tabular-nums transition-colors duration-300 ${
                        cleared ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {cleared ? usd(r.net.nettedCombinedUsd) : "——"}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-xs text-muted-foreground">Freed</dt>
                    <dd
                      className={`font-mono text-sm font-medium tabular-nums transition-colors duration-300 ${
                        cleared ? "text-success" : "text-muted-foreground"
                      }`}
                    >
                      {cleared ? usd(r.net.savingsUsd) : "——"}
                    </dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </section>
      </div>
    </PageShell>
  );
}
