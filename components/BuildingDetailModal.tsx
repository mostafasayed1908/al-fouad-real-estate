import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Layers, Square, Car, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { useLanguage } from '../contexts/LanguageContext';

interface GalleryImage {
  id: string;
  image_url: string;
  image_title_en?: string;
  image_title_ar?: string;
  display_order: number;
  image_type: string;
  is_featured: boolean;
}

interface TimelinePhase {
  id: string;
  phase_name_en: string;
  phase_name_ar: string;
  phase_description_en?: string;
  phase_description_ar?: string;
  phase_order: number;
  completion_percentage: number;
  phase_status: string;
  is_current_phase: boolean;
  milestone_icon?: string;
}

interface BuildingDetails {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  address?: string;
  address_ar?: string;
  cover_photo?: string;
  floors?: number;
  total_units?: number;
  available_units?: number;
  building_area_sqm?: number;
  building_area_sqft?: number;
  parking_spaces?: number;
  status?: string;
  delivery_status?: string;
  latitude?: number;
  longitude?: number;
  gallery?: GalleryImage[];
  timeline_phases?: TimelinePhase[];
}

interface BuildingDetailModalProps {
  buildingId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BuildingDetailModal({ buildingId, isOpen, onClose }: BuildingDetailModalProps) {
  const { language } = useLanguage();
  const [building, setBuilding] = useState<BuildingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'timeline'>('overview');

  useEffect(() => {
    if (isOpen && buildingId) {
      fetchBuildingDetails();
    }
  }, [isOpen, buildingId]);

  const fetchBuildingDetails = async () => {
    setLoading(true);
    try {
      // Fetch building basic info
      const { data: buildingData, error: buildingError } = await supabase
        .from('buildings')
        .select('*')
        .eq('id', buildingId)
        .maybeSingle();

      if (buildingError) throw buildingError;

      // Fetch gallery images
      const { data: galleryData } = await supabase
        .from('building_gallery')
        .select('*')
        .eq('building_id', buildingId)
        .order('display_order');

      // Fetch timeline phases
      const { data: timelineData } = await supabase
        .from('building_timeline_phases')
        .select('*')
        .eq('building_id', buildingId)
        .order('phase_order');

      setBuilding({
        ...buildingData,
        gallery: galleryData || [],
        timeline_phases: timelineData || []
      });
    } catch (error) {
      console.error('Error fetching building details:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (building?.gallery && building.gallery.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % building.gallery!.length);
    }
  };

  const prevImage = () => {
    if (building?.gallery && building.gallery.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + building.gallery!.length) % building.gallery!.length);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50';
      case 'delayed':
        return 'text-red-600 bg-red-50';
      case 'not_started':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in_progress':
        return Clock;
      case 'delayed':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-[1000px] max-h-[90vh] bg-white rounded-[20px] shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-[#666]" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#666]">Loading building details...</p>
            </div>
          </div>
        ) : building ? (
          <>
            {/* Header Image */}
            <div className="relative h-[300px] bg-gradient-to-br from-[#a74b48] to-[#8a3c39]">
              {building.cover_photo ? (
                <>
                  <img
                    src={building.cover_photo}
                    alt={language === 'ar' ? building.name_ar || building.name : building.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Layers className="w-24 h-24 text-white/20" />
                </div>
              )}
              
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-[36px] font-bold text-white mb-2">
                  {language === 'ar' ? building.name_ar || building.name : building.name}
                </h2>
                {building.address && (
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <p className="text-[14px]">
                      {language === 'ar' ? building.address_ar || building.address : building.address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6 bg-white">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-semibold text-[14px] border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-[#a74b48] text-[#a74b48]'
                    : 'border-transparent text-[#666] hover:text-black'
                }`}
              >
                {language === 'ar' ? 'نظرة عامة' : 'Overview'}
              </button>
              {building.gallery && building.gallery.length > 0 && (
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`px-6 py-4 font-semibold text-[14px] border-b-2 transition-colors ${
                    activeTab === 'gallery'
                      ? 'border-[#a74b48] text-[#a74b48]'
                      : 'border-transparent text-[#666] hover:text-black'
                  }`}
                >
                  {language === 'ar' ? 'المعرض' : 'Gallery'} ({building.gallery.length})
                </button>
              )}
              {building.timeline_phases && building.timeline_phases.length > 0 && (
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-6 py-4 font-semibold text-[14px] border-b-2 transition-colors ${
                    activeTab === 'timeline'
                      ? 'border-[#a74b48] text-[#a74b48]'
                      : 'border-transparent text-[#666] hover:text-black'
                  }`}
                >
                  {language === 'ar' ? 'الجدول الزمني' : 'Timeline'} ({building.timeline_phases.length})
                </button>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Description */}
                  {building.description && (
                    <div>
                      <h3 className="text-[18px] font-bold text-black mb-3">
                        {language === 'ar' ? 'الوصف' : 'Description'}
                      </h3>
                      <p className="text-[14px] text-[#666] leading-relaxed">
                        {language === 'ar' ? building.description_ar || building.description : building.description}
                      </p>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {building.floors && (
                      <div className="bg-[#F8F8F8] rounded-[16px] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Layers className="w-5 h-5 text-[#a74b48]" />
                          <p className="text-[12px] text-[#666]">
                            {language === 'ar' ? 'الطوابق' : 'Floors'}
                          </p>
                        </div>
                        <p className="text-[24px] font-bold text-black">{building.floors}</p>
                      </div>
                    )}

                    {building.total_units && (
                      <div className="bg-[#F8F8F8] rounded-[16px] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icons.Home className="w-5 h-5 text-[#a74b48]" />
                          <p className="text-[12px] text-[#666]">
                            {language === 'ar' ? 'إجمالي الوحدات' : 'Total Units'}
                          </p>
                        </div>
                        <p className="text-[24px] font-bold text-black">{building.total_units}</p>
                      </div>
                    )}

                    {building.available_units !== undefined && (
                      <div className="bg-[#F8F8F8] rounded-[16px] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <p className="text-[12px] text-[#666]">
                            {language === 'ar' ? 'الوحدات المتاحة' : 'Available Units'}
                          </p>
                        </div>
                        <p className="text-[24px] font-bold text-[#a74b48]">{building.available_units}</p>
                      </div>
                    )}

                    {building.building_area_sqm && (
                      <div className="bg-[#F8F8F8] rounded-[16px] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Square className="w-5 h-5 text-[#a74b48]" />
                          <p className="text-[12px] text-[#666]">
                            {language === 'ar' ? 'المساحة' : 'Area'}
                          </p>
                        </div>
                        <p className="text-[20px] font-bold text-black">
                          {building.building_area_sqm.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-[#999]">m²</p>
                      </div>
                    )}

                    {building.parking_spaces && (
                      <div className="bg-[#F8F8F8] rounded-[16px] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Car className="w-5 h-5 text-[#a74b48]" />
                          <p className="text-[12px] text-[#666]">
                            {language === 'ar' ? 'مواقف السيارات' : 'Parking Spaces'}
                          </p>
                        </div>
                        <p className="text-[24px] font-bold text-black">{building.parking_spaces}</p>
                      </div>
                    )}

                    {building.delivery_status && (
                      <div className="bg-[#F8F8F8] rounded-[16px] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-[#a74b48]" />
                          <p className="text-[12px] text-[#666]">
                            {language === 'ar' ? 'حالة التسليم' : 'Delivery Status'}
                          </p>
                        </div>
                        <p className="text-[14px] font-bold text-black capitalize">
                          {building.delivery_status.replace(/_/g, ' ')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Map Link */}
                  {building.latitude && building.longitude && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${building.latitude},${building.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-[#a74b48] text-white py-4 rounded-[12px] font-semibold hover:bg-[#8f3f3c] transition-all"
                    >
                      <MapPin className="w-5 h-5" />
                      {language === 'ar' ? 'الحصول على الاتجاهات' : 'Get Directions'}
                    </a>
                  )}
                </div>
              )}

              {/* Gallery Tab */}
              {activeTab === 'gallery' && building.gallery && building.gallery.length > 0 && (
                <div className="space-y-4">
                  {/* Main Image Carousel */}
                  <div className="relative h-[400px] bg-black rounded-[16px] overflow-hidden">
                    <img
                      src={building.gallery[currentImageIndex].image_url}
                      alt={building.gallery[currentImageIndex].image_title_en || 'Building image'}
                      className="w-full h-full object-contain"
                    />
                    
                    {building.gallery.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-6 h-6 text-black" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 text-white rounded-full text-[12px] font-semibold">
                      {currentImageIndex + 1} / {building.gallery.length}
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    {building.gallery.map((img, index) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative h-20 rounded-[8px] overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? 'border-[#a74b48] scale-105'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={img.image_url}
                          alt={img.image_title_en || ''}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Tab */}
              {activeTab === 'timeline' && building.timeline_phases && building.timeline_phases.length > 0 && (
                <div className="space-y-4">
                  {building.timeline_phases.map((phase, index) => {
                    const StatusIcon = getStatusIcon(phase.phase_status);
                    const IconComponent = phase.milestone_icon 
                      ? (Icons[phase.milestone_icon as keyof typeof Icons] as any)
                      : Calendar;
                    
                    return (
                      <div
                        key={phase.id}
                        className={`relative p-6 rounded-[16px] border-2 transition-all ${
                          phase.is_current_phase
                            ? 'border-[#a74b48] bg-[#a74b48]/5'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        {/* Phase Icon */}
                        <div className="absolute -left-4 top-6 w-12 h-12 bg-white border-4 border-[#a74b48] rounded-full flex items-center justify-center">
                          {IconComponent && <IconComponent className="w-5 h-5 text-[#a74b48]" />}
                        </div>

                        <div className="ml-10">
                          {/* Phase Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-[18px] font-bold text-black mb-1">
                                {language === 'ar' ? phase.phase_name_ar : phase.phase_name_en}
                              </h4>
                              {phase.phase_description_en && (
                                <p className="text-[13px] text-[#666]">
                                  {language === 'ar' ? phase.phase_description_ar || phase.phase_description_en : phase.phase_description_en}
                                </p>
                              )}
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-semibold ${getStatusColor(phase.phase_status)}`}>
                              <StatusIcon className="w-3 h-3" />
                              {phase.phase_status.replace(/_/g, ' ')}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[12px] text-[#666]">
                                {language === 'ar' ? 'التقدم' : 'Progress'}
                              </span>
                              <span className="text-[12px] font-bold text-[#a74b48]">
                                {phase.completion_percentage}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#a74b48] to-[#8a3c39] transition-all duration-300"
                                style={{ width: `${phase.completion_percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Connector Line */}
                        {index < building.timeline_phases!.length - 1 && (
                          <div className="absolute -bottom-4 left-2 w-0.5 h-8 bg-gray-300" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[500px]">
            <p className="text-[#666]">Building not found</p>
          </div>
        )}
      </div>
    </div>
  );
}