import assert from "node:assert/strict";
import test from "node:test";
import { mapPublishedArtwork } from "../lib/catalog/map-persisted-artwork.ts";
import type { PersistedArtwork } from "../lib/catalog/persistence-contract.ts";

const fixture = (): PersistedArtwork => ({
  id: "fixture-artwork", slug: "fixture-artwork", title: "Fixture artwork", shortDescription: "Development fixture", story: null, publicationStatus: "PUBLISHED", isActive: true, isCatalogVisible: true, isFeatured: false,
  collection: { id: "fixture-collection", name: "Fixture collection", slug: "fixture-collection", description: null },
  media: [
    { id: "gallery", mediaType: "GALLERY", storagePath: "fixture/gallery.jpg", altText: "Gallery", sortOrder: 2, width: 1200, height: 1000, isPublic: true },
    { id: "hero", mediaType: "HERO", storagePath: "fixture/hero.jpg", altText: "Hero", sortOrder: 0, width: 1200, height: 1500, isPublic: true },
    { id: "private", mediaType: "GALLERY", storagePath: "private/source.tif", altText: "Private", sortOrder: 1, width: 1, height: 1, isPublic: false },
  ],
  variants: [
    { id: "digital", variantType: "DIGITAL", name: "Digital", commercialConfigurationId: "digital-standard", currency: "USD", priceMinor: 12000, pricingStatus: "DEVELOPMENT_PLACEHOLDER", availability: "AVAILABLE", isCatalogVisible: true, isPurchasable: true, fulfillmentType: "DIGITAL", fulfillmentRequirement: "DIGITAL_DELIVERY", quantityPolicy: "SINGLE" },
    { id: "physical", variantType: "PHYSICAL", name: "Canvas", commercialConfigurationId: "canvas-18x24", currency: "USD", priceMinor: 28000, pricingStatus: "DEVELOPMENT_PLACEHOLDER", availability: "SOLD_OUT", isCatalogVisible: true, isPurchasable: false, fulfillmentType: "PHYSICAL", fulfillmentRequirement: "POD_FULFILLMENT", quantityPolicy: "MULTIPLE", physicalConfiguration: { sizeLabel: "18 x 24 in", width: 18, height: 24, dimensionUnit: "in" } },
  ],
});

test("maps public database rows into the existing digital and physical cart contract", () => {
  const artwork = mapPublishedArtwork(fixture(), (path) => `https://public.example/${path}`);
  assert.ok(artwork);
  assert.equal(artwork.digitalVariant?.price.amountMinor, 12000);
  assert.equal(artwork.digitalVariant?.quantityPolicy, "SINGLE");
  assert.equal(artwork.physicalVariants[0]?.purchaseAvailability, "UNAVAILABLE");
  assert.equal(artwork.physicalVariants[0]?.podMapping, undefined);
  assert.equal(artwork.pricingStatus, "DEVELOPMENT_PLACEHOLDER");
  assert.deepEqual(artwork.galleryImages.map((image) => image.src), ["https://public.example/fixture/gallery.jpg"]);
});

test("filters unpublished rows and refuses a public catalog record without public hero media", () => {
  const draft = fixture();
  draft.publicationStatus = "DRAFT";
  assert.equal(mapPublishedArtwork(draft, (path) => path), undefined);
  const noHero = fixture();
  noHero.media[1] = { ...noHero.media[1], isPublic: false };
  assert.equal(mapPublishedArtwork(noHero, (path) => path), undefined);
});
