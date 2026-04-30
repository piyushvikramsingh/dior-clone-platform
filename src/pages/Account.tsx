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

          {/* Connected Accounts */}
          <div className="mb-12">
            <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
              <Link2 size={20} /> Connected Accounts
            </h2>
            <div className="border border-border divide-y divide-border">
              {/* Email/password */}
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm font-body">Email & Password</p>
                  <p className="text-xs font-body text-muted-foreground mt-0.5">
                    {emailIdentity ? user.email : 'Not configured'}
                  </p>
                </div>
                <span className="text-[10px] font-body tracking-[0.15em] uppercase px-3 py-1 bg-secondary">
                  {emailIdentity ? 'Connected' : '—'}
                </span>
              </div>

              {/* Google */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  <div>
                    <p className="text-sm font-body">Google</p>
                    <p className="text-xs font-body text-muted-foreground mt-0.5">
                      {googleIdentity ? (googleIdentity.identity_data?.email as string) ?? 'Linked' : 'Not connected'}
                    </p>
                  </div>
                </div>
                {googleIdentity ? (
                  <button
                    onClick={handleUnlinkGoogle}
                    className="flex items-center gap-2 text-xs font-body tracking-[0.15em] uppercase border border-border px-4 py-2 hover:bg-secondary transition-colors"
                  >
                    <Unlink size={12} /> Disconnect
                  </button>
                ) : (
                  <button
                    onClick={handleLinkGoogle}
                    disabled={linking}
                    className="flex items-center gap-2 text-xs font-body tracking-[0.15em] uppercase bg-foreground text-background px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    <Link2 size={12} /> {linking ? 'Connecting...' : 'Connect'}
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs font-body text-muted-foreground mt-3">
              Linking lets you sign in with either method using the same account.
            </p>
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
