# 📋 دليل نسخ الملفات اليدوي من Figma Make

## ✅ الخطوات البسيطة:

### **1️⃣ أنشئ المجلدات على جهازك:**

```
Desktop/
└── al-fouad-real-estate/
    ├── admin/
    ├── components/
    │   ├── figma/
    │   └── ui/
    ├── contexts/
    ├── docs/
    ├── guidelines/
    ├── imports/
    ├── styles/
    ├── supabase/
    │   ├── functions/
    │   │   └── server/
    │   └── migrations/
    └── utils/
        └── supabase/
```

---

### **2️⃣ قائمة الملفات المطلوبة (نسخ واحد تلو الآخر):**

## 🔴 **الملفات الجذرية (Root Files):**

انسخ هذه الملفات من Figma Make إلى المجلد الرئيسي:

```
✅ index.html
✅ main.tsx
✅ App.tsx
✅ package.json
✅ tsconfig.json
✅ tsconfig.node.json
✅ vite.config.ts
✅ .gitignore
✅ README.md
```

**طريقة النسخ:**
1. في Figma Make: انقر على الملف من القائمة الجانبية
2. حدد كل المحتوى (Ctrl+A)
3. انسخ (Ctrl+C)
4. الصق في محرر نصوص
5. احفظ بنفس الاسم

---

## 📁 **/admin/ (7 ملفات)**

```
✅ AdminDashboard.tsx
✅ AdminLogin.tsx
✅ BuildingsManager.tsx
✅ CitiesManager.tsx
✅ ContentManager.tsx
✅ InquiriesManager.tsx
✅ UnitsManager.tsx
```

---

## 📁 **/components/ (21 ملف)**

```
✅ AboutUs.tsx
✅ AchievementsSection.tsx
✅ BuildingDetailModal.tsx
✅ BuildingDetails.tsx
✅ BuildingsMap.tsx
✅ CitiesSection.tsx
✅ CityDetails.tsx
✅ ConstructionTimeline.tsx
✅ ContactSales.tsx
✅ ContactUs.tsx
✅ FilterCard.tsx
✅ Footer.tsx
✅ HeroSection.tsx
✅ LeafletMap.tsx
✅ Map.tsx
✅ Navbar.tsx
✅ PropertiesPage.tsx
✅ SearchResults.tsx
✅ TestimonialsSection.tsx
✅ UnitDetails.tsx
```

---

## 📁 **/components/figma/ (1 ملف - محمي)**

```
⚠️ ImageWithFallback.tsx (موجود بالفعل - لا تعدله)
```

---

## 📁 **/components/ui/ (كل الملفات)**

هذه مكتبة shadcn/ui - **يمكن تخطيها الآن** لأنها ستُثبت تلقائياً مع `npm install`

لكن إذا أردت نسخها:
```
✅ button.tsx
✅ input.tsx
✅ label.tsx
✅ select.tsx
✅ textarea.tsx
✅ dialog.tsx
✅ table.tsx
✅ ... (باقي الملفات)
```

---

## 📁 **/contexts/ (1 ملف)**

```
✅ LanguageContext.tsx
```

---

## 📁 **/imports/ (5 ملفات)**

```
✅ Desktop1.tsx
✅ Frame14.tsx
✅ Frame18.tsx
✅ svg-a9cd8qe9is.ts
✅ svg-wvzp5ojbif.ts
✅ svg-xd1tsi0116.ts
```

---

## 📁 **/styles/ (1 ملف)**

```
✅ globals.css
```

---

## 📁 **/utils/supabase/ (3 ملفات)**

```
✅ client.ts
✅ info.tsx
✅ queries.ts
```

---

## 📁 **/supabase/functions/server/ (2 ملف)**

```
✅ index.tsx
⚠️ kv_store.tsx (محمي - لا تعدله)
```

---

## 📁 **/supabase/migrations/ (ملفات SQL)**

```
✅ buildings_complete_fixed.sql
✅ create_inquiries_table.sql
✅ create_timeline_phases_table.sql
✅ homepage_content.sql
✅ testimonials.sql
```

---

## 🎯 **الملفات الضرورية فقط (Quick Start):**

إذا أردت البدء سريعاً، انسخ **هذه الملفات فقط**:

### **المجموعة 1: Core Files (8 ملفات)**
```
1. index.html
2. main.tsx
3. App.tsx
4. package.json
5. tsconfig.json
6. vite.config.ts
7. .gitignore
8. styles/globals.css
```

### **المجموعة 2: Components (21 ملف)**
```
كل ملفات /components/*.tsx
```

