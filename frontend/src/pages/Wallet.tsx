import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Coins, Flower2, Leaf, RefreshCw, Wallet as WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

type WalletSummary = { phoolcoins: number; discountCredit: number };

export default function Wallet() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api<WalletSummary>("/wallet")
      .then((result) => { if (active) setSummary(result); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Unable to load your wallet."); });
    return () => { active = false; };
  }, []);

  return (
    <main className="min-h-screen bg-[#f3eee6]">
      <header className="border-b border-[#c5a66d]/45 bg-[#241518] text-[#f7efe3] shadow-[0_18px_45px_-36px_rgba(0,0,0,.8)]">
        <div className="container mx-auto flex items-center gap-4 px-4 py-5">
          <Button aria-label="Back to storefront" variant="ghost" size="icon" onClick={() => navigate("/")} className="text-[#ead8b5] hover:bg-white/10 hover:text-white"><ArrowLeft className="h-5 w-5" /></Button>
          <div><p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#d9bd82]">Your rewards, in bloom</p><h1 className="font-editorial text-4xl text-[#fff8ec]">My wallet</h1></div>
        </div>
      </header>
      <section className="container mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-2">
        {error ? <Card className="md:col-span-2"><CardContent className="p-8 text-center"><p role="alert" className="text-destructive">{error}</p><Button className="mt-5" onClick={() => navigate("/signin")}>Sign in again</Button></CardContent></Card> : <>
          <Card className="overflow-hidden border-0 bg-[#251c18] text-[#f5f0e8] shadow-medium"><CardContent className="p-7 md:p-9">
            <div className="flex items-center gap-3 text-[#dfc298]"><WalletIcon className="h-5 w-5"/><span className="text-xs uppercase tracking-[.2em]">BloomFlash wallet</span></div>
            <p className="mt-9 text-sm text-white/60">Return-flower credit</p>
            <p className="mt-1 text-5xl">₹{(summary?.discountCredit ?? 0).toFixed(2)}</p>
            <p className="mt-4 text-sm leading-6 text-white/65">Your return rewards are automatically applied to your next eligible order.</p>
            <Button onClick={() => navigate("/")} className="mt-7 bg-[#dfc298] text-[#251c18] hover:bg-[#ecd5ad]">Explore flowers <Flower2 className="ml-2 h-4 w-4"/></Button>
          </CardContent></Card>
          <Card className="border-[#d7b976]/35 bg-[#faf4e9]"><CardContent className="p-7 md:p-9">
            <div className="flex items-center gap-3 text-[#94682e]"><Coins className="h-5 w-5"/><span className="text-xs uppercase tracking-[.2em]">PhoolCoins</span></div>
            <p className="mt-9 text-5xl text-foreground">{summary?.phoolcoins ?? 0}</p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">Earn coins as you order. Every ritual supports a more thoughtful flower cycle.</p>
            <div className="mt-8 flex items-center gap-3 border-t border-[#251c18]/10 pt-5 text-sm text-muted-foreground"><RefreshCw className="h-4 w-4 text-[#94682e]"/>Return used blooms to earn wallet credit.</div>
          </CardContent></Card>
          <Card className="md:col-span-2 border-[#c5a66d]/45 bg-[#fffaf2] shadow-[0_20px_55px_-40px_rgba(66,25,35,.6)]"><CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Leaf className="h-5 w-5"/></div><div><h2 className="font-semibold">Keep the flower cycle turning</h2><p className="mt-1 text-sm text-muted-foreground">Schedule a flower return from any order in My Orders. Your credit is added here automatically.</p></div><Button variant="outline" className="sm:ml-auto border-[#54232e] bg-[#54232e] text-white hover:bg-[#401a24] hover:text-white" onClick={() => navigate("/orders")}>View my orders</Button></CardContent></Card>
        </>}
      </section>
    </main>
  );
}