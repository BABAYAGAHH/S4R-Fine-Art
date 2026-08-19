import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--color-gold)]">{children}</p>;
}
