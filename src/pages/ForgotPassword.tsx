import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-24 max-w-md text-center">
        {sent ? (
          <>
            <h1 className="font-display text-3xl mb-4">Email Sent</h1>
            <p className="text-sm font-body text-muted-foreground">
              Check your inbox for a password reset link.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl mb-2">Reset Password</h1>
            <p className="text-sm font-body text-muted-foreground mb-8">
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
              <button type="submit" disabled={loading} className="w-full bg-foreground text-background py-3.5 text-xs font-body tracking-[0.2em] uppercase hover:opacity-90 disabled:opacity-40">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
        <Link to="/login" className="inline-block mt-6 text-xs font-body text-muted-foreground underline hover:text-foreground">
          Back to Sign In
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
