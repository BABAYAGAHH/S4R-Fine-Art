import { artworks, launchCollection } from "@/data/artworks";
import type { Artwork, ArtworkVariant } from "@/types/commerce";
import type { CatalogRepository } from "./repository";

/** DEVELOPMENT ONLY — current UI fixture source, not production catalog data. */
export const seedCatalogRepository: CatalogRepository = {
  listArtworks: (): Artwork[] => artworks.filter((artwork) => artwork.catalogVisibility === "VISIBLE"),
  listFeaturedArtworks: (): Artwork[] => artworks.filter((artwork) => artwork.catalogVisibility === "VISIBLE" && artwork.featured),
  getArtworkBySlug: (slug: string): Artwork | undefined => artworks.find((artwork) => artwork.slug === slug && artwork.catalogVisibility === "VISIBLE"),
  getArtworkById: (id: string): Artwork | undefined => artworks.find((artwork) => artwork.id === id && artwork.catalogVisibility === "VISIBLE"),
  getVariant: (artworkId, variantId): { artwork: Artwork; variant: ArtworkVariant } | undefined => {
    const artwork = artworks.find((candidate) => candidate.id === artworkId && candidate.catalogVisibility === "VISIBLE");
    if (!artwork) return undefined;
    const variant = [artwork.digitalVariant, ...artwork.physicalVariants].find((candidate): candidate is ArtworkVariant => candidate !== undefined && candidate.id === variantId);
    return variant ? { artwork, variant } : undefined;
  },
  launchCollection,
};
