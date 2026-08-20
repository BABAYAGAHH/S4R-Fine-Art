"use client";

import { useState } from "react";
import { AddToCart } from "@/components/cart/add-to-cart";
import { formatMoney } from "@/lib/utils";
import type { ArtworkVariant } from "@/types/commerce";

export function VariantPurchase({ artworkId, variants }: { artworkId: string; variants: ArtworkVariant[] }) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");
  const selected = variants.find((variant) => variant.id === selectedId);
  if (!selected) return null;
  return <div className="mt-10 border-y border-[var(--color-line)] py-6"><p className="text-xs font-medium uppercase tracking-[0.17em] text-[var(--color-gold)]">Select an edition</p><div className="mt-5 space-y-3" role="radiogroup" aria-label="Available editions">{variants.map((variant) => <label key={variant.id} className="flex cursor-pointer items-start justify-between gap-4 border border-[var(--color-line)] p-4 has-[:checked]:border-[var(--color-gold)]"><span className="flex gap-3"><input type="radio" name="edition" value={variant.id} checked={selected.id === variant.id} onChange={() => setSelectedId(variant.id)} className="mt-1 accent-[var(--color-gold)]" /><span><span className="block text-sm text-[var(--color-ink)]">{variant.name}{variant.fulfillmentType === "PHYSICAL" ? ` · ${variant.size}` : ""}</span><span className="mt-1 block text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">{variant.fulfillmentRequirement === "DIGITAL_DELIVERY" ? "Digital delivery" : "Canvas fulfillment"}{variant.purchaseAvailability === "UNAVAILABLE" ? " · unavailable" : ""}</span></span></span><span className="text-sm text-[var(--color-ink)]">{formatMoney(variant.price)}</span></label>)}</div><div className="mt-6"><AddToCart artworkId={artworkId} variant={selected} /></div><p className="mt-3 text-center text-xs leading-5 text-[var(--color-muted)]">Cart selections are local browser state. Pricing and availability must be revalidated before future payment.</p></div>;
}
