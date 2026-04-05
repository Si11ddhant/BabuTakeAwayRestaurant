import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import MenuSection from "@/components/MenuSection";
import LocationSection from "@/components/LocationSection";
import CheckoutSection from "@/components/CheckoutSection";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";

const Index = () => (
  <CartProvider>
    <div className="min-h-screen bg-background pt-[72px] selection:bg-primary/30">
      {/* Hero Section with Integrated Header background */}
      <div className="bg-charcoal">
        <Header />
        <HeroBanner />
      </div>

      <main className="relative">
        {/* Menu Section - Native Grid Layout */}
        <div className="pb-16">
          <MenuSection />
        </div>

        {/* Checkout - Highlighted Section */}
        <div className="bg-secondary/10 border-y border-border/40">
          <CheckoutSection />
        </div>

        {/* Location - Informational */}
        <div className="py-16">
          <LocationSection />
        </div>
      </main>

      {/* Persistent UI Elements */}
      <CartSidebar />
      <Footer />
    </div>
  </CartProvider>
);

export default Index;
