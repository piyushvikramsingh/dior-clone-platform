import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types/product';

const Collection = () => {
  const { slug } = useParams<{ slug: string }>();

  const title = slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Collection';

  const { data: products, isLoading } = useQuery({
    queryKey: ['collection', slug],
    queryFn: async () => {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });

      if (slug && slug !== 'new-arrivals') {
        query = query.ilike('category', slug.replace(/-/g, ' '));
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Collection header */}
        <div className="bg-secondary/50 py-16 md:py-24 text-center">
          <p className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground mb-3">Collection</p>
          <h1 className="font-display text-4xl md:text-6xl font-light text-foreground">{title}</h1>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-secondary mb-4" />
                  <div className="h-4 bg-secondary w-3/4 mb-2" />
                  <div className="h-3 bg-secondary w-1/4" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-display text-xl text-muted-foreground italic">No products found</p>
              <p className="text-sm font-body text-muted-foreground mt-2">
                Check back soon for new additions to this collection.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Collection;
