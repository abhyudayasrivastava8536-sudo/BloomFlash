import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Flower2 } from "lucide-react";
import { api, type Session } from "@/lib/api";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try { const session = await api<Session>("/auth/signin", { method: "POST", body: JSON.stringify({ email, password }) }); localStorage.setItem("bloomflash_token", session.token); localStorage.setItem("user", JSON.stringify(session.user)); window.dispatchEvent(new Event("bloomflash:auth-changed")); navigate("/"); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in."); }
  };

  const handleGoogleSignIn = () => setError("Social sign-in is not enabled in this demo. Use your email and password.");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_20%_15%,rgba(133,47,60,.45),transparent_35%),radial-gradient(ellipse_at_85%_90%,rgba(130,94,43,.22),transparent_34%),linear-gradient(145deg,#160f10,#261719_54%,#160f10)] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-[1.6rem] border border-[#c7a96a]/50 bg-[#fbf7ef] p-7 shadow-[0_32px_100px_-40px_rgba(0,0,0,.9)] sm:p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-xl border border-[#d8bd81]/50 bg-[#421923] p-3 shadow-[0_10px_30px_-14px_rgba(66,25,35,.9)]">
              <Flower2 className="h-8 w-8 text-[#e7d09a]" />
            </div>
          </div>
          <h1 className="mb-2 text-center font-editorial text-4xl text-[#421923]">Welcome Back</h1>
          <p className="text-center text-muted-foreground mb-6">
            Sign in to continue to BloomFlash
          </p>

          <form onSubmit={handleSignIn} className="space-y-4">
            {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full border border-[#d4b971] bg-[#54232e] font-semibold text-[#fff8ec] shadow-md hover:bg-[#401a24]">
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#fbf7ef] px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-[#c8ae7b] text-[#54232e] hover:bg-[#f2e9da]"
            onClick={handleGoogleSignIn}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="font-semibold text-[#8b4a53] hover:text-[#54232e] hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
