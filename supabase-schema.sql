-- =====================================================
-- Al-Fouad Real Estate Investment Database Schema
-- =====================================================
-- This schema supports the real estate landing page and project details
-- Run this in the Supabase SQL Editor

-- =====================================================
-- 1. PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  hero_image TEXT,
  location TEXT,
  total_units INTEGER DEFAULT 0,
  available_units INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'completed', 'sold_out')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- =====================================================
-- 2. BUILDINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS buildings (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  floors INTEGER NOT NULL,
  total_units INTEGER NOT NULL,
  available_units INTEGER DEFAULT 0,
  image TEXT,
  description TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'coming_soon', 'sold_out')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_buildings_project_id ON buildings(project_id);
CREATE INDEX IF NOT EXISTS idx_buildings_status ON buildings(status);

-- =====================================================
-- 3. UNITS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  building_id TEXT NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  area DECIMAL(10, 2) NOT NULL,
  floor INTEGER NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('Cash', 'Installments', 'Both')),
  price DECIMAL(15, 2) NOT NULL,
  price_currency TEXT DEFAULT 'EGP',
  installment_years INTEGER,
  down_payment_percentage DECIMAL(5, 2),
  image TEXT,
  images TEXT[], -- Array of image URLs
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(building_id, unit_number)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_units_building_id ON units(building_id);
CREATE INDEX IF NOT EXISTS idx_units_project_id ON units(project_id);
CREATE INDEX IF NOT EXISTS idx_units_status ON units(status);
CREATE INDEX IF NOT EXISTS idx_units_is_featured ON units(is_featured);
CREATE INDEX IF NOT EXISTS idx_units_payment_type ON units(payment_type);
CREATE INDEX IF NOT EXISTS idx_units_price ON units(price);

-- =====================================================
-- 4. SEARCH QUERIES TABLE (Optional - for analytics)
-- =====================================================
CREATE TABLE IF NOT EXISTS search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT,
  min_price DECIMAL(15, 2),
  max_price DECIMAL(15, 2),
  payment_type TEXT,
  installment_years INTEGER,
  searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_queries_searched_at ON search_queries(searched_at);

-- =====================================================
-- 5. INQUIRIES TABLE (Optional - for contact forms)
-- =====================================================
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  unit_id TEXT REFERENCES units(id) ON DELETE SET NULL,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_project_id ON inquiries(project_id);

-- =====================================================
-- 6. TESTIMONIALS TABLE (Bilingual Support)
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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_is_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);

-- =====================================================
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. RLS POLICIES (Public read access for frontend)
-- =====================================================

-- Projects: Allow public read access
CREATE POLICY "Allow public read access on projects"
  ON projects FOR SELECT
  USING (true);

-- Buildings: Allow public read access
CREATE POLICY "Allow public read access on buildings"
  ON buildings FOR SELECT
  USING (true);

-- Units: Allow public read access
CREATE POLICY "Allow public read access on units"
  ON units FOR SELECT
  USING (true);

-- Search queries: Allow anyone to insert
CREATE POLICY "Allow public insert on search_queries"
  ON search_queries FOR INSERT
  WITH CHECK (true);

-- Inquiries: Allow public insert
CREATE POLICY "Allow public insert on inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

-- Testimonials: Allow public read access
CREATE POLICY "Allow public read access on testimonials"
  ON testimonials FOR SELECT
  USING (true);

-- =====================================================
-- 9. FUNCTIONS FOR AUTO-UPDATE TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for auto-updating timestamps
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buildings_updated_at
  BEFORE UPDATE ON buildings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. SEED DATA - PROJECTS
