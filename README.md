# S4R Fine Art

Premium fine-art commerce frontend foundation.

## Current batch

**Batch C1: Supabase-ready production-data foundation — IMPLEMENTED LOCALLY**

## Stack

Next.js App Router, TypeScript (strict), Tailwind CSS, ESLint, pnpm, Node’s built-in test runner, and a project-local Supabase CLI configuration.

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
- `lib/catalog/` — sole catalog repository boundary and future row-to-domain mapper
- `lib/cart/` — deterministic cart operations and versioned persistence
- `supabase/migrations/` — canonical migration lineage
- `types/` — commerce and cart contracts
- `public/artwork/` — development-only visual placeholders, never paid download masters

## Batch B commerce boundary

Cart lines represent purchase variants, identified by artwork ID, variant ID, configuration ID, fulfillment requirement, and quantity. Money uses integer USD minor units and is formatted only at the display boundary. Digital editions are fixed at one entitlement per equivalent configuration; physical editions may have quantity one or greater.

Cart selections persist locally as versioned browser data (`s4r-fine-art-cart`, version 1). They contain stable selection identifiers only, not catalog snapshots, payment data, secrets, or protected artwork paths. Future checkout must revalidate variant existence, purchasability, currency, current minor-unit price, physical configuration, and POD mapping/availability before payment. Browser cart state and subtotal are never commercial truth.

## Batch C data boundary

`supabase/migrations/20260820074030_initial_data_foundation.sql` is the first canonical production-data migration. It defines catalog, media, physical configuration, provider-mapping, digital-policy, and minimal admin-profile contracts with RLS enabled and no browser write grants. The current catalog continues to use `seedCatalogRepository`; a future Supabase implementation must be server-side and map its public read projection through the typed mapper.

`supabase/seed.sql` and `data/artworks.ts` are **DEVELOPMENT ONLY** fixtures, not client-approved production data. C1 has created no remote project, bucket, credentials, catalog rows, or migrations on a live database. See `supabase/STORAGE.md` for the C2 storage design.

## Current limitations

Not yet implemented:

- remote Supabase project, migration apply, Storage buckets, or Auth configuration
- checkout, payments, or order creation
- protected downloads or signed URLs
- POD provider API integration or fulfillment submission
- transactional email
- production deployment hardening

## Required next inputs

- C2: approved Supabase project name, ref, organization, region, and secure connection details.
- C3: approved client catalog, pricing, configuration, media, and provider-mapping data.
