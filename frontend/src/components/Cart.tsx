import { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, ChevronRight, Gift, Minus, Plus, Recycle, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { AuthDialog } from "@/components/AuthDialog";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { FlowerTile } from "@/components/FlowerTile";

interface Coupon {
  code: string;
  discount: number;
  description: string;
  requiresAuth: boolean;
}

interface AddOn {
  id: string;
  name: string;
  hindi: string;
  price: number;
  unit: string;
  crop: [number, number];
}

const defaultCoupons: Coupon[] = [
  { code: "NEWUSER50", discount: 50, description: "A welcome for your first order", requiresAuth: true },
  { code: "RECYCLE20", discount: 20, description: "A little love for returned blooms", requiresAuth: true },
  { code: "PHOOL10", discount: 10, description: "A thoughtful extra for your ritual", requiresAuth: true },
  { code: "TRAY5", discount: 5, description: "Add 3 different flower items to your puja tray", requiresAuth: true },
];

const addOns: AddOn[] = [
  { id: "rose-garland", name: "Rose garland", hindi: "गुलाब माला", price: 80, unit: "garland", crop: [2, 1] },
  { id: "lotus", name: "Lotus bloom", hindi: "कमल", price: 15, unit: "flower", crop: [1, 0] },
  { id: "marigold-garland", name: "Marigold garland", hindi: "गेंदा माला", price: 50, unit: "garland", crop: [1, 1] },
];

const formatINR = (amount: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2,
}).format(amount);

