import Link from "next/link";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return <footer className="border-t border-[var(--color-line)] py-10"><Container className="flex flex-col justify-between gap-6 text-xs uppercase tracking-[0.14em] text-[var(--color-muted)] sm:flex-row sm:items-center"><p>© {new Date().getFullYear()} S4R Fine Art</p><div className="flex gap-6"><Link href="/collections" className="footer-link">Collection</Link><Link href="/artist" className="footer-link">Artist & Vision</Link></div><p>Private gallery · Digital & canvas editions</p></Container></footer>;
}
