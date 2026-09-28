import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function PageShell({
  children,
  chain,
}: {
  children: ReactNode;
  chain?: "solana" | "monad";
}) {
  return (
    <>
      <SiteHeader chain={chain} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 md:px-6 md:py-14 lg:px-8">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
