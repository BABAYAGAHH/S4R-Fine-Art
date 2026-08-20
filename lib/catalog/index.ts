import { artworks, launchCollection } from "@/data/artworks";
import type { Artwork, ArtworkVariant } from "@/types/commerce";

/** The only application boundary to the current seed catalog. Replace its data source in Batch C. */
export const catalog = {
  listArtworks: (): Artwork[] => artworks.filter((artwork) => artwork.catalogVisibility === "VISIBLE"),
  listFeaturedArtworks: (): Artwork[] => artworks.filter((artwork) => artwork.catalogVisibility === "VISIBLE" && artwork.featured),
  getArtworkBySlug: (slug: string): Artwork | undefined => artworks.find((artwork) => artwork.slug === slug && artwork.catalogVisibility === "VISIBLE"),
  getArtworkById: (id: string): Artwork | undefined => artworks.find((artwork) => artwork.id === id && artwork.catalogVisibility === "VISIBLE"),
  getVariant: (artworkId: string, variantId: string): { artwork: Artwork; variant: ArtworkVariant } | undefined => {
    const artwork = artworks.find((candidate) => candidate.id === artworkId && candidate.catalogVisibility === "VISIBLE");
    if (!artwork) return undefined;
    const variant = [artwork.digitalVariant, ...artwork.physicalVariants].find((candidate): candidate is ArtworkVariant => candidate !== undefined && candidate.id === variantId);
    return variant ? { artwork, variant } : undefined;
  },
  launchCollection,
};