"use client";

import { useEffect, useState } from "react";
import { TerminalSquare } from "lucide-react";
import { PageShell } from "@/components/page-shell";

type Line = { text: string; cls?: string };

const AGENT_A_LINES: Line[] = [
  { text: "$ pnpm demo:agent-a", cls: "text-foreground" },
  { text: "→ key: disposable agent key A (devnet, spend-cap 1 USDC)", cls: "text-muted-foreground" },
  { text: "→ POST http://localhost:4021/v1/net-margin", cls: "text-muted-foreground" },
  { text: "← 402 PAYMENT-REQUIRED", cls: "text-destructive" },
  { text: "→ scheme exact · network solana:EtWT...qa1 · $0.01", cls: "text-muted-foreground" },
  { text: "→ paying 10_000 USDC base units", cls: "text-muted-foreground" },
  { text: "← 200 · nettedCombinedUsd 7,200.00 · trustModel cryptographic_mpc", cls: "text-primary" },
  { text: "← (legs omitted — aggregate summary only)", cls: "text-muted-foreground" },
];

const AGENT_B_LINES: Line[] = [
  { text: "$ pnpm demo:agent-b", cls: "text-foreground" },
  { text: "→ key: independent disposable key B", cls: "text-muted-foreground" },
  { text: "→ POST http://localhost:4021/v1/net-margin", cls: "text-muted-foreground" },
  { text: "← 402 PAYMENT-REQUIRED", cls: "text-destructive" },
  { text: "→ scheme exact · network solana:EtWT...qa1 · $0.01", cls: "text-muted-foreground" },
  { text: "→ paying 10_000 USDC base units", cls: "text-muted-foreground" },
  { text: "← 200 · savingsUsd 11,300.00 · backend arcium", cls: "text-primary" },
  { text: "← (legs omitted — aggregate summary only)", cls: "text-muted-foreground" },
];

function AgentTerminal({
  title,
  lines,
  running,
  onRun,
  disabled,
}: {
  title: string;
  lines: Line[];
  running: boolean;
  onRun: () => void;
  disabled: boolean;
}) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!running || visible >= lines.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 500);
    return () => clearTimeout(t);
  }, [running, visible, lines.length]);

  function run() {
    setVisible(0);
    onRun();
  }

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-[#0d0f13]">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-medium">
          <TerminalSquare className="h-4 w-4 text-primary" aria-hidden />
          {title}
        </h2>
        <button
          type="button"
          onClick={run}
          disabled={disabled}
          className="inline-flex h-10 items-center rounded-md border border-border px-3 text-xs transition-colors duration-100 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {running ? "Running…" : "Run agent"}
        </button>
      </header>
      <div className="min-h-[13rem] p-4 font-mono text-xs leading-6" aria-live="polite" aria-busy={running}>
        {visible === 0 && !running && (
          <p className="text-muted-foreground">
            Press Run agent to replay the x402 payment flow on devnet USDC.
          </p>
        )}
        {lines.slice(0, visible).map((l, i) => (
          <p key={i} className={l.cls}>
            {l.text}
          </p>
        ))}
      </div>
    </section>
  );
}

export default function AgentsPage() {
  const [aRunning, setARunning] = useState(false);
  const [bRunning, setBRunning] = useState(false);

  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Machine-payable clearing · x402 V2
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight md:text-4xl">
            Two independent agents, each pays its own way
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Party A and Party B each call the gated API with separate disposable keys. Unpaid
            calls get 402; a signed devnet USDC payment unlocks the combined net margin. This UI
            demo replays the recorded call flow — the wire script ships in the repo.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <AgentTerminal
            title="demo-agent-a"
            lines={AGENT_A_LINES}
            running={aRunning}
            onRun={() => setARunning(true)}
            disabled={aRunning}
          />
          <AgentTerminal
            title="demo-agent-b"
            lines={AGENT_B_LINES}
            running={bRunning}
            onRun={() => setBRunning(true)}
            disabled={bRunning}
          />
        </div>

        <p className="max-w-prose text-xs leading-relaxed text-muted-foreground">
          Monad x402 is enabled only if the facilitator /supported check passes at build time;
          otherwise payments stay Solana-only on this demo and the README says so. Per-call fee is
          a wedge, not venture math.
        </p>
      </div>
    </PageShell>
  );
}
