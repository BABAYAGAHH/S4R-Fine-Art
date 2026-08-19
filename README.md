# S4R Fine Art

Premium fine-art commerce frontend foundation.

## Current batch

**Batch A: Foundation + Design System — IMPLEMENTED**

## Stack

Next.js App Router, TypeScript (strict), Tailwind CSS, ESLint, and pnpm.

## Local setup

```bash
pnpm install
pnpm dev
```

Useful commands: `pnpm lint`, `pnpm typecheck`, and `pnpm build`.

## Directory overview

- `app/` — routes and global layout
- `components/` — reusable layout, artwork, home, and UI components
- `data/` — typed launch artwork seed data
- `types/` — commerce domain contracts
- `public/artwork/` — development-only visual placeholders, never paid download masters

## Design direction

The interface is a quiet digital gallery: obsidian surfaces, warm off-white typography, an editorial serif paired with a restrained sans-serif, and gold used only as an accent.

## Current limitations

Not yet implemented:

- persistent database
- cart
- checkout
- payments
- secure downloads
- POD fulfillment
- transactional email
- production deployment hardening

## Future batch sequence

Batch B should introduce the cart and persistence architecture only after commercial pricing, inventory/edition rules, payment-provider selection, and digital-asset security requirements are approved.
