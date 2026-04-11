import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Category } from '@/types/product';

const CategoryShowcase = () => {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });

  const defaultCategories = [
    { name: 'Women', slug: 'women', description: 'Timeless femininity' },
    { name: 'Men', slug: 'men', description: 'Modern sophistication' },
    { name: 'Accessories', slug: 'accessories', description: 'Finishing touches' },
  ];

  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground mb-3">Collections</p>
          <h2 className="font-display text-3xl md:text-5xl font-light text-foreground">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {displayCategories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/collections/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-muted"
            >
              {('image_url' in cat && cat.image_url) ? (
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-muted to-secondary" />
              )}
              <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground">
                <h3 className="font-display text-3xl md:text-4xl font-light mb-2">{cat.name}</h3>
                {'description' in cat && cat.description && (
                  <p className="text-xs font-body tracking-[0.15em] uppercase opacity-80">{cat.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
