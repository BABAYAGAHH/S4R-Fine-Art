"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links = [{ href: "/collections", label: "Collections" }, { href: "/artist", label: "Artist & Vision" }];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); buttonRef.current?.focus(); } };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  return <div className="md:hidden"><button ref={buttonRef} type="button" className="min-h-11 px-1 text-xs uppercase tracking-[0.16em] text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((current) => !current)}>{open ? "Close" : "Menu"}</button>{open ? <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute inset-x-0 top-full border-y border-[var(--color-line)] bg-[var(--color-obsidian)] px-5 py-6 shadow-2xl"><ul className="space-y-5">{links.map((link) => <li key={link.href}><Link href={link.href} onClick={() => setOpen(false)} className="block font-serif text-3xl text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]">{link.label}</Link></li>)}<li><span aria-label="Cart is not available yet" className="block pt-2 text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">Cart · coming later</span></li></ul></nav> : null}</div>;
}
