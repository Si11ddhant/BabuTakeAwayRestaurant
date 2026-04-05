import { useState, useEffect } from "react";
import { useMenuItems } from "@/hooks/useMenuItems";
import MenuCard from "@/components/MenuCard";
import { Search, Loader } from "lucide-react";

const MenuSection = () => {
  const { menuItems, categories, loading, error, getItemsByCategory } = useMenuItems();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const currentCategory = activeCategory || (categories[0] ?? "");
  const filtered = getItemsByCategory(currentCategory).filter(
    (item) =>
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative" id="menu-section">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-sm font-black uppercase tracking-widest text-muted-foreground">Preparing Menu...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-700 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <Search className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="font-black uppercase tracking-tight">Failed to load dishes</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Sticky Navigation & Search Container */}
          <div className="sticky top-[72px] z-40 bg-background/95 backdrop-blur-xl border-b border-border/40 pb-4 pt-6 transition-all duration-300">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search - Native App Style */}
                <div className="relative flex-1 max-w-md group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search for dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-transparent rounded-2xl text-sm font-medium placeholder:text-muted-foreground focus:bg-background focus:border-primary/20 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>

                {/* Category Scroll - Native PWA Style */}
                <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        // Optional: smooth scroll to top of menu when category changes
                        const element = document.getElementById('menu-grid');
                        if (element) {
                          const yOffset = -140; // Adjust based on sticky header/nav height
                          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }}
                      className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 border-2 ${
                        currentCategory === cat 
                          ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                          : "bg-white border-gray-100 text-gray-500 hover:border-primary/30 hover:text-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8" id="menu-grid">
            {/* Results Info */}
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tighter leading-none">
                  {currentCategory}
                </h2>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-2">
                  {filtered.length} {filtered.length === 1 ? 'item' : 'items'} available
                </p>
              </div>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                >
                  Clear Search
                </button>
              )}
            </div>

            {/* Grid - Native Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filtered.map((item, i) => (
                <div 
                  key={item.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <MenuCard 
                    item={{
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      category: item.category,
                      image: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
                      isVeg: item.is_veg ?? true, 
                      description: item.description || 'Traditional recipe crafted with authentic spices.',
                    }}
                  />
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-24 bg-secondary/20 rounded-3xl border-2 border-dashed border-border/50">
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Search className="w-8 h-8 text-muted-foreground opacity-20" />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight">No matching dishes</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto font-medium">
                  We couldn't find any "{searchQuery}" in {currentCategory}. Try exploring other categories!
                </p>
                <button 
                  onClick={() => { setSearchQuery(""); setActiveCategory(categories[0]); }}
                  className="mt-8 btn-primary-glow px-8 py-3 text-xs font-black uppercase tracking-widest"
                >
                  View All Menu
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default MenuSection;