-- =====================================================
INSERT INTO projects (id, name, description, hero_image, location, total_units, available_units, status)
VALUES 
  (
    'new-heliopolis',
    'New Heliopolis',
    'Experience modern luxury living in the heart of New Cairo. New Heliopolis offers state-of-the-art amenities and contemporary design for discerning residents.',
    'https://images.unsplash.com/photo-1599412965471-e5f860059f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    'New Cairo',
    148,
    142,
    'active'
  ),
  (
    'bait-el-watan',
    'Beit Al-Watan',
    'Premium residences with world-class amenities. Beit Al-Watan combines elegant architecture with modern convenience in an exclusive community setting.',
    'https://images.unsplash.com/photo-1757952854354-0b5495662b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    'Cairo',
    152,
    142,
    'active'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 11. SEED DATA - BUILDINGS
-- =====================================================
INSERT INTO buildings (id, project_id, name, floors, total_units, available_units, image, status)
VALUES 
  -- New Heliopolis Buildings
  ('new-heliopolis-b1', 'new-heliopolis', 'Building A', 12, 48, 48, 'https://images.unsplash.com/photo-1757952854354-0b5495662b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'available'),
  ('new-heliopolis-b2', 'new-heliopolis', 'Building B', 15, 60, 60, 'https://images.unsplash.com/photo-1599412965471-e5f860059f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'available'),
  ('new-heliopolis-b3', 'new-heliopolis', 'Building C', 10, 40, 34, 'https://images.unsplash.com/photo-1757952854354-0b5495662b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'available'),
  
  -- Beit Al-Watan Buildings
  ('bait-el-watan-b1', 'bait-el-watan', 'Tower 1', 20, 80, 72, 'https://images.unsplash.com/photo-1599412965471-e5f860059f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'available'),
  ('bait-el-watan-b2', 'bait-el-watan', 'Tower 2', 18, 72, 70, 'https://images.unsplash.com/photo-1757952854354-0b5495662b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'available')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 12. SEED DATA - SAMPLE UNITS
-- =====================================================
-- Sample units for New Heliopolis - Building A
INSERT INTO units (id, building_id, project_id, unit_number, area, floor, bedrooms, bathrooms, payment_type, price, installment_years, down_payment_percentage, image, is_featured, status)
VALUES 
  ('unit-nh-b1-001', 'new-heliopolis-b1', 'new-heliopolis', 'A-001', 145.50, 1, 2, 2, 'Installments', 2500000, 5, 20, 'https://images.unsplash.com/photo-1738168246881-40f35f8aba0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', true, 'available'),
  ('unit-nh-b1-002', 'new-heliopolis-b1', 'new-heliopolis', 'A-002', 180.00, 2, 3, 2, 'Installments', 3200000, 7, 15, 'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', true, 'available'),
  ('unit-nh-b1-003', 'new-heliopolis-b1', 'new-heliopolis', 'A-003', 220.00, 3, 3, 3, 'Cash', 4100000, NULL, NULL, 'https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', true, 'available'),
  ('unit-nh-b1-004', 'new-heliopolis-b1', 'new-heliopolis', 'A-004', 165.00, 4, 2, 2, 'Both', 2900000, 6, 25, 'https://images.unsplash.com/photo-1738168246881-40f35f8aba0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', false, 'available'),
  ('unit-nh-b1-005', 'new-heliopolis-b1', 'new-heliopolis', 'A-005', 195.00, 5, 3, 2, 'Installments', 3500000, 8, 20, 'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', false, 'available'),
  
  -- Sample units for Beit Al-Watan - Tower 1
  ('unit-bw-b1-001', 'bait-el-watan-b1', 'bait-el-watan', 'T1-001', 200.00, 5, 3, 2, 'Installments', 4500000, 7, 20, 'https://images.unsplash.com/photo-1738168246881-40f35f8aba0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', true, 'available'),
  ('unit-bw-b1-002', 'bait-el-watan-b1', 'bait-el-watan', 'T1-002', 250.00, 8, 4, 3, 'Cash', 5800000, NULL, NULL, 'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', true, 'available'),
  ('unit-bw-b1-003', 'bait-el-watan-b1', 'bait-el-watan', 'T1-003', 175.00, 3, 2, 2, 'Installments', 3800000, 5, 25, 'https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', true, 'available')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 13. SEED DATA - TESTIMONIALS
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
-- 14. HELPFUL VIEWS
-- =====================================================

-- View: Projects with building and unit counts
CREATE OR REPLACE VIEW projects_summary AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.hero_image,
  p.location,
  p.status,
  COUNT(DISTINCT b.id) as building_count,
  COUNT(DISTINCT u.id) as total_units,
  COUNT(DISTINCT CASE WHEN u.status = 'available' THEN u.id END) as available_units,
  COUNT(DISTINCT CASE WHEN u.is_featured = true THEN u.id END) as featured_units
FROM projects p
LEFT JOIN buildings b ON p.id = b.project_id
LEFT JOIN units u ON p.id = u.project_id
GROUP BY p.id, p.name, p.description, p.hero_image, p.location, p.status;

-- View: Units with full details
CREATE OR REPLACE VIEW units_full_details AS
SELECT 
  u.id,
  u.unit_number,
  u.area,
  u.floor,
  u.bedrooms,
  u.bathrooms,
  u.payment_type,
  u.price,
  u.price_currency,
  u.installment_years,
  u.down_payment_percentage,
  u.image,
  u.is_featured,
  u.status,
  b.name as building_name,
  b.id as building_id,
  p.name as project_name,
  p.id as project_id
FROM units u
JOIN buildings b ON u.building_id = b.id
JOIN projects p ON u.project_id = p.id;

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================

-- Query to verify tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN ('projects', 'buildings', 'units', 'search_queries', 'inquiries', 'testimonials')
ORDER BY table_name;
