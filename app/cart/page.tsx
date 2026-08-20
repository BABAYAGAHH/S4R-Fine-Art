import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";

export const metadata: Metadata = { title: "Cart", description: "Review selected S4R Fine Art editions." };
export default function Page() { return <CartPage />; }