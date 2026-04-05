import heroFood from "@/assets/hero-food.jpg";
import { Search, MapPin, ChevronRight, Star } from "lucide-react";

const HeroBanner = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      const yOffset = -80; // Account for sticky header
      const y = menuSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[300px] sm:h-[380px] lg:h-[440px] flex items-center overflow-hidden bg-charcoal">
      {/* Background Image with Dynamic Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroFood}
          alt="Delicious Indian food spread"
          className="w-full h-full object-cover opacity-40 sm:opacity-50 scale-105 animate-subtle-zoom"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/40 to-charcoal/90 sm:bg-gradient-to-r sm:from-charcoal/90 sm:via-charcoal/60 sm:to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl space-y-5 sm:space-y-7 animate-fade-in-up">
          {/* Minimal Branding */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-full mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Now Delivering</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter">
              Authentic Taste,<br />
              <span className="text-primary italic">Native Experience.</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm font-bold uppercase tracking-wide leading-relaxed">
              Premium Indian takeaway. Handcrafted spices, from our tandoor to your table.
            </p>
          </div>

          {/* Native-like Action Area */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 bg-white p-1.5 rounded-2xl sm:rounded-full shadow-2xl shadow-black/50 max-w-xl group transition-all hover:ring-8 hover:ring-primary/5">
            {/* Search Input (Trigger Scroll) */}
            <div className="relative flex-1 flex items-center px-4 py-2 sm:py-0">
              <Search className="absolute left-4 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search for biryani, rolls, or starters..."
                className="w-full pl-8 pr-2 py-1.5 bg-transparent text-sm font-black text-gray-900 placeholder:text-gray-400 focus:outline-none cursor-pointer"
                onClick={scrollToMenu}
                readOnly
              />
            </div>

            {/* Quick Action Button */}
            <button 
              onClick={scrollToMenu}
              className="bg-primary text-primary-foreground px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              Explore Menu
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Stats (Native Style) */}
          <div className="flex items-center gap-8 pt-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-white font-black text-lg sm:text-2xl tracking-tighter">4.8</span>
                <Star className="w-3 h-3 text-primary fill-primary" />
              </div>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Rating</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-white font-black text-lg sm:text-2xl tracking-tighter">30m</span>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Delivery</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col text-primary">
              <span className="text-white font-black text-lg sm:text-2xl tracking-tighter">100%</span>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Fresh</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
