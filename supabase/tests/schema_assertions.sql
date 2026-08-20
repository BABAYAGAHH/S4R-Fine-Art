-- C1 local-schema assertions.
-- Run after local Supabase is available; this file is not a migration.
begin;

do $$
declare
  expected_table text;
  expected_tables text[] := array[
    'artists', 'collections', 'artworks', 'artwork_variants',
    'variant_physical_configurations', 'pod_variant_mappings',
    'digital_delivery_policies', 'artwork_media', 'admin_profiles'
  ];
begin
  foreach expected_table in array expected_tables loop
    if to_regclass('public.' || expected_table) is null then
      raise exception 'missing expected table: %', expected_table;
    end if;
    if not exists (select 1 from pg_class where oid = ('public.' || expected_table)::regclass and relrowsecurity) then
      raise exception 'RLS is not enabled: %', expected_table;
    end if;
    if has_table_privilege('anon', 'public.' || expected_table, 'INSERT')
      or has_table_privilege('anon', 'public.' || expected_table, 'UPDATE')
      or has_table_privilege('anon', 'public.' || expected_table, 'DELETE')
      or has_table_privilege('authenticated', 'public.' || expected_table, 'INSERT')
      or has_table_privilege('authenticated', 'public.' || expected_table, 'UPDATE')
      or has_table_privilege('authenticated', 'public.' || expected_table, 'DELETE') then
      raise exception 'browser write grant found: %', expected_table;
    end if;
  end loop;

  if not exists (select 1 from pg_constraint where conname = 'artworks_slug_key')
    or not exists (select 1 from pg_constraint where conname = 'artwork_variants_price_minor_check')
    or not exists (select 1 from pg_constraint where conname = 'artwork_variants_contract') then
    raise exception 'required slug, money, or variant contract constraint missing';
  end if;

  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename in ('pod_variant_mappings', 'digital_delivery_policies', 'admin_profiles')
  ) then
    raise exception 'restricted table has a browser policy';
  end if;
end;
$$;

rollback;
