import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-luxury-cream">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, hsl(var(--foreground)) 35px, hsl(var(--foreground)) 36px)`
      }} />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="text-xs font-body tracking-[0.4em] uppercase text-muted-foreground mb-6 animate-fade-in">
          Spring / Summer 2026
        </p>
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[0.9] mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          The Art of
          <br />
          <span className="italic">Elegance</span>
        </h2>
        <p className="text-sm md:text-base font-body text-muted-foreground max-w-md mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Discover the new collection — where every detail is a testament to extraordinary craftsmanship.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.45s' }}>
          <Link
            to="/collections/new-arrivals"
            className="bg-foreground text-background px-10 py-3.5 text-xs font-body tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
          >
            Explore Collection
          </Link>
          <Link
            to="/collections/women"
            className="border border-foreground text-foreground px-10 py-3.5 text-xs font-body tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-all duration-300"
          >
            Shop Women
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
