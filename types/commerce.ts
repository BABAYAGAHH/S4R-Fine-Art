/** Stable commercial concepts. These contracts are provider-agnostic by design. */
export type FulfillmentType = "DIGITAL" | "PHYSICAL";
export type FulfillmentRequirement = "DIGITAL_DELIVERY" | "POD_FULFILLMENT";
export type AvailabilityStatus = "AVAILABLE" | "COMING_SOON" | "SOLD_OUT";
export type PurchaseAvailability = "PURCHASABLE" | "UNAVAILABLE";
export type CatalogVisibility = "VISIBLE" | "HIDDEN";
export type PricingStatus = "DEVELOPMENT_PLACEHOLDER" | "APPROVED";
export type QuantityPolicy = "SINGLE" | "MULTIPLE";

export interface Money {
  /** Integer ISO-4217 minor units only. Never use floating point arithmetic for commercial calculations. */
  amountMinor: number;
  currency: "USD";
}

export interface ArtworkImage { src: string; alt: string; width: number; height: number; }
export interface ArtworkCollection { id: string; name: string; slug: string; description?: string; }

interface VariantBase {
  id: string;
  name: string;
  price: Money;
  availability: AvailabilityStatus;
  purchaseAvailability: PurchaseAvailability;
  /** A stable machine identity for the purchasable configuration, independent of its display label. */
  commercialConfigurationId: string;
  quantityPolicy: QuantityPolicy;
}

export interface DigitalEntitlementPolicy { expiresAfterHours?: number; maximumDownloads?: number; }

export interface DigitalVariant extends VariantBase {
  fulfillmentType: "DIGITAL";
  fulfillmentRequirement: "DIGITAL_DELIVERY";
  /** Future internal protected-asset identifier; it is never a public or signed download URL. */
  protectedAssetReference?: string;
  entitlementPolicy?: DigitalEntitlementPolicy;
}

export interface PodProviderMapping { provider?: "PRINTIFY" | "GELATO"; providerProductId?: string; providerVariantId?: string; }

export interface PhysicalVariant extends VariantBase {
  fulfillmentType: "PHYSICAL";
  fulfillmentRequirement: "POD_FULFILLMENT";
  size: string;
  width?: number;
  height?: number;
  unit?: "in" | "cm";
  podMapping?: PodProviderMapping;
}

export type ArtworkVariant = DigitalVariant | PhysicalVariant;

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  story?: string;
  collection: ArtworkCollection;
  catalogVisibility: CatalogVisibility;
  pricingStatus: PricingStatus;
  heroImage: ArtworkImage;
  galleryImages: ArtworkImage[];
  digitalVariant?: DigitalVariant;
  physicalVariants: PhysicalVariant[];
  featured: boolean;
}