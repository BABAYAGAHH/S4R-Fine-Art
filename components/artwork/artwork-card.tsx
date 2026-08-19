import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/types/commerce";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return <article className="group"><Link href={`/artwork/${artwork.slug}`} className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"><div className="overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface)]"><Image src={artwork.heroImage.src} alt={artwork.heroImage.alt} width={artwork.heroImage.width} height={artwork.heroImage.height} className="h-auto w-full transition duration-500 motion-reduce:transition-none group-hover:scale-[1.015]" /></div><div className="flex items-start justify-between gap-4 pt-5"><div><h3 className="font-serif text-2xl leading-none text-[var(--color-ink)]">{artwork.title}</h3><p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">{artwork.collection.name}</p></div><span aria-hidden="true" className="mt-1 text-[var(--color-gold)] transition-transform group-hover:translate-x-1">↗</span></div></Link></article>;
}
