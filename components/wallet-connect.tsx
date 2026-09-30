"use client";

import { useEffect, useState } from "react";
import { LogOut, Wallet } from "lucide-react";

interface SolanaProvider {
  publicKey?: { toString(): string } | null;
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<void | { publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
}

declare global {
  interface Window {
    phantom?: { solana?: SolanaProvider };
    solflare?: SolanaProvider;
    solana?: SolanaProvider;
  }
}

function getProvider(): SolanaProvider | null {
  if (typeof window === "undefined") return null;
  return window.phantom?.solana ?? window.solflare ?? window.solana ?? null;
}

function short(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function WalletConnect({
  variant = "header",
  label = "Connect wallet",
  onConnect,
  onDisconnect,
}: {
  variant?: "header" | "block";
  label?: string;
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const p = getProvider();
    if (!p) return;
    p.connect({ onlyIfTrusted: true })
      .then((res) => {
        const pk = res?.publicKey?.toString() ?? p.publicKey?.toString() ?? null;
        if (pk) {
          setAddress(pk);
          onConnect?.(pk);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleConnect() {
    const provider = getProvider();
    if (!provider) {
      window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
      return;
    }
    setConnecting(true);
    try {
      const res = await provider.connect();
      const pk = res?.publicKey?.toString() ?? provider.publicKey?.toString() ?? null;
      if (pk) {
        setAddress(pk);
        onConnect?.(pk);
      }
    } catch {
      /* user rejected — return to idle quietly */
    } finally {
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    try {
      await getProvider()?.disconnect();
    } catch {
      /* ignore */
    }
    setAddress(null);
    onDisconnect?.();
  }

  if (address) {
    const connected = (
      <>
        <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
        <span className="font-mono text-xs tabular-nums" title={address}>
          {short(address)}
        </span>
        <button
          type="button"
          onClick={handleDisconnect}
          className="relative inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors duration-100 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring after:absolute after:-inset-2"
          aria-label="Disconnect wallet"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden />
        </button>
      </>
    );

    return variant === "header" ? (
      <span className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3">
        {connected}
      </span>
    ) : (
      <span className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4">
        {connected}
      </span>
    );
  }

  if (variant === "header") {
    return (
      <button
        type="button"
        onClick={handleConnect}
        disabled={connecting}
        aria-busy={connecting}
        className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-2.5 text-sm transition-colors duration-100 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none sm:px-4"
      >
        <Wallet className="h-4 w-4" aria-hidden />
        <span className={connecting ? "" : "hidden sm:inline"}>
          {connecting ? "Connecting…" : "Connect"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleConnect}
      disabled={connecting}
      aria-busy={connecting}
      className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm transition-colors duration-100 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
    >
      <Wallet className="h-4 w-4" aria-hidden />
      {connecting ? "Connecting…" : label}
    </button>
  );
}
