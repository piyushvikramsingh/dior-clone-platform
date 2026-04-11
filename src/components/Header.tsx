import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCartStore();
  const count = totalItems();

  const navLinks = [
    { label: 'New Arrivals', href: '/collections/new-arrivals' },
    { label: 'Women', href: '/collections/women' },
    { label: 'Men', href: '/collections/men' },
    { label: 'Accessories', href: '/collections/accessories' },
    { label: 'Fragrance', href: '/collections/fragrance' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-center py-2">
        <p className="text-xs font-body tracking-[0.2em] uppercase">
          Complimentary shipping on all orders
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-[0.15em] uppercase text-foreground">
              MAISON
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 ml-16">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/search" className="p-2 hover:opacity-70 transition-opacity">
              <Search size={18} />
            </Link>
            <Link to="/account" className="p-2 hover:opacity-70 transition-opacity hidden md:block">
              <User size={18} />
            </Link>
            <button
              onClick={openCart}
              className="p-2 hover:opacity-70 transition-opacity relative"
              aria-label="Open cart"
            >
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="flex flex-col py-6 px-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-body tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-body tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
