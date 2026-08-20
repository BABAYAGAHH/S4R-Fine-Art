-- S4R Fine Art C1: canonical production-data foundation.
-- This migration intentionally contains no client catalog fixtures, storage buckets,
-- payment, order, entitlement, or POD execution.

create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  biography text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint artists_slug_format check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references public.artists(id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint collections_slug_format check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete restrict,
  slug text not null unique,
  title text not null,
  short_description text not null,
  story text,
  publication_status text not null default 'DRAFT',
  is_active boolean not null default true,
  is_catalog_visible boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint artworks_slug_format check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint artworks_publication_status check (publication_status in ('DRAFT', 'PUBLISHED', 'ARCHIVED'))
);

create table if not exists public.artwork_variants (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks(id) on delete restrict,
  variant_type text not null,
  name text not null,
  commercial_configuration_id text not null,
  currency text not null default 'USD',
  price_minor bigint not null,
  pricing_status text not null default 'DEVELOPMENT_PLACEHOLDER',
  availability text not null default 'COMING_SOON',
  is_catalog_visible boolean not null default false,
  is_purchasable boolean not null default false,
  fulfillment_type text not null,
  fulfillment_requirement text not null,
  quantity_policy text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint artwork_variants_configuration_unique unique (artwork_id, commercial_configuration_id),
  constraint artwork_variants_type check (variant_type in ('DIGITAL', 'PHYSICAL')),
  constraint artwork_variants_currency check (currency = 'USD'),
  constraint artwork_variants_price_minor check (price_minor >= 0),
  constraint artwork_variants_pricing_status check (pricing_status in ('DEVELOPMENT_PLACEHOLDER', 'APPROVED')),
  constraint artwork_variants_availability check (availability in ('AVAILABLE', 'COMING_SOON', 'SOLD_OUT')),
  constraint artwork_variants_fulfillment_type check (fulfillment_type in ('DIGITAL', 'PHYSICAL')),
  constraint artwork_variants_fulfillment_requirement check (fulfillment_requirement in ('DIGITAL_DELIVERY', 'POD_FULFILLMENT')),
  constraint artwork_variants_quantity_policy check (quantity_policy in ('SINGLE', 'MULTIPLE')),
  constraint artwork_variants_contract check (
    (variant_type = 'DIGITAL' and fulfillment_type = 'DIGITAL' and fulfillment_requirement = 'DIGITAL_DELIVERY' and quantity_policy = 'SINGLE')
    or
    (variant_type = 'PHYSICAL' and fulfillment_type = 'PHYSICAL' and fulfillment_requirement = 'POD_FULFILLMENT' and quantity_policy = 'MULTIPLE')
  )
);

create table if not exists public.variant_physical_configurations (
  variant_id uuid primary key references public.artwork_variants(id) on delete restrict,
  size_label text,
  width numeric,
  height numeric,
  dimension_unit text,
  material text,
  finish text,
  frame_option text,
  production_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint physical_configurations_width check (width is null or width > 0),
  constraint physical_configurations_height check (height is null or height > 0),
  constraint physical_configurations_dimension_unit check (dimension_unit is null or dimension_unit in ('in', 'cm'))
);

create table if not exists public.pod_variant_mappings (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.artwork_variants(id) on delete restrict,
  provider text not null,
  provider_product_id text,
  provider_variant_id text,
  is_active boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint pod_variant_mappings_provider check (provider in ('PRINTIFY', 'GELATO')),
  constraint pod_variant_mappings_provider_unique unique (variant_id, provider)
);

create table if not exists public.digital_delivery_policies (
  variant_id uuid primary key references public.artwork_variants(id) on delete restrict,
  protected_asset_reference text,
  download_expiry_policy text,
  max_downloads integer,
  entitlement_template text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint digital_delivery_policies_expiry check (download_expiry_policy is null or download_expiry_policy in ('NONE', 'DURATION_AFTER_PURCHASE')),
  constraint digital_delivery_policies_max_downloads check (max_downloads is null or max_downloads > 0)
);

create table if not exists public.artwork_media (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks(id) on delete restrict,
  media_type text not null,
  storage_path text not null,
  alt_text text not null,
  sort_order integer not null default 0,
  width integer,
  height integer,
  is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  constraint artwork_media_type check (media_type in ('HERO', 'GALLERY', 'THUMBNAIL', 'VIDEO')),
  constraint artwork_media_storage_path check (storage_path !~* '^https?://'),
  constraint artwork_media_sort_order check (sort_order >= 0),
  constraint artwork_media_width check (width is null or width > 0),
  constraint artwork_media_height check (height is null or height > 0),
  constraint artwork_media_unique_position unique (artwork_id, media_type, sort_order)
);

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete restrict,
  role text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint admin_profiles_role check (role in ('ADMIN', 'SUPER_ADMIN'))
);

