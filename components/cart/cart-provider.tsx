"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { addToCart, clearCart, emptyCart, getFulfillmentClassification, getItemCount, getResolvedCartLines, getSubtotal, removeFromCart, revalidateCart, updatePhysicalQuantity } from "@/lib/cart/cart";
import { CART_STORAGE_KEY, parsePersistedCart, serializeCart } from "@/lib/cart/persistence";
import { catalog } from "@/lib/catalog";
import type { CartFulfillmentClassification, CartLine, CartSelection, CartState } from "@/types/cart";
import type { Money } from "@/types/commerce";

interface CartContextValue {
  lines: ReturnType<typeof getResolvedCartLines>;
  itemCount: number;
  subtotal: Money;
  fulfillmentClassification: CartFulfillmentClassification;
  restored: boolean;
  addItem: (selection: CartSelection) => void;
  removeItem: (line: CartLine) => void;
  updateQuantity: (line: CartLine, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
type CartAction = { type: "restore"; state: CartState } | { type: "add"; selection: CartSelection } | { type: "remove"; line: CartLine } | { type: "quantity"; line: CartLine; quantity: number } | { type: "clear" };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "restore": return { ...revalidateCart(action.state, catalog), hydrated: true };
    case "add": return addToCart(state, catalog, action.selection);
    case "remove": return removeFromCart(state, action.line);
    case "quantity": return updatePhysicalQuantity(state, catalog, action.line, action.quantity);
    case "clear": return clearCart(state);
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, emptyCart);

  useEffect(() => {
    dispatch({ type: "restore", state: parsePersistedCart(window.localStorage.getItem(CART_STORAGE_KEY)) });
  }, []);
  useEffect(() => {
    if (state.hydrated) window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(state));
  }, [state]);

  const value = useMemo<CartContextValue>(() => ({
    lines: getResolvedCartLines(state, catalog),
    itemCount: getItemCount(state),
    subtotal: getSubtotal(state, catalog),
    fulfillmentClassification: getFulfillmentClassification(state),
    restored: state.hydrated,
    addItem: (selection) => dispatch({ type: "add", selection }),
    removeItem: (line) => dispatch({ type: "remove", line }),
    updateQuantity: (line, quantity) => dispatch({ type: "quantity", line, quantity }),
    clear: () => dispatch({ type: "clear" }),
  }), [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider.");
  return context;
}