# 🗄️ Supabase Database Setup Guide

## Cities Table - Required Columns

You need to add the following columns to your `cities` table in Supabase:

### 1. Add `name_ar` Column (Arabic Name)
```sql
ALTER TABLE cities ADD COLUMN name_ar TEXT;
```

**Example data:**
- New Heliopolis → `هليوبوليس الجديدة`
- Beit El-Watan → `بيت الوطن`

### 2. Add `description_ar` Column (Optional - Arabic Description)
```sql
ALTER TABLE cities ADD COLUMN description_ar TEXT;
```

### 3. Add/Update `latitude` Column
```sql
ALTER TABLE cities ADD COLUMN latitude NUMERIC NOT NULL DEFAULT 30.0444;
```

### 4. Add/Update `longitude` Column
```sql
ALTER TABLE cities ADD COLUMN longitude NUMERIC NOT NULL DEFAULT 31.2357;
```

---

## 📍 Recommended Coordinates for Egyptian Cities

### New Heliopolis (هليوبوليس الجديدة)
- **Latitude:** `30.08442`
- **Longitude:** `31.32499`
- **Location:** New Cairo, Cairo Governorate

### Beit El-Watan (بيت الوطن)
- **Latitude:** `30.00194`
- **Longitude:** `31.46556`
- **Location:** New Cairo, Near AUC

---

## 📊 Sample SQL Update Query

```sql
-- Update New Heliopolis
UPDATE cities
SET 
  name_ar = 'هليوبوليس الجديدة',
  latitude = 30.08442,
  longitude = 31.32499,
  location = 'New Cairo, Cairo Governorate'
WHERE id = 'new-heliopolis';

-- Update Beit El-Watan
UPDATE cities
SET 
  name_ar = 'بيت الوطن',
  latitude = 30.00194,
  longitude = 31.46556,
  location = 'New Cairo, Near American University'
WHERE id = 'bait-el-watan';
```

---

## ✅ Verification Checklist

After updating the database, verify that each city has:

- [x] `name` (English) - e.g., "New Heliopolis"
- [x] `name_ar` (Arabic) - e.g., "هليوبوليس الجديدة"
- [x] `latitude` (Numeric) - e.g., 30.08442
- [x] `longitude` (Numeric) - e.g., 31.32499
- [x] `location` (Text) - e.g., "New Cairo, Cairo Governorate"
- [x] `description` (Text) - Detailed description in English
- [x] `description_ar` (Text, Optional) - Detailed description in Arabic
- [x] `status` - Should be 'active' to show on website

---

## 🔄 Automatic Computation

The following fields are **automatically computed** from the `buildings` and `units` tables:

### ✨ Computed Fields:
1. **`total_buildings`** - Count of buildings where `city_id` matches
2. **`total_units`** - Count of all units where `city_id` matches
3. **`available_units`** - Count of units where `city_id` matches AND `status = 'available'`

**You don't need to manually set these!** The application automatically calculates them from your buildings and units data.

---

## 🚀 How It Works on the Website

Once you've updated the database:

1. **Arabic Names**: When user switches to Arabic (AR), city names will display in Arabic
2. **Map Markers**: Cities will appear on the interactive map using lat/long coordinates
3. **Real-time Stats**: Building counts and unit counts are fetched live from the database
4. **Location Display**: City location appears in breadcrumbs and detail pages

---

## 🔍 Example: Complete City Entry

```json
{
  "id": "new-heliopolis",
  "name": "New Heliopolis",
  "name_ar": "هليوبوليس الجديدة",
  "description": "A modern residential compound featuring luxury apartments and penthouses in the heart of New Cairo with world-class amenities.",
  "description_ar": "مجمع سكني حديث يضم شققاً فاخرة وبنتهاوس في قلب القاهرة الجديدة مع مرافق عالمية المستوى.",
  "location": "New Cairo, Cairo Governorate",
  "latitude": 30.08442,
  "longitude": 31.32499,
  "hero_image": "https://your-image-url.com/hero.jpg",
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

## 📝 Notes

- **Computed fields** (total_buildings, total_units, available_units) are calculated dynamically - you don't store them!
- The app automatically counts buildings where `city_id` matches the city
- The app automatically counts units where `city_id` matches the city
- Only cities with `status = 'active'` will appear on the website
- Coordinates should be in decimal degrees format (not DMS)
- Use Google Maps to get accurate coordinates for each location

---

## 🎯 Next Steps

1. ✅ Add the `name_ar`, `latitude`, and `longitude` columns to your `cities` table
2. ✅ Update each city with Arabic names and coordinates
3. ✅ Ensure your `buildings` table has `city_id` pointing to the correct city
4. ✅ Ensure your `units` table has `city_id` pointing to the correct city
5. ✅ Test the website - city names should appear in Arabic when you switch language
6. ✅ Check the map - markers should appear at the correct locations
7. ✅ Verify building/unit counts are accurate on city detail pages
