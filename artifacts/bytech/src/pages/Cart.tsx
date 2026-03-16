import { Link, useLocation } from "wouter";
import { useCart, getCartKey } from "@/store/use-cart";
import { Layout } from "@/components/Layout";
import { useCreateOrder } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLang } from "@/lib/i18n";

const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
});
type CheckoutForm = z.infer<typeof checkoutSchema>;

export function Cart() {
  const [, setLocation] = useLocation();
  const { items, updateQuantity, removeItem, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const { t } = useLang();

  const createOrderMutation = useCreateOrder({
    mutation: {
      onSuccess: () => {
        clearCart();
        toast({ title: t.orderPlaced, description: t.orderPlacedDesc, className: "bg-primary text-primary-foreground border-none" });
        setLocation("/");
      },
      onError: (err) => {
        toast({ title: t.checkoutFailed, description: (err as any).error || "An error occurred.", variant: "destructive" });
      }
    }
  });

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({ resolver: zodResolver(checkoutSchema) });

  const onSubmit = (data: CheckoutForm) => {
    if (items.length === 0) return;
    createOrderMutation.mutate({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || null,
        items: items.map(item => ({ productId: item.product.id, quantity: item.quantity }))
      }
    });
  };

  const total = getCartTotal();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-32 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mb-6 border border-border">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">{t.emptyCart}</h2>
          <p className="text-muted-foreground mb-8">{t.emptyCartDesc}</p>
          <Link href="/products" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded hover:bg-primary/90 transition-colors uppercase tracking-wider">
            {t.startShopping}
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-display font-bold text-white mb-8">{t.yourCart.toUpperCase()}</h1>

        <div className="flex flex-col lg:flex-row gap-12">

          <div className="flex-grow space-y-4">
            <h2 className="text-xl font-bold border-b border-border pb-4 mb-6">
              {items.length} {t.items}
            </h2>

            {items.map((item) => {
              const price = item.product.salePrice ?? item.product.price;
              const key = getCartKey(item.product.id, item.selectedColor, item.selectedStorage);
              return (
                <div key={key} className="tech-panel p-4 rounded-xl flex gap-4 sm:gap-6 items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-background rounded-lg p-2 flex-shrink-0">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain mix-blend-screen" />
                    ) : (
                      <div className="w-full h-full bg-muted rounded"></div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <Link href={`/products/${item.product.id}`} className="font-bold text-white hover:text-primary transition-colors truncate block">
                      {item.product.name}
                    </Link>

                    {/* Color and Storage badges */}
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {item.selectedColor && (
                        <span className="inline-flex items-center gap-1.5 text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                          <span className="w-2.5 h-2.5 rounded-full border border-white/20 flex-shrink-0" style={{ backgroundColor: (() => { const m: Record<string,string> = { black:"#111",white:"#f5f5f5",silver:"#c0c0c0",gold:"#d4af37","space gray":"#6b6b6b","space grey":"#6b6b6b",gray:"#8e8e8e",grey:"#8e8e8e",blue:"#2563eb",green:"#22c55e",red:"#ef4444",pink:"#f472b6",purple:"#a855f7",yellow:"#eab308",orange:"#f97316","rose gold":"#b76e79",titanium:"#878681",midnight:"#1f2041",starlight:"#f5e6cf",coral:"#ff7b7b",lavender:"#b57bee" }; return m[item.selectedColor!.toLowerCase()] || "#6b7280"; })() }}></span>
                          {t.selectedColor}: {item.selectedColor}
                        </span>
                      )}
                      {item.selectedStorage && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
                          {t.selectedStorage}: {item.selectedStorage}
                        </span>
                      )}
                    </div>

                    <div className="text-primary font-medium mt-1.5">₪{price.toFixed(2)}</div>
                  </div>

                  <div className="flex items-center gap-3 flex-col sm:flex-row">
                    <div className="flex items-center bg-background border border-border rounded-md overflow-hidden h-9">
                      <button onClick={() => updateQuantity(key, item.quantity - 1)} className="w-8 h-full flex items-center justify-center hover:bg-white/5">
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="w-8 h-full flex items-center justify-center text-sm font-bold border-x border-border">
                        {item.quantity}
                      </div>
                      <button onClick={() => updateQuantity(key, item.quantity + 1)} disabled={item.quantity >= item.product.stock} className="w-8 h-full flex items-center justify-center hover:bg-white/5 disabled:opacity-50">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button onClick={() => removeItem(key)} className="text-muted-foreground hover:text-destructive transition-colors p-2" aria-label={t.remove}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="tech-panel p-6 rounded-xl sticky top-28">
              <h2 className="text-xl font-bold border-b border-border pb-4 mb-6">{t.orderSummary}</h2>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t.subtotal}</span>
                  <span>₪{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="border-t border-border pt-3 mt-3 flex justify-between font-bold text-lg text-white">
                  <span>{t.total}</span>
                  <span className="text-primary">₪{total.toFixed(2)}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">{t.checkoutDetails}</h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t.fullName}</label>
                  <input {...register("customerName")} className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder={t.namePlaceholder} />
                  {errors.customerName && <p className="text-destructive text-xs mt-1">{t.fullName} required</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t.email}</label>
                  <input {...register("customerEmail")} type="email" className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder={t.emailPlaceholder} />
                  {errors.customerEmail && <p className="text-destructive text-xs mt-1">{t.email} invalid</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t.phone}</label>
                  <input {...register("customerPhone")} className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder={t.phonePlaceholder} />
                </div>

                <button
                  type="submit"
                  disabled={createOrderMutation.isPending}
                  className="w-full mt-4 bg-primary text-primary-foreground font-display font-bold text-lg py-4 rounded-md uppercase tracking-wider hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createOrderMutation.isPending ? t.processing : t.placeOrder}
                  {!createOrderMutation.isPending && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
