import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { LogOut, Package, Shield, Link2, Unlink } from 'lucide-react';
import type { UserIdentity } from '@supabase/supabase-js';

const Account = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [identities, setIdentities] = useState<UserIdentity[]>([]);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  const refreshIdentities = useCallback(async () => {
    const { data } = await supabase.auth.getUserIdentities();
    setIdentities(data?.identities ?? []);
  }, []);

  useEffect(() => {
    if (user) refreshIdentities();
  }, [user, refreshIdentities]);

  const googleIdentity = identities.find((i) => i.provider === 'google');
  const emailIdentity = identities.find((i) => i.provider === 'email');

  const handleLinkGoogle = async () => {
    setLinking(true);
    const { error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account` },
    });
    setLinking(false);
    if (error) {
      toast({ title: 'Could not link Google', description: error.message, variant: 'destructive' });
    }
  };

  const handleUnlinkGoogle = async () => {
    if (!googleIdentity) return;
    if (identities.length < 2) {
      toast({
        title: 'Cannot unlink',
        description: 'You must have at least one sign-in method.',
        variant: 'destructive',
      });
      return;
    }
    const { error } = await supabase.auth.unlinkIdentity(googleIdentity);
    if (error) {
      toast({ title: 'Could not unlink', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Google disconnected' });
      refreshIdentities();
    }
  };

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data: orders } = useQuery({
    queryKey: ['my-orders', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-pulse text-muted-foreground font-body text-sm">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-display text-3xl md:text-4xl">My Account</h1>
              <p className="text-sm font-body text-muted-foreground mt-1">
                {profile?.full_name || user.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-xs font-body tracking-[0.15em] uppercase border border-border px-4 py-2 hover:bg-secondary transition-colors"
                >
                  <Shield size={14} /> Admin
                </Link>
              )}
              <button
                onClick={() => { signOut(); navigate('/'); }}
                className="flex items-center gap-2 text-xs font-body tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          {/* Orders */}
          <div>
            <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
              <Package size={20} /> Order History
            </h2>
            {!orders || orders.length === 0 ? (
              <div className="border border-border p-8 text-center">
                <p className="text-sm font-body text-muted-foreground">No orders yet</p>
                <Link
                  to="/"
                  className="inline-block mt-4 bg-foreground text-background px-6 py-2.5 text-xs font-body tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-border p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-body text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="text-xs font-body tracking-[0.1em] uppercase px-3 py-1 bg-secondary">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-body text-muted-foreground">Order #{order.id.slice(0, 8)}</span>
                      <span className="font-display text-lg">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Account;