export const Cart = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, addToCart, subtotal, totalItems } = useCart();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    } catch {
      setUser(null);
    }
  }, [isCartOpen]);

  const cartItems = Object.values(cart);
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const total = Math.max(0, subtotal - discount);
  const phoolCoins = Math.floor(total / 10);
  const returnCredit = Math.round(total * 0.1);
  const canMixAddOns = !cartItems.some((item) => item.orderType === "subscription");
  const distinctFlowerItems = cartItems.filter((item) => item.type === "flower" && item.orderType !== "subscription").length;
  const trayOfferRemaining = Math.max(0, 3 - distinctFlowerItems);
  const trayOfferQualified = trayOfferRemaining === 0;

  const applyCoupon = async (coupon: Coupon) => {
    if (coupon.requiresAuth && !user) {
      setCouponDialogOpen(false);
      setShowAuthDialog(true);
      return;
    }
    try {
      await api("/coupons/apply", { method: "POST", body: JSON.stringify({ code: coupon.code, mode: cartItems.some((item) => item.orderType === "subscription") ? "subscription" : "one-time", items: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })) }) });
      setAppliedCoupon(coupon);
      setCouponInput(coupon.code);
      setCouponDialogOpen(false);
      toast.success(`${coupon.code} applied`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "This offer could not be applied.");
    }
  };

  useEffect(() => {
    if (appliedCoupon?.code === "TRAY5" && !trayOfferQualified) {
      setAppliedCoupon(null);
      setCouponInput("");
      toast.info("TRAY5 was removed. Add 3 different flower items to use it.");
    }
  }, [appliedCoupon, trayOfferQualified]);

  const handleCouponInput = () => {
    const coupon = defaultCoupons.find((item) => item.code === couponInput.trim().toUpperCase());
    if (coupon) void applyCoupon(coupon);
    else toast.error("Choose one of the offers shown here.");
  };

  const addSuggestedItem = (item: AddOn) => {
    addToCart({
      id: item.id,
      name: item.name,
      hindi: item.hindi,
      image: "",
      crop: item.crop,
      price: item.price,
      unit: item.unit,
      type: "flower",
      orderType: "onetime",
    });
    toast.success(`${item.name} added to your ritual`);
  };

  const handleCheckout = () => {
    const hasSubscription = cartItems.some((item) => item.orderType === "subscription");
    if (hasSubscription && cartItems.some((item) => item.orderType !== "subscription")) {
      toast.error("Please check out monthly plans separately from one-time flowers.");
      return;
    }
    setIsCartOpen(false);
    const cartArray = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      crop: item.crop,
    }));
    const mode = hasSubscription ? "subscription" : "one-time";
    navigate("/checkout", { state: { cart: cartArray, total, discount, coupon: appliedCoupon?.code, mode } });
  };

  const suggestedItems = addOns.filter((item) => !cart[item.id]).slice(0, 2);

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-[min(100vw,34rem)] gap-0 overflow-hidden rounded-l-2xl border-[#e6dcc9] bg-[#fbf8f1] p-0 sm:max-w-lg">
          <SheetHeader className="border-b border-[#e6dcc9] bg-[linear-gradient(145deg,#fffdf8,#f5eddf)] px-6 py-5 text-left">
            <div className="mb-1 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.25em] text-[#8b6440]"><span className="h-px w-7 bg-[#b79562]" />The BloomFlash edit</div>
            <SheetTitle className="font-editorial text-4xl tracking-[-.025em] text-[#351820]">Your ritual bag</SheetTitle>
            <p className="text-xs text-[#77695c]">{totalItems} {totalItems === 1 ? "thoughtful selection" : "thoughtful selections"} · ready for your daily ritual</p>
          </SheetHeader>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
            {cartItems.length === 0 ? (
              <div className="flex min-h-[48vh] flex-col items-center justify-center px-5 text-center">
                <div className="mb-5 rounded-full border border-[#decba5] bg-[#f2e8d4] p-5 text-[#6b2b36]"><ShoppingBag className="h-8 w-8" strokeWidth={1.4} /></div>
                <p className="section-kicker mb-2">A little beauty awaits</p>
                <h3 className="font-editorial text-3xl text-[#351820]">Your bag is still a bud.</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-[#77695c]">Choose a flower or daily pack and we’ll gather it here for you.</p>
                <SheetClose asChild><Button variant="outline" className="mt-6 rounded-full border-[#8b6440]/40 px-6 text-[#5a2831]">Explore the collection <ArrowRight className="ml-2 h-4 w-4" /></Button></SheetClose>
              </div>
            ) : <>
              <section aria-labelledby="bag-items-heading">
                <div className="mb-3 flex items-center justify-between"><h3 id="bag-items-heading" className="section-kicker">Selected for you</h3><span className="text-[10px] uppercase tracking-[.16em] text-[#8d7d6a]">{cartItems.length} {cartItems.length === 1 ? "piece" : "pieces"}</span></div>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <article key={item.id} className="flex gap-3 rounded-2xl border border-[#e7ddca] bg-white/80 p-3 shadow-[0_9px_24px_-22px_rgba(50,31,22,.6)]">
                      <div className="shrink-0 overflow-hidden rounded-xl bg-[#f1e9dd]" style={{ width: 76, height: 76, flex: "0 0 76px" }}>{item.crop ? <FlowerTile photoId={item.photoId} col={item.crop[0]} row={item.crop[1]} alt={item.name} className="!h-full !w-full object-cover" /> : <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}</div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                        <div><h4 className="truncate font-editorial text-[1.35rem] leading-tight text-[#351820]">{item.name}</h4><p className="mt-1 text-[11px] text-[#827467]">{item.orderType === "subscription" ? "30-day monthly plan" : item.hindi}</p></div>
                        <p className="mt-2 text-xs font-semibold text-[#6b2b36]">{formatINR(item.price)} <span className="font-normal text-[#827467]">/ {item.unit}</span></p>
                      </div>
                      <div className="flex min-w-[72px] flex-col items-end justify-between">
                        <span className="text-sm font-semibold text-[#351820]">{formatINR(item.price * item.quantity)}</span>
                        <div className="flex items-center gap-1.5">
                          <Button aria-label={item.quantity === 1 ? `Remove ${item.name}` : `Reduce ${item.name}`} size="icon" variant="outline" className="h-7 w-7 rounded-full border-[#e3d7c3] bg-white" onClick={() => updateQuantity(item.id, -1)}>
                            {item.quantity === 1 || item.orderType === "subscription" ? <Trash2 className="h-3 w-3 text-[#82434a]" /> : <Minus className="h-3 w-3" />}
                          </Button>
                          <span className="min-w-7 text-center text-[11px] font-semibold text-[#5f5043]">{item.orderType === "subscription" ? "1 plan" : item.quantity}</span>
                          {item.orderType !== "subscription" && <Button aria-label={`Add another ${item.name}`} size="icon" variant="outline" className="h-7 w-7 rounded-full border-[#e3d7c3] bg-white" onClick={() => updateQuantity(item.id, 1)}><Plus className="h-3 w-3" /></Button>}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {canMixAddOns && suggestedItems.length > 0 && <section aria-labelledby="add-ons-heading" className="rounded-2xl border border-[#e5d7bd] bg-[linear-gradient(145deg,#f7efdf,#fffdf8)] p-4">
                <div className="mb-3 flex items-center gap-2"><Gift className="h-4 w-4 text-[#8d6844]" /><div><h3 id="add-ons-heading" className="font-editorial text-xl text-[#351820]">Complete the offering</h3><p className="text-[11px] text-[#827467]">A considered addition for your puja tray</p></div></div>
                <div className="mb-3 rounded-xl border border-[#e7d6b6] bg-[#fffdf8] p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs font-medium leading-5 text-[#5c2a33]">{trayOfferQualified ? "Your 5% tray offer is unlocked." : `Add ${trayOfferRemaining} more different ${trayOfferRemaining === 1 ? "flower" : "flowers"} to unlock 5% off.`}</p>
                    {trayOfferQualified && <Button size="sm" variant="outline" className="h-8 shrink-0 rounded-full border-[#6b2b36]/30 px-3 text-[#6b2b36]" onClick={() => { setCouponInput("TRAY5"); setCouponDialogOpen(true); }}>Use offer</Button>}
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#ede4d3]"><div className="h-full rounded-full bg-[#a37c4d] transition-all" style={{ width: `${Math.min(100, (distinctFlowerItems / 3) * 100)}%` }} /></div>
                </div>
                <div className="space-y-2">
                  {suggestedItems.map((item) => <div key={item.id} className="flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-[#e8decd] bg-white/80 p-2">
                    <div className="shrink-0 overflow-hidden rounded-lg bg-[#f1e9dd]" style={{ width: 44, height: 44, flex: "0 0 44px" }}><FlowerTile photoId={item.photoId} col={item.crop[0]} row={item.crop[1]} alt={item.name} className="h-full w-full" /></div>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[#3e2926]">{item.name}</p><p className="text-[11px] text-[#827467]">{formatINR(item.price)} / {item.unit}</p></div>
                    <Button aria-label={`Add ${item.name}`} size="sm" variant="outline" className="h-8 rounded-full border-[#6b2b36]/30 px-3 text-[#6b2b36] hover:bg-[#6b2b36] hover:text-white" onClick={() => addSuggestedItem(item)}><Plus className="mr-1 h-3.5 w-3.5" /> Add</Button>
                  </div>)}
                </div>
              </section>}

              <div className="flex items-start gap-3 rounded-xl border border-[#d8e1d2] bg-[#f3f6ef] p-3 text-[#53644b]">
                <Recycle className="mt-0.5 h-4 w-4 shrink-0" /><p className="text-xs leading-5">When you’re ready, return your used flowers in the same pouch. We’ll give them a second life.</p>
              </div>
            </>}
          </div>

          {cartItems.length > 0 && <SheetFooter className="border-t border-[#e6dcc9] bg-[#fffdf8] px-5 py-4">
            <div className="w-full space-y-3">
              <Button variant="outline" className="h-11 w-full justify-between rounded-xl border-[#e2d4bc] bg-[#faf5e9] text-[#5c2a33] hover:bg-[#f3e8d4]" onClick={() => setCouponDialogOpen(true)}>
                <span className="flex items-center gap-2"><Tag className="h-4 w-4" />{appliedCoupon ? `${appliedCoupon.code} applied` : "Apply a private offer"}</span>
                {appliedCoupon ? <span className="flex items-center gap-1 text-xs"><Check className="h-3.5 w-3.5" />{appliedCoupon.discount}% off</span> : <ChevronRight className="h-4 w-4" />}
              </Button>
              <div className="space-y-1.5 px-1 text-sm">
                <div className="flex justify-between text-[#76685a]"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
                {appliedCoupon && <div className="flex justify-between text-[#55734d]"><span>{appliedCoupon.code}</span><span>−{formatINR(discount)}</span></div>}
                <div className="flex items-baseline justify-between border-t border-[#e7ddca] pt-2 text-[#351820]"><span className="font-medium">Your total</span><span className="font-editorial text-3xl">{formatINR(total)}</span></div>
                <div className="flex items-start justify-between gap-3 rounded-xl bg-[#f5f0e8] px-3 py-2.5 text-[11px] leading-5 text-[#5a4541]"><span>Estimated order rewards</span><span className="text-right font-medium text-[#54232e]">{phoolCoins} PhoolCoins · {formatINR(returnCredit)} return credit*</span></div>
                <p className="px-1 text-[10px] leading-4 text-[#8a7b70]">*Wallet credit is added when you schedule a flower return after delivery.</p>
              </div>
              <Button className="h-12 w-full rounded-xl bg-[#54232e] text-white shadow-[0_10px_24px_-15px_rgba(84,35,46,.9)] hover:bg-[#401a24]" onClick={handleCheckout}>Continue to checkout <ArrowRight className="ml-2 h-4 w-4" /></Button>
              <SheetClose asChild><Button variant="ghost" className="h-9 w-full text-xs text-[#837566]">Continue browsing</Button></SheetClose>
            </div>
          </SheetFooter>}
        </SheetContent>
      </Sheet>

      <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
        <DialogContent className="max-h-[88vh] overflow-y-auto rounded-2xl border-[#e4d5bb] bg-[#fffdf8] sm:max-w-md">
          <DialogHeader>
            <p className="section-kicker">A small thank-you</p>
            <DialogTitle className="font-editorial text-4xl text-[#351820]">Your private offers</DialogTitle>
            <DialogDescription>Choose a code for this ritual, or enter one you already have.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2"><Input aria-label="Coupon code" placeholder="Enter offer code" value={couponInput} onChange={(event) => setCouponInput(event.target.value.toUpperCase())} className="h-11 rounded-xl border-[#e3d6c2] bg-white uppercase" /><Button onClick={handleCouponInput} className="h-11 rounded-xl bg-[#54232e] px-5 text-white hover:bg-[#401a24]">Apply</Button></div>
          <div className="space-y-2">
            {defaultCoupons.filter((coupon) => coupon.code !== "TRAY5" || trayOfferQualified).map((coupon) => <button key={coupon.code} type="button" onClick={() => { setCouponInput(coupon.code); void applyCoupon(coupon); }} className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#e8ddca] bg-white p-3 text-left transition-colors hover:border-[#a88352] hover:bg-[#fbf6eb]">
              <span><span className="block text-xs font-semibold tracking-[.12em] text-[#54232e]">{coupon.code}</span><span className="mt-1 block text-xs text-[#827467]">{coupon.description}</span></span><span className="font-editorial text-2xl text-[#8a6844]">{coupon.discount}%</span>
            </button>)}
          </div>
          {appliedCoupon && <div className="flex items-center justify-between rounded-xl bg-[#f0f5ec] p-3 text-sm text-[#53644b]"><span className="flex items-center gap-2"><Check className="h-4 w-4" />{appliedCoupon.code} is applied</span><Button variant="ghost" size="sm" className="h-8 text-[#6b2b36]" onClick={() => { setAppliedCoupon(null); setCouponInput(""); }}>Remove</Button></div>}
          <DialogFooter><Button variant="ghost" className="w-full rounded-xl text-[#77695c]" onClick={() => setCouponDialogOpen(false)}>Back to your bag</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </>
  );
};
