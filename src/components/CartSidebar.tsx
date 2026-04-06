import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Loader2,
  UtensilsCrossed,
  MapPin,
  Phone,
  User,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import emptyCartImg from "@/assets/empty-cart.png";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { menuItems } from "@/data/menuData";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type CheckoutPhase = "review" | "information";

const springTransition = { type: "spring" as const, damping: 32, stiffness: 380 };

const vibrate = () => {
  try {
    navigator.vibrate?.(10);
  } catch {
    /* noop */
  }
};

const CartSidebar = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    tax,
    deliveryFee,
    promoDiscount,
    total,
    mode,
    setMode,
    promoCode,
    setPromoCode,
    applyPromo,
    promoError,
    clearCart,
    isLoading,
    addItem,
  } = useCart();

  const [isMobile, setIsMobile] = useState(false);
  const [phase, setPhase] = useState<CheckoutPhase>("review");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isCartOpen) {
      const t = window.setTimeout(() => setPhase("review"), 280);
      return () => window.clearTimeout(t);
    }
  }, [isCartOpen]);

  const phoneDigits = formData.phone.replace(/\D/g, "");
  const validation = useMemo(() => {
    const nameOk = formData.name.trim().length >= 2;
    const phoneOk = phoneDigits.length >= 10;
    const addressOk = mode === "takeaway" || formData.address.trim().length >= 8;
    const cartOk = items.length > 0;
    return {
      nameOk,
      phoneOk,
      addressOk,
      cartOk,
      allOk: nameOk && phoneOk && addressOk && cartOk,
    };
  }, [formData.name, formData.address, phoneDigits.length, mode, items.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const goPhase = useCallback((p: CheckoutPhase) => {
    vibrate();
    setPhase(p);
    setOrderError("");
  }, []);

  const buildOrderPayload = useCallback(() => {
    const itemized = items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      is_veg: item.isVeg,
    }));
    return {
      version: 1,
      placed_at: new Date().toISOString(),
      customer: {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: mode === "delivery" ? formData.address.trim() : null,
      },
      order_type: mode,
      items: itemized,
      totals: {
        subtotal,
        gst: tax,
        delivery_fee: deliveryFee,
        promo_discount: promoDiscount,
        total,
      },
      promo_code: promoCode.trim() || null,
    };
  }, [items, formData, mode, subtotal, tax, deliveryFee, promoDiscount, total, promoCode]);

  const handlePlaceOrder = async () => {
    setOrderError("");
    if (!validation.allOk) {
      setOrderError("Complete all required fields to place your order.");
      return;
    }

    setIsPlacingOrder(true);
    const itemized = items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));
    const orderPayload = buildOrderPayload();

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const customerId = sessionData.session?.user?.id || null;

      const baseRow = {
        customer_id: customerId,
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_address: mode === "delivery" ? formData.address.trim() : "",
        order_type: mode,
        total_amount: total,
        status: "new",
        items: itemized,
        order_payload: orderPayload,
      };
      console.log('🚀 Step 1: Initiating order placement...', baseRow);

      const insertStart = Date.now();
      let { data: orderData, error: insertError } = await supabase
        .from("orders")
        .insert(baseRow)
        .select()
        .maybeSingle();
      const insertEnd = Date.now();

      console.log(`⏱️ Step 2: Supabase insert took ${insertEnd - insertStart}ms`);

      if (insertError) {
        console.error('❌ Step 2 ERROR: Supabase insertion error:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        });
      } else {
        console.log('✅ Step 2 SUCCESS: Order placed!', orderData);
      }

      const noPayloadMsg =
        !!insertError &&
        (/order_payload|schema cache/i.test(insertError.message ?? "") ||
          insertError.code === "PGRST204" ||
          insertError.message?.includes('order_payload'));

      if (insertError && noPayloadMsg) {
        console.warn('⚠️ Step 3: Retrying without order_payload due to potential schema mismatch...');

        const retryStart = Date.now();
        const retry = await supabase
          .from("orders")
          .insert({
            customer_name: baseRow.customer_name,
            customer_phone: baseRow.customer_phone,
            customer_address: baseRow.customer_address,
            order_type: baseRow.order_type,
            total_amount: baseRow.total_amount,
            status: baseRow.status,
            items: baseRow.items,
          })
          .select()
          .single();
        const retryEnd = Date.now();

        console.log(`⏱️ Step 3: Supabase retry took ${retryEnd - retryStart}ms`);

        if (retry.error) {
          console.error('❌ Step 3 ERROR: Supabase retry failed:', retry.error);
          throw retry.error;
        }

        console.log('✅ Step 3 SUCCESS: Order placed (retry)!', retry.data);

        clearCart();
        setIsCartOpen(false);
        navigate("/order-success", { state: { orderId: retry.data?.id || "guest-order" } });
        return;
      }

      if (insertError) {
        // Identify PGRST116 explicitly if maybeSingle doesn't bypass it, though maybeSingle fixes PGRST116 to null
        if (insertError.code === "PGRST116") {
          console.warn("Row inserted but hidden by RLS rules (PGRST116)");
        } else {
          throw insertError;
        }
      }

      clearCart();
      setIsCartOpen(false);
      navigate("/order-success", { state: { orderId: orderData?.id || "guest-order" } });
    } catch (err: any) {
      const dbError = err?.message || err?.details || "";
      const errorMessage = dbError ? `Failed to place order: ${dbError}` : "Failed to place order";
      console.error('💥 Fatal order placement error:', err);
      setOrderError(errorMessage);
      // Ensure we log the error specifically for debugging as requested
      console.log('Order Error details:', {
        message: errorMessage,
        formData,
        mode,
        itemsCount: items.length,
        total
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const recommendations = menuItems
    .filter((menuItem) => !items.find((cartItem) => cartItem.id === menuItem.id))
    .slice(0, 3);

  const phaseIndex = phase === "review" ? 1 : 2;

  if (!isCartOpen) return null;

  const cartContent = (
    <div className="flex h-full flex-col overflow-hidden bg-[#FFFFFF] relative">
      {isLoading && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="bento-card flex flex-col items-center gap-4 p-6">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <ShoppingBag className="text-primary absolute inset-0 m-auto h-5 w-5 animate-pulse" />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-foreground">Updating cart…</span>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-10 border-b border-[#E8E8E8] bg-white/95 px-5 pt-5 pb-4 backdrop-blur-md">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-primary/10 shadow-inner">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold leading-none tracking-tight text-[#1C1C1C]">
                Your cart
              </h2>
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              vibrate();
              setIsCartOpen(false);
            }}
            className="tap-haptic rounded-[1rem] p-3 transition-colors hover:bg-secondary"
            aria-label="Close cart"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-0.5">
          {([1, 2] as const).map((step) => (
            <div key={step} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-500",
                  phaseIndex >= step ? "bg-primary" : "bg-secondary"
                )}
              />
            </div>
          ))}
          <span className="min-w-[72px] text-right text-[10px] font-extrabold uppercase tracking-tighter text-muted-foreground">
            Step {phaseIndex} / 2
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-8 text-center custom-scrollbar">
          <div className="relative group mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl transition-colors group-hover:bg-primary/15" />
            <img
              src={emptyCartImg}
              alt=""
              className="relative h-52 w-52 object-contain opacity-95 drop-shadow-2xl"
              loading="lazy"
            />
          </div>
          <p className="text-2xl font-extrabold tracking-tight text-[#1C1C1C]">Hungry?</p>
          <p className="mt-3 max-w-[280px] text-sm font-medium leading-relaxed text-muted-foreground">
            Add dishes from the menu — your cart will slide open here.
          </p>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="btn-primary-glow mt-8 flex w-full max-w-xs items-center justify-center gap-2 rounded-[1.25rem] py-4 text-sm font-extrabold"
          >
            Browse menu
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 custom-scrollbar">
            <AnimatePresence mode="wait">
              {phase === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={springTransition}
                  className="space-y-6"
                >
                  <div className="flex gap-1 rounded-[1.25rem] border border-[#E8E8E8] bg-secondary/40 p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        vibrate();
                        setMode("delivery");
                      }}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-[1rem] py-3 text-xs font-extrabold uppercase transition-all tap-haptic",
                        mode === "delivery"
                          ? "bg-white text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <MapPin className="h-4 w-4" />
                      Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        vibrate();
                        setMode("takeaway");
                      }}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-[1rem] py-3 text-xs font-extrabold uppercase transition-all tap-haptic",
                        mode === "takeaway"
                          ? "bg-white text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Takeaway
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                        Items
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          vibrate();
                          clearCart();
                        }}
                        className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-destructive hover:opacity-80"
                      >
                        <Trash2 className="h-3 w-3" />
                        Clear
                      </button>
                    </div>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bento-card group relative flex gap-4 p-4 transition-all hover:border-primary/25"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem]">
                          <img
                            src={item.image}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute right-2 top-2">
                            <div
                              className={cn(
                                "scale-90 border-2 border-white shadow-md",
                                item.isVeg ? "veg-indicator" : "nonveg-indicator"
                              )}
                            />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 py-0.5">
                          <h4 className="truncate text-sm font-extrabold text-[#1C1C1C]">{item.name}</h4>
                          <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                            £{item.price.toLocaleString('en-GB', { minimumFractionDigits: 2 })} / unit
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center rounded-full border border-[#E8E8E8] bg-secondary/50 p-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="tap-haptic flex h-8 w-8 items-center justify-center rounded-full hover:bg-white disabled:opacity-30"
                                disabled={item.quantity <= 1 || isLoading}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-extrabold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="tap-haptic flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 text-primary hover:bg-primary/20"
                                disabled={isLoading}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-extrabold">£{(item.price * item.quantity).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="tap-haptic absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border border-[#E8E8E8] bg-white text-muted-foreground opacity-0 shadow-md transition-opacity hover:text-destructive group-hover:opacity-100"
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {recommendations.length > 0 && (
                    <div className="pt-2">
                      <div className="mb-3 flex items-center gap-2 px-1">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                          Often ordered together
                        </span>
                      </div>
                      <div className="space-y-2">
                        {recommendations.map((rec) => (
                          <div
                            key={rec.id}
                            className="bento-card flex items-center gap-3 p-3 transition-all hover:border-primary/20"
                          >
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[0.75rem]">
                              <img src={rec.image} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-extrabold text-[#1C1C1C]">{rec.name}</p>
                              <p className="text-[10px] font-bold text-primary">£{rec.price.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => addItem(rec)}
                              className="tap-haptic flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-primary/10 text-primary hover:bg-primary hover:text-white"
                              disabled={isLoading}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {phase === "information" && (
                <motion.div
                  key="information"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={springTransition}
                  className="space-y-6"
                >
                  <button
                    type="button"
                    onClick={() => goPhase("review")}
                    className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground hover:text-primary"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to items
                  </button>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <User className="h-4 w-4 text-primary" />
                      <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
                        Your details
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="ml-1 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                        Name
                      </Label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="Full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="h-14 rounded-[1rem] border-[#E8E8E8] pl-12 text-sm font-medium focus-visible:ring-primary/20"
                          disabled={isPlacingOrder}
                          autoComplete="name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="ml-1 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                        Phone
                      </Label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          placeholder="10-digit mobile number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="h-14 rounded-[1rem] border-[#E8E8E8] pl-12 text-sm font-medium focus-visible:ring-primary/20"
                          disabled={isPlacingOrder}
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                  </div>

                  {mode === "delivery" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-1">
                        <MapPin className="h-4 w-4 text-primary" />
                        <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
                          Address
                        </h3>
                      </div>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                        <textarea
                          id="address"
                          name="address"
                          placeholder="Flat, street, landmark, city — we’ll route smarter with more detail"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full resize-none rounded-[1rem] border border-[#E8E8E8] py-3.5 pl-12 pr-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                          disabled={isPlacingOrder}
                        />
                      </div>
                    </div>
                  )}

                  {orderError && phase === "information" && (
                    <div className="flex gap-3 rounded-[1rem] border border-destructive/15 bg-destructive/5 p-4">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      <p className="text-xs font-bold text-destructive">{orderError}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="sticky bottom-0 z-10 border-t border-[#E8E8E8] bg-white/95 px-5 py-5 shadow-[0_-12px_40px_-18px_rgba(0,0,0,0.12)] backdrop-blur-md">
            {phase === "review" && (
              <div className="mb-4 space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full rounded-[1rem] border border-[#E8E8E8] py-3.5 pl-10 pr-3 text-xs font-extrabold uppercase tracking-widest placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      vibrate();
                      applyPromo();
                    }}
                    className="tap-haptic rounded-[1rem] bg-primary/10 px-5 py-3 text-xs font-extrabold uppercase tracking-widest text-primary hover:bg-primary hover:text-white disabled:opacity-30"
                    disabled={!promoCode || isLoading}
                  >
                    Apply
                  </button>
                </div>
                {promoError ? (
                  <p className="px-1 text-[10px] font-bold text-destructive">{promoError}</p>
                ) : null}
                {promoDiscount > 0 ? (
                  <div className="flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 px-2 py-2 text-[10px] font-extrabold uppercase tracking-widest text-primary">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Saved £{promoDiscount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </div>
                ) : null}
              </div>
            )}

            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-[#1C1C1C]">£{subtotal.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
              </div>
              {mode === "delivery" && (
                <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-[#1C1C1C]">£{deliveryFee.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                <span>Tax</span>
                <span className="text-[#1C1C1C]">£{tax.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-widest text-primary">
                  <span>Promo</span>
                  <span>−£{promoDiscount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-dashed border-[#E8E8E8] pt-3">
                <span className="text-sm font-extrabold uppercase tracking-tight text-[#1C1C1C]">Total</span>
                <span className="text-2xl font-extrabold tracking-tighter text-primary">£{total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {phase === "review" && (
              <button
                type="button"
                onClick={() => goPhase("information")}
                disabled={isLoading || items.length === 0}
                className="btn-primary-glow flex w-full items-center justify-center gap-2 rounded-[1.25rem] py-4 text-base font-extrabold"
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
            {phase === "information" && (
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={
                  isPlacingOrder ||
                  !validation.nameOk ||
                  !validation.phoneOk ||
                  !validation.addressOk
                }
                className="btn-primary-glow relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[1.25rem] py-4 text-base font-extrabold"
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Placing order…
                  </>
                ) : (
                  <>
                    Place order
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            )}

            {phase === "review" && (
              <p className="mt-3 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Secure checkout · HungryDash
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DrawerContent className="h-[90vh] border-t border-[#E8E8E8] bg-[#FFFFFF] p-0">
          <motion.div
            initial={{ y: 24, opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            transition={springTransition}
            className="h-full overflow-hidden rounded-t-[1.5rem]"
          >
            {cartContent}
          </motion.div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <>
      <motion.div
        role="presentation"
        className="fixed inset-0 z-50 cursor-default bg-[#1C1C1C]/35 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsCartOpen(false)}
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={springTransition}
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-[#FFFFFF] shadow-2xl"
      >
        {cartContent}
      </motion.aside>
    </>
  );
};

export default CartSidebar;
