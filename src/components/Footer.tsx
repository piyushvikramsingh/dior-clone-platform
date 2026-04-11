import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="font-display text-2xl tracking-[0.15em] uppercase mb-4">MAISON</h2>
            <p className="text-sm font-body text-primary-foreground/70 leading-relaxed">
              Where timeless elegance meets modern sophistication. Each piece tells a story of craftsmanship and refined taste.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-body tracking-[0.2em] uppercase mb-6">Shop</h3>
            <ul className="space-y-3">
              {['New Arrivals', 'Women', 'Men', 'Accessories', 'Fragrance'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/collections/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-sm font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs font-body tracking-[0.2em] uppercase mb-6">Client Services</h3>
            <ul className="space-y-3">
              {['Contact Us', 'Shipping & Returns', 'Size Guide', 'FAQs', 'Store Locator'].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-sm font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-body tracking-[0.2em] uppercase mb-6">Newsletter</h3>
            <p className="text-sm font-body text-primary-foreground/70 mb-4">
              Subscribe to receive exclusive updates and early access.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent border border-primary-foreground/30 px-4 py-2.5 text-sm font-body placeholder:text-primary-foreground/40 focus:outline-none focus:border-primary-foreground/60"
              />
              <button className="bg-primary-foreground text-primary px-6 py-2.5 text-xs font-body tracking-[0.15em] uppercase hover:opacity-90 transition-opacity">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-body text-primary-foreground/50">
            © 2026 MAISON. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link
                key={item}
                to="#"
                className="text-xs font-body text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
