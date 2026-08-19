import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function NotFound() {
  return <Section className="flex min-h-[60vh] items-center"><Container><p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-gold)]">404 · Not found</p><h1 className="mt-5 font-serif text-5xl leading-[0.9] tracking-[-0.045em] sm:text-7xl">This work is not in the gallery.</h1><Link href="/collections" className="action-link">Return to collection <span>↗</span></Link></Container></Section>;
}
