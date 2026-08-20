import type { CartLine, CartState } from "../../types/cart";
import { emptyCart } from "./cart.ts";

export const CART_STORAGE_KEY = "s4r-fine-art-cart";
export const CART_STORAGE_VERSION = 1;

interface PersistedCart { version: number; lines: CartLine[]; }

const isCartLine = (value: unknown): value is CartLine => {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;
  return typeof line.artworkId === "string" && typeof line.artworkSlug === "string" && typeof line.variantId === "string" && (line.variantType === "DIGITAL" || line.variantType === "PHYSICAL") && (line.fulfillmentRequirement === "DIGITAL_DELIVERY" || line.fulfillmentRequirement === "POD_FULFILLMENT") && typeof line.commercialConfigurationId === "string" && Number.isInteger(line.quantity) && (line.quantity as number) > 0;
};

export function serializeCart(state: CartState): string {
  const payload: PersistedCart = { version: CART_STORAGE_VERSION, lines: state.lines };
  return JSON.stringify(payload);
}

export function parsePersistedCart(raw: string | null): CartState {
  if (!raw) return emptyCart();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyCart();
    const payload = parsed as Record<string, unknown>;
    if (payload.version !== CART_STORAGE_VERSION || !Array.isArray(payload.lines) || !payload.lines.every(isCartLine)) return emptyCart();
    return { lines: payload.lines, hydrated: false };
  } catch {
    return emptyCart();
  }
}