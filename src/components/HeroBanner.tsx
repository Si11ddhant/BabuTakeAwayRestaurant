import heroFood from "@/assets/hero-food.jpg";
import { Search, Star, Clock, Percent, ArrowLeft, Share2, MoreVertical, MapPin } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Mapping to actual database categories
const quickCategories = [
  { name: "Starters", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&h=200&fit=crop" },
  { name: "Main Course", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop" },
  { name: "Tandoor", img: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=200&h=200&fit=crop" },
  { name: "Biryani", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop" },
  { name: "Chinese", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop" },
  { name: "Breads", img: "https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=200&h=200&fit=crop" },
];

const HeroBanner = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.dispatchEvent(
        new CustomEvent("hero-search", { detail: searchQuery.trim() })
      );
      const menuSection = document.getElementById("menu-section");
      if (menuSection) {
        window.scrollTo({ top: menuSection.offsetTop - 80, behavior: "smooth" });
      }
      setIsSearchOpen(false);
    }
  };

  return (
    <section className="bg-gray-50 pb-2">
      {/* 1. Full Bleed Image with Overlay Icons */}
      <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] bg-slate-900">
        <img
          src={heroFood}
          alt="Babu Takeaway"
          className="w-full h-full object-cover opacity-90"
        />

        {/* Gradient for icon visibility */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/70 to-transparent z-10" />

        {/* Top Action Strip Overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-[env(safe-area-inset-top)]">
          <div className="container mx-auto px-4 py-4 max-w-3xl flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>

            {/* Expandable Search or Icon */}
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex-1 origin-right animate-in fade-in zoom-in duration-200">
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes..."
                    autoFocus
                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-gray-800 placeholder:text-gray-400"
                  />
                  <button type="submit">
                    <Search className="h-4 w-4 text-primary shrink-0 ml-2" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex-1 flex justify-end gap-3">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
                >
                  <Search className="w-5 h-5" strokeWidth={2.5} />
                </button>
                <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors">
                  <Share2 className="w-5 h-5" strokeWidth={2.5} />
                </button>
                <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors">
                  <MoreVertical className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl relative z-30 -mt-12 md:-mt-16">

        {/* 2. Floating Restaurant Info Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-5 mb-5 border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-none mb-1.5">
                Babu Takeaway
              </h1>
              <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-semibold mb-0.5">
                <span>North Indian, Chinese</span>
              </div>
              <div className="flex items-center gap-1 text-[12px] text-gray-400 font-semibold">
                 Navi Mumbai <span className="mx-1">•</span> 2.5 km
              </div>
            </div>

            {/* Rating Block */}
            <div className="flex flex-col items-center bg-green-700 text-white px-2.5 py-1.5 rounded-xl shrink-0 shadow-sm">
              <div className="flex items-center gap-1 text-sm font-black">
                4.3 <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <div className="w-full border-t border-white/30 my-1" />
              <span className="text-[9px] font-bold opacity-90 tracking-wide">10K+ ratings</span>
            </div>
          </div>

          {/* Delivery Estimate Box (Inside the card) */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-100">
            <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
              <Clock className="w-4 h-4 text-primary" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-gray-800">30-35 mins</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Delivery to your location</span>
            </div>
          </div>
        </div>

        {/* 3. Dashed Offers Strip (Outside the card) */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex items-center gap-3 bg-blue-50/80 border border-dashed border-blue-300 p-3.5 rounded-2xl min-w-[240px] shrink-0">
            <div className="bg-blue-600 p-1.5 rounded-full text-white shadow-sm shrink-0">
              <Percent className="w-4 h-4" strokeWidth={3} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-black text-blue-900 leading-none mb-1.5">20% OFF up to ₹50</p>
              <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Use code BABU20</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-purple-50/80 border border-dashed border-purple-300 p-3.5 rounded-2xl min-w-[240px] shrink-0">
            <div className="bg-purple-600 p-1.5 rounded-full text-white shadow-sm shrink-0">
              <Percent className="w-4 h-4" strokeWidth={3} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-black text-purple-900 leading-none mb-1.5">Flat ₹100 OFF</p>
              <p className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">On orders above ₹500</p>
            </div>
          </div>
        </div>

        {/* 4. Circular Quick Categories */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-400">Explore Menu</h3>
             <div className="h-px bg-gray-200 flex-1 ml-4" />
          </div>
          
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {quickCategories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center gap-2.5 cursor-pointer active:scale-95 transition-transform shrink-0 w-[72px]"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("hero-search", { detail: cat.name }));
                  document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm border-2 border-white ring-1 ring-gray-100">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroBanner;