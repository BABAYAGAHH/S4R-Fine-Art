import { seedCatalogRepository } from "./seed-repository";

/** Current development-only implementation; future Supabase reads stay server-side. */
export const catalog = seedCatalogRepository;
export type { CatalogRepository } from "./repository";
