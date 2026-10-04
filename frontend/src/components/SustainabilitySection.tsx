import { Card } from "@/components/ui/card";
import { Leaf, RefreshCw, Gift, TrendingDown } from "lucide-react";

const benefits = [
  {
    icon: RefreshCw,
    title: "Daily Pickup",
    description: "We collect used flowers from your doorstep the next day after delivery",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Recycling",
    description: "Partner with companies who transform used flowers into incense, organic colors & compost",
  },
  {
    icon: Gift,
    title: "Return Rewards",
    description: "Schedule a flower return and earn wallet credit equal to 10% of the order value",
  },
  {
    icon: TrendingDown,
    title: "Lower Prices",
    description: "Use earned wallet credit toward a future flower order",
  },
];

export const SustainabilitySection = () => {
  return (
    <section className="bg-[#f5f0e8] py-20">
      <div className="container mx-auto px-4 text-[#2b2020]">
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6b2b36]/15 bg-white/70 px-4 py-2 shadow-sm">
            <Leaf className="h-4 w-4 text-[#6b2b36]" />
            <span className="text-sm font-medium text-[#6b2b36]">Circular Economy</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Flowers that Give Back
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our sustainable initiative. Return used flowers and help us create a greener future while saving money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={benefit.title}
                className="animate-fade-in border-[#e4d9ce] bg-[#fffdfa] p-6 text-center shadow-[0_12px_35px_-30px_rgba(50,26,29,.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#b99964]/40 bg-[#6b2b36] shadow-[0_8px_20px_-12px_rgba(66,25,35,.75)]">
                  <Icon className="h-7 w-7 text-[#ead6a8]" strokeWidth={1.6} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block max-w-2xl border-[#60303a] bg-[linear-gradient(135deg,#351820,#532832)] p-6 shadow-[0_24px_60px_-34px_rgba(53,24,32,.8)]">
            <h3 className="mb-2 text-2xl font-bold text-[#f4e8d2]">
              🌸 Make Every Puja Count
            </h3>
            <p className="text-[#f5eee5]/80">
              Your used flowers don't go to waste. They're transformed into sacred items for future pujas, completing the spiritual cycle.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};
