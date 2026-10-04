import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, total } = location.state || { cart: [], total: 0 };
  const isSubscription = location.state?.mode === "subscription";
  const estimatedCoins = Math.floor(Number(total || 0) / 10);
  const returnCredit = Math.round(Number(total || 0) * 0.1);
  const packDailyPrice = isSubscription && cart?.[0]?.id?.startsWith("subscription-pack-") ? Number(cart[0].id.split("-").at(-1)) : 0;

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    address: "",
    landmark: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localStorage.getItem("bloomflash_token")) { navigate("/signin", { state: { from: "/checkout" } }); return; }
    navigate("/payment", { state: { cart, total, address, coupon: location.state?.coupon, mode: location.state?.mode } });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(112,45,52,.28),transparent_35%),linear-gradient(145deg,#171011,#241518_48%,#171011)] px-4 py-8">
      <div className="container mx-auto max-w-2xl">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-[#ead8b5]/75 transition-colors hover:text-[#ead8b5]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="rounded-[1.6rem] border border-[#b99a63]/45 bg-[#fbf7ef] p-6 shadow-[0_28px_90px_-36px_rgba(0,0,0,.75)] sm:p-9">
          <p className="section-kicker mb-2">{isSubscription ? "A ritual that comes full circle" : "Thoughtfully prepared for you"}</p>
          <h1 className="mb-6 font-editorial text-5xl text-[#421923]">{isSubscription ? "Monthly flower plan" : "Delivery address"}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                placeholder="Enter your pincode"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Complete Address</Label>
              <Textarea
                id="address"
                placeholder="House/Flat No., Building Name, Street"
                value={address.address}
                onChange={(e) => setAddress({ ...address, address: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input
                id="landmark"
                placeholder="Nearby landmark for easy delivery"
                value={address.landmark}
                onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
              />
            </div>

            <div className="border-t border-[#c6ad7d]/50 pt-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">{isSubscription ? "Monthly plan total:" : "Total amount:"}</span>
                <span className="text-2xl font-bold text-primary">₹{total}</span>
              </div>
              <div className="mb-4 rounded-xl border border-[#d9c69f] bg-[#f6efe3] p-4 text-sm">
                {isSubscription && packDailyPrice > 0 && <div className="mb-2 flex justify-between gap-3 text-muted-foreground"><span>30 daily orders</span><span className="line-through">₹{packDailyPrice * 30}</span></div>}
                {isSubscription && packDailyPrice > 0 && <div className="mb-2 flex justify-between gap-3 font-medium text-[#55734d]"><span>Monthly plan saving</span><span>₹{packDailyPrice * 3}</span></div>}
                <div className="flex justify-between gap-3 text-[#54232e]"><span>Estimated PhoolCoins</span><strong>{estimatedCoins}</strong></div>
                <div className="mt-1 flex justify-between gap-3 text-[#6b2b36]"><span>Potential wallet credit after flower return</span><strong>₹{returnCredit}</strong></div>
              </div>
              {isSubscription && <p className="mb-4 text-xs leading-5 text-muted-foreground">One 30-day plan, shown as a single subscription item. Demo checkout does not charge or automatically renew. Return credit is added only after a return is scheduled.</p>}
              <Button
                type="submit"
                className="h-12 w-full border border-[#d9bd82] bg-[#54232e] text-lg font-semibold text-[#fffaf1] shadow-[0_12px_28px_-16px_rgba(84,35,46,.9)] hover:bg-[#401a24]"
              >
                Proceed to Payment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
