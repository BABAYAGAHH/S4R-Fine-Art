import type { Artwork } from "@/types/commerce";
import { ArtworkCard } from "@/components/artwork/artwork-card";

export function ArtworkGrid({ artworks }: { artworks: Artwork[] }) {
  return <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">{artworks.map((artwork) => <ArtworkCard key={artwork.id} artwork={artwork} />)}</div>;
}
