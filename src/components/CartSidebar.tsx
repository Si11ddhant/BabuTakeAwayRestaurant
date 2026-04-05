import { X, Plus, Minus, Trash2, Tag, ShoppingBag, ArrowRight, Sparkles, Loader2, UtensilsCrossed, MapPin, Phone, User, AlertCircle, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import emptyCartImg from "@/assets/empty-cart.png";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { menuItems } from "@/data/menuData";

const CartSidebar = () => {
  const {
    items, isCartOpen, setIsCartOpen, updateQuantity, removeItem,
    subtotal, tax, deliveryFee, promoDiscount, total, mode,
    promoCode, setPromoCode, applyPromo, promoError, clearCart,
    isLoading, addItem
  } = useCart();

  const [isMobile, setIsMobile] = useState(false);
  const [currentStep, setCurrentStep] = useState<'cart' | 'checkout'>('cart');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset step when cart closes
  useEffect(() => {
    if (!isCartOpen) {
      setTimeout(() => setCurrentStep('cart'), 300);
    }
  }, [isCartOpen]);

  // Function to handle moving to checkout
  const handleProceedToCheckout = () => {
    setCurrentStep('checkout');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setOrderError('Please enter your name');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setOrderError('Please enter a valid phone number');
      return false;
    }
    if (mode === 'delivery' && !formData.address.trim()) {
      setOrderError('Please enter your delivery address');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setOrderError('');
    
    if (!validateForm()) return;

    setIsPlacingOrder(true);

    try {
      // Create guest order record in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
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

      setOrderSuccess(true);
      clearCart();
      setIsCartOpen(false);

      // Redirect to success page
      setTimeout(() => {
        navigate('/order-success', { state: { orderId: orderData.id } });
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place order';
      setOrderError(errorMessage);
      setIsPlacingOrder(false);
    }
  };

  // Simple recommendation logic: show top 3 items not in cart
  const recommendations = menuItems
    .filter(menuItem => !items.find(cartItem => cartItem.id === menuItem.id))
    .slice(0, 3);

  if (!isCartOpen) return null;

  const cartContent = (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[60] bg-background/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-card p-6 rounded-3xl shadow-2xl border border-border/50 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <ShoppingBag className="w-5 h-5 text-primary absolute inset-0 m-auto animate-pulse" />
            </div>
            <span className="text-sm font-bold text-foreground tracking-tight">Updating your cart...</span>
          </div>
        </div>
      )}

      {/* Header with Step Indicator */}
      <div className="px-6 pt-6 pb-4 border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-foreground leading-none">Your Cart</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1.5">
                {items.length} {items.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="p-3 rounded-2xl hover:bg-secondary/80 transition-all duration-300 group active:scale-90"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-2 px-1">
          <div className="flex-1 flex items-center gap-2">
            <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${currentStep === 'cart' || currentStep === 'checkout' ? 'bg-primary' : 'bg-secondary'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${currentStep === 'checkout' ? 'bg-primary' : 'bg-secondary'}`} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground min-w-[60px] text-right">
            Step {currentStep === 'cart' ? '1' : '2'} of 2
          </span>
        </div>
      </div>

      {/* Content Area */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center space-y-8 overflow-y-auto custom-scrollbar">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
            <div className="relative transform group-hover:scale-105 transition-transform duration-500">
              <img 
                src={emptyCartImg} 
                alt="Empty cart" 
                className="w-56 h-56 object-contain opacity-90 drop-shadow-2xl" 
                loading="lazy" 
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-border/50 flex items-center gap-2 whitespace-nowrap">
                <UtensilsCrossed className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">Nothing here yet</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 max-w-[280px]">
            <p className="text-2xl font-black text-foreground tracking-tight">Hungry?</p>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Your cart is waiting for some delicious treats. Start adding items from our menu!
            </p>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="btn-primary-glow w-full py-4 rounded-2xl flex items-center justify-center gap-3 group text-base font-black"
          >
            Browse Menu
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="w-full pt-8 border-t border-border/50">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-5">Quick Selection</p>
            <div className="grid grid-cols-2 gap-3">
              {['Starters', 'Main Course', 'Biryani', 'Desserts'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setIsCartOpen(false)}
                  className="p-4 bg-card rounded-2xl text-xs font-black text-foreground hover:bg-primary hover:text-white transition-all border border-border/50 hover:border-primary shadow-sm active:scale-95"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
            {currentStep === 'cart' ? (
              <div className="space-y-6">
                {/* Mode Selector */}
                <div className="p-1.5 bg-secondary/50 rounded-2xl flex items-center gap-1 border border-border/50">
                  <button 
                    onClick={() => setMode('delivery')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${mode === 'delivery' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <MapPin className="w-4 h-4" />
                    DELIVERY
                  </button>
                  <button 
                    onClick={() => setMode('takeaway')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${mode === 'takeaway' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    TAKEAWAY
                  </button>
                </div>

                {/* Cart Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Items</span>
                    <button onClick={clearCart} className="text-[10px] font-black uppercase tracking-widest text-destructive hover:opacity-80 transition-opacity flex items-center gap-1.5">
                      <Trash2 className="w-3 h-3" />
                      Clear All
                    </button>
                  </div>
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className="group relative flex items-center gap-4 bg-card rounded-3xl p-4 border border-border/50 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5"
                    >
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          loading="lazy" 
                        />
                        <div className="absolute top-2 right-2">
                          <div className={`${item.isVeg ? "veg-indicator" : "nonveg-indicator"} scale-75 border-2 border-white shadow-md`} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 py-1">
                        <h4 className="font-black text-sm text-foreground truncate mb-0.5 group-hover:text-primary transition-colors">{item.name}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight mb-2">₹{item.price} / unit</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-secondary/80 rounded-full p-1 border border-border/50 shadow-inner">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-foreground transition-all active:scale-90 disabled:opacity-30"
                              disabled={item.quantity <= 1 || isLoading}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-black tabular-nums">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                              className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all active:scale-90"
                              disabled={isLoading}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-black text-foreground">₹{item.price * item.quantity}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-90"
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-4 px-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Often ordered together</span>
                    </div>
                    <div className="space-y-3">
                      {recommendations.map(rec => (
                        <div key={rec.id} className="flex items-center gap-4 p-3 bg-card rounded-2xl border border-border/50 hover:border-primary/20 transition-all group shadow-sm">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                            <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-foreground truncate">{rec.name}</p>
                            <p className="text-[10px] text-primary font-bold">₹{rec.price}</p>
                          </div>
                          <button 
                            onClick={() => addItem(rec)}
                            className="w-9 h-9 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-90 flex items-center justify-center"
                            disabled={isLoading}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                {/* Back Link */}
                <button 
                  onClick={() => setCurrentStep('cart')}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Back to your items
                </button>

                {/* Form Sections */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <User className="w-4 h-4 text-primary" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Personal Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Full Name</Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            id="name"
                            name="name"
                            placeholder="Type your name..."
                            value={formData.name}
                            onChange={handleInputChange}
                            className="h-14 pl-12 bg-secondary/30 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                            disabled={isPlacingOrder}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Phone Number</Label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Mobile number..."
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="h-14 pl-12 bg-secondary/30 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                            disabled={isPlacingOrder}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {mode === 'delivery' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 px-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Delivery Location</h3>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Street Address</Label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <textarea
                            id="address"
                            name="address"
                            placeholder="Flat no, Street, Landmark..."
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full h-32 pl-12 pr-4 py-4 bg-secondary/30 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none placeholder:text-muted-foreground/50"
                            disabled={isPlacingOrder}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Box */}
                {orderError && (
                  <div className="p-4 bg-destructive/5 border border-destructive/10 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-destructive text-xs font-bold leading-relaxed">{orderError}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky Footer Section */}
          <div className="bg-card border-t border-border/50 p-6 space-y-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            {currentStep === 'cart' && (
              <div className="space-y-3">
                {/* Promo Input */}
                <div className="flex gap-2">
                  <div className="flex-1 relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-secondary/30 border-transparent rounded-xl text-xs font-black uppercase tracking-widest placeholder:text-muted-foreground/50 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
                    />
                  </div>
                  <button 
                    onClick={applyPromo} 
                    className="px-6 py-3 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all disabled:opacity-30 active:scale-95"
                    disabled={!promoCode || isLoading}
                  >
                    Apply
                  </button>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex items-center gap-2 text-veg font-black text-[10px] uppercase tracking-widest bg-veg/5 p-2 rounded-lg border border-veg/10">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Discount applied: ₹{promoDiscount} saved!
                  </div>
                )}
              </div>
            )}

            {/* Bill Summary Summary */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">₹{subtotal}</span>
              </div>
              {mode === "delivery" && (
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span className="text-foreground">₹{deliveryFee}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Taxes & GST</span>
                <span className="text-foreground">₹{tax}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-veg">
                  <span>Promo Discount</span>
                  <span>-₹{promoDiscount}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-border/50">
                <span className="text-sm font-black uppercase tracking-widest text-foreground">Total Amount</span>
                <span className="text-2xl font-black text-primary tracking-tighter">₹{total}</span>
              </div>
            </div>

            {/* Main Action Button */}
            {currentStep === 'cart' ? (
              <button 
                onClick={handleProceedToCheckout}
                disabled={isLoading}
                className="btn-primary-glow w-full py-4.5 rounded-2xl text-base font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 group active:scale-[0.98] transition-all"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="btn-primary-glow w-full py-4.5 rounded-2xl text-base font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 group active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            )}
            
            {currentStep === 'cart' && (
              <p className="text-[9px] text-center text-muted-foreground font-bold uppercase tracking-[0.2em]">
                Secure checkout powered by HungryDash
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
        <DrawerContent className="h-[90vh] bg-background">
          <div className="overflow-hidden h-full rounded-t-[2rem]">
            {cartContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50" onClick={() => setIsCartOpen(false)} />

      {/* Sidebar */}
      <aside className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-50 flex flex-col shadow-2xl animate-slide-in-right">
        {cartContent}
      </aside>
    </>
  );
};

export default CartSidebar;