import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search as SearchIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types/product';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
    enabled: searchTerm.trim().length > 0,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-2xl mx-auto mb-16">
          <h1 className="font-display text-3xl md:text-5xl font-light text-foreground text-center mb-10">Search</h1>
          <div className="relative">
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products..."
              className="w-full bg-transparent border-b-2 border-border focus:border-foreground pl-12 pr-4 py-4 text-base font-body outline-none transition-colors placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
        </div>

        {searchTerm.trim() && (
          <>
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
              <p className="text-center font-body text-muted-foreground">
                No results for "{searchTerm}"
              </p>
            )}
          </>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Search;
