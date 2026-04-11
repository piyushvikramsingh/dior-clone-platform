const BrandStory = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="space-y-6">
            <p className="text-xs font-body tracking-[0.3em] uppercase text-luxury-gold">Our Philosophy</p>
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground leading-tight">
              Crafted with
              <br />
              <span className="italic">Intention</span>
            </h2>
            <p className="text-sm md:text-base font-body text-muted-foreground leading-relaxed max-w-md">
              Every piece in our collection is a dialogue between heritage and innovation. 
              We believe in the power of exceptional materials, meticulous craftsmanship, 
              and designs that transcend seasons.
            </p>
            <p className="text-sm md:text-base font-body text-muted-foreground leading-relaxed max-w-md">
              From our ateliers to your wardrobe, each creation carries the spirit of 
              artisanal excellence and contemporary vision.
            </p>
          </div>
          <div className="aspect-[4/5] bg-gradient-to-br from-secondary to-muted overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-6xl md:text-8xl text-muted-foreground/20 italic">M</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
