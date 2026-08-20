# S4R Fine Art

Premium fine-art commerce frontend foundation.

## Current batch

**Batch B: Commerce Contract + Cart State Foundation — IMPLEMENTED**

## Stack

Next.js App Router, TypeScript (strict), Tailwind CSS, ESLint, pnpm, and Node’s built-in test runner.

## Local setup

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Useful commands: `pnpm test`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`.

## Directory overview

- `app/` — routes and global layout
- `components/` — reusable layout, artwork, cart, and UI components
- `data/` — typed development seed catalog
- `lib/catalog/` — the sole application boundary for catalog access
- `lib/cart/` — deterministic cart operations and versioned persistence
- `types/` — commerce and cart contracts
- `public/artwork/` — development-only visual placeholders, never paid download masters

## Design direction

The interface is a quiet digital gallery: obsidian surfaces, warm off-white typography, an editorial serif paired with a restrained sans-serif, and gold used only as an accent.

## Batch B commerce boundary

Cart lines represent purchase variants, identified by artwork ID, variant ID, configuration ID, fulfillment requirement, and quantity. Money uses integer USD minor units and is formatted only at the display boundary. Digital editions are fixed at one entitlement per equivalent configuration; physical editions may have quantity one or greater.

Cart selections persist locally as versioned browser data (`s4r-fine-art-cart`, version 1). They contain stable selection identifiers only, not catalog snapshots, payment data, secrets, or protected artwork paths. Hydration restores localStorage only in a client effect; the reducer atomically revalidates persisted selections and marks hydration complete before any persistence write can occur.

Future checkout must revalidate variant existence, purchasability, currency, current minor-unit price, physical configuration, and POD mapping/availability before payment. Browser cart state and subtotal are never commercial truth.

Seed prices are development placeholders in USD minor units and are not approved production prices. **Production pricing is blocked pending client approval.**

## Current limitations

Not yet implemented:

- persistent database, database schema, migrations, RLS, Storage, or Auth
- checkout, payments, or order creation
- protected downloads or signed URLs
- POD provider API integration or fulfillment submission
- transactional email
- production deployment hardening

## Recommended next phase

Batch C should introduce production persistence and server-side checkout revalidation only after final pricing, inventory/edition rules, payment-provider selection, protected-download policy, and POD commercial mappings are approved.