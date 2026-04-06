import heroFood from "@/assets/hero-food.jpg";
import { Search, MapPin, Navigation, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const heroContent = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 26, stiffness: 280 },
  },
};

const HeroBanner = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu-section");
    if (menuSection) {
      const yOffset = window.matchMedia("(max-width: 767px)").matches ? -88 : -96;
      const y = menuSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.dispatchEvent(
        new CustomEvent("hero-search", { detail: searchQuery.trim() })
      );
    }
    scrollToMenu();
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Location not supported", {
        description: "Your browser does not support geolocation.",
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        toast.success("Location captured", {
          description: "We’ll prioritize nearby delivery when you check out.",
        });
      },
      () => {
        toast.error("Could not access location", {
          description: "Allow location access in your browser settings.",
        });
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#faf8f4] to-white">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-10 md:px-6 lg:px-10 lg:py-14">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
        <motion.div
          className="order-1"
          variants={heroContent}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            id="special-offers"
            variants={heroItem}
            className="mb-4 inline-flex w-fit scroll-mt-28 items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              Special offers · Navi Mumbai
            </span>
          </motion.div>

          <motion.h1
            variants={heroItem}
            className="text-balance text-4xl font-extrabold leading-[1.12] tracking-tight text-[#1C1C1C] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]"
          >
            <span className="font-serif font-semibold italic text-[#1C1C1C] lg:text-[1.06em]">
              Authentic
            </span>{" "}
            <span className="font-sans">Flavors, Delivered with Care.</span>
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mt-5 max-w-md text-base font-medium leading-relaxed text-[#1C1C1C]/65"
          >
            Rooted in Navi Mumbai—chef-led recipes, honest ingredients, and dependable delivery to your
            door.
          </motion.p>

          <motion.form
            variants={heroItem}
            onSubmit={handleSearchSubmit}
            className="mt-6 space-y-3"
          >
            <div className="relative flex min-h-[44px] items-center rounded-[1rem] border border-[#E8E8E8] bg-white shadow-sm">
              <Search
                className="pointer-events-none absolute left-4 h-4 w-4 text-[#1C1C1C]/35"
                strokeWidth={2}
              />
              <input
                type="search"
                name="hero-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to eat today…"
                className="h-11 w-full rounded-[1rem] border-0 bg-transparent py-2 pl-11 pr-24 text-sm font-medium text-[#1C1C1C] placeholder:text-[#1C1C1C]/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
                aria-label="Search dishes"
              />
              <button
                type="button"
                onClick={handleLocateMe}
                className="absolute right-2 inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-primary hover:bg-primary/10"
                aria-label="Locate me"
              >
                <Navigation className="h-4 w-4 shrink-0" />
              </button>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-11 min-w-[44px] w-full items-center justify-center gap-2 rounded-[1rem] bg-gradient-to-br from-[#E85D4C] via-primary to-[#C41E3A] px-6 text-sm font-extrabold uppercase tracking-wider text-white shadow-[0_10px_26px_-8px_rgba(225,70,80,0.55)]"
            >
              <MapPin className="h-4 w-4" strokeWidth={2.5} />
              Explore Menu
            </motion.button>
          </motion.form>

          <motion.div variants={heroItem} className="mt-6 flex flex-wrap gap-3">
            <div className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#E8E8E8] bg-white px-3 py-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <Star className="h-4 w-4 fill-amber-400/50 text-amber-400" />
              </div>
              <span className="text-xs font-bold text-[#1C1C1C]">4.5+ Star Rating</span>
            </div>
            <div className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" strokeWidth={2} />
              <span className="text-xs font-bold text-emerald-900">Hygiene Certified</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="order-2"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 220, delay: 0.12 }}
        >
          <div
            className="rounded-[2rem] ring-1 ring-black/5"
            style={{
              filter:
                "drop-shadow(0 24px 42px rgba(225,90,75,0.18)) drop-shadow(0 10px 20px rgba(0,0,0,0.08))",
            }}
          >
            <img
              src={heroFood}
              alt="Signature dishes from our kitchen"
              className="h-56 w-full rounded-[2rem] object-cover sm:h-72 md:h-[26rem] lg:h-[30rem]"
              width={1000}
              height={1200}
            />
          </div>
        </motion.div>
      </div>
      </div>
    </section>
  );
};

export default HeroBanner;
