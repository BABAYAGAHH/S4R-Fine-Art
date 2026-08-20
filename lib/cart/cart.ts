import type { CartFulfillmentClassification, CartLine, CartSelection, CartState } from "../../types/cart";
import type { Artwork, ArtworkVariant, Money } from "../../types/commerce";
import { addMoney, multiplyMoney, zeroMoney } from "../money.ts";

export interface CatalogLookup {
  getVariant(artworkId: string, variantId: string): { artwork: Artwork; variant: ArtworkVariant } | undefined;
}

export interface ResolvedCartLine { line: CartLine; artwork: Artwork; variant: ArtworkVariant; }

export const emptyCart = (): CartState => ({ lines: [], hydrated: false });
const lineKey = (line: Pick<CartLine, "artworkId" | "variantId" | "commercialConfigurationId">): string => `${line.artworkId}:${line.variantId}:${line.commercialConfigurationId}`;

const isPurchasable = (variant: ArtworkVariant): boolean => variant.purchaseAvailability === "PURCHASABLE" && variant.availability === "AVAILABLE";

function createLine(catalog: CatalogLookup, selection: CartSelection): CartLine | undefined {
  const resolved = catalog.getVariant(selection.artworkId, selection.variantId);
  if (!resolved || !isPurchasable(resolved.variant)) return undefined;
  if (resolved.variant.commercialConfigurationId !== selection.commercialConfigurationId) return undefined;
  return {
    artworkId: resolved.artwork.id,
    artworkSlug: resolved.artwork.slug,
    variantId: resolved.variant.id,
    variantType: resolved.variant.fulfillmentType,
    fulfillmentRequirement: resolved.variant.fulfillmentRequirement,
    commercialConfigurationId: resolved.variant.commercialConfigurationId,
    quantity: 1,
  };
}

export function addToCart(state: CartState, catalog: CatalogLookup, selection: CartSelection): CartState {
  const nextLine = createLine(catalog, selection);
  if (!nextLine) return state;
  const existingIndex = state.lines.findIndex((line) => lineKey(line) === lineKey(nextLine));
  if (existingIndex < 0) return { ...state, lines: [...state.lines, nextLine] };
  if (nextLine.variantType === "DIGITAL") return state;
  return { ...state, lines: state.lines.map((line, index) => index === existingIndex ? { ...line, quantity: line.quantity + 1 } : line) };
}

export function removeFromCart(state: CartState, line: Pick<CartLine, "artworkId" | "variantId" | "commercialConfigurationId">): CartState {
  const key = lineKey(line);
  return { ...state, lines: state.lines.filter((candidate) => lineKey(candidate) !== key) };
}

export function updatePhysicalQuantity(state: CartState, catalog: CatalogLookup, line: Pick<CartLine, "artworkId" | "variantId" | "commercialConfigurationId">, quantity: number): CartState {
  if (!Number.isInteger(quantity) || quantity < 1) return state;
  const key = lineKey(line);
  const resolved = catalog.getVariant(line.artworkId, line.variantId);
  if (!resolved || resolved.variant.fulfillmentType !== "PHYSICAL" || !isPurchasable(resolved.variant) || resolved.variant.commercialConfigurationId !== line.commercialConfigurationId) return state;
  return { ...state, lines: state.lines.map((candidate) => lineKey(candidate) === key ? { ...candidate, quantity } : candidate) };
}

export const clearCart = (state: CartState): CartState => ({ ...state, lines: [] });
export const getItemCount = (state: CartState): number => state.lines.reduce((count, line) => count + line.quantity, 0);

export function getResolvedCartLines(state: CartState, catalog: CatalogLookup): ResolvedCartLine[] {
  return state.lines.flatMap((line) => {
    const resolved = catalog.getVariant(line.artworkId, line.variantId);
    if (!resolved || resolved.variant.commercialConfigurationId !== line.commercialConfigurationId) return [];
    return [{ line, ...resolved }];
  });
}

export function getSubtotal(state: CartState, catalog: CatalogLookup): Money {
  return getResolvedCartLines(state, catalog).reduce((subtotal, { line, variant }) => addMoney(subtotal, multiplyMoney(variant.price, line.quantity)), zeroMoney());
}

export function getFulfillmentClassification(state: CartState): CartFulfillmentClassification {
  const requirements = new Set(state.lines.map((line) => line.fulfillmentRequirement));
  if (requirements.size === 0) return "EMPTY";
  if (requirements.size > 1) return "MIXED";
  return requirements.has("DIGITAL_DELIVERY") ? "DIGITAL_ONLY" : "PHYSICAL_ONLY";
}

export function revalidateCart(state: CartState, catalog: CatalogLookup): CartState {
  return state.lines.reduce<CartState>((valid, candidate) => {
    const resolved = catalog.getVariant(candidate.artworkId, candidate.variantId);
    if (!resolved || !isPurchasable(resolved.variant) || resolved.variant.commercialConfigurationId !== candidate.commercialConfigurationId) return valid;
    const selection: CartSelection = { artworkId: candidate.artworkId, variantId: candidate.variantId, commercialConfigurationId: candidate.commercialConfigurationId };
    let next = addToCart(valid, catalog, selection);
    if (resolved.variant.fulfillmentType === "PHYSICAL" && Number.isInteger(candidate.quantity) && candidate.quantity > 1) next = updatePhysicalQuantity(next, catalog, selection, candidate.quantity);
    return next;
  }, { ...emptyCart(), hydrated: state.hydrated });
}