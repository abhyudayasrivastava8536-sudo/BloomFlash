import { Card } from "@/components/ui/card";
import { Package, Truck, Home, Recycle } from "lucide-react";

const steps = [
  {
    icon: Package,
    step: "1",
    title: "Choose Your Pack",
    description: "Select from daily packs (₹10-₹50) or customize your own mix of flowers and garlands",
  },
  {
    icon: Truck,
    step: "2",
    title: "Daily Delivery",
    description: "Fresh flowers delivered to your doorstep every morning before your puja time",
  },
  {
    icon: Home,
    step: "3",
    title: "Complete Your Puja",
    description: "Use the fresh flowers for your daily prayers and rituals with devotion",
  },
  {
    icon: Recycle,
    step: "4",
    title: "Next Day Pickup",
    description: "Schedule a convenient flower return and earn wallet credit toward a future order",
  },
];

export const HowItWorks = () => {
  return (
    <section className="bg-[#fbf8f3] py-20">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, sustainable, and seamless flower delivery in 4 easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a67e5f]/70 to-transparent" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Card className="relative z-10 h-full border-[#e4d9ce] bg-[#fffdfa] p-6 text-center shadow-[0_12px_35px_-30px_rgba(50,26,29,.6)] transition-all duration-300 hover:shadow-medium">
                  <div className="relative mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#b99964]/40 bg-[#6b2b36] shadow-[0_8px_20px_-12px_rgba(66,25,35,.75)]">
                    <Icon className="relative z-10 h-7 w-7 text-[#ead6a8]" strokeWidth={1.6} />
                    <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#e2cda1] bg-[#f5efe5] text-sm font-bold text-[#54232e]">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
