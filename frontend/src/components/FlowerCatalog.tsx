import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { FlowerTile, type FlowerPhoto } from "@/components/FlowerTile";

const flowers = [
  { id: "rose", name: "Garden Rose", hindi: "गुलाब", price: 2, unit: "stem", crop: [2, 0] as [number, number], photoId: "rose" as FlowerPhoto },
  { id: "marigold", name: "Marigold", hindi: "गेंदा", price: 1.5, unit: "flower", crop: [0, 0] as [number, number], photoId: "marigold" as FlowerPhoto },
  { id: "lotus", name: "Lotus", hindi: "कमल", price: 15, unit: "flower", crop: [1, 0] as [number, number], photoId: "lotus" as FlowerPhoto },
  { id: "hibiscus", name: "Hibiscus", hindi: "गुड़हल", price: 2, unit: "flower", crop: [0, 1] as [number, number], photoId: "hibiscus" as FlowerPhoto },
  { id: "rose-garland", name: "Rose Garland", hindi: "गुलाब माला", price: 80, unit: "garland", crop: [2, 1] as [number, number], photoId: "roseGarland" as FlowerPhoto },
  { id: "marigold-garland", name: "Marigold Garland", hindi: "गेंदा माला", price: 50, unit: "garland", crop: [1, 1] as [number, number], photoId: "marigoldGarland" as FlowerPhoto },
  { id: "mixed-garland", name: "Mixed Garland", hindi: "मिश्रित माला", price: 60, unit: "garland", crop: [0, 2] as [number, number], photoId: "mixedGarland" as FlowerPhoto },
  { id: "white-chrysanthemum", name: "White Chrysanthemum", hindi: "सफेद गुलदाउदी", price: 3, unit: "flower", crop: [0, 0] as [number, number], photoId: "guldaudi" as FlowerPhoto },
];

export const FlowerCatalog = () => {
  const { addToCart } = useCart();
  return <section className="bg-muted/30 py-20" aria-labelledby="flowers-heading">
    <div className="container mx-auto px-4">
      <div className="mb-12 text-center"><p className="section-kicker mb-3">An offering, thoughtfully gathered</p><h2 id="flowers-heading" className="editorial-title text-foreground">Flowers & garlands</h2><p className="mx-auto mt-4 max-w-xl text-muted-foreground">Seasonal blooms, chosen for the moments you make sacred.</p></div>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {flowers.map((flower) => <Card key={flower.id} className="group overflow-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-medium">
          <div className="relative aspect-[4/4.4] overflow-hidden bg-[#241b18]"><FlowerTile photoId={flower.photoId} col={flower.crop[0]} row={flower.crop[1]} alt={`${flower.name} — editorial floral photography`} className="h-full w-full transition-transform duration-700 group-hover:scale-105"/><Badge className="absolute left-3 top-3 border border-white/15 bg-black/50 text-[9px] uppercase tracking-[.16em] text-white backdrop-blur">Seasonal</Badge></div>
          <div className="p-4"><h3 className="font-editorial text-2xl">{flower.name}</h3><p className="mt-1 text-xs text-muted-foreground">{flower.hindi}</p><div className="mt-4 flex items-end justify-between"><div><span className="text-lg font-medium">₹{flower.price}</span><span className="ml-1 text-xs text-muted-foreground">/ {flower.unit}</span></div><Button aria-label={`Add ${flower.name} to cart`} onClick={() => addToCart({ id: flower.id, name: flower.name, hindi: flower.hindi, image: "", crop: flower.crop, photoId: flower.photoId, price: flower.price, unit: flower.unit, type: "flower" })} size="icon" className="h-9 w-9 rounded-full bg-[#251c18] text-white hover:bg-[#89564c]"><Plus className="h-4 w-4"/></Button></div></div>
        </Card>)}
      </div>
    </div>
  </section>;
};
