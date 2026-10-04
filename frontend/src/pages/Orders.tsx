import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, ShoppingBag, Clock, MapPin, Coins, Recycle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

interface Order {
  id: string;
  items: Array<{ id: string; name: string; quantity: number; price: number; unit?: string }>;
  mode?: "subscription" | "one-time";
  total: number;
  status: string;
  createdAt: string;
  eta: string | null;
  address: { address: string; pincode: string; landmark?: string };
  coinsEarned: number;
}

export default function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [returnedOrderIds, setReturnedOrderIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    Promise.all([api<Order[]>("/orders"), api<{ orderId: string }[]>("/pickups")]).then(([savedOrders, pickups]) => { setOrders(savedOrders); setReturnedOrderIds(pickups.map((pickup) => pickup.orderId)); }).catch((e) => { const message = e instanceof Error ? e.message : "Unable to load your orders."; setLoadError(message); toast.error(message); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const placedOrder = location.state?.placedOrder;
    if (location.state?.placed && placedOrder?.id) {
      toast.success(`Order placed · ${placedOrder.coinsEarned} PhoolCoins earned`);
      setOrders((current) => current.some((order) => order.id === placedOrder.id) ? current : [placedOrder, ...current]);
    }
  }, [location.state]);

  const orderAgain = (order: Order) => {
    const crops: Record<string, [number, number]> = { rose: [2,0], marigold: [0,0], lotus: [1,0], hibiscus: [0,1], "rose-garland": [2,1], "marigold-garland": [1,1], "mixed-garland": [0,2], "white-chrysanthemum": [0,0] };
    const photos: Record<string, "rose" | "marigold" | "lotus" | "hibiscus" | "guldaudi" | "roseGarland" | "marigoldGarland" | "mixedGarland" | "packBasic" | "packStandard" | "packPremium" | "packDeluxe"> = { rose: "rose", marigold: "marigold", lotus: "lotus", hibiscus: "hibiscus", "white-chrysanthemum": "guldaudi", "rose-garland": "roseGarland", "marigold-garland": "marigoldGarland", "mixed-garland": "mixedGarland", "pack-10": "packBasic", "pack-20": "packStandard", "pack-30": "packPremium", "pack-50": "packDeluxe" };
    order.items.forEach((item) => {
      const id = order.mode === "subscription" && item.id.startsWith("pack-") ? `subscription-${item.id}` : item.id;
      addToCart({ id, name: item.name, image: "", crop: crops[item.id] || [0,0], photoId: photos[item.id], price: item.price, unit: item.unit || (id.startsWith("subscription-") ? "month" : "each"), type: item.id.startsWith("pack-") ? "pack" : "flower", orderType: order.mode === "subscription" ? "subscription" : "onetime" }, item.quantity);
    });
    toast.success("Your previous order is back in the bag.");
    navigate("/");
  };

  const scheduleReturn = async (orderId: string) => {
    try { const pickup = await api<{ orderId: string; reward: number }>("/pickups", { method: "POST", body: JSON.stringify({ orderId }) }); setReturnedOrderIds((ids) => [...ids, orderId]); toast.success(`Flower return arranged. ₹${pickup.reward} credit added to your wallet.`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Unable to arrange a flower return."); }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing": case "placed": return "bg-amber-500/20 text-amber-600 border-amber-300";
      case "shipped": return "bg-blue-500/20 text-blue-600 border-blue-300";
      case "out_for_delivery": return "bg-primary/20 text-primary border-primary/30";
      case "delivered": return "bg-green-500/20 text-green-600 border-green-300";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "processing": case "placed": return "Placed";
      case "shipped": return "Shipped";
      case "out_for_delivery": return "Out for Delivery";
      case "delivered": return "Delivered";
    }
  };

  return (
    <div className="min-h-screen bg-[#f4efe7] text-[#281b1b]">
      <div className="border-b border-[#c5a66d]/50 bg-[#241518] px-4 py-4 text-[#f8f0e3]">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-editorial text-3xl text-[#f5e7cd]">My Orders</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {location.state?.placedOrder && <div className="mb-6 rounded-2xl border border-[#d8e3d0] bg-[#f4f8f0] p-5 text-[#455c3e]"><p className="font-semibold">Your ritual is on its way.</p><p className="mt-1 text-sm">You earned {location.state.placedOrder.coinsEarned} PhoolCoins. Return the used flowers when convenient to receive ₹{Math.round(location.state.placedOrder.total * .1)} in wallet credit.</p></div>}
        {loading ? <div className="py-20 text-center text-muted-foreground">Loading your order history…</div> : loadError ? <div role="alert" className="mx-auto max-w-lg rounded-2xl border border-[#e3d5cf] bg-white p-8 text-center"><h2 className="font-editorial text-3xl text-[#421923]">We couldn’t load your orders</h2><p className="mt-2 text-sm text-muted-foreground">{loadError}</p><Button className="mt-5 bg-[#54232e] text-white hover:bg-[#401a24]" onClick={() => navigate("/signin")}>Sign in again</Button></div> : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-primary/10 rounded-full p-8 mb-6">
              <Package className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Orders Yet</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
              You haven't placed any orders yet. Start exploring our fresh flowers and garlands!
            </p>
            <Button 
              onClick={() => navigate("/")} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              size="lg"
            >
              <ShoppingBag className="h-5 w-5" />
              Order Now
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-[#c5a66d]/40 bg-[#fffdf9] shadow-[0_18px_50px_-38px_rgba(40,20,20,.55)]">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-editorial text-2xl text-[#421923]">Order #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} border`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">₹{order.total}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm bg-primary/5 p-3 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Delivery estimate: <strong>{order.eta ? new Date(order.eta).toLocaleString() : "confirmed for your address"}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{order.address?.address}, {order.address?.landmark ? `${order.address.landmark}, ` : ""}{order.address?.pincode}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm bg-amber-500/10 p-3 rounded-lg">
                    <Coins className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-700">
                      You earned <strong>{order.coinsEarned} PhoolCoins</strong> on this order!
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2"><Button variant="outline" onClick={() => orderAgain(order)} className="justify-center gap-2 border-[#54232e] bg-[#54232e] font-semibold text-white shadow-sm hover:bg-[#401a24] hover:text-white"><ShoppingBag className="h-4 w-4" />Order again</Button><Button variant="outline" onClick={() => scheduleReturn(order.id)} disabled={returnedOrderIds.includes(order.id)} className={`justify-center gap-2 border-[#9b793e] bg-[#faf3e4] font-semibold text-[#543d20] hover:bg-[#f0e2c6] ${returnedOrderIds.includes(order.id) ? "cursor-default opacity-100" : ""}`}><Recycle className="h-4 w-4" />{returnedOrderIds.includes(order.id) ? "Flower return scheduled" : <>Return flowers · earn ₹{Math.round(order.total * 0.1)} credit</>}</Button></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
