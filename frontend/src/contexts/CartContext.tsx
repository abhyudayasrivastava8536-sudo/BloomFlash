import React, { createContext, useContext, useState, ReactNode } from "react";

import type { FlowerPhoto } from "@/components/FlowerTile";

export interface CartItem {
  id: string;
  name: string;
  hindi?: string;
  image: string;
  crop?: [number, number];
  photoId?: FlowerPhoto;
  price: number;
  unit: string;
  quantity: number;
  type?: "flower" | "pack";
  orderType?: "subscription" | "onetime";
}

interface CartContextType {
  cart: Record<string, CartItem>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">, initialQuantity?: number) => void;
  updateQuantity: (itemId: string, change: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: Omit<CartItem, "quantity">, initialQuantity = 1) => {
    setCart((prev) => {
      const existing = prev[item.id];
      if (existing) {
        if (item.orderType === "subscription") return prev;
        return {
          ...prev,
          [item.id]: { ...existing, quantity: existing.quantity + 1 }
        };
      }
      return {
        ...prev,
        [item.id]: { ...item, quantity: initialQuantity }
      };
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart((prev) => {
      const item = prev[itemId];
      if (!item) return prev;
      
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [itemId]: { ...item, quantity: newQuantity }
      };
    });
  };

  const clearCart = () => setCart({});

  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      isCartOpen, 
      setIsCartOpen, 
      addToCart, 
      updateQuantity, 
      clearCart,
      totalItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
