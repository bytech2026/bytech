الملف هذا جاهز ترفعه على GitHub.

شو تعمل:
1) افتح GitHub
2) اعمل Repository جديد
3) ارفع كل محتويات هذا المجلد كما هي
4) بعد الرفع:
   - افتح Neon واعمل قاعدة بيانات جديدة
   - افتح database.sql وانسخه داخل SQL Editor في Neon ثم Run
   - افتح Render واربط GitHub مع هذا الريبو
   - على Render ضيف 3 متغيرات:
     DATABASE_URL = رابط قاعدة البيانات من Neon
     SESSION_SECRET = أي كلمة سر طويلة من عندك
     OWNER_PASSWORD = كلمة السر للوحة التحكم
   - بعد ما Render يطلع لك رابط مثل https://something.onrender.com
     افتح netlify.toml وغير السطر:
     to = "https://PUT-YOUR-RENDER-URL-HERE.onrender.com/api/:splat"
     وحط مكانه رابط Render الحقيقي
   - بعدين افتح Netlify واربط نفس الريبو من GitHub

مهم:
- لا تحذف أي ملف من هذا المجلد.
- إذا GitHub طلب Upload files ارفع كل شيء الموجود هنا.
- إذا طلع خطأ في Render أو Netlify صوّر الشاشة وابعثها.
