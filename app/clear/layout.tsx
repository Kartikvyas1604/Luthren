import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clearing session — Obligor",
};

export default function ClearLayout({ children }: { children: React.ReactNode }) {
  return children;
}
