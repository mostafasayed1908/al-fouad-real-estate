import { useState, useEffect } from 'react';
import { Building2, Home, ChevronRight, MapPin, Maximize2, DollarSign, Camera, Users, TrendingUp, Award } from 'lucide-react';
import { 
  getCityById, 
  getBuildingsByCity, 
  getFeaturedUnits,
  formatPrice 
} from '../utils/supabase/queries';
import type { City, Building, Unit } from '../utils/supabase/client';
import { useLanguage } from '../contexts/LanguageContext';
import { LeafletMap } from './LeafletMap';

interface CityDetailsProps {
  cityId: string;
  onBackToHome: () => void;
  onViewBuilding: (buildingId: string) => void;
}

export function CityDetails({ cityId, onBackToHome, onViewBuilding }: CityDetailsProps) {
  const [city, setCity] = useState<City | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [featuredUnits, setFeaturedUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  // Fetch city and buildings on mount
  useEffect(() => {
    async function fetchCityData() {
      setLoading(true);
      const [cityData, buildingsData, featuredData] = await Promise.all([
        getCityById(cityId),
        getBuildingsByCity(cityId),
        getFeaturedUnits(cityId)
      ]);

      setCity(cityData);
      setBuildings(buildingsData);
      setFeaturedUnits(featuredData);
      setLoading(false);
    }

    fetchCityData();
  }, [cityId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666] text-[18px]">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen pt-32 px-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[32px] font-bold text-black mb-4">{t('cityDetails.notFound')}</h2>
          <button 
            onClick={onBackToHome}
            className="bg-[#a74b48] text-white px-6 py-3 rounded-[8px] hover:bg-[#8f3f3c] transition-colors"
          >
            {t('search.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-[#F8F8F8] pt-[120px] pb-6">
        <div className="max-w-[1440px] mx-auto px-[70px]">
          <div className="flex items-center gap-2 text-[14px]">
            <button onClick={onBackToHome} className="text-[#666] hover:text-[#a74b48] transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              {t('cityDetails.breadcrumb.home')}
            </button>
            <ChevronRight className="w-4 h-4 text-[#999]" />
            <span className="text-black font-medium">{city.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Image Gallery */}
      <div className="relative h-[500px] overflow-hidden">
        <img 
          src={city.hero_image || 'https://images.unsplash.com/photo-1599412965471-e5f860059f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920'} 
          alt={language === 'ar' && city.name_ar ? city.name_ar : city.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1440px] mx-auto px-[70px] w-full">
            <h1 className="text-white text-[56px] font-bold mb-4">
              {language === 'ar' && city.name_ar ? city.name_ar : city.name}
            </h1>
            {city.location && (
              <div className="flex items-center gap-2 mb-6 text-white/90">
                <MapPin className="w-6 h-6" />
                <span className="text-[20px]">{city.location}</span>
              </div>
            )}
            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                <Building2 className="w-5 h-5 text-white" />
                <div>
                  <p className="text-white/70 text-[12px]">{t('cityDetails.totalBuildings')}</p>
                  <p className="text-white font-bold text-[18px]">{city.total_buildings || buildings.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                <Home className="w-5 h-5 text-white" />
                <div>
                  <p className="text-white/70 text-[12px]">{t('cityDetails.availableUnits')}</p>
                  <p className="text-white font-bold text-[18px]">{city.available_units || buildings.reduce((sum, b) => sum + (b.available_units || 0), 0)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* City Overview Section */}
      <div className="max-w-[1440px] mx-auto px-[70px] py-20">
        {/* Description Section */}
        <div className="mb-20">
          <h2 className="text-[42px] font-bold text-black mb-6">{t('cityDetails.overview')}</h2>
          <p className="text-[18px] text-[#666] leading-relaxed max-w-[900px]">
            {language === 'ar' && city.description_ar ? city.description_ar : city.description}
          </p>
        </div>

        {/* Location Map Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="w-8 h-8 text-[#a74b48]" />
            <h2 className="text-[36px] font-bold text-black">{t('cityDetails.location')}</h2>
          </div>
          
          <div className="bg-white rounded-[24px] overflow-hidden shadow-lg">
            <div className="relative h-[450px] bg-gray-100">
              {city.latitude && city.longitude ? (
                <LeafletMap
                  center={[city.latitude, city.longitude]}
                  zoom={15}
                  markerTitle={language === 'ar' && city.name_ar ? city.name_ar : city.name}
                  markerPosition={[city.latitude, city.longitude]}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-[#999] mx-auto mb-4" />
                    <p className="text-[#666] text-[16px]">{t('cityDetails.noLocationData')}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-gradient-to-r from-[#a74b48]/5 to-transparent border-t border-gray-100">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-[#a74b48] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-[18px] font-bold text-black mb-2">
                    {language === 'ar' && city.name_ar ? city.name_ar : city.name}
                  </h3>
                  <p className="text-[15px] text-[#666]">{city.location || 'Cairo, Egypt'}</p>
                  {city.latitude && city.longitude && (
                    <p className="text-[13px] text-[#999] mt-1">
                      {t('cityDetails.coordinates')}: {city.latitude.toFixed(5)}, {city.longitude.toFixed(5)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buildings Cards Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#a74b48]" />
              <h2 className="text-[36px] font-bold text-black">{t('cityDetails.ourBuildings')}</h2>
            </div>
            <div className="flex items-center gap-2 text-[#666]">
              <span className="text-[16px]">{buildings.length} {t('cityDetails.building')}</span>
            </div>
          </div>

          {buildings.length === 0 ? (
            <div className="text-center py-16 bg-[#F8F8F8] rounded-[20px]">
              <Building2 className="w-16 h-16 text-[#999] mx-auto mb-4" />
              <p className="text-[#666] text-[18px]">{t('cityDetails.noBuildingsAvailable')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buildings.map((building) => (
                <div
                  key={building.id}
                  className="group bg-white rounded-[20px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-[#E5E5E5] hover:border-[#a74b48]"
                  onClick={() => onViewBuilding(building.id)}
                >
                  <div className="relative h-[240px] overflow-hidden">
                    <img 
                      src={building.gallery_image_1 || building.image || 'https://images.unsplash.com/photo-1757952854354-0b5495662b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'} 
                      alt={building.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    
                    {building.status === 'sold_out' ? (
                      <div className="absolute top-4 right-4">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-full text-[14px] font-bold shadow-lg">
                          {t('cityDetails.soldOut')}
                        </span>
                      </div>
                    ) : (
                      <div className="absolute top-4 right-4">
                        <span className="bg-green-600 text-white px-4 py-2 rounded-full text-[14px] font-bold shadow-lg">
                          {t('cityDetails.available')}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-[24px] font-bold mb-1">{building.name}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    {building.description && (
                      <p className="text-[14px] text-[#666] mb-4 line-clamp-2">{building.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="flex items-center gap-2 bg-[#F8F8F8] rounded-[12px] p-3">
                        <Building2 className="w-5 h-5 text-[#a74b48]" />
                        <div>
                          <p className="text-[11px] text-[#999]">{t('cityDetails.floors')}</p>
                          <p className="text-[15px] font-bold text-black">{building.floors}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-[#F8F8F8] rounded-[12px] p-3">
                        <Home className="w-5 h-5 text-[#a74b48]" />
                        <div>
                          <p className="text-[11px] text-[#999]">{t('cityDetails.units')}</p>
                          <p className="text-[15px] font-bold text-black">{building.available_units}</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      className={`w-full py-3 rounded-[12px] font-semibold text-[16px] transition-all ${
                        building.status === 'sold_out' 
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                          : 'bg-[#a74b48] text-white hover:bg-[#8f3f3c] hover:shadow-lg'
                      }`}
                      disabled={building.status === 'sold_out'}
                    >
                      {building.status === 'sold_out' ? t('cityDetails.soldOut') : t('cityDetails.viewUnits')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}