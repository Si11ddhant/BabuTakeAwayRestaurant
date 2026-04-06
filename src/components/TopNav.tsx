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

  const isAdmin = role === 'admin';

  // 1. TRIGGER THE NAVBAR ONLY AFTER SCROLLING PAST THE HERO IMAGE
  useEffect(() => {
    // Triggers when user scrolls past 200px (roughly past the hero banner)
    const onScroll = () => setScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToHash = (hash: string) => {
    const el = document.getElementById(hash);
    if (el) {
      // Mobile offset accounts for the bottom nav visually, though technically scrolling to top
      const yOffset = window.matchMedia("(max-width: 767px)").matches ? -20 : -88;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else if (hash === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavClick = (hash: string) => {
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
    handleNavClick("menu-section");
  };

  const handleAdminClick = () => {
    window.dispatchEvent(new CustomEvent("admin-transition-start"));
    setTimeout(() => {
      navigate("/admin");
    }, 600);
  };

  return (
    <>
      {/* ========================================== */}
      {/* TOP NAVIGATION (Desktop & Mobile Header)   */}
      {/* ========================================== */}
      {/* 2. DYNAMIC CLASSES TO HIDE/SHOW ON SCROLL */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] w-full border-b border-[#E8E8E8]/90 bg-white/95 backdrop-blur-xl transition-all duration-300 transform",
          scrolled
            ? "translate-y-0 opacity-100 shadow-sm py-0"
            : "-translate-y-full opacity-0 pointer-events-none"
        )}
        role="navigation"
        aria-label="Primary navigation"
      >
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 pt-[env(safe-area-inset-top)]">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group min-w-0 shrink no-underline flex items-center gap-2"
            aria-label="Babu Takeaway and Restaurant home"
          >
            <span className="font-serif text-lg md:text-xl font-bold leading-snug tracking-tight text-[#1C1C1C]">
              Babu Takeaway <span className="text-primary">& Restaurant</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleDesktopSearch} className="hidden flex-1 max-w-md items-center md:flex ml-8">
            <div className="relative w-full group">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="search"
                value={desktopQuery}
                onChange={(e) => setDesktopQuery(e.target.value)}
                placeholder="Search for delicious meals..."
                className="h-12 w-full rounded-2xl border border-[#E8E8E8] bg-slate-50/50 pl-11 pr-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                aria-label="Search menu"
              />
            </div>
          </form>

          {/* Desktop Links & Actions */}
          <div className="hidden items-center gap-6 md:flex ml-auto">
            {navLinks.map(({ label, hash }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleNavClick(hash)}
                className="text-sm font-bold text-slate-600 transition-colors hover:text-primary"
              >
                {label}
              </button>
            ))}

            {/* Desktop Admin Button */}
            <button
              type="button"
              onClick={handleAdminClick}
              className="group relative flex h-10 items-center gap-2 rounded-xl bg-slate-50 px-4 text-sm font-bold text-slate-700 transition-all hover:bg-slate-100 hover:text-primary border border-[#E8E8E8]"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin</span>
              {isAdmin && (
                <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-blue opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-electric-blue shadow-[0_0_8px_#00D2FF]"></span>
                </span>
              )}
            </button>

            {/* Desktop Cart Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary/5 px-5 text-sm font-black text-primary transition-colors hover:bg-primary hover:text-white group"
              aria-label={totalItems > 0 ? `Cart, ${totalItems} items` : "Open cart"}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={2.5} />
              <span>Cart</span>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 1.4, 1], opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#1C1C1C] px-1.5 text-[11px] font-black text-white ring-4 ring-white group-hover:bg-white group-hover:text-primary transition-colors"
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] h-16 bg-white border-t border-[#E8E8E8] pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="flex h-full items-center justify-around px-2">

          {/* Home */}
          <button
            onClick={() => handleNavClick("top")}
            className="flex flex-col items-center justify-center w-16 gap-1 text-slate-500 hover:text-primary active:scale-95 transition-all"
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          {/* Menu */}
          <button
            onClick={() => handleNavClick("menu-section")}
            className="flex flex-col items-center justify-center w-16 gap-1 text-slate-500 hover:text-primary active:scale-95 transition-all"
          >
            <UtensilsCrossed className="h-5 w-5" />
            <span className="text-[10px] font-bold">Menu</span>
          </button>

          {/* Cart (Center Prominent) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center w-16 gap-1 text-slate-500 hover:text-primary active:scale-95 transition-all"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5 text-[#1C1C1C]" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 1.4, 1], opacity: 1 }}
                    className="absolute -right-2.5 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-white ring-2 ring-white"
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className="text-[10px] font-bold text-[#1C1C1C]">Cart</span>
          </button>

          {/* Admin / Profile */}
          <button
            onClick={handleAdminClick}
            className="relative flex flex-col items-center justify-center w-16 gap-1 text-slate-500 hover:text-primary active:scale-95 transition-all"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[10px] font-bold">Admin</span>
            {isAdmin && (
              <span className="absolute right-3 top-0 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-blue opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-blue"></span>
              </span>
            )}
          </button>

        </div>
      </nav>
    </>
  );
};

export default TopNav;