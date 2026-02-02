-- =====================================================
-- TESTIMONIALS TABLE - STANDALONE SCRIPT
-- =====================================================
-- Run this script if you only want to add the testimonials table
-- to an existing Al-Fouad Real Estate database

-- =====================================================
-- 1. CREATE TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  role_en TEXT NOT NULL,
  role_ar TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. ADD INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_testimonials_is_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CREATE RLS POLICY (Public Read Access)
-- =====================================================
CREATE POLICY "Allow public read access on testimonials"
  ON testimonials FOR SELECT
  USING (true);

-- =====================================================
-- 5. CREATE AUTO-UPDATE TIMESTAMP TRIGGER
-- =====================================================
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. INSERT SAMPLE DATA
-- =====================================================
INSERT INTO testimonials (name_en, name_ar, role_en, role_ar, content_en, content_ar, rating, image, display_order, is_active)
VALUES 
  (
    'Ahmed Hassan',
    'أحمد حسن',
    'Property Owner',
    'مالك عقار',
    'Al-Fouad exceeded my expectations. The quality of construction and attention to detail in New Heliopolis is outstanding. Highly recommended!',
    'فاقت شركة الفؤاد توقعاتي. جودة البناء والاهتمام بالتفاصيل في هليوبوليس الجديدة رائعة. أنصح بها بشدة!',
    5,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    1,
    true
  ),
  (
    'Sarah Mohamed',
    'سارة محمد',
    'Investor',
    'مستثمرة',
    'Professional team and transparent process. They guided me through every step of purchasing my villa in Beit El-Watan. Couldn''t be happier!',
    'فريق محترف وعملية شفافة. أرشدوني في كل خطوة لشراء فيلتي في بيت الوطن. لا يمكن أن أكون أكثر سعادة!',
    5,
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    2,
    true
  ),
  (
    'Khaled Ibrahim',
    'خالد إبراهيم',
    'Homeowner',
    'صاحب منزل',
    'The best real estate investment I''ve made. Premium location, excellent amenities, and a company that truly cares about its clients.',
    'أفضل استثمار عقاري قمت به. موقع مميز، ومرافق ممتازة، وشركة تهتم حقاً بعملائها.',
    5,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    3,
    true
  ),
  (
    'Fatima Ali',
    'فاطمة علي',
    'Real Estate Consultant',
    'مستشارة عقارية',
    'Working with Al-Fouad has been a pleasure. Their professionalism and commitment to quality sets them apart in the Egyptian real estate market.',
    'العمل مع شركة الفؤاد كان متعة. احترافيتهم والتزامهم بالجودة يميزهم في سوق العقارات المصري.',
    5,
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    4,
    true
  ),
  (
    'Omar Rashid',
    'عمر رشيد',
    'Business Owner',
    'صاحب أعمال',
    'I purchased three units as an investment. The return on investment has exceeded my projections. Al-Fouad delivers on their promises.',
    'اشتريت ثلاث وحدات كاستثمار. عائد الاستثمار فاق توقعاتي. شركة الفؤاد تفي بوعودها.',
    5,
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    5,
    true
  );

-- =====================================================
-- 7. VERIFY INSTALLATION
-- =====================================================
-- Check that the table was created successfully
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'testimonials') as column_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name = 'testimonials';

-- Check sample data
SELECT 
  COUNT(*) as total_testimonials,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_testimonials
FROM testimonials;

-- Display all testimonials (English names)
SELECT 
  id,
  name_en,
  role_en,
  rating,
  display_order,
  is_active
FROM testimonials
ORDER BY display_order;
