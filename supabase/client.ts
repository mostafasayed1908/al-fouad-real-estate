import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Create a singleton Supabase client
export const supabase = createSupabaseClient(supabaseUrl, publicAnonKey);

// Type definitions for our database
export interface City {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  hero_image: string | null;
  location: string | null;
  latitude: number;
  longitude: number;
  total_units: number;
  available_units: number;
  total_buildings?: number;
  status: 'active' | 'upcoming' | 'completed' | 'sold_out';
  created_at: string;
  updated_at: string;
}

export interface Building {
  id: string;
  city_id: string;
  name: string;
  floors?: number;
  total_units?: number;
  available_units?: number;
  image?: string;
  gallery_image_1?: string;
  description?: string;
  description_ar?: string;
  status?: 'available' | 'coming_soon' | 'sold_out';
  address?: string;
  latitude?: number;
  longitude?: number;
  timeline_phases?: BuildingTimelinePhase[];
  created_at?: string;
  updated_at?: string;
}

// Master timeline phase from database
export interface MasterTimelinePhase {
  id: string;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  typical_duration_days?: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Building's timeline phase (references master phase + adds status)
export interface BuildingTimelinePhase {
  phase_id: string; // Phase name in English
  phase_name_ar?: string; // Phase name in Arabic
  status: 'completed' | 'in_progress' | 'upcoming';
  order: number;
}

export interface Unit {
  id: string;
  building_id: string;
  city_id: string;
  unit_number: string;
  area: number;
  floor: number;
  bedrooms: number | null;
  bathrooms: number | null;
  payment_type: 'Cash' | 'Installments' | 'Both';
  price: number;
  price_currency: string;
  installment_years: number | null;
  down_payment_percentage: number | null;
  image: string | null;
  images: string[] | null;
  is_featured: boolean;
  status: 'available' | 'reserved' | 'sold';
  created_at: string;
  updated_at: string;
}

export interface SearchQuery {
  location: string | null;
  min_price: number | null;
  max_price: number | null;
  payment_type: string | null;
  installment_years: number | null;
}

export interface Inquiry {
  name: string;
  email: string;
  phone: string | null;
  city_id: string | null;
  unit_id: string | null;
  message: string | null;
}