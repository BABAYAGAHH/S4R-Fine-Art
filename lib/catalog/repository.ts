import type { Artwork, ArtworkCollection, ArtworkVariant } from "@/types/commerce";

/** Stable catalog surface used by pages and cart logic. */
export interface CatalogRepository {
  listArtworks(): Artwork[];
  listFeaturedArtworks(): Artwork[];
  getArtworkBySlug(slug: string): Artwork | undefined;
  getArtworkById(id: string): Artwork | undefined;
  getVariant(artworkId: string, variantId: string): { artwork: Artwork; variant: ArtworkVariant } | undefined;
  launchCollection: ArtworkCollection;
}
