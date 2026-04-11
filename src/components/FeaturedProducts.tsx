import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import type { Product } from '@/types/product';

const FeaturedProducts = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground mb-3">Curated Selection</p>
          <h2 className="font-display text-3xl md:text-5xl font-light text-foreground">Featured Pieces</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-secondary mb-4" />
                <div className="h-4 bg-secondary w-3/4 mb-2" />
                <div className="h-3 bg-secondary w-1/4" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-display text-xl text-muted-foreground italic">No products yet</p>
            <p className="text-sm font-body text-muted-foreground mt-2">
              Products will appear here once added to the store.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
