import type { BackendKind } from "@/lib/margin";

const LABELS: Record<BackendKind, { text: string; cls: string; note: string }> = {
  arcium: {
    text: "Arcium MPC",
    cls: "border-primary/40 text-primary",
    note: "Cryptographic MPC — no single operator sees either book",
  },
  enclave: {
    text: "TEE attested",
    cls: "border-steel/40 text-steel",
    note: "Hardware-attested enclave — same formula, different trust model than MPC",
  },
  simulated: {
    text: "Simulated",
    cls: "border-destructive/40 text-destructive",
    note: "SIMULATED — same formula, no MPC, no attestation",
  },
};

export function BackendBadge({ kind, showNote = false }: { kind: BackendKind; showNote?: boolean }) {
  const { text, cls, note } = LABELS[kind];
  return (
    <span className="inline-flex items-start gap-2">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs ${cls}`}
        title={note}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
        {text}
      </span>
      {showNote && (
        <span className="text-xs text-muted-foreground max-w-sm">{note}</span>
      )}
    </span>
  );
}
