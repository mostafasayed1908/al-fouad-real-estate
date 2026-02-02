# Inquiries Table Setup Instructions

## Overview
The contact form now saves inquiries to a Supabase database table called `inquiries`. This allows you to view and manage all customer inquiries from the Admin Dashboard.

## Database Setup Required

You need to create the `inquiries` table in your Supabase database. Follow these steps:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `/supabase/migrations/create_inquiries_table.sql`
5. Click **Run** to execute the query

### Option 2: Using Supabase CLI

If you have Supabase CLI installed locally:

```bash
supabase db push
```

## Table Schema

The `inquiries` table includes the following columns:

| Column       | Type      | Description                                    |
|-------------|-----------|------------------------------------------------|
| `id`        | UUID      | Primary key (auto-generated)                   |
| `name`      | TEXT      | Customer's full name (required)                |
| `email`     | TEXT      | Customer's email address (required)            |
| `phone`     | TEXT      | Customer's phone number (optional)             |
| `message`   | TEXT      | Customer's message/inquiry (optional)          |
| `city_id`   | UUID      | Reference to cities table (optional)           |
| `unit_id`   | UUID      | Reference to units table (optional)            |
| `created_at`| TIMESTAMP | When the inquiry was submitted                 |
| `updated_at`| TIMESTAMP | When the inquiry was last updated              |

## Features

### Frontend (Contact Form)
- ✅ Collects customer name, email, phone, subject, and message
- ✅ Optional city dropdown (shows all available cities)
- ✅ Sends data to backend API
- ✅ Shows success/error messages
- ✅ Bilingual support (English/Arabic)

### Backend (API)
- ✅ Endpoint: `POST /make-server-74e21526/inquiries`
- ✅ Validates and saves data to Supabase
- ✅ Returns success/error response
- ✅ Uses SERVICE_ROLE_KEY for secure database access

### Admin Dashboard
- ✅ View all inquiries in **Admin > Inquiries** section
- ✅ Filter by city
- ✅ Filter by date (Today, Last 7 Days, Last 30 Days)
- ✅ View customer details (name, email, phone, city)
- ✅ Read full messages
- ✅ Delete inquiries
- ✅ See total inquiry count
- ✅ Shows when each inquiry was submitted

## Testing

After creating the table:

1. Go to your website's **Contact Us** page
2. Fill out the contact form
3. Submit the form
4. Go to **Admin Dashboard > Inquiries**
5. You should see your inquiry appear in the list

## Security

- ✅ Row Level Security (RLS) is enabled
- ✅ Public users can only INSERT inquiries
- ✅ Authenticated admin users can READ and DELETE inquiries
- ✅ Uses Supabase Auth for admin access control

## Troubleshooting

### Inquiry not appearing in admin dashboard?
- Check browser console for errors
- Verify the `inquiries` table exists in Supabase
- Make sure you're logged in to the admin dashboard
- Check Supabase logs for database errors

### "relation inquiries does not exist" error?
- You need to run the SQL migration (see Database Setup above)
- The table hasn't been created yet

### Can't delete inquiries?
- Make sure you're logged in as an admin user
- Check RLS policies are correctly set up
