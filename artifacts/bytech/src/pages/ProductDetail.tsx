import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import { useCart } from "@/store/use-cart";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";
import { ShoppingCart, Minus, Plus, ShieldCheck, Truck, ArrowLeft, Check } from "lucide-react";

const COLOR_MAP: Record<string, string> = {
  black: "#111111",
  white: "#f5f5f5",
  silver: "#c0c0c0",
  gold: "#d4af37",
  "space gray": "#6b6b6b",
  "space grey": "#6b6b6b",
  gray: "#8e8e8e",
  grey: "#8e8e8e",
  blue: "#2563eb",
  "midnight blue": "#191970",
  "sierra blue": "#7ba7c0",
  "alpine green": "#4a7c59",
  green: "#22c55e",
  red: "#ef4444",
  pink: "#f472b6",
  purple: "#a855f7",
  yellow: "#eab308",
  orange: "#f97316",
  "rose gold": "#b76e79",
  titanium: "#878681",
  "natural titanium": "#878681",
  "black titanium": "#3a3a3a",
  "white titanium": "#e8e8e8",
  coral: "#ff7b7b",
  lavender: "#b57bee",
  midnight: "#1f2041",
  starlight: "#f5e6cf",
};

function getColorSwatch(name: string): string {
  const key = name.toLowerCase().trim();
  return COLOR_MAP[key] || "#6b7280";
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

export function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const productId = parseInt(params?.id || "0");
  const { data: product, isLoading, isError } = useGetProduct(productId);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { t } = useLang();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>();

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (isError || !product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t.productNotFound}</h2>
          <Link href="/products" className="text-primary hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> {t.backToProducts}
          </Link>
        </div>
      </Layout>
    );
  }

  const hasDiscount = product.salePrice !== null && product.salePrice !== undefined && product.salePrice < product.price;
  const colors: string[] = (product as any).colors || [];
  const storageOptions: string[] = (product as any).storageOptions || [];
  const hasColors = colors.length > 0;
  const hasStorage = storageOptions.length > 0;

  const canAddToCart =
    product.stock > 0 &&
    (!hasColors || selectedColor !== undefined) &&
    (!hasStorage || selectedStorage !== undefined);

  const handleAddToCart = () => {
    if (!canAddToCart) {
      if (hasColors && !selectedColor) toast({ title: t.pleaseSelectColor, variant: "destructive" });
      else if (hasStorage && !selectedStorage) toast({ title: t.pleaseSelectStorage, variant: "destructive" });
      return;
    }
    addItem(product as any, quantity, selectedColor, selectedStorage);
    const details = [selectedColor, selectedStorage].filter(Boolean).join(", ");
    toast({ title: t.addedToCart, description: `${quantity}x ${product.name}${details ? ` — ${details}` : ""}`, className: "bg-card border-primary text-white" });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t.backToProducts}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Image */}
          <div className="tech-panel rounded-2xl p-8 aspect-square flex items-center justify-center relative">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_30px_rgba(0,240,255,0.1)]" />
            ) : (
              <img src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80" alt="Hardware" className="w-full h-full object-cover rounded-xl opacity-60 grayscale" />
            )}
            {hasDiscount && (
              <div className="absolute top-6 start-6 bg-accent text-background font-bold px-4 py-2 rounded-md text-sm tracking-wider uppercase">
                {t.sale}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-sm font-display tracking-widest uppercase text-primary mb-2">
                {product.categoryName || "Uncategorized"}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 pb-6 border-b border-border">
              {hasDiscount ? (
                <>
                  <span className="text-4xl font-bold text-primary">₪{product.salePrice?.toFixed(2)}</span>
                  <span className="text-xl text-muted-foreground line-through mb-1">₪{product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-4xl font-bold text-white">₪{product.price.toFixed(2)}</span>
              )}
            </div>

            {/* Color Selector */}
            {hasColors && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t.selectColor}:</span>
                  {selectedColor && (
                    <span className="text-sm text-white font-medium">{selectedColor}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => {
                    const swatch = getColorSwatch(color);
                    const isLight = isLightColor(swatch);
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${isSelected ? "border-primary scale-110 shadow-[0_0_10px_rgba(0,240,255,0.5)]" : "border-border hover:border-white/50"}`}
                        style={{ backgroundColor: swatch }}
                      >
                        {isSelected && (
                          <Check className={`absolute inset-0 m-auto w-4 h-4 ${isLight ? "text-black" : "text-white"}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Storage Selector */}
            {hasStorage && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t.selectStorage}:</span>
                  {selectedStorage && (
                    <span className="text-sm text-white font-medium">{selectedStorage}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {storageOptions.map((option) => {
                    const isSelected = selectedStorage === option;
                    return (
                      <button
                        key={option}
                        onClick={() => setSelectedStorage(option)}
                        className={`px-5 py-2.5 rounded-lg border-2 text-sm font-bold tracking-wide transition-all ${
                          isSelected
                            ? "border-primary bg-primary/15 text-primary shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                            : "border-border bg-background text-muted-foreground hover:border-white/50 hover:text-white"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>

            {/* Add to Cart */}
            <div className="bg-card border border-border p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center font-medium text-sm">
                  {t.status}:
                  {product.stock > 0 ? (
                    <span className="ms-2 text-green-400 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      {t.inStock} ({product.stock})
                    </span>
                  ) : (
                    <span className="ms-2 text-destructive">{t.outOfStock}</span>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center bg-background border border-border rounded-md overflow-hidden h-14">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.stock <= 0} className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/5 disabled:opacity-50">
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-12 h-full flex items-center justify-center font-bold text-lg border-x border-border">{quantity}</div>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={product.stock <= 0} className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/5 disabled:opacity-50">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-grow h-14 font-display font-bold text-lg uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-3 ${
                    canAddToCart
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                      : "bg-primary/50 text-primary-foreground/70 cursor-pointer"
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock > 0 ? t.addToCart : t.outOfStock}
                </button>
              </div>

              {/* Selection hints */}
              {product.stock > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {hasColors && !selectedColor && (
                    <span className="text-accent">← {t.pleaseSelectColor}</span>
                  )}
                  {hasStorage && !selectedStorage && (
                    <span className="text-accent">← {t.pleaseSelectStorage}</span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck className="w-5 h-5 text-primary flex-shrink-0" /> {t.fastDelivery}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" /> {t.warranty}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
