import { supabase, City, Building, Unit, SearchQuery, Inquiry } from './client';

// =====================================================
// CITY QUERIES
// =====================================================

export async function getCities() {
  const { data: citiesData, error } = await supabase
    .from('cities')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  // Enrich cities with computed total_buildings and total_units from actual tables
  const enrichedCities = await Promise.all(
    (citiesData || []).map(async (city) => {
      // Get total buildings for this city
      const { count: buildingsCount } = await supabase
        .from('buildings')
        .select('*', { count: 'exact', head: true })
        .eq('city_id', city.id);

      // Get total units for this city
      const { count: totalUnitsCount } = await supabase
        .from('units')
        .select('*', { count: 'exact', head: true })
        .eq('city_id', city.id);

      // Get available units for this city
      const { count: availableUnitsCount } = await supabase
        .from('units')
        .select('*', { count: 'exact', head: true })
        .eq('city_id', city.id)
        .eq('status', 'available');

      return {
        ...city,
        total_buildings: buildingsCount || 0,
        total_units: totalUnitsCount || 0,
        available_units: availableUnitsCount || 0,
      };
    })
  );

  return enrichedCities as City[];
}

export async function getCityById(cityId: string) {
  if (!cityId) {
    return null;
  }

  const { data: cityData, error } = await supabase
    .from('cities')
    .select('*')
    .eq('id', cityId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching city:', error);
    return null;
  }

  if (!cityData) {
    return null;
  }

  // Enrich city with computed total_buildings and total_units from actual tables
  const { count: buildingsCount } = await supabase
    .from('buildings')
    .select('*', { count: 'exact', head: true })
    .eq('city_id', cityData.id);

  const { count: totalUnitsCount } = await supabase
    .from('units')
    .select('*', { count: 'exact', head: true })
    .eq('city_id', cityData.id);

  const { count: availableUnitsCount } = await supabase
    .from('units')
    .select('*', { count: 'exact', head: true })
    .eq('city_id', cityData.id)
    .eq('status', 'available');

  return {
    ...cityData,
    total_buildings: buildingsCount || 0,
    total_units: totalUnitsCount || 0,
    available_units: availableUnitsCount || 0,
  } as City;
}

// =====================================================
// BUILDING QUERIES
// =====================================================

export async function getBuildingsByCity(cityId: string) {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('city_id', cityId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching buildings:', error);
    return [];
  }

  // Enrich buildings with unit counts
  const enrichedBuildings = await Promise.all(
    (data || []).map(async (building) => {
      const { count: totalUnitsCount } = await supabase
        .from('units')
        .select('*', { count: 'exact', head: true })
        .eq('building_id', building.id);

      const { count: availableUnitsCount } = await supabase
        .from('units')
        .select('*', { count: 'exact', head: true })
        .eq('building_id', building.id)
        .eq('status', 'available');

      return {
        ...building,
        total_units: totalUnitsCount || 0,
        available_units: availableUnitsCount || 0,
      };
    })
  );

  return enrichedBuildings as Building[];
}

export async function getBuildingById(buildingId: string) {
  if (!buildingId) {
    return null;
  }

  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('id', buildingId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching building:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  // Enrich building with unit counts
  const { count: totalUnitsCount } = await supabase
    .from('units')
    .select('*', { count: 'exact', head: true })
    .eq('building_id', buildingId);

  const { count: availableUnitsCount } = await supabase
    .from('units')
    .select('*', { count: 'exact', head: true })
    .eq('building_id', buildingId)
    .eq('status', 'available');

  return {
    ...data,
    total_units: totalUnitsCount || 0,
    available_units: availableUnitsCount || 0,
  } as Building;
}

// =====================================================
// UNIT QUERIES
// =====================================================

export async function getUnitsByCity(cityId: string) {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .eq('city_id', cityId)
    .eq('status', 'available')
    .order('unit_number', { ascending: true });

  if (error) {
    console.error('Error fetching units:', error);
    return [];
  }

  return data as Unit[];
}

export async function getUnitsByBuilding(buildingId: string) {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .eq('building_id', buildingId)
    .eq('status', 'available')
    .order('floor', { ascending: true });

  if (error) {
    console.error('Error fetching units by building:', error);
    return [];
  }

  return data as Unit[];
}

export async function getUnitById(unitId: string) {
  if (!unitId) {
    return null;
  }

  const { data, error } = await supabase
    .from('units')
    .select('*')
    .eq('id', unitId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching unit:', error);
    return null;
  }

  return data as Unit | null;
}

export async function getFeaturedUnits(cityId: string) {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .eq('city_id', cityId)
    .eq('is_featured', true)
    .eq('status', 'available')
    .limit(3);

  if (error) {
    console.error('Error fetching featured units:', error);
    return [];
  }

  return data as Unit[];
}

export async function searchUnits(filters: {
  cityId?: string;
  minPrice?: number;
  maxPrice?: number;
  paymentType?: string;
  minArea?: number;
  maxArea?: number;
  installmentYears?: number;
}) {
  let query = supabase
    .from('units')
    .select('*')
    .eq('status', 'available');

  if (filters.cityId) {
    query = query.eq('city_id', filters.cityId);
  }

  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters.paymentType && filters.paymentType !== 'all') {
    query = query.or(`payment_type.eq.${filters.paymentType},payment_type.eq.Both`);
  }

  if (filters.installmentYears) {
    query = query.gte('installment_years', filters.installmentYears);
  }

  if (filters.minArea) {
    query = query.gte('area', filters.minArea);
  }

  if (filters.maxArea) {
    query = query.lte('area', filters.maxArea);
  }

  const { data, error } = await query.order('price', { ascending: true });

  if (error) {
    console.error('Error searching units:', error);
    return [];
  }

  return data as Unit[];
}

// =====================================================
// ANALYTICS QUERIES
// =====================================================

export async function logSearchQuery(searchQuery: SearchQuery) {
  const { error } = await supabase
    .from('search_queries')
    .insert([searchQuery]);

  if (error) {
    console.error('Error logging search query:', error);
  }
}

// =====================================================
// INQUIRY QUERIES
// =====================================================

export async function submitInquiry(inquiry: Inquiry) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([inquiry])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error submitting inquiry:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

// =====================================================
// SUMMARY QUERIES
// =====================================================

export async function getProjectSummary(projectId: string) {
  if (!projectId) {
    return null;
  }

  const { data, error } = await supabase
    .from('projects_summary')
    .select('*')
    .eq('id', projectId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching project summary:', error);
    return null;
  }

  return data;
}

// =====================================================
// TIMELINE PHASES QUERIES
// =====================================================

export async function getTimelinePhases() {
  const { data, error } = await supabase
    .from('timeline_phases')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching timeline phases:', error);
    return [];
  }

  return data;
}

// Helper function to format price
export function formatPrice(price: number, currency: string = 'EGP'): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M ${currency}`;
  }
  return `${price.toLocaleString()} ${currency}`;
}
