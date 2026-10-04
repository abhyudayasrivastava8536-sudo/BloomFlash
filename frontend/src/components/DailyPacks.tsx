import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { FlowerTile } from "@/components/FlowerTile";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { FlowerPhoto } from "@/components/FlowerTile";

interface Pack {
  id: string;
  name: string;
  price: number;
  popular?: boolean;
  features: string[];
  crop: [number, number];
  photoId: FlowerPhoto;
}

const packs: Pack[] = [
  {
    id: "pack-basic",
    name: "Basic",
    price: 10,
    crop: [0, 0],
    photoId: "packBasic",
    features: ["1 small garland", "5 loose flowers", "Flexible delivery", "Return reminder"],
  },
  {
    id: "pack-standard",
    name: "Standard",
    price: 20,
    popular: true,
    crop: [2, 0],
    photoId: "packStandard",
    features: ["1 medium garland", "10 loose flowers", "Mix 2 varieties", "Flexible delivery", "Return reminder"],
  },
  {
    id: "pack-premium",
    name: "Premium",
    price: 30,
    crop: [1, 0],
    photoId: "packPremium",
    features: ["1 large garland", "15 loose flowers", "Mix 3 varieties", "Premium selection", "Flexible delivery"],
  },
  {
    id: "pack-deluxe",
    name: "Deluxe",
    price: 50,
    crop: [2, 1],
    photoId: "packDeluxe",
    features: ["2 garlands", "25 loose flowers", "Mix any varieties", "Premium selection", "Flexible delivery"],
  },
];
const monthlyPrice = (pack: Pack) => Math.round(pack.price * 27);

export const DailyPacks = () => {
  const [orderType, setOrderType] = useState<"subscription" | "onetime">("subscription");
  const [selectedPlan, setSelectedPlan] = useState<Pack | null>(null);
  const { addToCart } = useCart();

  const handleAddToCart = (pack: Pack) => {
    if (orderType === "subscription") {
      setSelectedPlan(pack);
      return;
    }
    addToCart({
      id: `pack-${pack.price}`,
      name: `${pack.name} Pack`,
      hindi: "एक बार का ऑर्डर",
      image: "",
      crop: pack.crop,
      photoId: pack.photoId,
      price: pack.price,
      unit: "day",
      type: "pack",
      orderType: "onetime",
    }, 1);
  };

  const addSubscription = () => {
    if (!selectedPlan) return;
    addToCart({
      id: `subscription-pack-${selectedPlan.price}`,
      name: `${selectedPlan.name} Flower Subscription`,
      hindi: "30-दिन की मासिक सदस्यता",
      image: "",
      crop: selectedPlan.crop,
      photoId: selectedPlan.photoId,
      price: monthlyPrice(selectedPlan),
      unit: "month",
      type: "pack",
      orderType: "subscription",
    }, 1);
    setSelectedPlan(null);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Daily Flower Packs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Choose your perfect pack. Mix and match flowers for daily puja.
          </p>

          <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-xl">
            <Button
              variant={orderType === "subscription" ? "default" : "ghost"}
              onClick={() => setOrderType("subscription")}
              className={`rounded-lg ${orderType === "subscription" ? "bg-accent text-accent-foreground shadow-md hover:bg-accent/90" : ""}`}
              aria-pressed={orderType === "subscription"}
              size="sm"
            >
              Subscription
            </Button>
            <Button
              variant={orderType === "onetime" ? "default" : "ghost"}
              onClick={() => setOrderType("onetime")}
              className={`rounded-lg ${orderType === "onetime" ? "bg-accent text-accent-foreground shadow-md hover:bg-accent/90" : ""}`}
              aria-pressed={orderType === "onetime"}
              size="sm"
            >
              One-Time
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {packs.map((pack) => (
            <Card
              key={pack.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-medium hover:-translate-y-1 ${
                pack.popular ? "border-2 border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              {pack.popular && (
                <Badge className="absolute top-3 right-3 z-10 bg-gradient-accent border-0 text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}

              <div className="aspect-video overflow-hidden">
                <FlowerTile photoId={pack.photoId} col={pack.crop[0]} row={pack.crop[1]} alt={`${pack.name} flower pack`} className="h-full w-full" />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{pack.name}</h3>
                <div className="mb-3">
                  {orderType === "subscription" ? <><span className="text-2xl font-bold text-primary">₹{monthlyPrice(pack)}</span><span className="text-sm text-muted-foreground">/month</span><p className="text-xs text-muted-foreground"><span className="line-through">₹{pack.price * 30}</span> · ₹{pack.price}/day · save ₹{pack.price * 3}</p><p className="text-xs font-medium text-[#6b2b36]">Earn {Math.floor(monthlyPrice(pack) / 10)} PhoolCoins + about ₹{Math.round(monthlyPrice(pack) * .1)} return credit</p></> : <><span className="text-2xl font-bold text-primary">₹{pack.price}</span><span className="text-sm text-muted-foreground">/day</span></>}
                </div>

                <ul className="space-y-1.5 mb-4">
                  {pack.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-start gap-1.5 text-xs">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                  {pack.features.length > 3 && (
                    <li className="text-xs text-muted-foreground pl-5">+{pack.features.length - 3} more</li>
                  )}
                </ul>

                <Button
                  onClick={() => handleAddToCart(pack)}
                  className="w-full bg-accent text-accent-foreground text-sm shadow-soft hover:bg-accent/90"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {orderType === "subscription" ? "Subscribe" : "Order Now"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {orderType === "subscription" && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-[#6b2b36]">Save 10% on the 30-day plan</span> compared with buying that pack daily; returning the flowers can earn wallet credit too.
            </p>
          </div>
        )}
      </div>
      <Dialog open={selectedPlan !== null} onOpenChange={(open) => { if (!open) setSelectedPlan(null); }}>
        <DialogContent className="sm:max-w-md rounded-2xl border-border bg-card">
          <DialogHeader>
            <p className="section-kicker">Your daily ritual, on repeat</p>
            <DialogTitle className="font-editorial text-4xl">{selectedPlan?.name} monthly plan</DialogTitle>
            <DialogDescription className="leading-6">
              One simple 30-day plan, with the 10% commitment saving already included. Your demo checkout shows the full plan total, rewards and estimated flower-return credit.
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && <div className="rounded-xl border border-border/70 bg-background/70 p-4">
            <div className="flex items-baseline justify-between gap-4"><span className="font-semibold">{selectedPlan.name} flower pack</span><span className="text-xl font-semibold text-primary">₹{monthlyPrice(selectedPlan)}<span className="text-sm font-normal text-muted-foreground"> / month</span></span></div>
            <p className="mt-1 text-xs text-muted-foreground">₹{selectedPlan.price * 30} when bought daily · save ₹{selectedPlan.price * 3} over 30 days · one monthly plan line</p>
            <p className="mt-2 text-xs font-medium text-[#6b2b36]">Estimated rewards: {Math.floor(monthlyPrice(selectedPlan) / 10)} PhoolCoins + ₹{Math.round(monthlyPrice(selectedPlan) * .1)} wallet credit if returned</p>
            <ul className="mt-4 space-y-2">{selectedPlan.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 shrink-0 text-primary" />{feature}</li>)}</ul>
          </div>}
          <p className="text-xs leading-5 text-muted-foreground">This project demo records a monthly plan order; it does not charge a real payment method or automatically renew.</p>
          <DialogFooter>
            <Button onClick={addSubscription} className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">Continue with this plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