create index if not exists collections_artist_id_idx on public.collections(artist_id);
create index if not exists artworks_collection_id_idx on public.artworks(collection_id);
create index if not exists artworks_public_catalog_idx on public.artworks(publication_status, is_active, is_catalog_visible);
create index if not exists artwork_variants_artwork_id_idx on public.artwork_variants(artwork_id);
create index if not exists artwork_variants_public_catalog_idx on public.artwork_variants(artwork_id, is_catalog_visible, availability);
create index if not exists pod_variant_mappings_variant_id_idx on public.pod_variant_mappings(variant_id);
create index if not exists artwork_media_artwork_id_idx on public.artwork_media(artwork_id);
create index if not exists artwork_media_public_idx on public.artwork_media(artwork_id, is_public, sort_order);

drop trigger if exists set_artists_updated_at on public.artists;
create trigger set_artists_updated_at before update on public.artists for each row execute function private.set_updated_at();
drop trigger if exists set_collections_updated_at on public.collections;
create trigger set_collections_updated_at before update on public.collections for each row execute function private.set_updated_at();
drop trigger if exists set_artworks_updated_at on public.artworks;
create trigger set_artworks_updated_at before update on public.artworks for each row execute function private.set_updated_at();
drop trigger if exists set_artwork_variants_updated_at on public.artwork_variants;
create trigger set_artwork_variants_updated_at before update on public.artwork_variants for each row execute function private.set_updated_at();
drop trigger if exists set_variant_physical_configurations_updated_at on public.variant_physical_configurations;
create trigger set_variant_physical_configurations_updated_at before update on public.variant_physical_configurations for each row execute function private.set_updated_at();
drop trigger if exists set_pod_variant_mappings_updated_at on public.pod_variant_mappings;
create trigger set_pod_variant_mappings_updated_at before update on public.pod_variant_mappings for each row execute function private.set_updated_at();
drop trigger if exists set_digital_delivery_policies_updated_at on public.digital_delivery_policies;
create trigger set_digital_delivery_policies_updated_at before update on public.digital_delivery_policies for each row execute function private.set_updated_at();
drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;
create trigger set_admin_profiles_updated_at before update on public.admin_profiles for each row execute function private.set_updated_at();

alter table public.artists enable row level security;
alter table public.collections enable row level security;
alter table public.artworks enable row level security;
alter table public.artwork_variants enable row level security;
alter table public.variant_physical_configurations enable row level security;
alter table public.pod_variant_mappings enable row level security;
alter table public.digital_delivery_policies enable row level security;
alter table public.artwork_media enable row level security;
alter table public.admin_profiles enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.artists, public.collections, public.artworks, public.artwork_variants, public.variant_physical_configurations, public.artwork_media to anon, authenticated;

drop policy if exists public_read_artists on public.artists;
create policy public_read_artists on public.artists for select to anon, authenticated using (
  is_active and exists (
    select 1 from public.collections c join public.artworks a on a.collection_id = c.id
    where c.artist_id = artists.id and c.is_active and a.publication_status = 'PUBLISHED' and a.is_active and a.is_catalog_visible
  )
);

drop policy if exists public_read_collections on public.collections;
create policy public_read_collections on public.collections for select to anon, authenticated using (
  is_active and exists (
    select 1 from public.artworks a
    where a.collection_id = collections.id and a.publication_status = 'PUBLISHED' and a.is_active and a.is_catalog_visible
  )
);

drop policy if exists public_read_artworks on public.artworks;
create policy public_read_artworks on public.artworks for select to anon, authenticated using (
  publication_status = 'PUBLISHED' and is_active and is_catalog_visible
);

drop policy if exists public_read_artwork_variants on public.artwork_variants;
create policy public_read_artwork_variants on public.artwork_variants for select to anon, authenticated using (
  is_catalog_visible and exists (
    select 1 from public.artworks a
    where a.id = artwork_variants.artwork_id and a.publication_status = 'PUBLISHED' and a.is_active and a.is_catalog_visible
  )
);

drop policy if exists public_read_physical_configurations on public.variant_physical_configurations;
create policy public_read_physical_configurations on public.variant_physical_configurations for select to anon, authenticated using (
  exists (
    select 1 from public.artwork_variants v join public.artworks a on a.id = v.artwork_id
    where v.id = variant_physical_configurations.variant_id and v.is_catalog_visible and a.publication_status = 'PUBLISHED' and a.is_active and a.is_catalog_visible
  )
);

drop policy if exists public_read_artwork_media on public.artwork_media;
create policy public_read_artwork_media on public.artwork_media for select to anon, authenticated using (
  is_public and exists (
    select 1 from public.artworks a
    where a.id = artwork_media.artwork_id and a.publication_status = 'PUBLISHED' and a.is_active and a.is_catalog_visible
  )
);
