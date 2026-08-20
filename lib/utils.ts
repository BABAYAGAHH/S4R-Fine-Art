import type { Money } from "@/types/commerce";

const MINOR_UNITS_BY_CURRENCY: Record<Money["currency"], number> = { USD: 2 };

export function formatMoney({ amountMinor, currency }: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: MINOR_UNITS_BY_CURRENCY[currency],
    maximumFractionDigits: MINOR_UNITS_BY_CURRENCY[currency],
  }).format(amountMinor / 10 ** MINOR_UNITS_BY_CURRENCY[currency]);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}