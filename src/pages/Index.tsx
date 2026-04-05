import { CartProvider } from "@/context/CartContext";
import HeroBanner from "@/components/HeroBanner";
import MenuSection from "@/components/MenuSection";
import LocationSection from "@/components/LocationSection";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import TopNav from "@/components/TopNav";

const Index = () => (
  <CartProvider>
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Primary Responsive Navigation at the top */}
      <TopNav />
      
      {/* Hero Section - No padding top as TopNav is fixed and covers first 72px */}
      <div className="bg-charcoal overflow-hidden">
        <HeroBanner />
      </div>

      <main className="relative">
        {/* Menu Section - Background set to white for contrast */}
        <MenuSection />

        {/* Location - Informational */}
        <LocationSection />
      </main>

      {/* Persistent UI Elements */}
      <CartSidebar />
      <Footer />
    </div>
  </CartProvider>
);

export default Index;
