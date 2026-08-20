import type { Money } from "../types/commerce";

export const zeroMoney = (currency: Money["currency"] = "USD"): Money => ({ amountMinor: 0, currency });

export function addMoney(left: Money, right: Money): Money {
  if (left.currency !== right.currency) throw new Error("Cannot add money with different currencies.");
  return { amountMinor: left.amountMinor + right.amountMinor, currency: left.currency };
}

export function multiplyMoney(money: Money, quantity: number): Money {
  if (!Number.isInteger(quantity) || quantity < 0) throw new Error("Quantity must be a non-negative integer.");
  return { amountMinor: money.amountMinor * quantity, currency: money.currency };
}