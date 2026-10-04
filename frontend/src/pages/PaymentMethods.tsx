import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Plus, Trash2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SavedCard {
  id: string;
  type: "credit" | "debit";
  lastFour: string;
  expiry: string;
  name: string;
}

interface SavedUPI {
  id: string;
  upiId: string;
  app?: string;
}

export default function PaymentMethods() {
  const navigate = useNavigate();
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [savedUPIs, setSavedUPIs] = useState<SavedUPI[]>([]);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [upiDialogOpen, setUpiDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState<{ number: string; expiry: string; cvv: string; name: string; type: "credit" | "debit" }>({ number: "", expiry: "", cvv: "", name: "", type: "credit" });
  const [newUPI, setNewUPI] = useState("");

  useEffect(() => {
    const cards = localStorage.getItem("bloomflash_cards");
    const upis = localStorage.getItem("bloomflash_upis");
    if (cards) setSavedCards(JSON.parse(cards));
    if (upis) setSavedUPIs(JSON.parse(upis));
  }, []);

  const saveCard = () => {
    if (newCard.number.length < 16 || !newCard.expiry || !newCard.name) {
      toast.error("Please fill all card details");
      return;
    }
    const card: SavedCard = {
      id: Date.now().toString(),
      type: newCard.type,
      lastFour: newCard.number.slice(-4),
      expiry: newCard.expiry,
      name: newCard.name
    };
    const updated = [...savedCards, card];
    setSavedCards(updated);
    localStorage.setItem("bloomflash_cards", JSON.stringify(updated));
    setNewCard({ number: "", expiry: "", cvv: "", name: "", type: "credit" });
    setCardDialogOpen(false);
    toast.success("Card saved successfully!");
  };

  const saveUPI = (app?: string) => {
    const upiId = app ? `user@${app.toLowerCase()}` : newUPI;
    if (!upiId || !upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID");
      return;
    }
    const upi: SavedUPI = {
      id: Date.now().toString(),
      upiId,
      app
    };
    const updated = [...savedUPIs, upi];
    setSavedUPIs(updated);
    localStorage.setItem("bloomflash_upis", JSON.stringify(updated));
    setNewUPI("");
    setUpiDialogOpen(false);
    toast.success("UPI ID saved successfully!");
  };

  const deleteCard = (id: string) => {
    const updated = savedCards.filter(c => c.id !== id);
    setSavedCards(updated);
    localStorage.setItem("bloomflash_cards", JSON.stringify(updated));
    toast.success("Card removed");
  };

  const deleteUPI = (id: string) => {
    const updated = savedUPIs.filter(u => u.id !== id);
    setSavedUPIs(updated);
    localStorage.setItem("bloomflash_upis", JSON.stringify(updated));
    toast.success("UPI removed");
  };

  const upiApps = [
    { name: "GPay", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png", color: "bg-white" },
    { name: "PhonePe", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png", color: "bg-purple-600" },
    { name: "Paytm", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png", color: "bg-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-[#f3eee6]">
      <div className="border-b border-[#c5a66d]/45 bg-[#241518] px-4 py-4 text-[#f7efe3]">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-[#ead8b5] hover:bg-white/10 hover:text-white" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-editorial text-3xl text-[#fff8ec]">Payment Methods</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8 max-w-2xl">
        {/* Cards Section */}
        <Card className="border-[#c5a66d]/40 bg-[#fffaf2] shadow-[0_20px_55px_-40px_rgba(66,25,35,.65)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#9c6f32]" />
              Credit & Debit Cards
            </CardTitle>
            <Dialog open={cardDialogOpen} onOpenChange={setCardDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1 border border-[#d4b971] bg-[#54232e] text-[#fff8ec] hover:bg-[#401a24]">
                  <Plus className="h-4 w-4" /> Add Card
                </Button>
              </DialogTrigger>
              <DialogContent className="border-[#c5a66d]/45 bg-[#fbf7ef]">
                <DialogHeader>
                  <DialogTitle>Add New Card</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="flex gap-2">
                    <Button
                      variant={newCard.type === "credit" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewCard({ ...newCard, type: "credit" })}
                    >
                      Credit Card
                    </Button>
                    <Button
                      variant={newCard.type === "debit" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewCard({ ...newCard, type: "debit" })}
                    >
                      Debit Card
                    </Button>
                  </div>
                  <div>
                    <Label>Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={newCard.number}
                      onChange={(e) => setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Expiry</Label>
                      <Input
                        placeholder="MM/YY"
                        value={newCard.expiry}
                        onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input
                        type="password"
                        placeholder="***"
                        maxLength={3}
                        value={newCard.cvv}
                        onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Cardholder Name</Label>
                    <Input
                      placeholder="Name on card"
                      value={newCard.name}
                      onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                    />
                  </div>
                  <Button onClick={saveCard} className="w-full bg-[#54232e] text-white hover:bg-[#401a24]">
                    Save Card
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {savedCards.length === 0 ? (
              <p className="text-muted-foreground text-sm">No cards saved yet</p>
            ) : (
              <div className="space-y-3">
                {savedCards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-8 w-8 text-[#9c6f32]" />
                      <div>
                        <p className="font-medium">•••• •••• •••• {card.lastFour}</p>
                        <p className="text-xs text-muted-foreground">{card.type === "credit" ? "Credit" : "Debit"} • Expires {card.expiry}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteCard(card.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* UPI Section */}
        <Card className="border-[#c5a66d]/40 bg-[#fffaf2] shadow-[0_20px_55px_-40px_rgba(66,25,35,.65)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="font-bold text-[#9c6f32]">UPI</span>
              Payments
            </CardTitle>
            <Dialog open={upiDialogOpen} onOpenChange={setUpiDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1 border border-[#d4b971] bg-[#54232e] text-[#fff8ec] hover:bg-[#401a24]">
                  <Plus className="h-4 w-4" /> Add UPI
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add UPI ID</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Enter UPI ID</Label>
                    <Input
                      placeholder="yourname@upi"
                      value={newUPI}
                      onChange={(e) => setNewUPI(e.target.value)}
                    />
                  </div>
                  <Button onClick={() => saveUPI()} className="w-full bg-[#54232e] text-white hover:bg-[#401a24]">
                    Save UPI ID
                  </Button>
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-3">Or link with your favorite app</p>
                    <div className="grid grid-cols-3 gap-3">
                      {upiApps.map((app) => (
                        <button
                          key={app.name}
                          onClick={() => saveUPI(app.name)}
                          className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <img src={app.icon} alt={app.name} className="h-10 w-10 object-contain" />
                          <span className="text-xs font-medium">{app.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {savedUPIs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No UPI IDs saved yet</p>
            ) : (
              <div className="space-y-3">
                {savedUPIs.map((upi) => (
                  <div key={upi.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-[#6a7750]" />
                      <div>
                        <p className="font-medium">{upi.upiId}</p>
                        {upi.app && <p className="text-xs text-muted-foreground">Linked with {upi.app}</p>}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteUPI(upi.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* International Payments */}
        <Card className="border-[#c5a66d]/40 bg-[#fffaf2] shadow-[0_20px_55px_-40px_rgba(66,25,35,.65)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌍 International Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 rounded-xl border border-[#ddcfb7] bg-white/70 p-4 transition-colors hover:border-[#8b4a53] hover:bg-[#f8f1e8]">
                <span className="font-semibold tracking-tight text-[#203b75]">PayPal</span>
              </button>
              <button className="flex items-center justify-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors">
                <span className="font-semibold tracking-tight text-[#21191a]">Apple Pay</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">Coming soon for international customers</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
