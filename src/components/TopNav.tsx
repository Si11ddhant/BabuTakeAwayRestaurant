import { Home, UtensilsCrossed, Search, User, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const TopNav = () => {
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Menu", icon: UtensilsCrossed, path: "/#menu-section" },
    { name: "Search", icon: Search, path: "/search" },
    { name: "Account", icon: User, path: "/admin" },
    { name: "Cart", icon: ShoppingBag, path: "cart" }, // Special handling for Cart
  ];

  const isActive = (path: string) => {
    if (path === "cart") return false; // Handled separately
    if (path.startsWith("/#")) return false;
    return location.pathname === path;
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-[100]"
      role="navigation"
      aria-label="Primary Navigation"
    >
      {/* Darker/High-Contrast Background for visibility */}
      <div className="absolute inset-0 bg-slate-900 dark:bg-black border-b border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.2)] pt-[env(safe-area-inset-top)]" />
      
      <div className="relative max-w-7xl mx-auto flex items-center justify-around h-[72px] px-4 pt-[env(safe-area-inset-top)] md:px-10 lg:px-20">
        {navItems.map((item) => {
          const active = isActive(item.path) || (item.name === "Home" && location.pathname === "/");
          const Icon = item.icon;
          const isCart = item.name === "Cart";

          const content = (
            <>
              <div className={cn(
                "p-2.5 rounded-full transition-all duration-500",
                active ? "bg-primary/20" : "bg-transparent"
              )}>
                <div className="relative">
                  <Icon className={cn("w-6 h-6", active ? "text-primary animate-in zoom-in-75 duration-300" : "text-slate-400")} />
                  {isCart && totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 flex items-center justify-center bg-primary text-[8px] font-black text-white rounded-full border-2 border-slate-900 shadow-sm">
                      {totalItems}
                    </span>
                  )}
                </div>
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-wider",
                active ? "text-primary" : "text-slate-400"
              )}>
                {item.name}
              </span>
              
              {/* Active Indicator Dot (Optional, keeping it subtle) */}
              {active && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(255,107,0,0.4)]" />
              )}
            </>
          );

          if (isCart) {
            return (
              <button
                key={item.name}
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-300 active:scale-90 relative"
                aria-label={`Open shopping cart with ${totalItems} items`}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-300 active:scale-90 relative"
              aria-current={active ? "page" : undefined}
              aria-label={item.name}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default TopNav;