import type { FulfillmentRequirement, FulfillmentType } from "@/types/commerce";

/** Persisted browser selection only. Catalog and commercial values are resolved at runtime. */
export interface CartLine {
  artworkId: string;
  artworkSlug: string;
  variantId: string;
  variantType: FulfillmentType;
  fulfillmentRequirement: FulfillmentRequirement;
  commercialConfigurationId: string;
  quantity: number;
}

/** `hydrated` is client-runtime state and is intentionally never persisted. */
export interface CartState { lines: CartLine[]; hydrated: boolean; }
export type CartFulfillmentClassification = "EMPTY" | "DIGITAL_ONLY" | "PHYSICAL_ONLY" | "MIXED";
export interface CartSelection { artworkId: string; variantId: string; commercialConfigurationId: string; }