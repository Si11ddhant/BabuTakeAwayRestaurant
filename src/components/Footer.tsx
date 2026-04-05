import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ExternalLink, ArrowRight, Heart, Utensils } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Utensils className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-black text-white tracking-tighter leading-tight uppercase">
                  Babu
                </h2>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">Takeaway</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs font-medium leading-relaxed max-w-xs uppercase tracking-wide">
              Authentic Indian flavours delivered straight to your door. Spices handcrafted with tradition.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-500 group" aria-label="Social">
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              Explore
              <div className="w-10 h-px bg-primary/30" />
            </h3>
            <ul className="space-y-4">
              {['Home', 'Menu', 'Order Now', 'Offers', 'Gallery'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-primary text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group transition-all">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              Contact
              <div className="w-10 h-px bg-primary/30" />
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-[11px] font-black uppercase tracking-wider text-gray-400">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Curry District, UK</span>
              </li>
              <li className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wider text-gray-400">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+442012345678" className="hover:text-primary transition-colors">+44 (0) 20 1234 5678</a>
              </li>
              <li className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wider text-gray-400">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:info@babutakeaway.com" className="hover:text-primary transition-colors">info@babu.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              Updates
              <div className="w-10 h-px bg-primary/30" />
            </h3>
            <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest leading-relaxed">
              Get latest offers and updates.
            </p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-5 pr-12 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button className="absolute right-2 top-2 w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
              © {currentYear} Babu Takeaway. All rights reserved.
            </p>
            <p className="text-gray-700 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
              Made with <Heart className="w-2.5 h-2.5 text-primary fill-primary animate-pulse" /> for food lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;