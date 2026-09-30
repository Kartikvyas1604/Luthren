"use client";

import { useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, LoaderCircle, Lock, Wallet } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { BackendBadge } from "@/components/backend-badge";
import { BookColumn } from "@/components/book-column";
import { MarginHero } from "@/components/margin-hero";
import { adversarialBooks, solanaPartyA, solanaPartyB } from "@/lib/fixtures";
import { twoPartyNetted, twoPartySiloed, type BackendKind } from "@/lib/margin";

const STAGES = [
  "Sealing Party A legs",
  "Sealing Party B legs",
  "Queueing confidential computation",
  "Awaiting MPC finalization",
  "Decrypting outputs only",
];

export default function ClearPage() {
  const [backend, setBackend] = useState<BackendKind>("simulated");
  const [stage, setStage] = useState<number>(-1);
  const [phase, setPhase] = useState<"setup" | "computing" | "done">("setup");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [bookA, setBookA] = useState(solanaPartyA);
  const [bookB, setBookB] = useState(solanaPartyB);

  const siloed = useMemo(() => twoPartySiloed(bookA, bookB), [bookA, bookB]);
  const netted = useMemo(() => twoPartyNetted(bookA, bookB), [bookA, bookB]);

  function loadFixture() {
    setBookA(solanaPartyA);
    setBookB(solanaPartyB);
  }

  function loadAdversarialFixture() {
    setBookA(adversarialBooks.a);
    setBookB(adversarialBooks.b);
  }

  function compute() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("computing");
    setStage(0);
    STAGES.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStage(i), i * 700));
    });
    timers.current.push(
      setTimeout(() => {
        setPhase("done");
        setBackend("simulated");
      }, STAGES.length * 700),
    );
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage(-1);
    setPhase("setup");
  }

  const busy = phase === "computing";

  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
              Clearing session
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Assign both parties, review your own legs, then compute the combined net margin.
              This UI demo runs the real formula locally on labeled fixtures — SIMULATED, not MPC.
            </p>
          </div>
          <BackendBadge kind={busy || phase === "setup" ? "simulated" : backend} showNote />
        </div>

        {phase === "setup" && (
          <section aria-label="Party setup" className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadFixture}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm transition-colors duration-100 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Wallet className="h-4 w-4" aria-hidden />
              Load judge fixture
            </button>
            <button
              type="button"
              onClick={loadAdversarialFixture}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm transition-colors duration-100 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <AlertTriangle className="h-4 w-4" aria-hidden />
              Load offsetting fixture
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={compute}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity duration-100 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
            >
              <Lock className="h-4 w-4" aria-hidden />
              Compute two-party net margin
            </button>
          </section>
        )}

        {phase === "computing" && (
          <section aria-label="Computing" aria-busy="true" className="anim-fade-up rounded-xl border border-primary/30 bg-card p-6">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-primary" aria-hidden />
              Running confidential computation
              <span className="rounded-full border border-destructive/40 px-2 py-0.5 font-mono text-[10px] uppercase text-destructive">
                simulated
              </span>
            </p>
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-secondary" aria-hidden>
              <div className="anim-shimmer h-full w-full rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
            <ol className="mt-4 space-y-2">
              {STAGES.map((s, i) => (
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
                  {i === stage && (
                    <LoaderCircle
                      className="h-3 w-3 animate-spin text-primary motion-reduce:animate-none"
                      aria-hidden
                    />
                  )}
                  {i === stage && <span className="sr-only">in progress</span>}
                </li>
              ))}
            </ol>
          </section>
        )}

        {phase === "done" && netted && (
          <MarginHero
            result={netted}
            siloedCombined={siloed.siloedCombined}
            onReset={reset}
          />
        )}

        <section aria-label="Position books" className="grid gap-6 lg:grid-cols-2">
          <BookColumn
            title={`Party A — ${bookA.label}`}
            wallet={bookA.wallet}
            legs={bookA.legs}
            hidden={false}
          />
          <BookColumn
            title={`Party B — ${bookB.label}`}
            wallet={bookB.wallet}
            legs={bookB.legs}
            hidden={false}
          />
        </section>

        {phase === "done" && (
          <section aria-label="Next step" className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm transition-colors duration-100 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              New session
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </section>
        )}
      </div>
    </PageShell>
  );
}
