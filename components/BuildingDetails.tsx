import { useState, useEffect } from 'react';
import { Building2, MapPin, Home, BedDouble, Bath, Maximize2, DollarSign, ChevronRight, Calendar, Layers, TrendingUp, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { 
  getBuildingById, 
  getUnitsByBuilding,
  getCityById,
  formatPrice 
} from '../utils/supabase/queries';
import type { Building, Unit, City, MasterTimelinePhase, BuildingTimelinePhase } from '../utils/supabase/client';
import { useLanguage } from '../contexts/LanguageContext';
import { LeafletMap } from './LeafletMap';
import { supabase } from '../utils/supabase/client';

interface BuildingDetailsProps {
  buildingId: string;
  onBackToCity: () => void;
  onBackToHome: () => void;
  onViewUnit: (unitId: string) => void;
}

export function BuildingDetails({ buildingId, onBackToCity, onBackToHome, onViewUnit }: BuildingDetailsProps) {
  const [building, setBuilding] = useState<Building | null>(null);
  const [city, setCity] = useState<City | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [masterPhases, setMasterPhases] = useState<MasterTimelinePhase[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    async function fetchBuildingData() {
      setLoading(true);
      
      try {
        const buildingData = await getBuildingById(buildingId);
        
        if (buildingData) {
          setBuilding(buildingData);
          
          // Fetch related city
          const cityData = await getCityById(buildingData.city_id);
          setCity(cityData);
          
          // Fetch units
          const unitsData = await getUnitsByBuilding(buildingId);
          setUnits(unitsData);
          
          // Fetch master timeline phases
          const { data: masterPhasesData } = await supabase
            .from('timeline_phases')
            .select('*')
            .eq('is_active', true)
            .order('display_order');
          setMasterPhases(masterPhasesData || []);
          
          // Set first image as selected
          if (buildingData.gallery_image_1) {
            setSelectedImage(buildingData.gallery_image_1);
          } else if (buildingData.image) {
            setSelectedImage(buildingData.image);
          }
        }
      } catch (error) {
        console.error('Error fetching building:', error);
      }
      
      setLoading(false);
    }

    fetchBuildingData();
  }, [buildingId]);

  const getPhaseName = (phase: BuildingTimelinePhase) => {
    // For custom free-text phases (new system):
    // - Use phase_name_ar when language is Arabic
    // - Use phase_id (English name) otherwise
    if (phase.phase_id) {
      const name = language === 'ar' 
        ? (phase.phase_name_ar || phase.phase_id)  // Arabic name or fallback to English
        : phase.phase_id;  // English name
      
      return name;
    }
    
    // For legacy master phases (old system):
    // Try to find phase in master phases table
    const masterPhase = masterPhases.find(p => p.id === phase.phase_id);
    if (masterPhase) {
      return language === 'ar' ? masterPhase.name_ar : masterPhase.name;
    }
    
    // Fallback
    return phase.phase_id;
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-600 shadow-green-500/50';
      case 'in_progress':
        return 'bg-[#a74b48] border-[#8a3c39] shadow-[#a74b48]/50';
      case 'upcoming':
        return 'bg-gray-300 border-gray-400';
      default:
        return 'bg-gray-300 border-gray-400';
    }
  };

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-8 h-8 text-white" />;
      case 'in_progress':
        return <Loader2 className="w-8 h-8 text-white animate-spin" />;
      case 'upcoming':
        return <Calendar className="w-8 h-8 text-gray-600" />;
      default:
        return <Calendar className="w-8 h-8 text-gray-600" />;
    }
  };

  const getPhaseStatusText = (status: string) => {
    if (language === 'ar') {
      switch (status) {
        case 'completed': return 'مكتمل';
        case 'in_progress': return 'جاري التنفيذ';
        case 'upcoming': return 'لم يبدأ';
        default: return status;
      }
    } else {
      switch (status) {
        case 'completed': return 'Completed';
        case 'in_progress': return 'In Progress';
        case 'upcoming': return 'Upcoming';
        default: return status;
      }
    }
  };

  const getPhaseCardClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-2 border-green-200';
      case 'in_progress':
        return 'bg-[#a74b48]/5 border-2 border-[#a74b48] shadow-lg';
      case 'upcoming':
        return 'bg-gray-50 border-2 border-gray-200';
      default:
        return 'bg-gray-50 border-2 border-gray-200';
    }
  };

  const getPhaseStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in_progress':
        return 'bg-[#a74b48] text-white';
      case 'upcoming':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const timelinePhases = building?.timeline_phases || [];
  const hasTimeline = timelinePhases.length > 0;

  // Get gallery images from building data
  const galleryImages = building ? [
    (building as any).gallery_image_1,
    (building as any).gallery_image_2,
    (building as any).gallery_image_3,
    (building as any).gallery_image_4,
    (building as any).gallery_image_5,
    (building as any).gallery_image_6,
    (building as any).gallery_image_7,
    (building as any).gallery_image_8,
  ].filter(Boolean).map((url, index) => ({
    id: `${index}`,
    image_url: url,
    display_order: index,
    image_type: index === 0 ? 'exterior' : 'general',
    is_featured: index === 0
  })) : [];

  // Fallback images if no gallery images
  const displayImages = galleryImages.length > 0 ? galleryImages : [
    {
      id: '1',
      image_url: building?.image || 'https://images.unsplash.com/photo-1757952854354-0b5495662b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920',
      display_order: 0,
      image_type: 'exterior',
      is_featured: true
    },
    {
      id: '2',
      image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920',
      display_order: 1,
      image_type: 'exterior',
      is_featured: false
    },
    {
      id: '3',
      image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920',
      display_order: 2,
      image_type: 'interior',
      is_featured: false
    },
    {
      id: '4',
      image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920',
      display_order: 3,
      image_type: 'amenity',
      is_featured: false
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666] text-[18px]">{t('building.loading')}</p>
        </div>
      </div>
    );
  }

  if (!building || !city) {
    return (
      <div className="min-h-screen pt-32 px-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[32px] font-bold text-black mb-4">{t('building.notFound')}</h2>
          <button 
            onClick={onBackToHome}
            className="bg-[#a74b48] text-white px-6 py-3 rounded-[8px] hover:bg-[#8f3f3c] transition-colors"
          >
            {t('building.backToHome')}
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
              {t('building.home')}
            </button>
            <ChevronRight className="w-4 h-4 text-[#999]" />
            <button onClick={onBackToCity} className="text-[#666] hover:text-[#a74b48] transition-colors">
              {city.name}
            </button>
            <ChevronRight className="w-4 h-4 text-[#999]" />
            <span className="text-black font-medium">{building.name}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="max-w-[1440px] mx-auto px-[70px] pt-12">
        <div className="flex items-center gap-3 mb-6">
          <Maximize2 className="w-7 h-7 text-[#a74b48]" />
          <h2 className="text-[32px] font-bold text-black">{t('building.gallery')}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-12">
          {/* Main Image */}
          <div className="lg:col-span-3 relative h-[500px] rounded-[24px] overflow-hidden group">
            <img 
              src={selectedImage || 'https://images.unsplash.com/photo-1757952854354-0b5495662b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920'}
              alt={`${building.name} - Image ${selectedImage + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-[42px] font-bold mb-2">{building.name}</h1>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-[18px]">{city.name}</span>
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 lg:grid-cols-1 gap-4">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image.image_url)}
                className={`relative h-[115px] rounded-[16px] overflow-hidden transition-all ${
                  selectedImage === image.image_url 
                    ? 'ring-4 ring-[#a74b48] scale-105' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img 
                  src={image.image_url} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Building Description & Info */}
      <div className="bg-[#F8F8F8] py-16">
        <div className="max-w-[1440px] mx-auto px-[70px]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Description */}
            <div className="lg:col-span-2 bg-white rounded-[24px] p-8 shadow-sm">
              <h2 className="text-[28px] font-bold text-black mb-6">{t('building.aboutBuilding')}</h2>
              <p className="text-[16px] text-[#666] leading-relaxed mb-6">
                {building.description || `${building.name} is a premium residential building located in the heart of ${city.name}. This exceptional property offers modern amenities and superior construction quality, designed to provide the ultimate living experience for residents.`}
              </p>
              <p className="text-[16px] text-[#666] leading-relaxed">
                {t('building.descriptionExtra')}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-[#a74b48] to-[#8a3c39] rounded-[24px] p-8 text-white shadow-lg">
              <h3 className="text-[24px] font-bold mb-6">{t('building.quickStats')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/20">
                  <span className="text-white/80">{t('building.totalFloors')}</span>
                  <span className="text-[24px] font-bold">{building.floors}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-white/20">
                  <span className="text-white/80">{t('building.totalUnits')}</span>
                  <span className="text-[24px] font-bold">{building.available_units}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-white/20">
                  <span className="text-white/80">{t('building.buildingArea')}</span>
                  <span className="text-[24px] font-bold">12,500m²</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">{t('building.status')}</span>
                  <span className="text-[18px] font-semibold">{t('building.underConstruction')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Date Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-[20px] p-6 shadow-sm border-l-4 border-[#a74b48]">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-[#a74b48]" />
                <h3 className="text-[16px] font-bold text-black">{t('building.deliveryDate')}</h3>
              </div>
              <p className="text-[32px] font-bold text-[#a74b48]">Q2 2025</p>
              <p className="text-[14px] text-[#666] mt-2">{t('building.expectedDelivery')}</p>
            </div>

            <div className="bg-white rounded-[20px] p-6 shadow-sm border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h3 className="text-[16px] font-bold text-black">{t('building.constructionProgress')}</h3>
              </div>
              <p className="text-[32px] font-bold text-green-600">75%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-6 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <h3 className="text-[16px] font-bold text-black">{t('building.timeRemaining')}</h3>
              </div>
              <p className="text-[32px] font-bold text-blue-600">6 {t('building.months')}</p>
              <p className="text-[14px] text-[#666] mt-2">{t('building.untilCompletion')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Construction Timeline */}
      <div className="max-w-[1440px] mx-auto px-[70px] py-16">
        <div className="flex items-center gap-3 mb-12">
          <TrendingUp className="w-8 h-8 text-[#a74b48]" />
          <h2 className="text-[36px] font-bold text-black">{t('building.constructionTimeline')}</h2>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className={`absolute ${language === 'ar' ? 'right-8' : 'left-8'} top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-[#a74b48] to-gray-300`}></div>

          <div className="space-y-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {hasTimeline ? (
              timelinePhases.map((step, index) => (
                <div key={index} className="relative flex items-start gap-6 group">
                  {/* Timeline Dot */}
                  <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all ${getPhaseStatusColor(step.status)}`}>
                    {getPhaseIcon(step.status)}
                  </div>

                  {/* Timeline Content */}
                  <div className={`flex-1 rounded-[20px] p-6 transition-all ${getPhaseCardClass(step.status)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-[22px] font-bold text-black mb-1">{getPhaseName(step)}</h3>
                        <p className="text-[14px] text-[#666]">{step.description}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-[14px] font-semibold ${getPhaseStatusBadge(step.status)}`}>
                        {step.date ? step.date : getPhaseStatusText(step.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {step.status === 'completed' && (
                        <span className="text-[14px] text-green-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          {language === 'ar' ? 'مكتمل' : 'Completed'}
                        </span>
                      )}
                      {step.status === 'in_progress' && (
                        <span className="text-[14px] text-[#a74b48] font-semibold flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}
                        </span>
                      )}
                      {step.status === 'upcoming' && (
                        <span className="text-[14px] text-gray-600 font-semibold flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {language === 'ar' ? 'لم يبدأ' : 'Upcoming'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-[#F8F8F8] rounded-[20px]">
                <TrendingUp className="w-16 h-16 text-[#999] mx-auto mb-4" />
                <p className="text-[#666] text-[18px]">{t('building.noTimelineAvailable')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location Map */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <MapPin className="w-8 h-8 text-[#a74b48]" />
          <h2 className="text-[36px] font-bold text-black">{t('building.locationMap')}</h2>
        </div>

        <div className="bg-white rounded-[24px] overflow-hidden shadow-lg">
          <div className="relative h-[450px] bg-gray-100">
            {(building.latitude && building.longitude) || (city?.latitude && city?.longitude) ? (
              <LeafletMap
                center={[
                  building.latitude || city?.latitude || 30.0444,
                  building.longitude || city?.longitude || 31.2357
                ]}
                zoom={building.latitude ? 16 : 14}
                markerTitle={building.name}
                markerPosition={[
                  building.latitude || city?.latitude || 30.0444,
                  building.longitude || city?.longitude || 31.2357
                ]}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-[#999] mx-auto mb-4" />
                  <p className="text-[#666] text-[16px]">Location data not available</p>
                </div>
              </div>
            )}
          </div>
          <div className="p-6 bg-gradient-to-r from-[#a74b48]/5 to-transparent border-t border-gray-100">
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-[#a74b48] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-[18px] font-bold text-black mb-2">{building.name}</h3>
                <p className="text-[15px] text-[#666] mb-2">{building.address || city?.location || 'New Cairo, Egypt'}</p>
                {city && (
                  <p className="text-[13px] text-[#999]">
                    {language === 'ar' && city.name_ar ? city.name_ar : city.name}
                  </p>
                )}
                {(building.latitude && building.longitude) && (
                  <p className="text-[13px] text-[#999] mt-1">
                    {t('cityDetails.coordinates')}: {building.latitude.toFixed(5)}, {building.longitude.toFixed(5)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Units Section */}
      <div className="max-w-[1440px] mx-auto px-[70px] py-16">
        <div className="flex items-center gap-3 mb-8">
          <Home className="w-8 h-8 text-[#a74b48]" />
          <h2 className="text-[36px] font-bold text-black">{t('building.availableUnits')}</h2>
        </div>

        {units.length === 0 ? (
          <div className="text-center py-16 bg-[#F8F8F8] rounded-[20px]">
            <Home className="w-16 h-16 text-[#999] mx-auto mb-4" />
            <p className="text-[#666] text-[18px]">{t('building.noUnitsAvailable')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-[16px] border-2 border-[#E5E5E5] p-6 hover:border-[#a74b48] hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[20px] font-bold text-black">{unit.unit_number}</p>
                    <p className="text-[14px] text-[#666] mt-1">{t('building.floor')} {unit.floor}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                    unit.payment_type === 'Cash' 
                      ? 'bg-green-100 text-green-700' 
                      : unit.payment_type === 'Installments'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {unit.payment_type}
                  </span>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-[#666]">{t('building.area')}:</span>
                    <span className="font-semibold text-black">{unit.area} sqm</span>
                  </div>
                  {unit.bedrooms && (
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-[#666]">{t('building.bedrooms')}:</span>
                      <span className="font-semibold text-black">{unit.bedrooms}</span>
                    </div>
                  )}
                  {unit.bathrooms && (
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-[#666]">{t('building.bathrooms')}:</span>
                      <span className="font-semibold text-black">{unit.bathrooms}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-[#666]">{t('building.price')}:</span>
                    <span className="font-bold text-[#a74b48]">{formatPrice(unit.price, unit.price_currency)}</span>
                  </div>
                  {unit.installment_years && (
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#666]">{t('building.installment')}:</span>
                      <span className="text-[#666]">{unit.installment_years} {t('building.years')}</span>
                    </div>
                  )}
                </div>

                <button 
                  className="w-full bg-[#a74b48] text-white py-3 rounded-[12px] font-semibold hover:bg-[#8f3f3c] hover:shadow-lg transition-all" 
                  onClick={() => onViewUnit(unit.id)}
                >
                  {t('building.viewDetails')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}