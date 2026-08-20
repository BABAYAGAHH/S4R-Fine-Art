import Link from "next/link";
import { CartLink } from "@/components/cart/cart-link";
import { Container } from "@/components/ui/container";
import { MobileNav } from "@/components/layout/mobile-nav";

export function SiteHeader() {
  return <header className="sticky top-0 z-20 border-b border-[var(--color-line)] bg-[color:rgb(15_16_16_/_0.94)] backdrop-blur"><Container className="relative flex min-h-18 items-center justify-between gap-6"><Link href="/" className="font-serif text-xl tracking-[0.1em] text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]">S4R <span className="font-sans text-[0.6em] tracking-[0.2em]">FINE ART</span></Link><nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex"><Link href="/collections" className="nav-link">Collections</Link><Link href="/artist" className="nav-link">Artist & Vision</Link></nav><div className="hidden md:block"><CartLink /></div><MobileNav /></Container></header>;
}