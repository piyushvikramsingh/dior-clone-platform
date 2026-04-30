import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-foreground/40 z-50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="font-display text-xl tracking-wide">Shopping Bag ({items.length})</h2>
          <button onClick={closeCart} className="p-1 hover:opacity-70 transition-opacity">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <ShoppingBag size={48} className="text-muted-foreground/40" />
            <p className="font-body text-sm text-muted-foreground">Your bag is empty</p>
            <button
              onClick={closeCart}
              className="bg-foreground text-background px-8 py-3 text-xs font-body tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-20 h-28 bg-secondary flex-shrink-0 overflow-hidden">
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-sm">{item.product.name}</h3>
                      {item.size && (
                        <p className="text-xs font-body text-muted-foreground mt-0.5">Size: {item.size}</p>
                      )}
                      <p className="text-sm font-body mt-1">{formatPrice(item.product.price)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-secondary transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-xs font-body">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-secondary transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-xs font-body text-muted-foreground underline hover:text-foreground transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-body tracking-wide uppercase">Total</span>
                <span className="text-lg font-display">{formatPrice(totalPrice())}</span>
              </div>
              <p className="text-xs font-body text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="block w-full bg-foreground text-background text-center py-3.5 text-xs font-body tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
CartDrawer.displayName = 'CartDrawer';

export default CartDrawer;
