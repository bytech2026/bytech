import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import {
  useGetMe,
  useGetStats,
  useListProducts,
  useListCategories,
  useListOrders,
  useListSales,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCreateCategory,
  useDeleteCategory,
  useUpdateOrderStatus,
  useCreateSale,
  useDeleteSale,
  UpdateOrderStatusInputStatus
} from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";
import { Box, Tags, ShoppingCart, Percent, Plus, Edit, Trash2, X, Activity, Upload, Link as LinkIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="tech-panel w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-border bg-muted/20">
          <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function OwnerDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLang();

  const [activeTab, setActiveTab] = useState<"products" | "categories" | "orders" | "sales">("products");
  const { data: session, isLoading: sessionLoading } = useGetMe({ query: { retry: false } });

  if (!sessionLoading && !session?.isOwner) {
    setLocation("/owner-login");
    return null;
  }

  const { data: stats } = useGetStats({ query: { enabled: !!session?.isOwner } });
  const { data: products } = useListProducts(undefined, { query: { enabled: !!session?.isOwner && activeTab === "products" } });
  const { data: categories } = useListCategories({ query: { enabled: !!session?.isOwner } });
  const { data: orders } = useListOrders({ query: { enabled: !!session?.isOwner && activeTab === "orders" } });
  const { data: sales } = useListSales({ query: { enabled: !!session?.isOwner && activeTab === "sales" } });

  const inv = () => queryClient.invalidateQueries({ queryKey: ["/api/products"] });
  const createProduct = useCreateProduct({ onSuccess: () => { inv(); toast({ title: t.addProduct }) } });
  const updateProduct = useUpdateProduct({ onSuccess: () => { inv(); toast({ title: t.updateProduct }) } });
  const deleteProduct = useDeleteProduct({ onSuccess: () => { inv(); toast({ title: t.delete }) } });
  const createCategory = useCreateCategory({ onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/categories"] }); toast({ title: t.addCategory }) } });
  const deleteCategory = useDeleteCategory({ onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/categories"] }); toast({ title: t.delete }) } });
  const updateOrderStatus = useUpdateOrderStatus({ onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/orders"] }) } });
  const createSale = useCreateSale({ onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/sales"] }); toast({ title: t.createSale }) } });
  const deleteSale = useDeleteSale({ onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/sales"] }); toast({ title: t.delete }) } });

  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isSaleModalOpen, setSaleModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const emptyProd = {
  name: "",
  description: "",
  price: 0,
  salePrice: "",
  stock: 0,
  categoryId: 0,
  imageUrl: "",
  featured: false,
  colors: [] as string[],
  storageOptions: [] as string[],
  variantStock: [] as { color: string; storage: string; quantity: number }[],
};  const [prodForm, setProdForm] = useState(emptyProd);
  const [catForm, setCatForm] = useState({ name: "", description: "" });
  const [saleForm, setSaleForm] = useState({ title: "", description: "", discountPercent: 10, startDate: new Date().toISOString().split("T")[0], endDate: new Date().toISOString().split("T")[0] });

  const [colorInput, setColorInput] = useState("");
  const [storageInput, setStorageInput] = useState("");

  const handleEditProduct = (id: number) => {
    const p = products?.find(x => x.id === id);
    if (p) {
      setProdForm({
        name: p.name, description: p.description, price: p.price,
        salePrice: p.salePrice ? String(p.salePrice) : "",
        stock: p.stock, categoryId: p.categoryId || 0, imageUrl: p.imageUrl || "",
        featured: p.featured,
        colors: (p as any).colors || [],
        storageOptions: (p as any).storageOptions || [],
      });
      setColorInput("");
      setStorageInput("");
      setEditingProductId(id);
      setProductModalOpen(true);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setProdForm(prev => ({ ...prev, imageUrl: url }));
      toast({ title: t.uploadImage, description: "✓" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const submitProduct = () => {
    const payload = {
      name: prodForm.name,
      description: prodForm.description,
      price: Number(prodForm.price),
      salePrice: prodForm.salePrice ? Number(prodForm.salePrice) : null,
      stock: prodForm.stock,
      categoryId: prodForm.categoryId > 0 ? prodForm.categoryId : null,
      imageUrl: prodForm.imageUrl || null,
      featured: prodForm.featured,
      colors: prodForm.colors,
      storageOptions: prodForm.storageOptions,
    };
    if (editingProductId) {
      updateProduct.mutate({ id: editingProductId, data: payload });
    } else {
      createProduct.mutate({ data: payload });
    }
    setProductModalOpen(false);
  };

  if (sessionLoading) return <Layout><div className="p-20 text-center">{t.loadingSystems}</div></Layout>;

  const statusMap: Record<string, string> = {
    pending: t.statusPending,
    processing: t.statusProcessing,
    shipped: t.statusShipped,
    delivered: t.statusDelivered,
    cancelled: t.statusCancelled,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: t.revenue, value: `₪${stats?.totalRevenue?.toFixed(2) || "0.00"}`, icon: "₪", color: "bg-primary/20 text-primary" },
            { label: t.orders, value: stats?.totalOrders || 0, icon: <ShoppingCart className="w-6 h-6" />, color: "bg-accent/20 text-accent" },
            { label: t.productsLabel, value: stats?.totalProducts || 0, icon: <Box className="w-6 h-6" />, color: "bg-purple-500/20 text-purple-400" },
            { label: t.pending, value: stats?.pendingOrders || 0, icon: <Activity className="w-6 h-6" />, color: "bg-destructive/20 text-destructive" },
          ].map((stat, i) => (
            <div key={i} className="tech-panel p-6 rounded-xl flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center font-bold text-xl`}>
                {typeof stat.icon === "string" ? stat.icon : stat.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-border mb-8 scrollbar-hide">
          {([
            { key: "products", label: t.inventory, icon: <Box className="w-4 h-4" /> },
            { key: "categories", label: t.categoriesTab, icon: <Tags className="w-4 h-4" /> },
            { key: "orders", label: t.ordersTab, icon: <ShoppingCart className="w-4 h-4" />, badge: stats?.pendingOrders },
            { key: "sales", label: t.promotions, icon: <Percent className="w-4 h-4" /> },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 font-display font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}
            >
              {tab.icon} {tab.label}
              {tab.badge ? <span className="bg-destructive text-white text-[10px] px-1.5 py-0.5 rounded-full">{tab.badge}</span> : null}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-card border border-border rounded-xl min-h-[500px]">

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <div>
              <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
                <h2 className="font-bold text-white">{t.productDatabase}</h2>
                <button
                  onClick={() => { setEditingProductId(null); setProdForm(emptyProd); setColorInput(""); setStorageInput(""); setProductModalOpen(true); }}
                  className="bg-primary text-primary-foreground px-4 py-2 text-sm font-bold uppercase rounded flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" /> {t.addProduct}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border">
                    <tr>
                      <th className="px-6 py-4">{t.id}</th>
                      <th className="px-6 py-4">{t.product}</th>
                      <th className="px-6 py-4">{t.price}</th>
                      <th className="px-6 py-4">{t.stock}</th>
                      <th className="px-6 py-4">{t.categoryCol}</th>
                      <th className="px-6 py-4 text-right">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map(p => (
                      <tr key={p.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 font-mono text-muted-foreground">#{p.id}</td>
                        <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                          {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-8 h-8 object-cover rounded" />}
                          {p.name}
                          {p.featured && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase">{t.featured}</span>}
                        </td>
                        <td className="px-6 py-4">₪{p.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`${p.stock === 0 ? "text-destructive" : p.stock < 10 ? "text-accent" : "text-green-400"}`}>{p.stock} {t.units}</span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{p.categoryName || "-"}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => handleEditProduct(p.id)} className="text-primary hover:text-white p-1"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => { if (confirm(t.confirmDelete)) deleteProduct.mutate({ id: p.id }) }} className="text-destructive hover:text-white p-1"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                    {!products?.length && <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">{t.noProducts2}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORIES */}
          {activeTab === "categories" && (
            <div>
              <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
                <h2 className="font-bold text-white">{t.taxonomySystems}</h2>
                <button onClick={() => { setCatForm({ name: "", description: "" }); setCategoryModalOpen(true); }} className="bg-primary text-primary-foreground px-4 py-2 text-sm font-bold uppercase rounded flex items-center gap-2 hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" /> {t.addCategory}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
                {categories?.map(c => (
                  <div key={c.id} className="border border-border rounded-lg p-4 bg-muted/10 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white">{c.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{c.productCount} {t.productsAttached}</p>
                    </div>
                    <button onClick={() => { if (confirm(t.confirmDelete)) deleteCategory.mutate({ id: c.id }) }} className="text-muted-foreground hover:text-destructive p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div>
              <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
                <h2 className="font-bold text-white">{t.orderProcessing}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border">
                    <tr>
                      <th className="px-6 py-4">{t.orderID}</th>
                      <th className="px-6 py-4">{t.date}</th>
                      <th className="px-6 py-4">{t.customer}</th>
                      <th className="px-6 py-4">{t.totalCol}</th>
                      <th className="px-6 py-4">{t.status}</th>
                      <th className="px-6 py-4">{t.update}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map(o => (
                      <tr key={o.id} className="border-b border-border hover:bg-muted/10">
                        <td className="px-6 py-4 font-mono text-muted-foreground">ORD-{o.id.toString().padStart(4, "0")}</td>
                        <td className="px-6 py-4">{format(new Date(o.createdAt), "MMM d, yyyy")}</td>
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{o.customerName}</div>
                          <div className="text-xs text-muted-foreground">{o.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-primary">₪{o.totalAmount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${o.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : o.status === "processing" ? "bg-blue-500/20 text-blue-500" : o.status === "shipped" ? "bg-purple-500/20 text-purple-400" : o.status === "delivered" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-500"}`}>
                            {statusMap[o.status] || o.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            className="bg-background border border-border text-xs rounded p-1"
                            value={o.status}
                            onChange={(e) => updateOrderStatus.mutate({ id: o.id, data: { status: e.target.value as UpdateOrderStatusInputStatus } })}
                          >
                            <option value="pending">{t.statusPending}</option>
                            <option value="processing">{t.statusProcessing}</option>
                            <option value="shipped">{t.statusShipped}</option>
                            <option value="delivered">{t.statusDelivered}</option>
                            <option value="cancelled">{t.statusCancelled}</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {!orders?.length && <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">{t.noOrders}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SALES */}
          {activeTab === "sales" && (
            <div>
              <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
                <h2 className="font-bold text-white">{t.activePromotions}</h2>
                <button onClick={() => { setSaleForm({ title: "", description: "", discountPercent: 10, startDate: new Date().toISOString().split("T")[0], endDate: new Date().toISOString().split("T")[0] }); setSaleModalOpen(true); }} className="bg-primary text-primary-foreground px-4 py-2 text-sm font-bold uppercase rounded flex items-center gap-2 hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" /> {t.createSale}
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
                {sales?.map(s => (
                  <div key={s.id} className="border border-primary/30 rounded-lg p-5 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
                    {s.active && <div className="absolute top-0 end-0 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">{t.active}</div>}
                    <h3 className="font-display font-bold text-xl text-white flex items-center gap-2 mb-1"><Percent className="w-5 h-5 text-accent" /> {s.title}</h3>
                    <p className="text-2xl font-bold text-accent mb-4">{s.discountPercent}% {t.off}</p>
                    <div className="text-sm text-muted-foreground mb-4">
                      {format(new Date(s.startDate), "MMM d, yyyy")} - {format(new Date(s.endDate), "MMM d, yyyy")}
                    </div>
                    <button onClick={() => { if (confirm(t.confirmDelete)) deleteSale.mutate({ id: s.id }) }} className="text-xs text-destructive hover:underline">
                      {t.terminatePromo}
                    </button>
                  </div>
                ))}
                {!sales?.length && <div className="col-span-2 py-12 text-center text-muted-foreground">{t.noSales}</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      <Modal isOpen={isProductModalOpen} onClose={() => setProductModalOpen(false)} title={editingProductId ? t.editProduct : t.newProduct}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.name}</label>
            <input type="text" className="w-full bg-background border border-border rounded p-2 text-white" value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.descriptionLabel}</label>
            <textarea className="w-full bg-background border border-border rounded p-2 text-white h-24" value={prodForm.description} onChange={e => setProdForm({ ...prodForm, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.priceLabel}</label>
              <input type="number" step="0.01" className="w-full bg-background border border-border rounded p-2 text-white" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: parseFloat(e.target.value) })} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.salePriceLabel}</label>
              <input type="number" step="0.01" className="w-full bg-background border border-border rounded p-2 text-white" value={prodForm.salePrice} onChange={e => setProdForm({ ...prodForm, salePrice: e.target.value })} placeholder="0.00" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.stockLabel}</label>
              <input type="number" className="w-full bg-background border border-border rounded p-2 text-white" value={prodForm.stock} onChange={e => setProdForm({ ...prodForm, stock: parseInt(e.target.value) })} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.categoryLabel}</label>
              <select className="w-full bg-background border border-border rounded p-2 text-white" value={prodForm.categoryId} onChange={e => setProdForm({ ...prodForm, categoryId: parseInt(e.target.value) })}>
                <option value="0">{t.noneCategory}</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">{t.imageLabel}</label>

            {prodForm.imageUrl && (
              <div className="relative mb-2 w-24 h-24">
                <img src={prodForm.imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded border border-border" />
                <button onClick={() => setProdForm({ ...prodForm, imageUrl: "" })} className="absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-white text-xs">×</button>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/30 text-primary rounded text-sm hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? "..." : t.uploadImage}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
              />

              <div className="flex-grow relative">
                <LinkIcon className="absolute start-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded ps-7 py-2 text-white text-sm"
                  value={prodForm.imageUrl}
                  onChange={e => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                  placeholder={t.orPasteUrl}
                />
              </div>
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">{t.colorsLabel}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {prodForm.colors.map((c) => (
                <span key={c} className="flex items-center gap-1.5 text-xs bg-muted px-2.5 py-1 rounded-full text-white border border-border">
                  <span className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0" style={{ backgroundColor: (() => { const m: Record<string,string> = { black:"#111",white:"#f5f5f5",silver:"#c0c0c0",gold:"#d4af37","space gray":"#6b6b6b",gray:"#8e8e8e",grey:"#8e8e8e",blue:"#2563eb",green:"#22c55e",red:"#ef4444",pink:"#f472b6",purple:"#a855f7",yellow:"#eab308",orange:"#f97316","rose gold":"#b76e79",titanium:"#878681",midnight:"#1f2041",starlight:"#f5e6cf",coral:"#ff7b7b",lavender:"#b57bee" }; return m[c.toLowerCase()] || "#6b7280"; })() }}></span>
                  {c}
                  <button type="button" onClick={() => setProdForm({ ...prodForm, colors: prodForm.colors.filter(x => x !== c) })} className="text-muted-foreground hover:text-destructive ml-0.5 leading-none">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-grow bg-background border border-border rounded p-2 text-white text-sm"
                placeholder={t.addColorPlaceholder}
                value={colorInput}
                onChange={e => setColorInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); const v = colorInput.trim(); if (v && !prodForm.colors.includes(v)) { setProdForm({ ...prodForm, colors: [...prodForm.colors, v] }); setColorInput(""); } } }}
              />
              <button
                type="button"
                onClick={() => { const v = colorInput.trim(); if (v && !prodForm.colors.includes(v)) { setProdForm({ ...prodForm, colors: [...prodForm.colors, v] }); setColorInput(""); } }}
                className="px-3 py-2 bg-primary/20 text-primary border border-primary/30 rounded text-sm font-bold hover:bg-primary/30 transition-colors"
              >{t.addOption}</button>
            </div>
          </div>

          {/* Storage Options */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">{t.storageLabel}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {prodForm.storageOptions.map((s) => (
                <span key={s} className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                  {s}
                  <button type="button" onClick={() => setProdForm({ ...prodForm, storageOptions: prodForm.storageOptions.filter(x => x !== s) })} className="text-primary/60 hover:text-destructive ml-0.5 leading-none">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-grow bg-background border border-border rounded p-2 text-white text-sm"
                placeholder={t.addStoragePlaceholder}
                value={storageInput}
                onChange={e => setStorageInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); const v = storageInput.trim(); if (v && !prodForm.storageOptions.includes(v)) { setProdForm({ ...prodForm, storageOptions: [...prodForm.storageOptions, v] }); setStorageInput(""); } } }}
              />
              <button
                type="button"
                onClick={() => { const v = storageInput.trim(); if (v && !prodForm.storageOptions.includes(v)) { setProdForm({ ...prodForm, storageOptions: [...prodForm.storageOptions, v] }); setStorageInput(""); } }}
                className="px-3 py-2 bg-primary/20 text-primary border border-primary/30 rounded text-sm font-bold hover:bg-primary/30 transition-colors"
              >{t.addOption}</button>
            </div>
          </div>

          <div className="flex items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={prodForm.featured} onChange={e => setProdForm({ ...prodForm, featured: e.target.checked })} className="rounded bg-background border-border h-4 w-4" />
              <span className="text-sm text-white">{t.featuredLabel}</span>
            </label>
          </div>

          <button onClick={submitProduct} className="w-full bg-primary text-primary-foreground font-bold py-3 mt-4 rounded uppercase tracking-wider hover:bg-primary/90 transition-colors">
            {editingProductId ? t.updateProduct : t.saveProduct}
          </button>
        </div>
      </Modal>

      {/* Category Modal */}
      <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} title={t.newCategory}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.categoryName}</label>
            <input type="text" className="w-full bg-background border border-border rounded p-2 text-white" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.categoryDesc}</label>
            <input type="text" className="w-full bg-background border border-border rounded p-2 text-white" value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} />
          </div>
          <button onClick={() => { createCategory.mutate({ data: { name: catForm.name, description: catForm.description || null } }); setCategoryModalOpen(false); }} className="w-full bg-primary text-primary-foreground font-bold py-3 mt-4 rounded uppercase tracking-wider hover:bg-primary/90 transition-colors">
            {t.saveCategory}
          </button>
        </div>
      </Modal>

      {/* Sale Modal */}
      <Modal isOpen={isSaleModalOpen} onClose={() => setSaleModalOpen(false)} title={t.newSale}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.saleTitle}</label>
            <input type="text" className="w-full bg-background border border-border rounded p-2 text-white" value={saleForm.title} onChange={e => setSaleForm({ ...saleForm, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.discount}</label>
            <input type="number" min="1" max="100" className="w-full bg-background border border-border rounded p-2 text-white" value={saleForm.discountPercent} onChange={e => setSaleForm({ ...saleForm, discountPercent: parseInt(e.target.value) })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.startDate}</label>
              <input type="date" className="w-full bg-background border border-border rounded p-2 text-white" value={saleForm.startDate} onChange={e => setSaleForm({ ...saleForm, startDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.endDate}</label>
              <input type="date" className="w-full bg-background border border-border rounded p-2 text-white" value={saleForm.endDate} onChange={e => setSaleForm({ ...saleForm, endDate: e.target.value })} />
            </div>
          </div>
          <button
            onClick={() => {
              createSale.mutate({ data: { title: saleForm.title, discountPercent: saleForm.discountPercent, startDate: saleForm.startDate, endDate: saleForm.endDate, description: null, productId: null, categoryId: null } });
              setSaleModalOpen(false);
            }}
            className="w-full bg-primary text-primary-foreground font-bold py-3 mt-4 rounded uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            {t.saveSale}
          </button>
        </div>
      </Modal>
    </Layout>
  );
}
