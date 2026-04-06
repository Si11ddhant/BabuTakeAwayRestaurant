import { Menu, Search, ShoppingBag, X, LayoutDashboard } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopQuery, setDesktopQuery] = useState("");

  const isAdmin = role === 'admin';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToHash = (hash: string) => {
    const el = document.getElementById(hash);
    if (el) {
      const yOffset = window.matchMedia("(max-width: 767px)").matches ? -84 : -88;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setMobileMenuOpen(false);
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
    <nav
      className={cn(
        "sticky top-0 z-[100] w-full border-b border-[#E8E8E8]/90 bg-white/90 backdrop-blur-md transition-shadow duration-300",
        scrolled && "shadow-sm"
      )}
      role="navigation"
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 pt-[env(safe-area-inset-top)]">
        <Link
          to="/"
          className="group min-w-0 max-w-[70vw] shrink no-underline sm:max-w-none"
          aria-label="Babu Takeaway and Restaurant home"
        >
          <span className="font-serif text-[0.82rem] font-semibold leading-snug tracking-tight text-[#1C1C1C] sm:text-base lg:text-lg">
            Babu Takeaway{" "}
            <span className="text-primary">and Restaurant</span>
          </span>
        </Link>

        <form onSubmit={handleDesktopSearch} className="hidden flex-1 max-w-md items-center md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={desktopQuery}
              onChange={(e) => setDesktopQuery(e.target.value)}
              placeholder="Search dishes"
              className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white pl-10 pr-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/15"
              aria-label="Search menu"
            />
          </div>
        </form>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ label, hash }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleNavClick(hash)}
              className="h-11 text-sm font-semibold text-[#1C1C1C]/80 transition-colors hover:text-primary"
            >
              {label}
            </button>
          ))}
          
          <button
            type="button"
            onClick={handleAdminClick}
            className="group relative flex h-11 items-center gap-2 text-sm font-bold text-[#1C1C1C]/80 transition-colors hover:text-primary"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Admin</span>
            {isAdmin && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-blue opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-blue shadow-[0_0_8px_#00D2FF]"></span>
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 480, damping: 28 }}
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-[#E8E8E8] bg-white px-3 text-sm font-bold text-[#1C1C1C] shadow-sm transition-colors hover:border-primary/25 hover:bg-secondary/40"
            aria-label={totalItems > 0 ? `Cart, ${totalItems} items` : "Open cart"}
          >
            <ShoppingBag className="h-4.5 w-4.5 text-primary" strokeWidth={2} />
            <span className="hidden sm:inline">Cart</span>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ 
                    scale: [0.5, 1.4, 1],
                    opacity: 1 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 15,
                    duration: 0.4
                  }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-extrabold text-white ring-2 ring-white"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8E8E8] bg-white text-[#1C1C1C] md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[#E8E8E8] bg-white md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleNavClick(link.hash)}
                  className="flex h-11 w-full items-center rounded-lg px-3 text-sm font-semibold text-[#1C1C1C] hover:bg-secondary/60"
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={handleAdminClick}
                className="flex h-11 w-full items-center justify-between rounded-lg px-3 text-sm font-bold text-[#1C1C1C] hover:bg-secondary/60"
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Admin</span>
                </div>
                {isAdmin && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-blue opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-blue"></span>
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default TopNav;
