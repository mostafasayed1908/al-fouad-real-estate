# إضافة جدول الشهادات إلى Supabase

## نظرة عامة
تم إنشاء جدول الشهادات (testimonials) بدعم كامل للغتين العربية والإنجليزية لموقع شركة الفؤاد للاستثمار العقاري.

## هيكل الجدول

### الحقول (Columns)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | معرف فريد (يتم إنشاؤه تلقائياً) |
| `name_en` | TEXT | اسم العميل بالإنجليزية |
| `name_ar` | TEXT | اسم العميل بالعربية |
| `role_en` | TEXT | الدور/المسمى الوظيفي بالإنجليزية |
| `role_ar` | TEXT | الدور/المسمى الوظيفي بالعربية |
| `content_en` | TEXT | محتوى الشهادة بالإنجليزية |
| `content_ar` | TEXT | محتوى الشهادة بالعربية |
| `rating` | INTEGER | التقييم (من 1 إلى 5) |
| `image` | TEXT | رابط صورة العميل |
| `display_order` | INTEGER | ترتيب العرض |
| `is_active` | BOOLEAN | حالة النشاط (فعال/غير فعال) |
| `created_at` | TIMESTAMP | تاريخ الإنشاء |
| `updated_at` | TIMESTAMP | تاريخ آخر تحديث |

## خطوات التثبيت

### الطريقة 1: استخدام الملف الكامل (موصى به للتثبيت الجديد)
إذا كنت تقوم بإنشاء قاعدة البيانات من البداية:

1. افتح Supabase Dashboard
2. انتقل إلى **SQL Editor**
3. انسخ محتوى ملف `supabase-schema.sql`
4. الصق المحتوى في SQL Editor
5. اضغط **Run** لتنفيذ الاستعلام

### الطريقة 2: إضافة جدول الشهادات فقط (للقواعد الموجودة)
إذا كانت قاعدة البيانات موجودة بالفعل وتريد إضافة جدول الشهادات فقط:

1. افتح Supabase Dashboard
2. انتقل إلى **SQL Editor**
3. انسخ محتوى ملف `testimonials-only.sql`
4. الصق المحتوى في SQL Editor
5. اضغط **Run** لتنفيذ الاستعلام

## البيانات التجريبية

تم تضمين 5 شهادات تجريبية:
1. أحمد حسن - مالك عقار
2. سارة محمد - مستثمرة
3. خالد إبراهيم - صاحب منزل
4. فاطمة علي - مستشارة عقارية
5. عمر رشيد - صاحب أعمال

## استعلامات SQL مفيدة

### عرض جميع الشهادات النشطة
```sql
SELECT 
  name_en,
  name_ar,
  role_en,
  role_ar,
  content_en,
  content_ar,
  rating,
  display_order
FROM testimonials
WHERE is_active = true
ORDER BY display_order;
```

### إضافة شهادة جديدة
```sql
INSERT INTO testimonials (
  name_en, 
  name_ar, 
  role_en, 
  role_ar, 
  content_en, 
  content_ar, 
  rating, 
  image, 
  display_order, 
  is_active
)
VALUES (
  'John Doe',
  'جون دو',
  'Real Estate Investor',
  'مستثمر عقاري',
  'Excellent service and professional team.',
  'خدمة ممتازة وفريق محترف.',
  5,
  'https://images.unsplash.com/photo-example',
  6,
  true
);
```

### تحديث حالة شهادة
```sql
UPDATE testimonials
SET is_active = false
WHERE id = 'uuid-here';
```

### حذف شهادة
```sql
DELETE FROM testimonials
WHERE id = 'uuid-here';
```

### تغيير ترتيب العرض
```sql
UPDATE testimonials
SET display_order = 1
WHERE id = 'uuid-here';
```

## الأمان (Row Level Security)

تم تفعيل RLS على جدول الشهادات مع:
- **القراءة العامة (Public Read)**: يمكن لأي شخص قراءة الشهادات النشطة
- **الكتابة المحمية**: يتطلب إضافة/تعديل/حذف الشهادات صلاحيات إدارية

## الفهرسة (Indexes)

تم إضافة فهارس لتحسين الأداء:
- `idx_testimonials_is_active` - للبحث السريع عن الشهادات النشطة
- `idx_testimonials_display_order` - للترتيب السريع

## التحديث التلقائي للتوقيت

يتم تحديث `updated_at` تلقائياً عند أي تعديل على السجل.

## الاستعلام من الواجهة الأمامية

### مثال باستخدام Supabase Client
```typescript
// Get all active testimonials
const { data, error } = await supabase
  .from('testimonials')
  .select('*')
  .eq('is_active', true)
  .order('display_order', { ascending: true });
```

### مثال باستخدام REST API
```javascript
const response = await fetch(
  `https://YOUR_PROJECT_ID.supabase.co/rest/v1/testimonials?is_active=eq.true&order=display_order.asc`,
  {
    headers: {
      'apikey': 'YOUR_ANON_KEY',
      'Authorization': 'Bearer YOUR_ANON_KEY'
    }
  }
);
const testimonials = await response.json();
```

## دعم اللغات

عند عرض الشهادات في التطبيق:
- استخدم `name_en` و `role_en` و `content_en` للنسخة الإنجليزية
- استخدم `name_ar` و `role_ar` و `content_ar` للنسخة العربية

## التحقق من التثبيت

بعد تشغيل السكريبت، يمكنك التحقق من نجاح التثبيت:

```sql
-- التحقق من إنشاء الجدول
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'testimonials';

-- عد الشهادات
SELECT COUNT(*) FROM testimonials;

-- عرض البيانات ا��تجريبية
SELECT name_en, name_ar, rating FROM testimonials;
```

## الصيانة

### نسخ احتياطي للبيانات
```sql
-- تصدير جميع الشهادات
SELECT * FROM testimonials;
```

### استعادة البيانات
قم بحفظ نتائج الاستعلام أعلاه واستخدم INSERT لاستعادتها عند الحاجة.

## الدعم

للمزيد من المعلومات حول Supabase:
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
