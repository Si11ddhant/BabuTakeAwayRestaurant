import { ShoppingCart, MapPin, Clock, Utensils, Shield, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

const Header = () => {
  const { mode, setMode, totalItems, items, total, setIsCartOpen, removeItem } = useCart();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <header className="gradient-header fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center border-b border-white/5 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo & Brand - More Compact/Native */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/30">
              <Utensils className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-xl font-black text-white leading-none tracking-tighter">
                Babu
              </h1>
              <p className="text-[8px] text-white/50 uppercase tracking-[0.2em] font-black">Takeaway</p>
            </div>
          </Link>

          {/* Center: Toggle - Native Switch Style */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-2xl">
              <button
                onClick={() => setMode("delivery")}
                className={`px-4 sm:px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                  mode === "delivery"
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                Delivery
              </button>
              <button
                onClick={() => setMode("takeaway")}
                className={`px-4 sm:px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                  mode === "takeaway"
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                Takeaway
              </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/admin"
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all group border border-white/5"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4 text-white/60 group-hover:text-primary transition-colors" />
            </Link>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  onClick={() => setIsCartOpen(true)}
                  onMouseEnter={() => setIsPopoverOpen(true)}
                  className="relative p-2 sm:p-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all group border border-primary/20"
                  aria-label="Open shopping cart"
                >
                  <ShoppingCart className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  {totalItems > 0 && (
                    <span key={totalItems} className="cart-badge bg-white text-primary border-primary shadow-lg">{totalItems}</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-80 p-0 bg-white/98 backdrop-blur-2xl border-white/20 shadow-2xl rounded-2xl overflow-hidden hidden md:block" 
                align="end"
                onMouseLeave={() => setIsPopoverOpen(false)}
              >
                <div className="p-4 border-b border-border/50 bg-secondary/30 flex items-center justify-between">
                  <h3 className="font-black text-xs uppercase tracking-widest text-foreground flex items-center gap-2">
                    <ShoppingCart className="w-3.5 h-3.5 text-primary" />
                    Cart Preview
                  </h3>
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {totalItems} Items
                  </span>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {items.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-xs text-muted-foreground font-black uppercase tracking-tight">Your cart is empty</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 group/item">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-border/50 shadow-sm">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-foreground truncate uppercase tracking-tight">{item.name}</p>
                          <p className="text-[10px] text-primary font-black">{item.quantity} × ₹{item.price}</p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {items.length > 0 && (
                  <div className="p-4 bg-secondary/30 border-t border-border/50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Subtotal</span>
                      <span className="text-lg font-black text-primary tracking-tighter">₹{total}</span>
                    </div>
                    <button 
                      onClick={() => { setIsPopoverOpen(false); setIsCartOpen(true); }}
                      className="btn-primary-glow w-full py-3.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group shadow-xl shadow-primary/20"
                    >
                      Checkout Now
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
