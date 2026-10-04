import { Flower2, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl border border-[#d8bd81]/40 bg-[#421923] flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-[#e7d09a]" strokeWidth={1.5} />
              </div>
              <span className="flex flex-col leading-none">
                <span className="font-editorial text-3xl tracking-[-.035em]">BloomFlash</span>
                <span className="mt-1 text-[8px] uppercase tracking-[.23em] text-background/60">Rituals, returned to earth</span>
              </span>
            </div>
            <p className="text-sm text-background/70">
              Sustainable flower delivery for your daily puja needs. Fresh flowers, eco-friendly practices.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#packs" className="hover:text-background transition-colors">Daily Packs</a></li>
              <li><a href="#flowers" className="hover:text-background transition-colors">Flowers</a></li>
              <li><a href="#sustainability" className="hover:text-background transition-colors">Sustainability</a></li>
              <li><a href="#how" className="hover:text-background transition-colors">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@pujaflowers.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>Available in select cities across India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-sm text-background/70">
          <p>© 2026 BloomFlash. Thoughtful rituals, lighter footprints.</p>
        </div>
      </div>
    </footer>
  );
};
