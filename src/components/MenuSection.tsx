import { useState, useEffect, useMemo } from "react";
import { useMenuItems } from "@/hooks/useMenuItems";
import MenuCard from "@/components/MenuCard";
import { Search, AlertCircle, ChevronDown, Utensils, Star, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-col md:flex-row gap-4 p-4 border-b border-gray-100 bg-white", className)}>
    <div className="flex-1 space-y-3 py-2">
      <div className="w-4 h-4 rounded-sm bg-gray-200 animate-pulse" />
      <div className="h-5 bg-gray-200 rounded-md w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded-md w-1/4 animate-pulse" />
      <div className="h-3 bg-gray-100 rounded-md w-full animate-pulse mt-4" />
    </div>
    <div className="relative w-[130px] h-[130px] shrink-0 rounded-2xl bg-gray-100 animate-pulse shadow-sm" />
  </div>
);

const MenuSection = () => {
  const { menuItems, categories, loading, error, getItemsByCategory } = useMenuItems();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Zomato/Swiggy Style UI States
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterNonVeg, setFilterNonVeg] = useState(false);
  const [filterBestseller, setFilterBestseller] = useState(false);
  const [isMenuFabOpen, setIsMenuFabOpen] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    const onHeroSearch = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") setSearchQuery(detail);
    };
    window.addEventListener("hero-search", onHeroSearch);
    return () => window.removeEventListener("hero-search", onHeroSearch);
  }, []);

  const currentCategory = activeCategory || (categories[0] ?? "");
  const q = searchQuery.trim().toLowerCase();

  // Custom filter logic combining Categories, Search, and Quick Filters
  const filtered = useMemo(() => {
    let baseItems = [];

    // 1. Handle Search vs Category
    if (q) {
      const isCategoryClick = categories.some(c => c.toLowerCase() === q);
      if (isCategoryClick) {
        setActiveCategory(categories.find(c => c.toLowerCase() === q) || categories[0]);
        setSearchQuery(""); 
        baseItems = getItemsByCategory(categories.find(c => c.toLowerCase() === q) || "");
      } else {
        baseItems = menuItems.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            (item.description ?? "").toLowerCase().includes(q)
        );
      }
    } else {
      baseItems = getItemsByCategory(currentCategory);
    }

    // 2. Apply Diet & Bestseller Filters
    return baseItems.filter(item => {
      if (filterVeg && !item.is_veg) return false;
      if (filterNonVeg && item.is_veg) return false;
      // Note: Assuming you add a bestseller flag later. Currently mocks visual filter.
      if (filterBestseller && item.name.length < 10) return false; 
      return true;
    });

  }, [menuItems, currentCategory, q, getItemsByCategory, categories, filterVeg, filterNonVeg, filterBestseller]);

  const listTitle = q ? `Search results for "${searchQuery}"` : currentCategory;

  return (
    <section className="relative bg-white min-h-screen pb-24" id="menu-section">
      <div className="w-full h-3 bg-gray-50 border-y border-gray-100" />

      {/* 1. Sticky Category Tabs */}
      <div className="sticky top-[3.5rem] md:top-[4rem] z-30 bg-white border-b border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="container mx-auto px-0 max-w-3xl">
          <div className="flex overflow-x-auto scrollbar-hide items-center px-2">
            {loading ? (
              <div className="flex px-4 gap-6 py-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 w-24 bg-gray-100 animate-pulse rounded-full shrink-0" />
                ))}
              </div>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory(cat);
                    const element = document.getElementById('menu-grid');
                    if (element) {
                      window.scrollTo({ top: element.offsetTop - 180, behavior: 'smooth' });
                    }
                  }}
                  className={cn(
                    "relative whitespace-nowrap px-4 py-4 mx-1 text-[15px] font-bold capitalize transition-colors shrink-0",
                    currentCategory === cat && !q
                      ? "text-gray-900"
                      : "text-gray-400 hover:text-gray-700"
                  )}
                >
                  {cat}
                  {currentCategory === cat && !q && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-md animate-in fade-in zoom-in-95 duration-200" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* 2. Swiggy-Style Quick Filters Row */}
        <div className="bg-gray-50/50 py-3 px-4 border-t border-gray-50 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <div className="flex items-center justify-center p-2 rounded-full bg-white border border-gray-200 shadow-sm shrink-0 mr-1">
             <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          </div>
          
          <button
            onClick={() => { setFilterVeg(!filterVeg); setFilterNonVeg(false); }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[13px] font-bold transition-all shrink-0 shadow-sm",
              filterVeg ? "border-green-600 bg-green-50 text-green-700" : "border-gray-200 bg-white text-gray-600"
            )}
          >
            <div className="w-3 h-3 border border-green-600 rounded-[2px] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
            </div>
            100% Veg
          </button>

          <button
            onClick={() => { setFilterNonVeg(!filterNonVeg); setFilterVeg(false); }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[13px] font-bold transition-all shrink-0 shadow-sm",
              filterNonVeg ? "border-red-600 bg-red-50 text-red-700" : "border-gray-200 bg-white text-gray-600"
            )}
          >
            <div className="w-3 h-3 border border-red-600 rounded-[2px] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
            </div>
            Non Veg
          </button>

          <button
            onClick={() => setFilterBestseller(!filterBestseller)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[13px] font-bold transition-all shrink-0 shadow-sm",
              filterBestseller ? "border-[#D97706] bg-[#FEF3C7] text-[#D97706]" : "border-gray-200 bg-white text-gray-600"
            )}
          >
            <Star className={cn("w-3.5 h-3.5", filterBestseller ? "fill-current" : "")} />
            Bestseller
          </button>
        </div>
      </div>

      <div className="container mx-auto px-0 md:px-4 max-w-3xl py-2" id="menu-grid">

        {error && (
          <div className="my-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-4 mx-4 md:mx-0">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900">Menu temporarily unavailable</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Section Title Header */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 md:px-0 pt-6 pb-2 mb-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2 capitalize">
              {listTitle}
              <ChevronDown className="w-5 h-5 text-gray-400" strokeWidth={3} />
            </h2>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-md">
              {filtered.length} {filtered.length === 1 ? 'ITEM' : 'ITEMS'}
            </span>
          </div>
        )}

        {/* Content List */}
        <div className="flex flex-col">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filtered.length > 0 ? (
            filtered.map((item, i) => (
              <div
                key={item.id}
                className="animate-in slide-in-from-bottom-4 fade-in duration-300 border-b border-dashed border-gray-200 last:border-b-0 px-4 md:px-0 py-3"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
              >
                <MenuCard
                  item={{
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    category: item.category,
                    image: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
                    isVeg: item.is_veg ?? true,
                    description: item.description || '',
                  }}
                />
              </div>
            ))
          ) : (
            !error && (
              <div className="text-center py-20 mx-4 mt-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                  <Search className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-lg font-black text-gray-900">No dishes found</h3>
                <p className="text-sm font-medium text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  We couldn&apos;t find any matches. Try changing your filters.
                </p>
                <button
                  onClick={() => { setSearchQuery(""); setFilterVeg(false); setFilterNonVeg(false); setFilterBestseller(false); }}
                  className="mt-6 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-primary/30"
                >
                  Clear Filters
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* 3. Zomato-Style Floating "MENU" Button (FAB) */}
      {!loading && categories.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
          
          {/* Menu Modal Overlay */}
          {isMenuFabOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsMenuFabOpen(false)} 
              />
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100 py-3 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200 max-h-[60vh] overflow-y-auto scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsMenuFabOpen(false);
                      document.getElementById('menu-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <span className={cn(
                      "text-[14px] font-bold",
                      currentCategory === cat ? "text-primary" : "text-gray-700"
                    )}>
                      {cat}
                    </span>
                    {currentCategory === cat && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* The FAB Trigger Button */}
          <button
            onClick={() => setIsMenuFabOpen(!isMenuFabOpen)}
            className="bg-slate-900 text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] px-6 py-3 rounded-full flex items-center gap-2 text-[13px] font-black tracking-widest uppercase active:scale-95 transition-transform border border-slate-700"
          >
            <Utensils className="w-4 h-4" />
            Menu
          </button>
        </div>
      )}
    </section>
  );
};

export default MenuSection;