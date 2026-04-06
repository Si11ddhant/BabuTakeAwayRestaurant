import { useState, useEffect, useMemo } from "react";
import { useMenuItems } from "@/hooks/useMenuItems";
import MenuCard from "@/components/MenuCard";
import { Search, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-col md:flex-row gap-4 p-4 border-b border-[#E8E8E8] bg-white", className)}>
    <div className="flex-1 space-y-3">
      <div className="w-4 h-4 rounded-sm bg-slate-100 animate-pulse" />
      <div className="h-5 bg-slate-100 rounded-md w-3/4 animate-pulse" />
      <div className="h-4 bg-slate-100 rounded-md w-1/4 animate-pulse" />
      <div className="h-3 bg-slate-100 rounded-md w-full animate-pulse" />
    </div>
    <div className="relative w-32 h-32 shrink-0 rounded-2xl bg-slate-100 animate-pulse" />
  </div>
);

const MenuSection = () => {
  const { menuItems, categories, loading, error, getItemsByCategory } = useMenuItems();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Custom filter logic to match actual categories or search queries
  const filtered = useMemo(() => {
    // If they typed something, search the whole menu
    if (q) {
      // Check if the query perfectly matches a category name (from the quick links)
      const isCategoryClick = categories.some(c => c.toLowerCase() === q);
      if (isCategoryClick) {
        setActiveCategory(categories.find(c => c.toLowerCase() === q) || categories[0]);
        setSearchQuery(""); // Clear query so tabs work normally again
        return getItemsByCategory(categories.find(c => c.toLowerCase() === q) || "");
      }

      // Otherwise, do a standard text search
      return menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description ?? "").toLowerCase().includes(q)
      );
    }
    // If no search, just show the active category tab
    return getItemsByCategory(currentCategory);
  }, [menuItems, currentCategory, q, getItemsByCategory, categories]);

  const listTitle = q ? "Search results" : currentCategory;

  return (
    <section className="relative bg-white min-h-screen" id="menu-section">

      {/* Sticky Zomato-Style Category Tabs */}
      <div className="sticky top-[3.8rem] md:top-[4.5rem] z-40 bg-white border-b border-gray-100 shadow-[0_4px_12px_rgb(0,0,0,0.03)] transition-all duration-300">
        <div className="container mx-auto px-0 max-w-3xl">
          <div className="flex overflow-x-auto scrollbar-hide">
            {loading ? (
              <div className="flex px-4 gap-6 py-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-6 w-24 bg-slate-100 animate-pulse rounded-md shrink-0" />
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
                      window.scrollTo({ top: element.offsetTop - 140, behavior: 'smooth' });
                    }
                  }}
                  className={cn(
                    "whitespace-nowrap px-5 py-4 text-sm font-bold capitalize transition-all shrink-0 border-b-[3px]",
                    currentCategory === cat && !q
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  )}
                >
                  {cat}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-0 md:px-4 max-w-3xl py-2" id="menu-grid">

        {/* Error State */}
        {error && (
          <div className="my-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-4 mx-4 md:mx-0">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900">Menu temporarily unavailable</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
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
                className="animate-fade-in border-b border-gray-100 last:border-b-0 px-4 md:px-0 py-2"
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
                    description: item.description || '',
                  }}
                />
              </div>
            ))
          ) : (
            /* EMPTY STATE */
            !error && (
              <div className="text-center py-20 mx-4 mt-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Search className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No dishes found</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                  We couldn&apos;t find any &quot;{searchQuery}&quot;
                  {q ? " across the menu." : ` in ${currentCategory}.`}
                </p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory(categories[0]); }}
                  className="mt-6 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-transform active:scale-95"
                >
                  View Menu
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;