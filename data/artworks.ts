import type { Artwork, ArtworkCollection, Money, PurchaseAvailability } from "@/types/commerce";

export const launchCollection: ArtworkCollection = {
  id: "collection-launch-editions",
  name: "Launch Editions",
  slug: "launch-editions",
  description: "The inaugural S4R Fine Art collection.",
};

/** Development-only prices in USD minor units. They are not approved production prices. */
const developmentPrice = (amountMinor: number): Money => ({ amountMinor, currency: "USD" });
const developmentPurchasability: PurchaseAvailability = process.env.NODE_ENV === "development" ? "PURCHASABLE" : "UNAVAILABLE";
const artworkImage = (slug: string, title: string, width: number, height: number) => ({
  src: `/artwork/${slug}.svg`,
  alt: `Development placeholder for ${title}`,
  width,
  height,
});

const statement = "Artwork statement to be supplied by S4R Fine Art.";
const digitalVariant = (id: string) => ({
  id,
  fulfillmentType: "DIGITAL" as const,
  fulfillmentRequirement: "DIGITAL_DELIVERY" as const,
  name: "Digital edition",
  price: developmentPrice(12000),
  availability: "AVAILABLE" as const,
  purchaseAvailability: developmentPurchasability,
  commercialConfigurationId: "digital-standard-edition",
  quantityPolicy: "SINGLE" as const,
});
const canvasVariant = (id: string, size: string, width: number, height: number) => ({
  id,
  fulfillmentType: "PHYSICAL" as const,
  fulfillmentRequirement: "POD_FULFILLMENT" as const,
  name: "Canvas edition",
  size,
  width,
  height,
  unit: "in" as const,
  price: developmentPrice(28000),
  availability: "AVAILABLE" as const,
  purchaseAvailability: developmentPurchasability,
  commercialConfigurationId: `canvas-${width}x${height}-in`,
  quantityPolicy: "MULTIPLE" as const,
  podMapping: {},
});

export const artworks: Artwork[] = [
  {
    id: "artwork-the-armor-unlaced", slug: "the-armor-unlaced", title: "The Armor Unlaced", shortDescription: statement, story: statement,
    collection: launchCollection, catalogVisibility: "VISIBLE", pricingStatus: "DEVELOPMENT_PLACEHOLDER",
    heroImage: artworkImage("the-armor-unlaced", "The Armor Unlaced", 1200, 1500), galleryImages: [artworkImage("the-armor-unlaced", "The Armor Unlaced", 1200, 1500)],
    digitalVariant: digitalVariant("digital-armor-unlaced"), physicalVariants: [canvasVariant("canvas-armor-unlaced-18x24", "18 × 24 in", 18, 24)], featured: true,
  },
  {
    id: "artwork-the-melting-shield", slug: "the-melting-shield", title: "The Melting Shield", shortDescription: statement, story: statement,
    collection: launchCollection, catalogVisibility: "VISIBLE", pricingStatus: "DEVELOPMENT_PLACEHOLDER",
    heroImage: artworkImage("the-melting-shield", "The Melting Shield", 1500, 1100), galleryImages: [artworkImage("the-melting-shield", "The Melting Shield", 1500, 1100)],
    digitalVariant: digitalVariant("digital-melting-shield"), physicalVariants: [canvasVariant("canvas-melting-shield-24x18", "24 × 18 in", 24, 18)], featured: true,
  },
  {
    id: "artwork-the-open-vault", slug: "the-open-vault", title: "The Open Vault", shortDescription: statement, story: statement,
    collection: launchCollection, catalogVisibility: "VISIBLE", pricingStatus: "DEVELOPMENT_PLACEHOLDER",
    heroImage: artworkImage("the-open-vault", "The Open Vault", 1200, 1200), galleryImages: [artworkImage("the-open-vault", "The Open Vault", 1200, 1200)],
    digitalVariant: digitalVariant("digital-open-vault"), physicalVariants: [canvasVariant("canvas-open-vault-20x20", "20 × 20 in", 20, 20)], featured: true,
  },
  {
    id: "artwork-the-unlocked-anchor", slug: "the-unlocked-anchor", title: "The Unlocked Anchor", shortDescription: statement, story: statement,
    collection: launchCollection, catalogVisibility: "VISIBLE", pricingStatus: "DEVELOPMENT_PLACEHOLDER",
    heroImage: artworkImage("the-unlocked-anchor", "The Unlocked Anchor", 1200, 1560), galleryImages: [artworkImage("the-unlocked-anchor", "The Unlocked Anchor", 1200, 1560)],
    digitalVariant: digitalVariant("digital-unlocked-anchor"), physicalVariants: [canvasVariant("canvas-unlocked-anchor-18x24", "18 × 24 in", 18, 24)], featured: true,
  },
];