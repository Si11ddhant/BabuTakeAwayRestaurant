import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { MapPin, Phone, Mail, User, CreditCard, Smartphone, Building2, Banknote, CheckCircle2, ShoppingCart, ArrowRight, Loader2, Clock } from "lucide-react";

type PaymentMode = "upi" | "card" | "netbanking" | "cash";

const paymentOptions: { id: PaymentMode; label: string; icon: React.ElementType; sub: string }[] = [
  { id: "upi", label: "UPI", icon: Smartphone, sub: "GPAY, PhonePe" },
  { id: "card", label: "Card", icon: CreditCard, sub: "Debit/Credit" },
  { id: "cash", label: "Cash", icon: Banknote, sub: "Pay on Delivery" },
];

const CheckoutSection = ({ isCompact = false }: { isCompact?: boolean }) => {
  const navigate = useNavigate();
  const { mode, items, total, setIsCartOpen, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMode>("upi");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Required";
    if (!/^[6-9]\d{9}$/.test(phone)) e.phone = "Invalid number";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    if (mode === "delivery" && !address.trim()) e.address = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setIsCartOpen(true);
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: name,
          customer_phone: phone,
          customer_address: mode === 'delivery' ? address : 'Takeaway',
          order_type: mode,
          total_amount: total,
          status: 'new',
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      setSubmitted(true);
      setTimeout(() => {
        clearCart();
        navigate('/order-success', { state: { orderId: orderData.id } });
      }, 2000);
    } catch (err) {
      console.error('❌ Order error:', err);
      setErrors({ submit: "Failed to place order. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6 animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-accent mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">Order Placed!</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Thanks, {name}! Your order of ₹{total} is confirmed.
          {mode === "delivery" ? " Arriving in 30-40m." : " Ready for pickup soon."}
        </p>
        <button 
          onClick={() => setSubmitted(false)} 
          className="mt-6 text-sm font-bold text-primary hover:underline"
        >
          Place Another Order
        </button>
      </div>
    );
  }

  return (
    <div className={`${isCompact ? "" : "container mx-auto px-4 py-16"}`} id="checkout">
      {!isCompact && (
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">Checkout</h2>
          <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mt-2">Secure & Fast Ordering</p>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Form */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div>
              <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Customer Details</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Where should we send your feast?</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="E.G. SAHIL KHAN" 
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary/30 border-2 border-transparent rounded-2xl text-[11px] font-black uppercase tracking-widest text-foreground focus:bg-background focus:border-primary/20 focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all" 
                  />
                </div>
                {errors.name && <p className="text-[10px] text-destructive font-black uppercase tracking-tight ml-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} 
                    placeholder="9876543210" 
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary/30 border-2 border-transparent rounded-2xl text-[11px] font-black uppercase tracking-widest text-foreground focus:bg-background focus:border-primary/20 focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all" 
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-destructive font-black uppercase tracking-tight ml-1">{errors.phone}</p>}
              </div>
            </div>

            {mode === "delivery" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Delivery Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="STREET, AREA, LANDMARK..." 
                    rows={3} 
                    className="w-full pl-12 pr-4 py-4 bg-secondary/30 border-2 border-transparent rounded-2xl text-[11px] font-black uppercase tracking-widest text-foreground focus:bg-background focus:border-primary/20 focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all resize-none" 
                  />
                </div>
                {errors.address && <p className="text-[10px] text-destructive font-black uppercase tracking-tight ml-1">{errors.address}</p>}
              </div>
            )}

            {/* Payment Selection */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-4">
                <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Payment</h3>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPayment(opt.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
                      payment === opt.id 
                        ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5" 
                        : "border-transparent bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <opt.icon className="w-5 h-5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Right: Summary & CTA */}
        <div className="lg:sticky lg:top-32 h-fit space-y-6">
          <div className="bg-charcoal text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
            
            <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
              Order Summary
              <div className="flex-1 h-px bg-white/10" />
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/60">
                <span>Items Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/60">
                <span>Delivery Charge</span>
                <span className="text-primary">{mode === 'delivery' ? '₹40' : 'FREE'}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Amount</p>
                  <p className="text-3xl font-black tracking-tighter text-primary leading-none mt-1">₹{mode === 'delivery' ? total + 40 : total}</p>
                </div>
                <div className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary">{mode}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary-glow w-full py-5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 group disabled:opacity-50 shadow-2xl shadow-primary/30"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : items.length === 0 ? (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Cart is Empty
                </>
              ) : (
                <>
                  Confirm Order
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
            
            {errors.submit && (
              <p className="text-[10px] text-red-400 text-center font-black uppercase tracking-tight mt-4 animate-pulse">
                {errors.submit}
              </p>
            )}
            
            <p className="text-[9px] text-center text-white/30 font-black uppercase tracking-[0.2em] mt-6">
              By placing order you agree to our terms
            </p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/20 p-4 rounded-2xl flex items-center gap-3 border border-border/50">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Safe Payment</span>
            </div>
            <div className="bg-secondary/20 p-4 rounded-2xl flex items-center gap-3 border border-border/50">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSection;
