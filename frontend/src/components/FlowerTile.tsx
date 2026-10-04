import { flowerImages } from "@/lib/flowerImages";
const cropImages = [flowerImages.marigold, flowerImages.lotus, flowerImages.rose, flowerImages.hibiscus, flowerImages.marigoldGarland, flowerImages.roseGarland, flowerImages.mixedGarland];
export type FlowerPhoto = keyof typeof flowerImages;
export function FlowerTile({ col, row, alt, className = "", photoId }: { col: number; row: number; alt: string; className?: string; photoId?: FlowerPhoto }) {
  const index = row === 2 ? 6 : Math.max(0, Math.min(5, row * 3 + Math.max(0, Math.min(2, col))));
  return <img src={photoId ? flowerImages[photoId] : cropImages[index]} alt={alt} loading="lazy" decoding="async" className={`block h-full w-full object-cover ${className}`} />;
}
