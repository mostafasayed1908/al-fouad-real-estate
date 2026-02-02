# 🎛️ Admin Dashboard Guide

## Overview

Your Al-Fouad Real Estate website now has a **complete admin dashboard** that allows you to manage all website content directly from the browser. The dashboard is located in a separate `/admin` directory and connects to your Supabase database.

---

## 📂 Directory Structure

```
/admin/
├── AdminLogin.tsx          # Secure login page
├── AdminDashboard.tsx      # Main dashboard with tabs
├── CitiesManager.tsx       # Manage cities (CRUD)
├── BuildingsManager.tsx    # Manage buildings (CRUD)
├── UnitsManager.tsx        # Manage units (CRUD)
└── ContentManager.tsx      # Manage testimonials, hero, counters
```

---

## 🔐 Accessing the Admin Dashboard

### Step 1: Create an Admin User in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Users**
3. Click **"Add User"**
4. Enter admin credentials:
   - **Email**: `admin@alfouad.com` (or your preferred email)
   - **Password**: Create a strong password
5. Click **"Create User"**

### Step 2: Access the Dashboard

Navigate to your website URL and add `/admin` to access the dashboard:
```
https://your-website.com/#admin
```

Or, directly in the browser, manually change the URL after loading to trigger the admin page.

> **Note**: For now, you'll need to manually navigate by typing in the browser console:
> ```javascript
> window.location.hash = '#admin'
> ```

---

## 🎯 Dashboard Features

### 1. **Cities Manager** 🏙️

Manage all cities in your portfolio:

**What You Can Do:**
- ✅ **Add New City**: Create new city listings
- ✅ **Edit City**: Update name (English & Arabic), lat/long, description, location, status, hero image
- ✅ **Delete City**: Remove cities (⚠️ careful - affects buildings and units)
- ✅ **Set Coordinates**: Specify exact lat/long for map markers

**Fields Available:**
- Name (English) *
- Name (Arabic)
- Description (English)
- Description (Arabic)
- Location (e.g., "New Cairo, Egypt")
- Latitude * (e.g., 30.08442)
- Longitude * (e.g., 31.32499)
- Hero Image URL
- Status: Active | Upcoming | Completed | Sold Out

**Live Updates:**
- Total buildings and units are **automatically calculated** from database
- Changes appear on the website immediately after saving

---

### 2. **Buildings Manager** 🏢

Manage all buildings within cities:

**What You Can Do:**
- ✅ **Add New Building**: Create buildings and assign to cities
- ✅ **Edit Building**: Update details, construction progress, delivery dates
- ✅ **Delete Building**: Remove buildings
- ✅ **Construction Timeline**: Set progress for 5 phases (Planning, Foundation, Structure, Finishing, Delivery)

**Fields Available:**
- Building Name *
- City * (dropdown)
- Status: Available | Under Construction | Sold Out
- Delivery Date
- Total Floors
- Total Units
- Overall Construction Progress (0-100%)
- Phase Progress:
  - Planning (0-100%)
  - Foundation (0-100%)
  - Structure (0-100%)
  - Finishing (0-100%)
  - Delivery (0-100%)
- Address
- Description

**Construction Timeline Feature:**
Each building has 5 phases you can track individually, and the website displays them beautifully with progress indicators.

---

### 3. **Units Manager** 🏠

Manage all property units:

**What You Can Do:**
- ✅ **Add New Unit**: Create units and assign to buildings
- ✅ **Edit Unit**: Update prices, specs, status
- ✅ **Delete Unit**: Remove units
- ✅ **Filter Units**: By city or building for easy navigation
- ✅ **Bulk Management**: See all units at once

**Fields Available:**
- City * (dropdown)
- Building * (dropdown - filtered by city)
- Unit Number * (e.g., "A101")
- Type: Apartment | Penthouse | Villa | Townhouse | Studio
- Status: Available | Reserved | Sold
- Floor
- Bedrooms
- Bathrooms
- Area (m²)
- Price (Cash EGP)
- Price (Installment EGP)
- Installment Years
- Description
- Features (comma-separated, e.g., "Balcony, Parking, Garden View")

