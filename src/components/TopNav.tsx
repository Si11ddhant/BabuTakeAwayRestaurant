import { Search, ShoppingBag, LayoutDashboard, Home, UtensilsCrossed } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Menu", hash: "menu-section" },
  { label: "Special Offers", hash: "special-offers" },
  { label: "Contact", hash: "location" },
] as const;

const TopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems, setIsCartOpen } = useCart();
  const { role } = useAuth();
  
  const [scrolled, setScrolled] = useState(false);
  const [desktopQuery, setDesktopQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home"); // Track active tab for mobile

  const isAdmin = role === 'admin';

  // 1. TRIGGER THE DESKTOP NAVBAR ONLY AFTER SCROLLING
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToHash = (hash: string) => {
    const el = document.getElementById(hash);
    if (el) {
      const yOffset = window.matchMedia("(max-width: 767px)").matches ? -20 : -88;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else if (hash === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavClick = (hash: string, tabName: string = "") => {
    if (tabName) setActiveTab(tabName);
    
    if (location.pathname !== "/") {
      window.location.href = `/#${hash}`;
      return;
    }
    scrollToHash(hash);
  };

  const handleDesktopSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (desktopQuery.trim()) {
      window.dispatchEvent(new CustomEvent("hero-search", { detail: desktopQuery.trim() }));
    }
    handleNavClick("menu-section", "menu");
  };

  const handleAdminClick = () => {
    setActiveTab("admin");
    window.dispatchEvent(new CustomEvent("admin-transition-start"));
    setTimeout(() => {
      navigate("/admin");
    }, 600);
  };

  return (
    <>
      {/* ========================================== */}
      {/* TOP NAVIGATION (Desktop Only)              */}
      {/* ========================================== */}
      {/* Added 'hidden md:block' to prevent the ugly header on mobile */}
      <nav
        className={cn(
          "hidden md:block fixed top-0 left-0 right-0 z-[100] w-full border-b border-gray-100 bg-white/95 backdrop-blur-xl transition-all duration-300 transform shadow-sm",
          scrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        )}
        role="navigation"
        aria-label="Primary navigation"
      >
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-6 lg:px-10 pt-[env(safe-area-inset-top)]">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => handleNavClick("top", "home")}
            className="group min-w-0 shrink no-underline flex items-center gap-2"
          >
            <span className="font-serif text-xl font-black leading-snug tracking-tight text-gray-900">
              Babu Takeaway
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleDesktopSearch} className="flex-1 max-w-md items-center flex ml-8">
            <div className="relative w-full group">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="search"
                value={desktopQuery}
                onChange={(e) => setDesktopQuery(e.target.value)}
                placeholder="Search for delicious meals..."
                className="h-11 w-full rounded-full border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
              />
            </div>
          </form>

          {/* Desktop Links & Actions */}
          <div className="items-center gap-6 flex ml-auto">
            {navLinks.map(({ label, hash }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleNavClick(hash, label.toLowerCase())}
                className="text-[14px] font-bold text-gray-500 transition-colors hover:text-primary"
              >
                {label}
              </button>
            ))}

            {/* Desktop Admin Button */}
            <button
              type="button"
              onClick={handleAdminClick}
              className="group relative flex h-10 items-center gap-2 rounded-full bg-gray-50 px-5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-100 hover:text-primary border border-gray-200"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin</span>
              {isAdmin && (
                <span className="absolute 1 top-0 right-0 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-white"></span>
                </span>
              )}
            </button>

            {/* Desktop Cart Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary/10 px-6 text-sm font-black text-primary transition-colors hover:bg-primary hover:text-white group"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={2.5} />
              <span>Cart</span>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 1.4, 1], opacity: 1 }}
                    className="absolute -right-1.5 -top-1.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-gray-900 px-1.5 text-[10px] font-black text-white ring-2 ring-white transition-colors"
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ========================================== */}
      {/* BOTTOM NAVIGATION (Mobile Only)            */}
      {/* ========================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] h-[68px] bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex h-full items-center justify-around px-1">

          {/* Home */}
          <button
            onClick={() => handleNavClick("top", "home")}
            className={cn(
              "flex flex-col items-center justify-center w-16 gap-1 active:scale-95 transition-all duration-200",
              activeTab === "home" ? "text-primary" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Home className="h-6 w-6" strokeWidth={activeTab === "home" ? 2.5 : 2} />
            <span className={cn("text-[10px]", activeTab === "home" ? "font-black" : "font-semibold")}>Home</span>
          </button>

          {/* Menu */}
          <button
            onClick={() => handleNavClick("menu-section", "menu")}
            className={cn(
              "flex flex-col items-center justify-center w-16 gap-1 active:scale-95 transition-all duration-200",
              activeTab === "menu" ? "text-primary" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <UtensilsCrossed className="h-6 w-6" strokeWidth={activeTab === "menu" ? 2.5 : 2} />
            <span className={cn("text-[10px]", activeTab === "menu" ? "font-black" : "font-semibold")}>Menu</span>
          </button>

          {/* Cart */}
          <button
            onClick={() => { setIsCartOpen(true); setActiveTab("cart"); }}
            className={cn(
              "relative flex flex-col items-center justify-center w-16 gap-1 active:scale-95 transition-all duration-200",
              activeTab === "cart" ? "text-primary" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <div className="relative">
              <ShoppingBag className="h-6 w-6" strokeWidth={activeTab === "cart" ? 2.5 : 2} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 1.4, 1], opacity: 1 }}
                    className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-white ring-[2px] ring-white"
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className={cn("text-[10px]", activeTab === "cart" ? "font-black" : "font-semibold")}>Cart</span>
          </button>

          {/* Admin / Profile */}
          <button
            onClick={handleAdminClick}
            className={cn(
              "relative flex flex-col items-center justify-center w-16 gap-1 active:scale-95 transition-all duration-200",
              activeTab === "admin" ? "text-primary" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <LayoutDashboard className="h-6 w-6" strokeWidth={activeTab === "admin" ? 2.5 : 2} />
            <span className={cn("text-[10px]", activeTab === "admin" ? "font-black" : "font-semibold")}>Admin</span>
            {isAdmin && (
              <span className="absolute right-3 top-0 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500 border border-white"></span>
              </span>
            )}
          </button>

        </div>
      </nav>
    </>
  );
};

export default TopNav;