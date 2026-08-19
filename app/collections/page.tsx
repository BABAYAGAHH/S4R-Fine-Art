import type { Metadata } from "next";
import { ArtworkGrid } from "@/components/artwork/artwork-grid";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { artworks, launchCollection } from "@/data/artworks";

export const metadata: Metadata = { title: "Collections", description: "Explore the launch collection from S4R Fine Art." };

export default function CollectionsPage() {
  return <><Section className="border-b border-[var(--color-line)] pb-14 pt-16 sm:pt-24"><Container><Eyebrow>Collection 01</Eyebrow><h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.9] tracking-[-0.045em] sm:text-7xl">{launchCollection.name}</h1><p className="mt-7 max-w-xl text-base leading-8 text-[var(--color-muted)]">{launchCollection.description} Browse each work and its forthcoming edition formats.</p></Container></Section><Section><Container><ArtworkGrid artworks={artworks} /></Container></Section></>;
}
