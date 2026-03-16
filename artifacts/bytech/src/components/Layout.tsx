import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/store/use-cart";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { ShoppingCart, Menu, X, Cpu, ShieldAlert, LogOut, Languages } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

export function Layout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const cartCount = useCart((state) => state.getItemCount());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, lang, setLang, dir } = useLang();

  const { data: session } = useGetMe({ query: { retry: false, refetchOnWindowFocus: false } });
  const logoutMutation = useLogout({ mutation: { onSuccess: () => { window.location.href = "/"; } } });
  const isOwner = session?.isOwner === true;

  const navLinks = [
    { label: t.home, href: "/" },
    { label: t.products, href: "/products" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" dir={dir}>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                <div className="w-10 h-10 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <span className="font-display text-2xl font-bold tracking-widest text-white group-hover:text-primary transition-colors">
                  BYTECH
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
                >
                  {link.label}
                </Link>
              ))}
              {isOwner && (
                <Link
                  href="/owner"
                  className={`text-sm font-medium uppercase tracking-wider transition-colors flex items-center gap-1 ${location.startsWith("/owner") ? "text-accent" : "text-muted-foreground hover:text-accent"}`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  {t.dashboard}
                </Link>
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-border rounded-md text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                title="Switch Language"
              >
                <Languages className="w-4 h-4" />
                {lang === "en" ? "العربية" : "English"}
              </button>

              <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-primary transition-colors group">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isOwner && (
                <button
                  onClick={() => logoutMutation.mutate()}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-md hover:border-destructive hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t.logout}
                </button>
              )}

              <button
                className="md:hidden p-2 text-muted-foreground hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-card"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-white/5 rounded-md"
                >
                  {link.label}
                </Link>
              ))}
              {isOwner && (
                <Link
                  href="/owner"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium uppercase tracking-wider text-accent hover:bg-white/5 rounded-md"
                >
                  {t.dashboard}
                </Link>
              )}
              {isOwner && (
                <button
                  onClick={() => { logoutMutation.mutate(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-base font-medium uppercase tracking-wider text-destructive hover:bg-white/5 rounded-md"
                >
                  {t.logout}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Cpu className="w-6 h-6 text-primary" />
                <span className="font-display text-xl font-bold tracking-widest text-white">BYTECH</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-sm">{t.footerDesc}</p>
            </div>

            <div>
              <h4 className="font-display font-semibold text-white mb-4">{t.shop.toUpperCase()}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products" className="hover:text-primary transition-colors">{t.allProducts}</Link></li>
                <li><Link href="/products?onSale=true" className="hover:text-primary transition-colors">{t.specialOffers}</Link></li>
                <li><Link href="/cart" className="hover:text-primary transition-colors">{t.yourCartLink}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-white mb-4">{t.system.toUpperCase()}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/owner-login" className="hover:text-accent transition-colors flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> {t.ownerAccess}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              {t.copyright.replace("{year}", String(new Date().getFullYear()))}
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="cursor-not-allowed hover:text-white">{t.privacyPolicy}</span>
              <span className="cursor-not-allowed hover:text-white">{t.termsOfService}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
