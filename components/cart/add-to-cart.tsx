"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import type { ArtworkVariant } from "@/types/commerce";

export function AddToCart({ artworkId, variant }: { artworkId: string; variant: ArtworkVariant }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const purchasable = variant.purchaseAvailability === "PURCHASABLE";
  const add = () => { addItem({ artworkId, variantId: variant.id, commercialConfigurationId: variant.commercialConfigurationId }); setAdded(true); };
  return <Button type="button" disabled={!purchasable} onClick={add} className="w-full">{purchasable ? added ? "Added to cart" : "Add to cart" : "Edition unavailable"}</Button>;
}
