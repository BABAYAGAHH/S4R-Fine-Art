"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";

export function CartLink({ mobile = false }: { mobile?: boolean }) {
  const { itemCount, restored } = useCart();
  const label = restored ? `Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}` : "Cart";
  return <Link href="/cart" aria-label={label} className={mobile ? "block pt-2 text-xs uppercase tracking-[0.16em] text-[var(--color-ink)]" : "nav-link"}>Cart <span className="ml-1 text-[var(--color-gold)]">{restored ? itemCount : 0}</span></Link>;
}
