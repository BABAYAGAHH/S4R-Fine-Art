import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = { title: "Artist & Vision", description: "The developing artistic vision behind S4R Fine Art." };

const placeholder = "Text to be supplied by S4R Fine Art.";

export default function ArtistPage() {
  return <><Section className="border-b border-[var(--color-line)] pb-16 pt-16 sm:pb-24 sm:pt-24"><Container><Eyebrow>Artist & vision</Eyebrow><h1 className="mt-5 max-w-5xl font-serif text-5xl leading-[0.9] tracking-[-0.045em] sm:text-7xl">A practice shaped by attention.</h1><p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">Artist statement to be supplied by S4R Fine Art.</p></Container></Section><Section><Container className="grid gap-16 lg:grid-cols-[.75fr_1.25fr] lg:gap-24"><Eyebrow>Statement</Eyebrow><p className="font-serif text-3xl leading-[1.14] text-[var(--color-ink)] sm:text-4xl">{placeholder}</p></Container></Section><Section className="border-y border-[var(--color-line)] bg-[var(--color-surface)]"><Container className="grid gap-16 lg:grid-cols-2 lg:gap-24"><SectionHeading eyebrow="Vision" title="An evolving body of work">{placeholder}</SectionHeading><SectionHeading eyebrow="Creative philosophy" title="Meaning held in material and form">{placeholder}</SectionHeading></Container></Section><Section><Container className="grid gap-16 lg:grid-cols-[.75fr_1.25fr] lg:gap-24"><Eyebrow>Process</Eyebrow><p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">{placeholder}</p></Container></Section></>;
}
