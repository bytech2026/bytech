import { useState } from "react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useLang } from "@/lib/i18n";
import { Search, SlidersHorizontal, X } from "lucide-react";

export function Products() {
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const urlCategoryId = searchParams.get("categoryId");
  const urlOnSale = searchParams.get("onSale") === "true";

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(urlCategoryId ? parseInt(urlCategoryId) : undefined);
  const [onSale, setOnSale] = useState<boolean>(urlOnSale);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { t } = useLang();

  const { data: categories } = useListCategories();
  const { data: products, isLoading } = useListProducts({ categoryId, search: search || undefined, onSale: onSale || undefined });

  return (
    <Layout>
      <div className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">{t.hardwareCatalog}</h1>
          <p className="text-muted-foreground">{t.catalogSubtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

        <div className="md:hidden flex justify-between items-center mb-4">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" /> {t.filters}
          </button>
        </div>

        <aside className={`w-full md:w-64 flex-shrink-0 ${isFiltersOpen ? 'block' : 'hidden md:block'}`}>
          <div className="sticky top-28 space-y-8">

            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-widest text-muted-foreground mb-3">{t.search}</h3>
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-background border border-border rounded-md py-2 ps-9 pe-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white placeholder:text-muted-foreground"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-widest text-muted-foreground mb-3">{t.categories}</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setCategoryId(undefined)}
                  className={`w-full text-start text-sm py-1 transition-colors ${categoryId === undefined ? 'text-primary font-medium' : 'text-muted-foreground hover:text-white'}`}
                >
                  {t.allCategories}
                </button>
                {categories?.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`w-full text-start text-sm py-1 flex justify-between items-center transition-colors ${categoryId === cat.id ? 'text-primary font-medium' : 'text-muted-foreground hover:text-white'}`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{cat.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-widest text-muted-foreground mb-3">{t.filters}</h3>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${onSale ? 'bg-primary border-primary' : 'border-border bg-background group-hover:border-primary/50'}`}>
                  {onSale && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-primary-foreground"><path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" /></svg>}
                </div>
                <span className={`text-sm ${onSale ? 'text-white' : 'text-muted-foreground group-hover:text-white'}`}>{t.onSaleOnly}</span>
                <input type="checkbox" className="hidden" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} />
              </label>
            </div>

          </div>
        </aside>

        <div className="flex-grow">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 rounded-xl bg-card animate-pulse-slow"></div>)}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="text-center py-32 bg-card rounded-xl border border-border border-dashed">
              <h3 className="text-xl font-display font-bold text-white mb-2">{t.noProducts}</h3>
              <button
                onClick={() => { setSearch(""); setCategoryId(undefined); setOnSale(false); }}
                className="mt-6 px-6 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors text-sm font-medium uppercase tracking-wider"
              >
                Reset
              </button>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
