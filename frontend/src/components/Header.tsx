import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Flower2, User, ShoppingCart, Package, CreditCard, Wallet, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const token = localStorage.getItem("bloomflash_token");
      if (!token) { if (active) setUser(null); localStorage.removeItem("user"); return; }
      try {
        const currentUser = await api<any>("/auth/me");
        if (active) { setUser(currentUser); localStorage.setItem("user", JSON.stringify(currentUser)); }
      } catch { if (active) setUser(null); }
    };
    const handleAuthChange = () => { void refresh(); };
    window.addEventListener("bloomflash:auth-changed", handleAuthChange);
    window.addEventListener("bloomflash:auth-expired", handleAuthChange);
    void refresh();
    return () => { active = false; window.removeEventListener("bloomflash:auth-changed", handleAuthChange); window.removeEventListener("bloomflash:auth-expired", handleAuthChange); };
  }, []);

  const handleSignOut = () => {
    void api("/auth/signout", { method: "POST" }).catch(() => undefined);
    localStorage.removeItem("user");
    localStorage.removeItem("bloomflash_token");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#ded4c9] bg-[#fbf8f3] text-[#281b1b]">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex shrink-0 cursor-pointer items-center gap-3" onClick={() => navigate("/")} aria-label="BloomFlash home">
          <div className="rounded-2xl border border-[#d8bd81]/45 bg-[#421923] p-2.5 shadow-[0_8px_24px_-12px_rgba(66,25,35,.7)]">
            <Flower2 className="h-5 w-5 text-[#e7d09a]" strokeWidth={1.5} />
          </div>
          <span className="flex flex-col leading-none">
            <span className="font-editorial text-[1.8rem] tracking-[-.035em] text-[#421923]">BloomFlash</span>
            <span className="mt-1 hidden text-[8px] font-medium uppercase tracking-[.23em] text-[#7b6049] sm:block">Rituals, returned to earth</span>
          </span>
        </div>

        <SearchBar className="hidden md:flex flex-1 max-w-xl mx-4" />

        <nav className="hidden lg:flex items-center gap-6">
          <a href="#packs" className="text-sm font-medium hover:text-primary transition-colors">Daily Packs</a>
          <a href="#flowers" className="text-sm font-medium hover:text-primary transition-colors">Flowers</a>
          <a href="#sustainability" className="text-sm font-medium hover:text-primary transition-colors">Sustainability</a>
          <button onClick={() => navigate("/concierge")} className="text-sm font-medium hover:text-primary transition-colors">Ritual Studio</button>
        </nav>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex max-w-[230px] items-center gap-2 cursor-pointer rounded-full border border-[#6b2b36]/15 bg-[#6b2b36]/[0.06] px-3 py-1.5 transition-colors hover:bg-[#6b2b36]/10">
                  {user.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt={user.name} 
                      className="h-7 w-7 rounded-full object-cover border-2 border-primary/30"
                    />
                  ) : (
                    <User className="h-5 w-5 shrink-0 text-[#6b2b36]" />
                  )}
                  <span className="hidden truncate text-sm font-semibold text-[#421923] md:inline">{user.name}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background border shadow-lg">
                <DropdownMenuItem onClick={() => navigate("/orders")} className="cursor-pointer">
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/payment-methods")} className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/wallet")} className="cursor-pointer">
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" className="hidden border border-[#8b4a53]/35 bg-[#fbf8f3] font-semibold text-[#54232e] hover:bg-[#f0e3d4] hover:text-[#401a24] md:inline-flex" onClick={() => navigate("/signin")}>
                Sign In
              </Button>
              <Button 
                className="rounded-xl border border-[#d4b971] bg-[#54232e] font-semibold tracking-[.08em] text-[#fff8ec] shadow-[0_8px_22px_-14px_rgba(84,35,46,.9)] hover:bg-[#401a24]"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
            </>
          )}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="p-4">
            <SearchBar className="w-full" />
          </div>
          <nav className="flex flex-col gap-1 p-4 pt-0">
            <a href="#packs" className="text-sm font-medium hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted">Daily Packs</a>
            <a href="#flowers" className="text-sm font-medium hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted">Flowers</a>
            <a href="#sustainability" className="text-sm font-medium hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted">Sustainability</a>
            <button onClick={() => navigate("/concierge")} className="text-left text-sm font-medium hover:text-primary py-3 px-4 rounded-lg hover:bg-muted">Ritual Studio</button>
            {!user && (
              <Button variant="ghost" className="w-full justify-start mt-2" onClick={() => navigate("/signin")}>
                Sign In
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
