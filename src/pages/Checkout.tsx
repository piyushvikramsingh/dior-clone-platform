import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [form, setForm] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    const orderData = {
      user_id: user?.id || null,
      email: form.email,
      total: totalPrice(),
      items: items.map((i) => ({
        product_id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
      })),
      shipping_address: {
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        country: form.country,
      },
      status: 'pending',
    };

    const { data, error } = await supabase.from('orders').insert(orderData).select().single();
    setLoading(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setOrderId(data.id);
      setOrderPlaced(true);
      clearCart();
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 md:px-8 py-20 max-w-lg text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-display">✓</div>
            <h1 className="font-display text-3xl mb-2">Order Confirmed</h1>
            <p className="text-sm font-body text-muted-foreground">
              Thank you for your order. Your order number is:
            </p>
            <p className="font-body text-xs tracking-[0.1em] mt-2 bg-secondary inline-block px-4 py-2">
              #{orderId.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <p className="text-sm font-body text-muted-foreground mb-8">
            A confirmation email has been sent to {form.email}
          </p>
          <Link
            to="/"
            className="inline-block bg-foreground text-background px-8 py-3 text-xs font-body tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 md:px-8 py-20 text-center">
          <h1 className="font-display text-3xl mb-4">Your Bag is Empty</h1>
          <Link to="/" className="text-sm font-body underline text-muted-foreground hover:text-foreground">
            Continue Shopping
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-16">
        <Link to="/" className="inline-flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-foreground mb-8">
          <ChevronLeft size={14} /> Continue Shopping
        </Link>

        <h1 className="font-display text-3xl md:text-4xl mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form */}
          <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-6">
            <div>
              <h2 className="font-display text-xl mb-4">Contact</h2>
              <Input type="email" placeholder="Email" value={form.email} onChange={handleChange('email')} required />
              {!user && (
                <p className="text-xs font-body text-muted-foreground mt-2">
                  Have an account? <Link to="/login" className="underline hover:text-foreground">Sign in</Link>
                </p>
              )}
            </div>

            <div>
              <h2 className="font-display text-xl mb-4">Shipping Address</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="First Name" value={form.firstName} onChange={handleChange('firstName')} required />
                  <Input placeholder="Last Name" value={form.lastName} onChange={handleChange('lastName')} required />
                </div>
                <Input placeholder="Address" value={form.address} onChange={handleChange('address')} required />
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="City" value={form.city} onChange={handleChange('city')} required />
                  <Input placeholder="State" value={form.state} onChange={handleChange('state')} required />
                  <Input placeholder="ZIP Code" value={form.zip} onChange={handleChange('zip')} required />
                </div>
                <Input placeholder="Country" value={form.country} onChange={handleChange('country')} required />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background py-4 text-xs font-body tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {loading ? 'Placing Order...' : `Place Order — ${formatPrice(totalPrice())}`}
            </button>
          </form>

          {/* Order Summary */}
          <div>
            <h2 className="font-display text-xl mb-6">Order Summary</h2>
            <div className="space-y-4 border-b border-border pb-6 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-secondary flex-shrink-0 overflow-hidden relative">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                    )}
                    <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-body">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 flex justify-between">
                    <div>
                      <h3 className="text-sm font-body">{item.product.name}</h3>
                      {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                    </div>
                    <span className="text-sm font-body">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Shipping</span>
                <span>Complimentary</span>
              </div>
              <div className="flex justify-between text-base font-body border-t border-border pt-3 mt-3">
                <span className="tracking-wide uppercase text-sm">Total</span>
                <span className="font-display text-xl">{formatPrice(totalPrice())}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
