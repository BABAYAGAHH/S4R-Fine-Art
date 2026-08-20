import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { VariantPurchase } from "@/components/cart/variant-purchase";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { catalog } from "@/lib/catalog";
import type { ArtworkVariant } from "@/types/commerce";

type ArtworkPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return catalog.listArtworks().map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: ArtworkPageProps): Promise<Metadata> { const artwork = catalog.getArtworkBySlug((await params).slug); return artwork ? { title: artwork.title, description: artwork.shortDescription, openGraph: { images: [{ url: artwork.heroImage.src, alt: artwork.heroImage.alt }] } } : {}; }

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const artwork = catalog.getArtworkBySlug((await params).slug);
  if (!artwork) return notFound();
  const variants = [artwork.digitalVariant, ...artwork.physicalVariants].filter((variant): variant is ArtworkVariant => Boolean(variant));
  return <><Section className="pt-10 sm:pt-16"><Container><div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.7fr)] lg:gap-20"><div className="border border-[var(--color-line)] bg-[var(--color-surface)] p-3"><Image src={artwork.heroImage.src} alt={artwork.heroImage.alt} width={artwork.heroImage.width} height={artwork.heroImage.height} priority className="h-auto w-full" /></div><div className="lg:pt-10"><Eyebrow>{artwork.collection.name}</Eyebrow><h1 className="mt-5 font-serif text-5xl leading-[0.9] tracking-[-0.045em] sm:text-6xl">{artwork.title}</h1><p className="mt-7 text-lg leading-8 text-[var(--color-muted)]">{artwork.shortDescription}</p><VariantPurchase artworkId={artwork.id} variants={variants} /></div></div></Container></Section><Section className="border-y border-[var(--color-line)] bg-[var(--color-surface)]"><Container className="grid gap-10 lg:grid-cols-[.65fr_1.35fr] lg:gap-24"><Eyebrow>Artwork statement</Eyebrow><p className="max-w-3xl font-serif text-3xl leading-[1.15] text-[var(--color-ink)] sm:text-4xl">{artwork.story}</p></Container></Section><Section><Container><Eyebrow>Artwork view</Eyebrow><div className="mt-7 grid gap-5 sm:grid-cols-2">{artwork.galleryImages.map((image) => <div key={image.src} className="border border-[var(--color-line)] bg-[var(--color-surface)] p-3"><Image src={image.src} alt={image.alt} width={image.width} height={image.height} className="h-auto w-full" /></div>)}</div></Container></Section></>;
}