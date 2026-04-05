import { X, Plus, Minus, Trash2, Tag, ShoppingBag, ArrowRight, Sparkles, Loader2, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import emptyCartImg from "@/assets/empty-cart.png";
import Checkout from "./Checkout";
import { menuItems } from "@/data/menuData";

const CartSidebar = () => {
  const {
    items, isCartOpen, setIsCartOpen, updateQuantity, removeItem,
    subtotal, tax, deliveryFee, promoDiscount, total, mode,
    promoCode, setPromoCode, applyPromo, promoError, clearCart,
    isLoading, addItem
  } = useCart();

  const [isMobile, setIsMobile] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simple recommendation logic: show top 3 items not in cart
  const recommendations = menuItems
    .filter(menuItem => !items.find(cartItem => cartItem.id === menuItem.id))
    .slice(0, 3);

  if (!isCartOpen) return null;

  const cartContent = (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-background/40 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-sm font-bold text-foreground">Updating Cart...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">Your Cart</h2>
            <p className="text-xs text-muted-foreground font-medium">{items.length} {items.length === 1 ? 'item' : 'items'} selected</p>
          </div>
        </div>
        <button 
          onClick={() => setIsCartOpen(false)} 
          className="p-2 rounded-xl hover:bg-secondary/80 transition-all duration-200 group"
          aria-label="Close cart"
        >
          <X className="w-5 h-5 text-muted-foreground group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center space-y-6 overflow-y-auto custom-scrollbar">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
            <img 
              src={emptyCartImg} 
              alt="Empty cart" 
              className="relative w-48 h-48 object-contain animate-float opacity-90" 
              loading="lazy" 
              width={512} 
              height={512} 
            />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-bold text-foreground">Craving something?</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your cart is empty. Explore our delicious menu and treat yourself to something special!
            </p>
          </div>
          
          <div className="w-full pt-4">
            <button 
              onClick={() => setIsCartOpen(false)} 
              className="btn-primary-glow w-full py-4 flex items-center justify-center gap-2 group"
            >
              Explore Menu
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Popular Categories in Empty State */}
          <div className="w-full pt-8 border-t border-border/50">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Popular Categories</p>
            <div className="grid grid-cols-2 gap-3">
              {['Starters', 'Main Course', 'Biryani', 'Desserts'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setIsCartOpen(false)}
                  className="p-3 bg-secondary/50 rounded-xl text-xs font-bold text-foreground hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="group relative flex items-center gap-4 bg-card hover:bg-accent/50 rounded-2xl p-4 border border-border/40 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    loading="lazy" 
                    width={64} 
                    height={64} 
                  />
                  <div className="absolute top-1 right-1">
                    <div className={`${item.isVeg ? "veg-indicator" : "nonveg-indicator"} scale-50 border-white shadow-sm`} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">₹{item.price} per unit</p>
                  <p className="text-sm font-black text-primary mt-1">₹{item.price * item.quantity}</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center bg-secondary/80 rounded-full p-1 border border-border/50">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-background transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1 || isLoading}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-black tabular-nums">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                      className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                      disabled={isLoading}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3 text-primary" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200"
                    title="Remove item"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="pt-8 pb-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <UtensilsCrossed className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest">Pairs well with</span>
                </div>
                <div className="space-y-3">
                  {recommendations.map(rec => (
                    <div key={rec.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border/30 hover:border-primary/20 transition-all group">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <img src={rec.image} alt={rec.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{rec.name}</p>
                        <p className="text-[10px] text-primary font-black">₹{rec.price}</p>
                      </div>
                      <button 
                        onClick={() => addItem(rec)}
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
                        disabled={isLoading}
                        title="Add to cart"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Promo Section */}
          <div className="px-6 py-4 bg-accent/30 border-t border-border/40 space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Special Offers</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-background border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button 
                onClick={applyPromo} 
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-95 active:scale-95 transition-all shadow-sm shadow-primary/20 disabled:opacity-50"
                disabled={!promoCode || isLoading}
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-[10px] text-destructive font-bold px-1">{promoError}</p>}
            {promoDiscount > 0 && (
              <div className="flex items-center gap-1.5 text-veg font-bold text-[10px] uppercase px-1">
                <div className="w-1 h-1 rounded-full bg-veg animate-pulse" />
                Savings: ₹{promoDiscount} applied!
              </div>
            )}
          </div>

          {/* Bill Summary */}
          <div className="px-6 py-5 border-t border-border/40 space-y-3 bg-card/50">
            <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
              <span>Item Subtotal</span>
              <span className="tabular-nums font-bold text-foreground">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
              <span>GST & Taxes (5%)</span>
              <span className="tabular-nums font-bold text-foreground">₹{tax}</span>
            </div>
            {mode === "delivery" && (
              <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                <span>Delivery Fee</span>
                <span className="tabular-nums font-bold text-foreground">₹{deliveryFee}</span>
              </div>
            )}
            {promoDiscount > 0 && (
              <div className="flex justify-between items-center text-xs font-bold text-veg">
                <span>Promo Discount</span>
                <span className="tabular-nums">-₹{promoDiscount}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-foreground font-black text-lg pt-3 border-t border-dashed border-border">
              <span>Grand Total</span>
              <span className="text-primary tabular-nums tracking-tighter">₹{total}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-6 border-t border-border/40 space-y-3 bg-background">
            <button 
              onClick={() => setShowCheckout(true)}
              disabled={isLoading}
              className="btn-primary-glow w-full py-4 text-base font-black flex items-center justify-center gap-3 shadow-lg shadow-primary/20 group disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Secure Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <button 
              onClick={clearCart} 
              disabled={isLoading}
              className="w-full py-2 text-xs font-bold text-muted-foreground hover:text-destructive transition-colors uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" />
              Clear Entire Cart
            </button>
          </div>
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {showCheckout && (
          <Checkout 
            cart={items.map(item => ({ 
              id: item.id as unknown as number,
              name: item.name, 
              price: item.price, 
              quantity: item.quantity 
            }))}
            orderType={mode}
            onClose={() => setShowCheckout(false)}
          />
        )}
        <Drawer open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader>
              <DrawerTitle>Your Cart</DrawerTitle>
            </DrawerHeader>
            {cartContent}
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout 
          cart={items.map(item => ({ 
            id: item.id as unknown as number,
            name: item.name, 
            price: item.price, 
            quantity: item.quantity 
          }))}
          orderType={mode}
          onClose={() => setShowCheckout(false)}
        />
      )}

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