### **المجموعة 3: Admin (7 ملفات)**
```
كل ملفات /admin/*.tsx
```

### **المجموعة 4: Utils (4 ملفات)**
```
contexts/LanguageContext.tsx
utils/supabase/client.ts
utils/supabase/info.tsx
utils/supabase/queries.ts
```

### **المجموعة 5: Backend (1 ملف)**
```
supabase/functions/server/index.tsx
```

---

## 🚀 **بعد نسخ كل الملفات:**

### **الخطوة 1: Initialize Git**

```bash
cd al-fouad-real-estate

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Al-Fouad Real Estate Platform"
```

### **الخطوة 2: إنشاء Repository على GitHub**

1. اذهب لـ https://github.com/new
2. اسم الـ Repository: `al-fouad-real-estate`
3. اجعله Private أو Public
4. **لا تضف** README أو .gitignore (عندك بالفعل)
5. Create repository

### **الخطوة 3: Push للـ Repository**

GitHub سيعطيك الأوامر، نفذها:

```bash
git remote add origin https://github.com/YOUR_USERNAME/al-fouad-real-estate.git
git branch -M main
git push -u origin main
```

### **الخطوة 4: Install & Run**

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

---

## 📊 **Progress Tracker:**

استخدم هذا الـ Checklist أثناء النسخ:

### ✅ Root Files:
- [ ] index.html
- [ ] main.tsx
- [ ] App.tsx
- [ ] package.json
- [ ] tsconfig.json
- [ ] vite.config.ts
- [ ] .gitignore

### ✅ Components:
- [ ] Navbar.tsx
- [ ] HeroSection.tsx
- [ ] CitiesSection.tsx
- [ ] CityDetails.tsx
- [ ] BuildingDetails.tsx
- [ ] UnitDetails.tsx
- [ ] PropertiesPage.tsx
- [ ] ContactUs.tsx
- [ ] AboutUs.tsx
- [ ] Footer.tsx
- [ ] Map.tsx
- [ ] BuildingsMap.tsx
- [ ] LeafletMap.tsx
- [ ] SearchResults.tsx
- [ ] FilterCard.tsx
- [ ] ConstructionTimeline.tsx
- [ ] TestimonialsSection.tsx
- [ ] AchievementsSection.tsx
- [ ] BuildingDetailModal.tsx
- [ ] ContactSales.tsx

### ✅ Admin:
- [ ] AdminLogin.tsx
- [ ] AdminDashboard.tsx
- [ ] CitiesManager.tsx
- [ ] BuildingsManager.tsx
- [ ] UnitsManager.tsx
- [ ] ContentManager.tsx
- [ ] InquiriesManager.tsx

### ✅ Contexts & Utils:
- [ ] contexts/LanguageContext.tsx
- [ ] utils/supabase/client.ts
- [ ] utils/supabase/info.tsx
- [ ] utils/supabase/queries.ts

### ✅ Backend:
- [ ] supabase/functions/server/index.tsx

### ✅ Styles:
- [ ] styles/globals.css

---

## ⏱️ **الوقت المتوقع:**

- ⚡ نسخ الملفات الأساسية: **10 دقائق**
- ⚡ نسخ كل الملفات: **20-30 دقيقة**
- ⚡ Setup + Git Push: **5 دقائق**

**المجموع: 15-35 دقيقة** ✅

---

## 💡 **نصائح:**

1. ✅ استخدم **VS Code** لفتح المجلد مباشرة
2. ✅ استخدم **Multi-cursor** في VS Code للسرعة
3. ✅ لا تنسخ ملفات `.md` (الـ documentation) - ليست ضرورية
4. ✅ تأكد من **الترميز UTF-8** عند الحفظ (للنصوص العربية)
5. ✅ تحقق من **structure المجلدات** قبل البدء

---

## 🆘 **حل المشاكل:**

### مشكلة: "الكود لا يظهر في Figma Make"

**الحل:**
1. اضغط F5 (Refresh)
2. جرب متصفح آخر (Chrome)
3. امسح الـ Cache

### مشكلة: "الملف كبير جداً للنسخ"

**الحل:**
استخدم Browser Console:
```javascript
// في Console (F12)
copy(document.querySelector('.code-editor').textContent)
```

---

## ✨ **بعد الانتهاء:**

```bash
# تحقق من كل شيء
npm install
npm run dev

# إذا كل شيء تمام:
git add .
git commit -m "Complete project setup"
git push
```

**مبروك! 🎉 المشروع الآن على GitHub!**
