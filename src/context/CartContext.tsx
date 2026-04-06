import React, { createContext, useContext, useState, useCallback } from "react";
import type { MenuItem } from "@/data/menuData";
import { toast } from "sonner";

export type CartItem = MenuItem & { quantity: number };
export type OrderMode = "delivery" | "takeaway";

type CartContextType = {
  items: CartItem[];
  mode: OrderMode;
  setMode: (mode: OrderMode) => void;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoDiscount: number;
  applyPromo: () => void;
  promoError: string;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

const DELIVERY_FEE = 49;
const TAX_RATE = 0.05;
const VALID_PROMOS: Record<string, number> = { BABU20: 0.2, WELCOME10: 0.1, FEAST50: 50 };

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mode, setMode] = useState<OrderMode>("delivery");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addItem = useCallback((item: MenuItem) => {
    setIsLoading(true);
    setTimeout(() => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
        return [...prev, { ...item, quantity: 1 }];
      });
      setIsLoading(false);
      
      toast.success(`${item.name} added to cart!`, {
        description: "Your delicious meal is waiting in the cart.",
        position: "top-center",
        duration: 3000,
        action: {
          label: "View Cart",
          onClick: () => setIsCartOpen(true),
        },
      });
    }, 300);
  }, [setIsCartOpen]);

  const removeItem = useCallback((id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setIsLoading(false);
    }, 200);
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
    setIsLoading(true);
    setTimeout(() => {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
      setIsLoading(false);
    }, 200);
  }, [removeItem]);

  const clearCart = useCallback(() => { 
    setIsLoading(true);
    setTimeout(() => {
      setItems([]); 
      setPromoDiscount(0); 
      setPromoCode(""); 
      setIsLoading(false);
    }, 300);
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const deliveryFee = mode === "delivery" ? DELIVERY_FEE : 0;

  const applyPromo = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const code = promoCode.toUpperCase().trim();
      const discount = VALID_PROMOS[code];
      if (!discount) { setPromoError("Invalid promo code"); setPromoDiscount(0); setIsLoading(false); return; }
      setPromoError("");
      setPromoDiscount(discount < 1 ? Math.round(subtotal * discount) : discount);
      setIsLoading(false);
    }, 400);
  }, [promoCode, subtotal]);

  const total = Math.max(0, subtotal + tax + deliveryFee - promoDiscount);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, mode, setMode, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal, tax, deliveryFee, total, promoCode, setPromoCode, promoDiscount, applyPromo, promoError, isCartOpen, setIsCartOpen, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};
