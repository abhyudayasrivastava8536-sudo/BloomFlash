import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { DailyPacks } from "@/components/DailyPacks";
import { FlowerCatalog } from "@/components/FlowerCatalog";
import { SustainabilitySection } from "@/components/SustainabilitySection";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { Cart } from "@/components/Cart";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <div id="packs">
          <DailyPacks />
        </div>
        <div id="flowers">
          <FlowerCatalog />
        </div>
        <div id="sustainability">
          <SustainabilitySection />
        </div>
        <div id="how">
          <HowItWorks />
        </div>
      </main>
      <Footer />
      <Cart />
    </div>
  );
};

export default Index;
