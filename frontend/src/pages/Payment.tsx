import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Wallet, Banknote } from "lucide-react";
import { api } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, total, address } = location.state || { cart: [], total: 0, address: {} };
  const isSubscription = location.state?.mode === "subscription";
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { clearCart } = useCart();

  const handlePayment = async () => {
    setSubmitting(true); setError("");
    try { const order = await api<{id:string; total:number; coinsEarned:number; items:unknown[]; mode:string}>("/orders", { method: "POST", body: JSON.stringify({ items: cart, address, payment: paymentMethod, coupon: location.state?.coupon, mode: location.state?.mode || "one-time" }) }); clearCart(); navigate("/orders", { state: { placed: true, placedOrder: order } }); }
    catch (e) { setError(e instanceof Error ? e.message : "We couldn't place this order."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(112,45,52,.23),transparent_35%),linear-gradient(145deg,#171011,#241518_48%,#171011)] px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate("/checkout", { state: { cart, total, mode: location.state?.mode, coupon: location.state?.coupon } })}
          className="mb-6 flex items-center gap-2 text-[#ead8b5]/75 transition-colors hover:text-[#ead8b5]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Address
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="h-fit rounded-[1.5rem] border border-[#b99a63]/55 bg-[#251719] p-6 text-[#f7efe3] shadow-[0_28px_90px_-36px_rgba(0,0,0,.75)]">
            <h2 className="mb-4 font-editorial text-3xl text-[#f3dfb5]">{isSubscription ? "Monthly plan" : "Order summary"}</h2>
            <div className="space-y-3 mb-4">
              {cart.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-white/65">{isSubscription ? `${item.name} · one monthly plan` : `${item.name} x ${item.quantity}`}</span>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mb-4 border-t border-[#cfb475]/30 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{isSubscription ? "Monthly plan total:" : "Total:"}</span>
                <span className="font-editorial text-3xl text-[#e6c783]">₹{total}</span>
              </div>
              {isSubscription && <p className="mt-2 text-xs leading-5 text-white/55">Demo checkout only. No real charge or automatic renewal will occur.</p>}
              <div className="mt-4 rounded-xl border border-[#cfb475]/35 bg-[#fffaf1]/[.07] p-4 text-sm text-[#f3e8d4]">
                {isSubscription && cart?.[0]?.id?.startsWith("subscription-pack-") && <div className="mb-2 flex justify-between text-muted-foreground"><span>Saving vs 30 daily orders</span><span>₹{Number(cart[0].id.split("-").at(-1)) * 3}</span></div>}
                <div className="flex justify-between text-[#f0d599]"><span>PhoolCoins earned</span><strong>{Math.floor(Number(total || 0) / 10)}</strong></div>
                <div className="mt-1 flex justify-between text-[#f0d599]"><span>Potential wallet credit after flower return</span><strong>₹{Math.round(Number(total || 0) * 0.1)}</strong></div>
              </div>
              <p className="mt-2 text-[11px] text-white/55">Wallet credit is awarded after you schedule a flower return in order history.</p>
            </div>
            <div className="rounded-xl border border-[#cfb475]/25 bg-white/[.06] p-4 text-sm">
              <p className="font-semibold mb-2">Delivery Address:</p>
              <p className="text-white/65">
                {address.name}<br />
                {address.address}<br />
                {address.landmark && `${address.landmark}, `}
                {address.pincode}<br />
                Phone: {address.phone}
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="rounded-[1.5rem] border border-[#b99a63]/45 bg-[#fbf7ef] p-6 shadow-[0_28px_90px_-36px_rgba(0,0,0,.65)]">
            <h2 className="mb-6 font-editorial text-3xl text-[#421923]">Select Payment Method</h2>
            
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
              <div className="flex items-center space-x-3 border border-[#ddcfb7] rounded-xl p-4 transition-colors hover:border-[#8b4a53] hover:bg-[#f8f1e8] cursor-pointer">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Smartphone className="h-5 w-5 text-[#9c6f32]" />
                  <span className="font-semibold">UPI</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3 border border-[#ddcfb7] rounded-xl p-4 transition-colors hover:border-[#8b4a53] hover:bg-[#f8f1e8] cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 text-[#9c6f32]" />
                  <span className="font-semibold">Credit/Debit Card</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3 border border-[#ddcfb7] rounded-xl p-4 transition-colors hover:border-[#8b4a53] hover:bg-[#f8f1e8] cursor-pointer">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Wallet className="h-5 w-5 text-[#9c6f32]" />
                  <span className="font-semibold">Wallet</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3 border border-[#ddcfb7] rounded-xl p-4 transition-colors hover:border-[#8b4a53] hover:bg-[#f8f1e8] cursor-pointer">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Banknote className="h-5 w-5 text-[#9c6f32]" />
                  <span className="font-semibold">Cash on Delivery</span>
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "upi" && (
              <div className="mt-6 space-y-3">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && <p role="alert" className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            <Button
              onClick={handlePayment}
              disabled={submitting || !localStorage.getItem("bloomflash_token")}
              className="mt-6 h-12 w-full border border-[#d9bd82] bg-[#54232e] text-lg font-semibold text-[#fffaf1] hover:bg-[#401a24]"
            >
              {paymentMethod === "cod" ? "Place Order" : `Pay ₹${total}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
