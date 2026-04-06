import { CartProvider } from "@/context/CartContext";
import HeroBanner from "@/components/HeroBanner";
import MenuSection from "@/components/MenuSection";
import LocationSection from "@/components/LocationSection";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import TopNav from "@/components/TopNav";

const Index = () => (
  <CartProvider>
    <div className="min-h-screen bg-white selection:bg-primary/25">
      {/* Primary Responsive Navigation at the top */}
      <TopNav />
      
      <div className="overflow-hidden bg-gradient-to-b from-[#faf8f4] via-white to-white">
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
