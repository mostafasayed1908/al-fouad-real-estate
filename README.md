# 🏢 Al-Fouad Real Estate Investment

A modern, bilingual real estate investment platform built with React, TypeScript, and Supabase.

## ✨ Features

- 🌍 **Bilingual Support** - Full Arabic (RTL) and English support with language toggle
- 🏙️ **Cities & Buildings Management** - Comprehensive city and building catalog
- 🏠 **Unit Listings** - Detailed property units with specifications
- 💰 **Payment Calculator** - Interactive installment calculator
- 🔍 **Advanced Search** - Filter by price, area, payment type
- 📊 **Admin Dashboard** - Complete CMS for managing content
- 🗺️ **Interactive Maps** - Integrated location maps
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Modern UI** - Clean design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Backend:** Supabase Edge Functions (Deno)
- **Authentication:** Supabase Auth
- **Icons:** Lucide React
- **State Management:** React Context API

## 📦 Project Structure

```
/
├── components/          # React components
│   ├── Navbar.tsx
│   ├── CityDetails.tsx
│   ├── BuildingDetails.tsx
│   ├── UnitDetails.tsx
│   └── ...
├── admin/              # Admin dashboard components
│   ├── AdminDashboard.tsx
│   ├── CitiesManager.tsx
│   ├── BuildingsManager.tsx
│   └── ...
├── contexts/           # React contexts
│   └── LanguageContext.tsx
├── utils/              # Utilities
│   └── supabase/
│       ├── client.ts
│       └── queries.ts
├── supabase/           # Supabase configuration
│   └── functions/
│       └── server/
└── styles/             # Global styles
    └── globals.css
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/al-fouad-real-estate.git
cd al-fouad-real-estate
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with your Supabase credentials (already configured in Figma Make)

4. Run database migrations:
Execute the SQL scripts in Supabase Dashboard to create tables:
- cities
- buildings
- units
- inquiries
- timeline_phases

5. Start development server:
```bash
npm run dev
```

## 🗄️ Database Schema

### Cities Table
- id (TEXT, PK)
- name, name_ar
- description, description_ar
- location, latitude, longitude
- status, created_at, updated_at

### Buildings Table
- id (TEXT, PK)
- city_id (FK → cities)
- name, name_ar, floors
- description, description_ar
- timeline_phases (JSONB)
- latitude, longitude

### Units Table
- id (TEXT, PK)
- building_id (FK → buildings)
- city_id (FK → cities)
- unit_number, area, floor
- bedrooms, bathrooms
- price, payment_type
- status, is_featured

## 👤 Admin Access

Access the admin dashboard at `/admin` route.

**Default credentials:**
- Email: admin@alfouad.com
- Password: admin123

⚠️ **Important:** Change default credentials in production!

## 🌐 Deployment

This project is built with Figma Make and can be deployed to:
- Vercel
- Netlify
- Supabase Hosting
- Any static hosting service

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For inquiries, please contact: info@alfouad.com

---

Built with ❤️ using [Figma Make](https://www.figma.com)
