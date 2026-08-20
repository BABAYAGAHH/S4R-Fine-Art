import type { AvailabilityStatus, PricingStatus } from "@/types/commerce";

/** Shape projected by a future server-side Supabase catalog repository. */
export interface PersistedArtworkMedia {
  id: string;
  mediaType: "HERO" | "GALLERY" | "THUMBNAIL" | "VIDEO";
  storagePath: string;
  altText: string;
  sortOrder: number;
  width: number | null;
  height: number | null;
  isPublic: boolean;
}

export interface PersistedArtworkVariant {
  id: string;
  variantType: "DIGITAL" | "PHYSICAL";
  name: string;
  commercialConfigurationId: string;
  currency: "USD";
  priceMinor: number;
  pricingStatus: PricingStatus;
  availability: AvailabilityStatus;
  isCatalogVisible: boolean;
  isPurchasable: boolean;
  fulfillmentType: "DIGITAL" | "PHYSICAL";
  fulfillmentRequirement: "DIGITAL_DELIVERY" | "POD_FULFILLMENT";
  quantityPolicy: "SINGLE" | "MULTIPLE";
  physicalConfiguration?: { sizeLabel: string | null; width: number | null; height: number | null; dimensionUnit: "in" | "cm" | null; };
  /** Public catalog reads never require a provider mapping. */
  podMapping?: { provider: "PRINTIFY" | "GELATO"; providerProductId: string | null; providerVariantId: string | null; isActive: boolean; };
}

export interface PersistedArtwork {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  story: string | null;
  publicationStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isActive: boolean;
  isCatalogVisible: boolean;
  isFeatured: boolean;
  collection: { id: string; name: string; slug: string; description: string | null };
  media: PersistedArtworkMedia[];
  variants: PersistedArtworkVariant[];
}
