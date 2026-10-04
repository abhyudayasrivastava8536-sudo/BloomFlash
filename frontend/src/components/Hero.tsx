import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, ArrowRight, CircleCheck, MapPin, Recycle, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Hero = () => {
  const [pincode, setPincode] = useState("");
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState<string | null>(null);
  const checkDelivery = async () => {
    if (!/^\d{6}$/.test(pincode)) { toast.error("Enter a valid 6-digit PIN code."); return; }
    setChecking(true);
    try { const result = await api<{ deliverable: boolean; eta: string }>(`/pincode/${pincode}`); setAvailability(result.deliverable ? `BloomFlash serves ${pincode}. Delivery timing is confirmed for your address at checkout.` : `We're not in ${pincode} yet. Join us as we grow.`); }
    catch { setAvailability("We couldn't check that PIN code right now. Please try again."); }
    finally { setChecking(false); }
  };

  return <section className="relative isolate min-h-[min(860px,calc(100svh-72px))] overflow-hidden bg-[#17110f] text-[#f7f0e7]">
    <img src="/bloomflash-cycle-film.svg" alt="" aria-hidden="true" fetchpriority="high" decoding="async" className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none object-cover object-[88%_center] opacity-95 md:object-center" />
    <div className="absolute inset-0 -z-[5] bg-[linear-gradient(90deg,rgba(20,15,14,.96)_0%,rgba(20,15,14,.88)_48%,rgba(20,15,14,.4)_100%),linear-gradient(0deg,rgba(20,15,14,.96)_0%,rgba(20,15,14,.62)_38%,transparent_70%)]" />
    <div className="container mx-auto flex min-h-[min(860px,calc(100svh-72px))] flex-col justify-center px-5 py-20 md:px-10 lg:px-16">
      <div className="max-w-3xl animate-fade-in rounded-3xl bg-[rgba(23,17,15,.42)] p-4 backdrop-blur-[3px] md:bg-[rgba(23,17,15,.2)] md:p-5">
        <div className="mb-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.3em] text-[#e5c892]"><span className="h-px w-10 bg-[#e5c892]" />Flowers for the rituals that matter</div>
        <h1 className="max-w-3xl text-6xl leading-[.9] tracking-[-.035em] sm:text-7xl md:text-8xl lg:text-[7.4rem]">A softer way<br />to <em className="font-normal text-[#e5c892]">begin again.</em></h1>
        <p className="mt-8 max-w-xl text-base leading-7 text-white/90 md:text-lg">Thoughtfully sourced flowers for your daily rituals. After the offering, blooms are collected for a second life—closing a gentler loop from growing and devotion back to the soil.</p>
        <div className="mt-9 flex flex-col gap-3 sm:max-w-xl sm:flex-row">
          <div className="relative flex-1"><MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#e5c892]" /><Input aria-label="PIN code" inputMode="numeric" placeholder="Your 6-digit PIN code" value={pincode} onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "").slice(0, 6)); setAvailability(null); }} className="h-14 border-white/25 bg-black/25 pl-11 text-white placeholder:text-white/55 focus-visible:ring-[#e5c892]" /><Button onClick={checkDelivery} disabled={checking} className="absolute right-1.5 top-1.5 h-11 bg-[#e5c892] px-5 text-[#201812] hover:bg-[#f0d9ad]">{checking ? "Checking" : "Check"}<ArrowRight className="ml-2 h-4 w-4" /></Button></div>
          <Button variant="outline" onClick={() => document.getElementById("flowers")?.scrollIntoView({ behavior: "smooth" })} className="h-14 border-white/30 bg-white/5 px-6 text-white hover:bg-white/10">Explore the collection</Button>
        </div>
        {availability && <p role="status" className="mt-3 flex items-start gap-2 text-sm text-[#f1d9aa]"><CircleCheck className="mt-0.5 h-4 w-4 shrink-0" />{availability}</p>}
      </div>
      <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/20 pt-5 text-[10px] uppercase tracking-[.19em] text-white/85 md:absolute md:bottom-9 md:left-16 md:right-16 md:mt-0">
        <a href="#how" className="inline-flex items-center gap-2 hover:text-white"><Sparkles className="h-4 w-4 text-[#e5c892]" />Grown with care, offered with intention</a><a href="#sustainability" className="inline-flex items-center gap-2 hover:text-white"><Recycle className="h-4 w-4 text-[#e5c892]" />Returned to earth, ready to bloom again</a><a href="#packs" className="ml-auto hidden items-center gap-2 hover:text-white sm:inline-flex">Discover BloomFlash <ArrowDown className="h-4 w-4" /></a>
      </div>
    </div>
  </section>;
};