**Smart Filtering:**
Filter units by city first, then by building for efficient management.

---

### 4. **Content Manager** 📝

Manage dynamic website content:

**Currently Available:**
- 📢 **Testimonials**: Managed via KV store (`testimonials` key)
- 🖼️ **Hero Section**: Managed via KV store (`hero_content` key)
- 📊 **Counters**: Managed via KV store (`counters` key)

**How to Edit:**
Content is stored in Supabase KV Store table. Edit directly in Supabase Dashboard:
1. Go to **Table Editor** → **kv_store_74e21526**
2. Find the key (e.g., `testimonials`, `hero_content`, `counters`)
3. Edit the JSON value
4. Save changes

**Example Structures:**

**Testimonials:**
```json
{
  "testimonials": [
    {
      "id": "1",
      "name": "Ahmed Hassan",
      "role": "Property Owner",
      "content": "Al-Fouad exceeded my expectations...",
      "rating": 5,
      "image": "https://..."
    }
  ]
}
```

**Hero Content:**
```json
{
  "hero_content": {
    "title": "Find Your Perfect Investment",
    "subtitle": "Premium properties...",
    "background_image": "https://...",
    "cta_text": "Explore Properties"
  }
}
```

**Counters:**
```json
{
  "counters": {
    "buildings": 50,
    "clients": 1000,
    "awards": 15,
    "years": 20
  }
}
```

---

## 🔄 How Updates Work

### Real-Time Website Updates

When you make changes in the admin dashboard:

1. **Save Button Clicked** → Data sent to Supabase
2. **Database Updated** → Changes stored immediately
3. **Website Refreshed** → New data appears automatically

### Automatic Calculations

Some fields are **computed automatically**:
- **City Total Buildings**: Count of buildings where `city_id` matches
- **City Total Units**: Count of units where `city_id` matches
- **City Available Units**: Count of units where `status = 'available'`

You don't need to manually update these!

---

## 🛡️ Security

### Authentication
- ✅ Supabase Auth handles all login/logout
- ✅ Sessions are securely stored
- ✅ Only authenticated users can access dashboard

