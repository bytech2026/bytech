import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Language = "en" | "ar";

export const translations = {
  en: {
    // Nav
    home: "Home",
    products: "Products",
    dashboard: "Dashboard",
    logout: "Logout",
    ownerAccess: "Owner Access",
    cart: "Cart",

    // Hero
    tagline: "Next Gen Hardware",
    heroTitle1: "UPGRADE YOUR",
    heroTitle2: "REALITY",
    heroSubtitle: "High-performance electronics, peripherals, and accessories for those who demand the absolute best.",
    shopNow: "Shop Now",
    viewDeals: "View Deals",
    featuredProducts: "Featured Products",
    newArrivals: "New Arrivals",
    viewAll: "View All Products",

    // Sale Banner
    saleBanner: "🔥 Limited Time Offer",
    saleOff: "OFF Storewide",

    // Features
    freeShipping: "Free Shipping",
    freeShippingDesc: "On all orders over ₪200",
    securePayment: "Secure Payment",
    securePaymentDesc: "100% protected transactions",
    techSupport: "Tech Support",
    techSupportDesc: "Expert help 24/7",

    // Products page
    hardwareCatalog: "Product Catalog",
    catalogSubtitle: "Browse our entire collection of premium electronics.",
    search: "Search",
    searchPlaceholder: "Search products...",
    categories: "Categories",
    allCategories: "All Categories",
    filters: "Filters",
    onSaleOnly: "Show items on sale",
    noProducts: "No products found.",

    // Product card / detail
    outOfStock: "Out of stock",
    lowStock: "Only {n} left in stock!",
    addToCart: "Add to Cart",
    addedToCart: "Added to Cart",
    outOfStockMsg: "This item is currently unavailable.",
    backToProducts: "Back to Products",
    productNotFound: "Product Not Found",
    inStock: "In Stock",
    quantity: "Quantity",
    description: "Description",
    category: "Category",
    warranty: "1 Year Warranty",
    warrantyDesc: "Official manufacturer warranty",
    fastDelivery: "Fast Delivery",
    fastDeliveryDesc: "Ships within 1-3 business days",
    featured: "Featured",
    sale: "Sale",

    // Cart
    yourCart: "Your Cart",
    emptyCart: "Your cart is empty",
    emptyCartDesc: "Browse our products and add items to get started.",
    startShopping: "Start Shopping",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    total: "Total",
    placeOrder: "Place Order",
    processing: "Processing...",
    checkoutDetails: "Checkout Details",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone (Optional)",
    namePlaceholder: "Your full name",
    emailPlaceholder: "your@email.com",
    phonePlaceholder: "+972 50 000 0000",
    orderPlaced: "Order Placed!",
    orderPlacedDesc: "We've received your order and will process it shortly.",
    checkoutFailed: "Checkout Failed",
    remove: "Remove",
    items: "items",

    // Owner login
    systemAccess: "Owner Login",
    restrictedArea: "Restricted area. Authorized personnel only.",
    enterPassword: "Enter Password",
    login: "Login",
    loginFailed: "Login Failed",
    invalidPassword: "Invalid password. Please try again.",
    ipLogged: "IP logged. Unauthorized access attempts are monitored.",

    // Owner dashboard
    revenue: "Revenue",
    orders: "Orders",
    productsLabel: "Products",
    pending: "Pending",
    inventory: "Inventory",
    categoriesTab: "Categories",
    ordersTab: "Orders",
    promotions: "Promotions",
    productDatabase: "Product Database",
    addProduct: "Add Product",
    id: "ID",
    product: "Product",
    price: "Price",
    stock: "Stock",
    categoryCol: "Category",
    actions: "Actions",
    units: "units",
    noProducts2: "No products found.",
    taxonomySystems: "Manage Categories",
    addCategory: "Add Category",
    productsAttached: "products",
    orderProcessing: "Order Processing",
    orderID: "Order ID",
    date: "Date",
    customer: "Customer",
    totalCol: "Total",
    status: "Status",
    update: "Update",
    noOrders: "No orders in database.",
    activePromotions: "Active Promotions",
    createSale: "Create Sale",
    active: "Active",
    terminatePromo: "Delete Promotion",
    noSales: "No active promotions.",

    // Product form
    editProduct: "Edit Product",
    newProduct: "New Product",
    name: "Product Name",
    descriptionLabel: "Description",
    priceLabel: "Price (₪)",
    salePriceLabel: "Sale Price (₪, optional)",
    stockLabel: "Stock Quantity",
    categoryLabel: "Category",
    noneCategory: "None",
    featuredLabel: "Mark as Featured",
    imageLabel: "Product Image",
    uploadImage: "Upload Image",
    orPasteUrl: "or paste URL",
    saveProduct: "Save Product",
    updateProduct: "Update Product",

    // Category form
    newCategory: "New Category",
    categoryName: "Category Name",
    categoryDesc: "Description (optional)",
    saveCategory: "Save Category",

    // Sale form
    newSale: "New Promotion",
    saleTitle: "Sale Title",
    discount: "Discount %",
    startDate: "Start Date",
    endDate: "End Date",
    saveSale: "Save Promotion",

    // Footer
    footerDesc: "Next-generation electronics and premium hardware for enthusiasts, professionals, and creators.",
    shop: "Shop",
    allProducts: "All Products",
    specialOffers: "Special Offers",
    yourCartLink: "Your Cart",
    system: "System",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    copyright: "© {year} Bytech. All rights reserved.",

    // Status labels
    statusPending: "Pending",
    statusProcessing: "Processing",
    statusShipped: "Shipped",
    statusDelivered: "Delivered",
    statusCancelled: "Cancelled",

    // Color & Storage
    selectColor: "Color",
    selectStorage: "Storage",
    pleaseSelectColor: "Please select a color",
    pleaseSelectStorage: "Please select a storage option",
    selectedColor: "Color",
    selectedStorage: "Storage",
    colorsLabel: "Available Colors",
    storageLabel: "Storage Options",
    addColorPlaceholder: "e.g. Black",
    addStoragePlaceholder: "e.g. 128GB",
    addOption: "Add",

    // misc
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this?",
    loadingSystems: "Loading...",
    off: "OFF",
  },
  ar: {
    // Nav
    home: "الرئيسية",
    products: "المنتجات",
    dashboard: "لوحة التحكم",
    logout: "تسجيل خروج",
    ownerAccess: "دخول المالك",
    cart: "السلة",

    // Hero
    tagline: "أحدث الأجهزة الإلكترونية",
    heroTitle1: "طوّر",
    heroTitle2: "واقعك",
    heroSubtitle: "إلكترونيات عالية الأداء وملحقات احترافية لمن يبحث عن الأفضل دائماً.",
    shopNow: "تسوق الآن",
    viewDeals: "عروض خاصة",
    featuredProducts: "منتجات مميزة",
    newArrivals: "وصل حديثاً",
    viewAll: "عرض جميع المنتجات",

    // Sale Banner
    saleBanner: "🔥 عرض لفترة محدودة",
    saleOff: "خصم على جميع المنتجات",

    // Features
    freeShipping: "شحن مجاني",
    freeShippingDesc: "على الطلبات فوق ₪200",
    securePayment: "دفع آمن",
    securePaymentDesc: "معاملات محمية 100%",
    techSupport: "دعم فني",
    techSupportDesc: "مساعدة متخصصة على مدار الساعة",

    // Products page
    hardwareCatalog: "كتالوج المنتجات",
    catalogSubtitle: "تصفح مجموعتنا الكاملة من الإلكترونيات المتميزة.",
    search: "بحث",
    searchPlaceholder: "ابحث عن منتج...",
    categories: "الفئات",
    allCategories: "جميع الفئات",
    filters: "الفلاتر",
    onSaleOnly: "عرض المنتجات المخفضة فقط",
    noProducts: "لا توجد منتجات.",

    // Product card / detail
    outOfStock: "نفد المخزون",
    lowStock: "باقي {n} قطع فقط!",
    addToCart: "أضف للسلة",
    addedToCart: "تمت الإضافة للسلة",
    outOfStockMsg: "هذا المنتج غير متوفر حالياً.",
    backToProducts: "العودة للمنتجات",
    productNotFound: "المنتج غير موجود",
    inStock: "متوفر",
    quantity: "الكمية",
    description: "الوصف",
    category: "الفئة",
    warranty: "ضمان سنة",
    warrantyDesc: "ضمان رسمي من الشركة المصنعة",
    fastDelivery: "توصيل سريع",
    fastDeliveryDesc: "يصل خلال 1-3 أيام عمل",
    featured: "مميز",
    sale: "تخفيض",

    // Cart
    yourCart: "سلة التسوق",
    emptyCart: "سلتك فارغة",
    emptyCartDesc: "تصفح منتجاتنا وأضف ما يعجبك.",
    startShopping: "ابدأ التسوق",
    orderSummary: "ملخص الطلب",
    subtotal: "المجموع الجزئي",
    total: "الإجمالي",
    placeOrder: "تأكيد الطلب",
    processing: "جاري المعالجة...",
    checkoutDetails: "تفاصيل الطلب",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف (اختياري)",
    namePlaceholder: "اسمك الكامل",
    emailPlaceholder: "بريدك@الإلكتروني.com",
    phonePlaceholder: "+972 50 000 0000",
    orderPlaced: "تم تأكيد الطلب!",
    orderPlacedDesc: "استلمنا طلبك وسنتواصل معك قريباً.",
    checkoutFailed: "فشل الدفع",
    remove: "حذف",
    items: "منتجات",

    // Owner login
    systemAccess: "دخول المالك",
    restrictedArea: "منطقة مقيدة. للمخولين فقط.",
    enterPassword: "أدخل كلمة المرور",
    login: "دخول",
    loginFailed: "فشل تسجيل الدخول",
    invalidPassword: "كلمة المرور غير صحيحة. حاول مجدداً.",
    ipLogged: "يتم تسجيل عنوان IP. محاولات الوصول غير المصرح بها مراقبة.",

    // Owner dashboard
    revenue: "الإيرادات",
    orders: "الطلبات",
    productsLabel: "المنتجات",
    pending: "قيد الانتظار",
    inventory: "المخزون",
    categoriesTab: "الفئات",
    ordersTab: "الطلبات",
    promotions: "العروض",
    productDatabase: "قاعدة المنتجات",
    addProduct: "إضافة منتج",
    id: "الرقم",
    product: "المنتج",
    price: "السعر",
    stock: "المخزون",
    categoryCol: "الفئة",
    actions: "الإجراءات",
    units: "وحدات",
    noProducts2: "لا توجد منتجات.",
    taxonomySystems: "إدارة الفئات",
    addCategory: "إضافة فئة",
    productsAttached: "منتجات",
    orderProcessing: "معالجة الطلبات",
    orderID: "رقم الطلب",
    date: "التاريخ",
    customer: "العميل",
    totalCol: "الإجمالي",
    status: "الحالة",
    update: "تحديث",
    noOrders: "لا توجد طلبات.",
    activePromotions: "العروض النشطة",
    createSale: "إنشاء عرض",
    active: "نشط",
    terminatePromo: "حذف العرض",
    noSales: "لا توجد عروض نشطة.",

    // Product form
    editProduct: "تعديل المنتج",
    newProduct: "منتج جديد",
    name: "اسم المنتج",
    descriptionLabel: "الوصف",
    priceLabel: "السعر (₪)",
    salePriceLabel: "سعر التخفيض (₪، اختياري)",
    stockLabel: "كمية المخزون",
    categoryLabel: "الفئة",
    noneCategory: "بدون فئة",
    featuredLabel: "تمييز المنتج على الصفحة الرئيسية",
    imageLabel: "صورة المنتج",
    uploadImage: "رفع صورة",
    orPasteUrl: "أو الصق رابط الصورة",
    saveProduct: "حفظ المنتج",
    updateProduct: "تحديث المنتج",

    // Category form
    newCategory: "فئة جديدة",
    categoryName: "اسم الفئة",
    categoryDesc: "وصف (اختياري)",
    saveCategory: "حفظ الفئة",

    // Sale form
    newSale: "عرض جديد",
    saleTitle: "عنوان العرض",
    discount: "نسبة الخصم %",
    startDate: "تاريخ البداية",
    endDate: "تاريخ النهاية",
    saveSale: "حفظ العرض",

    // Footer
    footerDesc: "إلكترونيات وأجهزة متطورة للمحترفين والمبدعين والمتحمسين.",
    shop: "تسوق",
    allProducts: "جميع المنتجات",
    specialOffers: "العروض الخاصة",
    yourCartLink: "سلتك",
    system: "النظام",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    copyright: "© {year} بايتك. جميع الحقوق محفوظة.",

    // Status labels
    statusPending: "قيد الانتظار",
    statusProcessing: "جاري المعالجة",
    statusShipped: "تم الشحن",
    statusDelivered: "تم التسليم",
    statusCancelled: "ملغي",

    // Color & Storage
    selectColor: "اللون",
    selectStorage: "التخزين",
    pleaseSelectColor: "يرجى اختيار لون",
    pleaseSelectStorage: "يرجى اختيار سعة تخزين",
    selectedColor: "اللون",
    selectedStorage: "التخزين",
    colorsLabel: "الألوان المتاحة",
    storageLabel: "خيارات التخزين",
    addColorPlaceholder: "مثال: أسود",
    addStoragePlaceholder: "مثال: 128GB",
    addOption: "إضافة",

    // misc
    delete: "حذف",
    confirmDelete: "هل أنت متأكد من الحذف؟",
    loadingSystems: "جاري التحميل...",
    off: "خصم",
  }
};

type Translations = typeof translations.en;

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem("bytech-lang") as Language) || "en";
  });

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem("bytech-lang", l);
  };

  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
