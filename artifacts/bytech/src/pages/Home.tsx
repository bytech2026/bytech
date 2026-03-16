import { Link } from "wouter";
import { useListProducts, useListSales } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Layout } from "@/components/Layout";
import { useLang } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Cpu } from "lucide-react";

export function Home() {
  const { data: products, isLoading: isLoadingProducts } = useListProducts();
  const { data: sales } = useListSales();
  const { t } = useLang();

  const featuredProducts = products?.filter(p => p.featured).slice(0, 4) || [];
  const newArrivals = products?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4) || [];
  const activeSale = sales?.find(s => s.active);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Abstract Tech Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6 uppercase tracking-wider">
              <Zap className="w-4 h-4" /> {t.tagline}
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight mb-6 drop-shadow-lg">
              {t.heroTitle1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t.heroTitle2}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-primary text-primary-foreground font-display font-bold text-lg rounded-md shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all flex items-center gap-2 uppercase tracking-wider hover:-translate-y-1"
              >
                {t.shopNow} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products?onSale=true"
                className="px-8 py-4 bg-card border border-border text-white font-display font-bold text-lg rounded-md hover:border-primary/50 transition-all uppercase tracking-wider"
              >
                {t.viewDeals}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Active Sale Banner */}
      {activeSale && (
        <section className="border-y border-primary/30 bg-primary/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-accent mb-2">{activeSale.title}</h2>
              <p className="text-white/80">{activeSale.description || `${activeSale.discountPercent}% ${t.saleOff}`}</p>
            </div>
            <Link
              href={activeSale.categoryId ? `/products?categoryId=${activeSale.categoryId}` : "/products?onSale=true"}
              className="whitespace-nowrap px-6 py-3 border border-accent text-accent font-bold uppercase tracking-wider hover:bg-accent hover:text-background transition-colors rounded-md"
            >
              {t.viewDeals}
            </Link>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 tech-panel rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{t.fastDelivery}</h3>
                <p className="text-sm text-muted-foreground">{t.fastDeliveryDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 tech-panel rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{t.warranty}</h3>
                <p className="text-sm text-muted-foreground">{t.warrantyDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 tech-panel rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{t.techSupport}</h3>
                <p className="text-sm text-muted-foreground">{t.techSupportDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-white">{t.featuredProducts}</h2>
              <div className="h-1 w-20 bg-primary mt-2"></div>
            </div>
            <Link href="/products" className="text-primary hover:text-accent font-medium text-sm uppercase tracking-wider flex items-center gap-1 transition-colors">
              {t.viewAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-96 rounded-xl bg-card animate-pulse-slow"></div>)}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : null}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-card/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-white">{t.newArrivals}</h2>
              <div className="h-1 w-20 bg-accent mt-2"></div>
            </div>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-96 rounded-xl bg-card animate-pulse-slow"></div>)}
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : null}
        </div>
      </section>
    </Layout>
  );
}
