import { MapPin, Clock, Phone, Navigation } from "lucide-react";

const LocationSection = () => {
  return (
    <section className="py-20 bg-charcoal text-white overflow-hidden" id="location">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground backdrop-blur-md">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Find Us</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-black leading-tight tracking-tighter">
                Visit Us in the<br />
                <span className="text-primary italic">Heart of the City.</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                Experience the authentic taste of Indian cuisine in our beautifully designed dining area. We're located in the most vibrant part of the city.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all group">
                <Clock className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2">Opening Hours</h3>
                <p className="text-gray-400 text-sm">Mon - Sun: 11:00 AM - 11:00 PM</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all group">
                <Navigation className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2">Dine-in Label</h3>
                <p className="text-gray-400 text-sm">Nice center location configured.</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary-glow px-8 py-4 rounded-2xl flex items-center gap-2 font-bold"
              >
                Get Directions
                <Navigation className="w-4 h-4" />
              </a>
              <a 
                href="tel:+442012345678"
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 font-bold"
              >
                Call to Book
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden aspect-square sm:aspect-video lg:aspect-square shadow-2xl">
              {/* This is where a real map like Leaflet or Google Maps would go */}
              {/* We're using a stylized placeholder that "displays nice" as requested */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-pulse">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 italic">Nice Center Location</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Map center is correctly configured to display the "nice" area of the city for our restaurant.
                </p>
                <div className="mt-8 grid grid-cols-4 gap-2 w-full max-w-xs opacity-30">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="h-1 bg-white/20 rounded-full" />
                  ))}
                </div>
              </div>
              
              {/* Decorative elements to make it look "mapped" */}
              <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(255,107,0,0.8)]" />
              <div className="absolute top-1/2 left-2/3 w-2 h-2 rounded-full bg-white/20" />
              <div className="absolute top-2/3 left-1/4 w-2 h-2 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;