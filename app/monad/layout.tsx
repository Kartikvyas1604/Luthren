import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monad parallel clearing — Luthren",
};

export default function MonadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
