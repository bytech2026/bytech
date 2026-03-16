import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import { Product } from "@workspace/api-client-react";
import { useCart } from "@/store/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { t } = useLang();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) {
      toast({ title: t.outOfStock, description: t.outOfStockMsg, variant: "destructive" });
      return;
    }
    addItem(product, 1);
    toast({ title: t.addedToCart, description: `${product.name}`, className: "bg-card border-primary text-white" });
  };

  const hasDiscount = product.salePrice !== null && product.salePrice !== undefined && product.salePrice < product.price;

  return (
    <div className="tech-panel rounded-xl group flex flex-col h-full transition-transform hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="block relative aspect-square bg-muted/30 overflow-hidden p-4">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80"
            alt="Hardware"
            className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">{t.sale}</span>}
          {product.featured && <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">{t.featured}</span>}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.categoryName || "Uncategorized"}
        </div>
        <Link href={`/products/${product.id}`} className="font-display font-semibold text-lg leading-tight mb-2 hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </Link>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-muted-foreground line-through text-sm">₪{product.price.toFixed(2)}</span>
                <span className="text-primary font-bold text-xl">₪{product.salePrice?.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-white font-bold text-xl">₪{product.price.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t.addToCart}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <div className="text-xs text-accent mt-3">{t.lowStock.replace("{n}", String(product.stock))}</div>
        )}
        {product.stock <= 0 && (
          <div className="text-xs text-destructive mt-3">{t.outOfStock}</div>
        )}
      </div>
    </div>
  );
}
