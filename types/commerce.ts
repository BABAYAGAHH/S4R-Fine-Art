export type FulfillmentType = "DIGITAL" | "PHYSICAL";
export type AvailabilityStatus = "AVAILABLE" | "COMING_SOON" | "SOLD_OUT";

export interface Money { amount: number; currency: "USD"; }
export interface ArtworkImage { src: string; alt: string; width: number; height: number; }
export interface ArtworkCollection { id: string; name: string; slug: string; description?: string; }
export interface DigitalVariant { id: string; fulfillmentType: "DIGITAL"; name: string; price: Money; availability: AvailabilityStatus; protectedAssetReference?: string; }
export interface PhysicalVariant { id: string; fulfillmentType: "PHYSICAL"; name: string; size: string; width?: number; height?: number; unit?: "in" | "cm"; price: Money; availability: AvailabilityStatus; fulfillmentProviderVariantId?: string; }
export type ArtworkVariant = DigitalVariant | PhysicalVariant;
export interface Artwork { id: string; slug: string; title: string; shortDescription: string; story?: string; collection: ArtworkCollection; heroImage: ArtworkImage; galleryImages: ArtworkImage[]; digitalVariant?: DigitalVariant; physicalVariants: PhysicalVariant[]; featured: boolean; }