### Database Permissions
Make sure your Supabase RLS (Row Level Security) policies allow:
- ✅ Authenticated users to **read** and **write** to `cities`, `buildings`, `units` tables
- ✅ Service role key is NOT exposed to frontend (it's only in backend)

### Recommended RLS Policies

```sql
-- Allow authenticated users to manage cities
CREATE POLICY "Authenticated users can manage cities"
ON cities FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to manage buildings
CREATE POLICY "Authenticated users can manage buildings"
ON buildings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to manage units
CREATE POLICY "Authenticated users can manage units"
ON units FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

---

## 🎨 User Interface

### Design
- **Clean & Modern**: Uses your brand colors (#a74b48)
- **Responsive**: Works on desktop and tablet
- **Intuitive**: Clear labels, helpful placeholders
- **Real-time Feedback**: Success/error messages for all actions

### Navigation
- **Tabs**: Switch between Cities, Buildings, Units, Content
- **Logout Button**: Always visible in top-right corner
- **User Info**: Shows logged-in email

---

## 🚀 Common Tasks

### Adding a New City

1. Go to **Cities** tab
2. Click **"Add New City"**
3. Fill in:
   - Name (English): `New Capital`
   - Name (Arabic): `العاصمة الإدارية`
   - Latitude: `30.0131`
   - Longitude: `31.4392`
   - Location: `New Administrative Capital, Egypt`
   - Description: Write your description
   - Status: `Active`
4. Click **"Save"**
5. ✅ City appears on website immediately!

### Adding a Building to a City

1. Go to **Buildings** tab
2. Click **"Add New Building"**
3. Select city from dropdown
4. Fill in building details
5. Set construction progress (e.g., 60%)
6. Set phase progress for timeline
7. Click **"Save"**

### Adding Units to a Building

1. Go to **Units** tab
2. Click **"Add New Unit"**
3. Select city, then building
4. Fill in unit details (bedrooms, area, price)
5. Click **"Save"**

### Updating Construction Progress

1. Go to **Buildings** tab
2. Click **Edit** on a building
3. Drag the **Construction Progress** slider
4. Update individual phases
5. Click **"Save"**
6. ✅ Timeline on website updates instantly!

---

## 📊 Database Structure

Your admin dashboard manages these tables:

### `cities` Table
```sql
id: text (primary key)
name: text
name_ar: text
description: text
description_ar: text
location: text
latitude: numeric
longitude: numeric
hero_image: text
status: text
created_at: timestamp
updated_at: timestamp
```

### `buildings` Table
```sql
id: text (primary key)
city_id: text (foreign key)
name: text
description: text
address: text
latitude: numeric
longitude: numeric
total_floors: integer
total_units: integer
available_units: integer
hero_image: text
status: text
delivery_date: date
construction_progress: integer
phase_planning: integer
phase_foundation: integer
phase_structure: integer
phase_finishing: integer
phase_delivery: integer
created_at: timestamp
updated_at: timestamp
```

### `units` Table
```sql
id: text (primary key)
city_id: text (foreign key)
building_id: text (foreign key)
unit_number: text
type: text
bedrooms: integer
bathrooms: integer
area: numeric
floor: integer
price_egp: numeric
price_installment: numeric
installment_years: integer
status: text
description: text
features: text
created_at: timestamp
updated_at: timestamp
```

---

## 🐛 Troubleshooting

### Can't Login?
- ✅ Make sure you created an admin user in Supabase
- ✅ Check email/password are correct
- ✅ Verify Supabase Auth is enabled

### Changes Not Appearing?
- ✅ Refresh the public website page
- ✅ Check browser console for errors
- ✅ Verify data saved in Supabase dashboard

### "Permission Denied" Errors?
- ✅ Check RLS policies in Supabase
- ✅ Make sure user is authenticated
- ✅ Verify table permissions

### Map Not Showing Location?
- ✅ Check lat/long are valid numbers
- ✅ Coordinates should be in decimal format (e.g., 30.08442)
- ✅ Verify both latitude and longitude are set

---

## 💡 Tips & Best Practices

1. **Backup Before Major Changes**: Export your database before bulk updates
2. **Use Descriptive Names**: Clear building/unit names help with management
3. **Keep Coordinates Accurate**: Use Google Maps to get exact lat/long
4. **Update Progress Regularly**: Keep construction timelines current
5. **Test on Staging**: If possible, test changes on a staging environment first
6. **Regular Backups**: Supabase offers automatic backups - enable them!

---

## 🎯 Future Enhancements

Possible improvements you could add:

- 🖼️ **Image Upload**: Direct image uploads to Supabase Storage
- 📧 **Email Notifications**: Notify when units are sold/reserved
- 📈 **Analytics Dashboard**: View visitor stats and popular properties
- 🗓️ **Booking System**: Let users book site visits
- 💬 **Live Chat**: Integrated customer support
- 📱 **Mobile App**: Native mobile admin app

---

## 📞 Support

If you need help:
1. Check Supabase logs for errors
2. Review browser console for frontend errors
3. Test database queries directly in Supabase SQL editor
4. Verify all environment variables are set

---

## ✅ Checklist: Getting Started

- [ ] Create admin user in Supabase Auth
- [ ] Navigate to `/admin` route (use browser console for now)
- [ ] Login with admin credentials
- [ ] Add your first city with lat/long
- [ ] Add a building to that city
- [ ] Add units to the building
- [ ] Verify changes appear on public website
- [ ] Update construction progress
- [ ] Test editing and deleting

---

**🎉 Congratulations! You now have a fully functional admin dashboard to manage your Al-Fouad Real Estate website!**

All changes you make in the dashboard will appear instantly on your live website. No coding required!
