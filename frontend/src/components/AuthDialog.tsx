import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onOpenChange(false);
    navigate("/signin");
  };

  const handleSignUp = () => {
    onOpenChange(false);
    navigate("/signup");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-soft border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Login Required</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2">
            Please sign in to your account or create a new one to apply coupons and complete your order.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={handleSignIn}
            className="w-full bg-gradient-hero hover:opacity-90 text-primary-foreground font-semibold"
          >
            Sign In
          </Button>
          <Button 
            onClick={handleSignUp}
            variant="outline"
            className="w-full border-primary/20 hover:bg-primary/5"
          >
            Create New Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
