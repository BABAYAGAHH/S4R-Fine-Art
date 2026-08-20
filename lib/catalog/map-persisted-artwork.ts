import type { Artwork, ArtworkImage, ArtworkVariant, DigitalVariant, PhysicalVariant } from "@/types/commerce";
import type { PersistedArtwork, PersistedArtworkMedia, PersistedArtworkVariant } from "./persistence-contract";

export type PublicMediaUrlResolver = (storagePath: string) => string;

const toImage = (media: PersistedArtworkMedia, resolvePublicMediaUrl: PublicMediaUrlResolver): ArtworkImage | undefined => {
  if (!media.isPublic || media.width === null || media.height === null) return undefined;
  return { src: resolvePublicMediaUrl(media.storagePath), alt: media.altText, width: media.width, height: media.height };
};

const toVariant = (row: PersistedArtworkVariant): ArtworkVariant | undefined => {
  if (!row.isCatalogVisible) return undefined;
  const base = { id: row.id, name: row.name, price: { amountMinor: row.priceMinor, currency: row.currency }, availability: row.availability, purchaseAvailability: row.isPurchasable ? "PURCHASABLE" as const : "UNAVAILABLE" as const, commercialConfigurationId: row.commercialConfigurationId, quantityPolicy: row.quantityPolicy };
  if (row.variantType === "DIGITAL" && row.fulfillmentType === "DIGITAL" && row.fulfillmentRequirement === "DIGITAL_DELIVERY" && row.quantityPolicy === "SINGLE") return { ...base, fulfillmentType: "DIGITAL", fulfillmentRequirement: "DIGITAL_DELIVERY" } satisfies DigitalVariant;
  const configuration = row.physicalConfiguration;
  if (!configuration?.sizeLabel || row.fulfillmentType !== "PHYSICAL" || row.fulfillmentRequirement !== "POD_FULFILLMENT" || row.quantityPolicy !== "MULTIPLE") return undefined;
  return { ...base, fulfillmentType: "PHYSICAL", fulfillmentRequirement: "POD_FULFILLMENT", size: configuration.sizeLabel, width: configuration.width ?? undefined, height: configuration.height ?? undefined, unit: configuration.dimensionUnit ?? undefined, podMapping: row.podMapping ? { provider: row.podMapping.provider, providerProductId: row.podMapping.providerProductId ?? undefined, providerVariantId: row.podMapping.providerVariantId ?? undefined } : undefined } satisfies PhysicalVariant;
};

/** Maps a public database projection to the existing client-safe commerce domain. */
export function mapPublishedArtwork(row: PersistedArtwork, resolvePublicMediaUrl: PublicMediaUrlResolver): Artwork | undefined {
  if (row.publicationStatus !== "PUBLISHED" || !row.isActive || !row.isCatalogVisible) return undefined;
  const media = [...row.media].sort((left, right) => left.sortOrder - right.sortOrder);
  const hero = media.filter((item) => item.mediaType === "HERO").map((item) => toImage(item, resolvePublicMediaUrl)).find((item): item is ArtworkImage => Boolean(item));
  if (!hero) return undefined;
  const variants = row.variants.map(toVariant).filter((variant): variant is ArtworkVariant => Boolean(variant));
  const digitalVariant = variants.find((variant): variant is DigitalVariant => variant.fulfillmentType === "DIGITAL");
  const physicalVariants = variants.filter((variant): variant is PhysicalVariant => variant.fulfillmentType === "PHYSICAL");
  return { id: row.id, slug: row.slug, title: row.title, shortDescription: row.shortDescription, story: row.story ?? undefined, collection: { id: row.collection.id, name: row.collection.name, slug: row.collection.slug, description: row.collection.description ?? undefined }, catalogVisibility: "VISIBLE", pricingStatus: row.variants.some((variant) => variant.pricingStatus === "DEVELOPMENT_PLACEHOLDER") ? "DEVELOPMENT_PLACEHOLDER" : "APPROVED", heroImage: hero, galleryImages: media.filter((item) => item.mediaType === "GALLERY").map((item) => toImage(item, resolvePublicMediaUrl)).filter((item): item is ArtworkImage => Boolean(item)), digitalVariant, physicalVariants, featured: row.isFeatured };
}
