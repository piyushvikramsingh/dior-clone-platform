import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="font-display text-lg italic">No Image</span>
          </div>
        )}

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-foreground/90 text-background py-3 text-xs font-body tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-foreground transition-colors backdrop-blur-sm"
          >
            <ShoppingBag size={14} />
            Add to Bag
          </button>
        </div>

        {/* Badges */}
        {product.compare_at_price && product.compare_at_price > product.price && (
          <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] font-body tracking-[0.1em] uppercase px-3 py-1">
            Sale
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className="font-display text-base md:text-lg text-foreground group-hover:opacity-70 transition-opacity">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-sm font-body text-foreground">{formatPrice(product.price)}</p>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <p className="text-sm font-body text-muted-foreground line-through">
              {formatPrice(product.compare_at_price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
