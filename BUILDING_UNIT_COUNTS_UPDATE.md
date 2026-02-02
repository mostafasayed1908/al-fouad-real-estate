# Building Unit Counts - Dynamic Calculation Update

## Overview
The `total_units` and `available_units` columns have been removed from the `buildings` table. These values are now calculated dynamically from the `units` table in real-time.

## Why This Change?

### Before:
- Building unit counts were stored as static values in the database
- These values could become outdated when units were added, updated, or deleted
- Required manual updates to keep in sync

### After:
- Unit counts are calculated dynamically from the actual units in the database
- Always accurate and up-to-date
- No manual syncing required
- Single source of truth (the units table)

## Database Migration Required

### Step 1: Run SQL Migration

Go to your Supabase Dashboard → SQL Editor and run:

```sql
-- Remove total_units and available_units columns from buildings table
ALTER TABLE buildings DROP COLUMN IF EXISTS total_units;
ALTER TABLE buildings DROP COLUMN IF EXISTS available_units;

-- Create a view for easy querying (optional but recommended)
CREATE OR REPLACE VIEW buildings_with_unit_counts AS
SELECT 
  b.*,
  COUNT(u.id) FILTER (WHERE u.status IS NOT NULL) as total_units,
  COUNT(u.id) FILTER (WHERE u.status = 'available') as available_units
FROM buildings b
LEFT JOIN units u ON u.building_id = b.id
GROUP BY b.id;
```

## Code Changes Made

### 1. Admin Portal - BuildingsManager.tsx ✅
- **Removed** `total_units` and `available_units` fields from the add/edit form
- **Removed** these fields from the formData state
- Admin no longer needs to manually enter unit counts
- Building list display updated (removed unit count from list view)

### 2. Query Functions - queries.ts ✅
Updated all building query functions to calculate unit counts dynamically:

#### `getBuildingsByCity(cityId: string)`
- Fetches buildings for a city
- Enriches each building with calculated unit counts from the units table
- Returns buildings with `total_units` and `available_units` properties

#### `getBuildingById(buildingId: string)`
- Fetches a single building
- Calculates and adds `total_units` and `available_units`
- Used by BuildingDetails and other components

### 3. Frontend Components (Automatic) ✅
All components that display building information automatically benefit:
- **BuildingDetails.tsx** - Shows available units count
- **BuildingsMap.tsx** - Displays total and available units
- **BuildingDetailModal.tsx** - Shows unit counts
- **CityDetails.tsx** - Displays building unit counts

## How It Works Now

### When fetching buildings:
```typescript
// Before (old way - static values from DB)
const building = { 
  id: 'xyz', 
  name: 'Building A',
  total_units: 50,        // Static, could be wrong
  available_units: 12     // Static, could be wrong
}

// After (new way - dynamically calculated)
const building = await getBuildingById('xyz');
// Returns:
{
  id: 'xyz',
  name: 'Building A',
  total_units: 48,         // Counted from units table
  available_units: 15      // Counted from units table
}
```

### The calculation:
```sql
-- Total units: Count all units for this building
SELECT COUNT(*) FROM units WHERE building_id = 'xyz'

-- Available units: Count only available units
SELECT COUNT(*) FROM units 
WHERE building_id = 'xyz' AND status = 'available'
```

## Benefits

### ✅ Data Accuracy
- Unit counts are always accurate
- No risk of outdated information
- Automatically reflects unit additions/deletions

### ✅ Simplified Admin
- Admin doesn't need to manually update counts
- One less field to worry about
- Reduces human error

### ✅ Single Source of Truth
- Units table is the only source for unit data
- No duplicate information
- Easier to maintain

### ✅ Real-time Updates
- When you add a unit → building counts update automatically
- When you delete a unit → building counts update automatically
- When you change unit status → available count updates automatically

## Migration Checklist

- [ ] **Backup your database** (always recommended before schema changes)
- [ ] **Run the SQL migration** to drop the columns
- [ ] **Test building queries** - verify unit counts appear correctly
- [ ] **Test admin portal** - verify building creation/editing works
- [ ] **Test frontend** - verify building details show correct counts
- [ ] **(Optional)** Use the `buildings_with_unit_counts` view for direct SQL queries

## Testing

After running the migration:

1. **Admin Portal Test:**
   - Go to Admin → Buildings
   - Add a new building (notice no unit count fields)
   - Save successfully
   
2. **Website Test:**
   - Go to a city details page
   - Click on a building
   - Verify unit counts display correctly
   
3. **Units Test:**
   - Add a new unit to a building
   - Check building details → unit count should increase
   - Delete a unit from a building
   - Check building details → unit count should decrease

## Troubleshooting

### Unit counts showing as 0?
- Make sure units have the correct `building_id`
- Check that units exist in the units table
- Verify the units table has data

### Error: "column does not exist"?
- Make sure you ran the SQL migration
- Check that the columns were successfully dropped
- Clear your browser cache and refresh

### Performance concerns?
- The queries use COUNT with indexes, which is fast
- For very large datasets, consider using the `buildings_with_unit_counts` view
- The view pre-calculates counts for even better performance

## Rollback (If Needed)

If you need to rollback this change:

```sql
-- Add columns back
ALTER TABLE buildings ADD COLUMN total_units INTEGER DEFAULT 0;
ALTER TABLE buildings ADD COLUMN available_units INTEGER DEFAULT 0;

-- Recalculate values from units table
UPDATE buildings b
SET 
  total_units = (SELECT COUNT(*) FROM units WHERE building_id = b.id),
  available_units = (SELECT COUNT(*) FROM units WHERE building_id = b.id AND status = 'available');
```

Then revert the code changes in BuildingsManager.tsx and queries.ts.
