import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";

export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return <div className="max-w-2xl">{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}<h2 className="mt-4 font-serif text-4xl leading-[0.98] tracking-[-0.035em] text-[var(--color-ink)] sm:text-5xl">{title}</h2>{children ? <div className="mt-6 text-base leading-7 text-[var(--color-muted)]">{children}</div> : null}</div>;
}
