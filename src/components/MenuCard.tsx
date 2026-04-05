import { Plus, Clock, Star } from "lucide-react";
import type { MenuItem } from "@/data/menuData";
import { useCart } from "@/context/CartContext";

const MenuCard = ({ item }: { item: MenuItem }) => {
  const { addItem } = useCart();

  return (
    <div className="menu-card flex flex-col h-full group bg-white hover:bg-white/50 transition-all duration-500">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className={`${item.is_veg ? "bg-green-500" : "bg-red-500"} w-4 h-4 rounded-sm border-2 border-white shadow-md flex items-center justify-center`}>
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          {item.price > 500 && (
            <div className="bg-primary/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg backdrop-blur-md uppercase tracking-tighter">
              Best Seller
            </div>
          )}
        </div>

        {/* Floating Quick Info */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-xl translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <Clock className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-black text-gray-800">25-30 min</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-black text-base text-gray-900 leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {item.name}
            </h3>
            <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-md">
              <span className="text-[10px] font-black text-green-700">4.2</span>
              <Star className="w-2.5 h-2.5 text-green-700 fill-green-700" />
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5 line-clamp-2 leading-relaxed font-medium">
            {item.description || "Authentic spices and traditional cooking methods combined for a perfect taste."}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Price</span>
            <span className="font-black text-lg text-gray-900 tracking-tighter">₹{item.price}</span>
          </div>
          <button
            onClick={() => addItem(item)}
            className="btn-primary-glow flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
