import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { flowerImages } from "@/lib/flowerImages";

interface Product {
  id: string;
  name: string;
  hindi: string;
  price: number;
  image: string;
  category: string;
}

const allProducts: Product[] = [
  { id: "rose", name: "Rose", hindi: "गुलाब", price: 2, image: flowerImages.rose, category: "Flowers" },
  { id: "marigold", name: "Marigold", hindi: "गेंदा", price: 1.5, image: flowerImages.marigold, category: "Flowers" },
  { id: "lotus", name: "Lotus", hindi: "कमल", price: 15, image: flowerImages.lotus, category: "Flowers" },
  { id: "hibiscus", name: "Hibiscus", hindi: "गुड़हल", price: 2, image: flowerImages.hibiscus, category: "Flowers" },
  { id: "white-chrysanthemum", name: "White Chrysanthemum", hindi: "सफेद गुलदाउदी", price: 3, image: flowerImages.guldaudi, category: "Flowers" },
  { id: "rose-garland", name: "Rose Garland", hindi: "गुलाब माला", price: 80, image: flowerImages.roseGarland, category: "Garlands" },
  { id: "marigold-garland", name: "Marigold Garland", hindi: "गेंदा माला", price: 50, image: flowerImages.marigoldGarland, category: "Garlands" },
  { id: "mixed-garland", name: "Mixed Garland", hindi: "मिश्रित माला", price: 60, image: flowerImages.mixedGarland, category: "Garlands" },
  { id: "pack-10", name: "Basic Pack ₹10", hindi: "बेसिक पैक", price: 10, image: flowerImages.packBasic, category: "Daily Packs" },
  { id: "pack-20", name: "Standard Pack ₹20", hindi: "स्टैंडर्ड पैक", price: 20, image: flowerImages.packStandard, category: "Daily Packs" },
  { id: "pack-30", name: "Premium Pack ₹30", hindi: "प्रीमियम पैक", price: 30, image: flowerImages.packPremium, category: "Daily Packs" },
  { id: "pack-50", name: "Deluxe Pack ₹50", hindi: "डीलक्स पैक", price: 50, image: flowerImages.packDeluxe, category: "Daily Packs" },
];

const placeholders = [
  "Search for roses...",
  "Search for marigold garlands...",
  "Search for lotus flowers...",
  "Search for daily puja pack...",
  "Search for hibiscus...",
];

interface SearchBarProps {
  className?: string;
  onProductSelect?: (product: Product) => void;
}

export const SearchBar = ({ className, onProductSelect }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.hindi.includes(query) ||
          product.category.toLowerCase().includes(searchTerm)
      );
      setFilteredProducts(filtered);
      setIsOpen(true);
    } else {
      setFilteredProducts([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (product: Product) => {
    setQuery("");
    setIsOpen(false);
    setFocused(false);
    onProductSelect?.(product);
    // Scroll to flowers section
    const flowersSection = document.getElementById("flowers");
    if (flowersSection) {
      flowersSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <>
    {focused && <button aria-label="Close search" tabIndex={-1} onMouseDown={(event) => { event.preventDefault(); setFocused(false); setIsOpen(false); }} className="fixed inset-0 z-[60] cursor-default bg-[#140d0e]/70 backdrop-blur-[3px]" />}
    <div ref={searchRef} className={`relative ${className} ${focused ? "z-[70]" : ""}`}>
      <div className={`relative w-full transition-all duration-300 ${focused ? "fixed left-1/2 top-[14vh] w-[min(48rem,92vw)] -translate-x-1/2" : ""}`}>
        <Search className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c776a] ${focused ? "left-5 h-5 w-5" : "left-3"}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { setFocused(true); if (query) setIsOpen(true); }}
          onBlur={(e) => { if (!searchRef.current?.contains(e.relatedTarget as Node)) setFocused(false); }}
          onKeyDown={(e) => { if (e.key === "Escape") { setFocused(false); setIsOpen(false); } }}
          placeholder={placeholders[placeholderIndex]}
          className={`w-full rounded-full border bg-[#fffdfa] font-editorial text-[#332728] transition-all placeholder:text-[#9a8f87] focus:border-[#8b5960] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6b2b36]/15 ${focused ? "border-[#b79562] px-6 py-4 pl-14 pr-12 text-xl shadow-[0_30px_90px_-36px_rgba(0,0,0,.65)]" : "border-[#d9cfc4] py-3 pl-10 pr-10 text-base shadow-[0_5px_18px_-16px_rgba(44,25,27,.7)]"}`}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c776a] transition-colors hover:text-[#54232e]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && filteredProducts.length > 0 && (
        <div className={"z-[80] mt-2 max-h-[min(55vh,28rem)] w-[min(48rem,92vw)] overflow-y-auto overflow-hidden rounded-2xl border border-[#e0d5ca] bg-[#fffdfa] shadow-[0_22px_55px_-24px_rgba(47,27,28,.35)] " + (focused ? "fixed left-1/2 top-[calc(14vh+4.6rem)] -translate-x-1/2" : "absolute left-1/2 top-full -translate-x-1/2")}>
          {Object.entries(groupedProducts).map(([category, products]) => (
            <div key={category}>
              <div className="bg-[#f5f0ea] px-4 py-2 text-[10px] font-semibold uppercase tracking-[.17em] text-[#795d51]">
                {category}
              </div>
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="flex w-full items-center gap-3 border-t border-[#eee7df] px-4 py-3 text-left transition-colors hover:bg-[#f7f1ea]"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-11 w-11 rounded-xl object-cover ring-1 ring-[#d7c9b9]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.hindi}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#54232e]">₹{product.price}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {isOpen && query && filteredProducts.length === 0 && (
        <div className={"z-[80] mt-2 w-[min(48rem,92vw)] rounded-xl border border-[#c5a66d]/45 bg-[#fffaf2] p-4 shadow-strong " + (focused ? "fixed left-1/2 top-[calc(14vh+4.6rem)] -translate-x-1/2" : "absolute left-1/2 top-full -translate-x-1/2")}>
          <p className="text-center text-muted-foreground text-sm">No products found for "{query}"</p>
        </div>
      )}
    </div>
    </>
  );
};
