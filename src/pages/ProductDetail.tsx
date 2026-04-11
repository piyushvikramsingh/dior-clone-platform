import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, Minus, Plus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/types/product';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem, openCart } = useCartStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, selectedSize || undefined, selectedColor || undefined);
      openCart();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 md:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-secondary animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-secondary w-3/4 animate-pulse" />
              <div className="h-5 bg-secondary w-1/4 animate-pulse" />
              <div className="h-20 bg-secondary animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 md:px-8 py-20 text-center">
          <h2 className="font-display text-2xl text-foreground mb-4">Product Not Found</h2>
          <Link to="/" className="text-sm font-body underline text-muted-foreground hover:text-foreground">
            Return Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-foreground mb-8">
          <ChevronLeft size={14} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-secondary overflow-hidden">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span className="font-display text-2xl italic">No Image</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-20 overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-foreground' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6 md:py-8">
            <div>
              <p className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground mb-2">{product.category}</p>
              <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mb-3">{product.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-xl font-body text-foreground">{formatPrice(product.price)}</span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-lg font-body text-muted-foreground line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm font-body text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-xs font-body tracking-[0.15em] uppercase mb-3">Size</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-body border transition-colors ${
                        selectedSize === size
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-xs font-body tracking-[0.15em] uppercase mb-3">Color</p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs font-body border transition-colors ${
                        selectedColor === color
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-xs font-body tracking-[0.15em] uppercase mb-3">Quantity</p>
              <div className="inline-flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-secondary transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-6 text-sm font-body">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-secondary transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="w-full bg-foreground text-background py-4 text-xs font-body tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {product.in_stock ? 'Add to Bag' : 'Out of Stock'}
            </button>

            {/* Details accordion-like */}
            <div className="border-t border-border pt-6 space-y-4">
              <div className="text-xs font-body text-muted-foreground space-y-2">
                <p>• Complimentary shipping on all orders</p>
                <p>• Free returns within 30 days</p>
                <p>• Gift wrapping available</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default ProductDetail;
