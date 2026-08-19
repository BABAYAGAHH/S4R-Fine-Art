import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button className={cn("inline-flex min-h-11 items-center justify-center border border-[var(--color-gold)] px-5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-ink)] transition hover:bg-[var(--color-gold)] hover:text-[var(--color-obsidian)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] disabled:cursor-not-allowed disabled:border-[var(--color-line)] disabled:text-[var(--color-muted)] disabled:hover:bg-transparent", className)} {...props}>{children}</button>;
}
