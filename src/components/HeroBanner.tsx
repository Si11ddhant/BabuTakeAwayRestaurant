import heroFood from "@/assets/hero-food.jpg";
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  User, 
  Mic 
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
  const [userLocation, setUserLocation] = useState("Navi Mumbai");

  useEffect(() => {
    // Geolocation logic placeholder
  }, []);

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
    }
  };

  return (
    <section className="bg-gray-50 pb-6">
      {/* 1. Full Bleed Image */}
      <div className="relative w-full h-[280px] sm:h-[320px] md:h-[380px] bg-slate-900 rounded-b-[2.5rem] overflow-hidden shadow-sm">
        <img
          src="/hero3.png"
          alt="Babu Takeaway Signature Dishes"
          className="w-full h-full object-cover"
        />

        {/* Top gradient ONLY - to ensure white location text is readable */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent z-10" />

        {/* Top Location & Profile Header */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-[env(safe-area-inset-top)]">
          <div className="container mx-auto px-4 py-5 max-w-3xl flex items-center justify-between">
            {/* Location Selector */}
            <div className="flex items-center gap-2 cursor-pointer group">
              <MapPin className="w-6 h-6 text-white group-hover:text-primary transition-colors" fill="#ef4444" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider mb-0.5 drop-shadow-md">Delivering To</span>
                <div className="flex items-center gap-1 text-white">
                  <span className="font-extrabold text-lg tracking-tight drop-shadow-md truncate max-w-[150px] sm:max-w-[200px]">
                    {userLocation}
                  </span>
                  <ChevronDown className="w-5 h-5 drop-shadow-md shrink-0" />
                </div>
              </div>
            </div>

            {/* Profile Icon */}
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-sm hover:bg-white/30 transition-colors shrink-0">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl relative z-30 -mt-10">
        
        {/* 2. Floating Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="bg-white rounded-2xl shadow-[0_12px_30px_rgb(0,0,0,0.08)] p-3.5 flex items-center gap-3 mb-8 mx-2 md:mx-0 border border-gray-100"
        >
          <Search className="w-6 h-6 text-primary shrink-0 ml-1" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for 'Biryani' or 'Naan'..."
            className="flex-1 bg-transparent border-none outline-none text-[16px] font-semibold text-gray-800 placeholder:text-gray-400 w-full"
          />
          <div className="w-px h-6 bg-gray-200 shrink-0"></div>
          <button type="button" className="shrink-0 mr-1 p-1.5 hover:bg-gray-50 rounded-full transition-colors">
            <Mic className="w-5 h-5 text-gray-400" />
          </button>
        </form>

        {/* 3. Swiggy-Style Quick Categories */}
        <div className="mb-2 mt-2">
          {/* Swiggy/Zomato conversational header */}
          <div className="flex items-center justify-between mb-4 px-1 md:px-0">
             <h3 className="text-[17px] font-black tracking-tight text-gray-900">
               What's on your mind?
             </h3>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-6 -mx-4 px-5 md:mx-0 md:px-1">
            {quickCategories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center gap-2.5 cursor-pointer active:scale-95 transition-transform shrink-0 w-[84px]"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("hero-search", { detail: cat.name }));
                  document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {/* Larger, softer image container with no harsh borders */}
                <div className="w-[84px] h-[84px] rounded-full overflow-hidden shadow-[0_4px_12px_rgb(0,0,0,0.06)] bg-white mb-1 relative">
                  <div className="absolute inset-0 bg-black/5 z-10 rounded-full pointer-events-none" /> {/* Subtle inner shadow/overlay */}
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                {/* Tighter, bolder typography */}
                <span className="text-[13px] font-bold text-gray-800 text-center leading-tight tracking-tight">
                  {cat.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroBanner;
