import { useState, useEffect } from 'react';
import { Search, MapPin, BedDouble, Bath, Maximize2, X } from 'lucide-react';
import { getCities, formatPrice, logSearchQuery } from '../utils/supabase/queries';
import { supabase } from '../utils/supabase/client';
import type { Unit, City } from '../utils/supabase/client';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchResultsProps {
  onBackToHome: () => void;
  onViewUnit: (unitId: string) => void;
  initialFilters?: SearchFilters;
}

export interface SearchFilters {
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
}

export function SearchResults({ onBackToHome, onViewUnit, initialFilters }: SearchResultsProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [results, setResults] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {});

  useEffect(() => {
    async function fetchCities() {
      const citiesData = await getCities();
      setCities(citiesData);
    }
    fetchCities();
  }, []);

  useEffect(() => {
    performSearch();
  }, [filters]);

  const performSearch = async () => {
    setLoading(true);

    // Log search query for analytics
    await logSearchQuery({
      location: filters.location || null,
      min_price: null,
      max_price: null,
      payment_type: null,
      installment_years: null
    });

    // Find city ID by location if location is specified
    let cityId: string | undefined;
    if (filters.location) {
      const city = cities.find(
        (c) => c.name.toLowerCase().includes(filters.location!.toLowerCase()) ||
               c.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
      cityId = city?.id;
    }

    // Fetch all units
    let query = supabase
      .from('units')
      .select('*')
      .eq('status', 'available');

    // Apply filters
    if (cityId) {
      query = query.eq('city_id', cityId);
    }

    if (filters.bedrooms) {
      query = query.eq('bedrooms', filters.bedrooms);
    }

    if (filters.bathrooms) {
      query = query.eq('bathrooms', filters.bathrooms);
    }

    if (filters.floor) {
      query = query.eq('floor', filters.floor);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching units:', error);
      setResults([]);
    } else {
      setResults(data || []);
    }

    setLoading(false);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const getCityName = (cityId: string) => {
    return cities.find((c) => c.id === cityId)?.name || '';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F8F8F8] pt-[120px] pb-8">
        <div className="max-w-[1440px] mx-auto px-[70px]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[40px] font-bold text-black">Search Properties</h1>
            <button
              onClick={onBackToHome}
              className="text-[#a74b48] hover:text-[#8f3f3c] font-medium transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white border-b border-[#E5E5E5] sticky top-[88px] z-40 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-[70px] py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Location Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#666] font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <select
                value={filters.location || ''}
                onChange={(e) => setFilters({ ...filters, location: e.target.value || undefined })}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[8px] text-[16px] focus:outline-none focus:border-[#a74b48] transition-colors bg-white"
              >
                <option value="">All Locations</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.location || city.name}>
                    {city.location || city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#666] font-medium flex items-center gap-2">
                <BedDouble className="w-4 h-4" />
                Bedrooms
              </label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => setFilters({ ...filters, bedrooms: Number(e.target.value) || undefined })}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[8px] text-[16px] focus:outline-none focus:border-[#a74b48] transition-colors bg-white"
              >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#666] font-medium flex items-center gap-2">
                <Bath className="w-4 h-4" />
                Bathrooms
              </label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => setFilters({ ...filters, bathrooms: Number(e.target.value) || undefined })}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[8px] text-[16px] focus:outline-none focus:border-[#a74b48] transition-colors bg-white"
              >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            {/* Floor */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#666] font-medium flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                Floor
              </label>
              <select
                value={filters.floor || ''}
                onChange={(e) => setFilters({ ...filters, floor: Number(e.target.value) || undefined })}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[8px] text-[16px] focus:outline-none focus:border-[#a74b48] transition-colors bg-white"
              >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 border-2 border-[#E5E5E5] text-[#666] px-6 py-3 rounded-[8px] font-semibold hover:border-[#a74b48] hover:text-[#a74b48] transition-colors"
            >
              <X className="w-5 h-5" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[1440px] mx-auto px-[70px] py-12">
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-[28px] font-bold text-black mb-2">
            {loading ? 'Searching...' : `${results.length} Properties Found`}
          </h2>
          <p className="text-[16px] text-[#666]">
            {filters.location && `in ${filters.location}`}
            {filters.bedrooms && ` • ${filters.bedrooms} Bedrooms`}
            {filters.bathrooms && ` • ${filters.bathrooms} Bathrooms`}
            {filters.floor && ` • Floor ${filters.floor}`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#666] text-[18px]">Searching properties...</p>
            </div>
          </div>
        ) : results.length === 0 ? (
          /* No Results */
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#F8F8F8] rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-[#999]" />
            </div>
            <h3 className="text-[24px] font-bold text-black mb-3">No Properties Found</h3>
            <p className="text-[16px] text-[#666] mb-6">
              Try adjusting your search filters to find more properties
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-[#a74b48] text-white px-8 py-3 rounded-[8px] font-semibold hover:bg-[#8f3f3c] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Results Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-[16px] border border-[#E5E5E5] overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => onViewUnit(unit.id)}
              >
                <div className="relative h-[240px] overflow-hidden">
                  <img
                    src={unit.image || 'https://images.unsplash.com/photo-1738168246881-40f35f8aba0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'}
                    alt={unit.unit_number}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-[20px] font-bold">{unit.unit_number}</h3>
                    <p className="text-white/90 text-[14px]">{getCityName(unit.city_id)}</p>
                  </div>
                  {unit.is_featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#a74b48] text-white px-3 py-1 rounded-full text-[12px] font-semibold">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                      unit.payment_type === 'Cash'
                        ? 'bg-green-100 text-green-700'
                        : unit.payment_type === 'Installments'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {unit.payment_type}
                    </span>
                    <span className="text-[14px] text-[#666]">Floor {unit.floor}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-[14px] text-[#666]">
                    <div className="text-center">
                      <p className="font-semibold text-black">{unit.area}</p>
                      <p className="text-[12px]">sqm</p>
                    </div>
                    {unit.bedrooms && (
                      <div className="text-center">
                        <p className="font-semibold text-black">{unit.bedrooms}</p>
                        <p className="text-[12px]">Bedrooms</p>
                      </div>
                    )}
                    {unit.bathrooms && (
                      <div className="text-center">
                        <p className="font-semibold text-black">{unit.bathrooms}</p>
                        <p className="text-[12px]">Bathrooms</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#E5E5E5] pt-4">
                    <p className="text-[14px] text-[#666] mb-1">Price</p>
                    <p className="text-[28px] font-bold text-[#a74b48]">
                      {formatPrice(unit.price, unit.price_currency)}
                    </p>
                    {unit.installment_years && (
                      <p className="text-[12px] text-[#666] mt-1">
                        Up to {unit.installment_years} years installment
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}