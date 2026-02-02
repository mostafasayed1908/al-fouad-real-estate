import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../utils/supabase/client';
import type { Building, MasterTimelinePhase, BuildingTimelinePhase } from '../utils/supabase/client';
import { Building2, Clock, CheckCircle2, Loader2, Calendar, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

interface ConstructionTimelineProps {
  onNavigateHome: () => void;
}

export function ConstructionTimeline({ onNavigateHome }: ConstructionTimelineProps) {
  const { dir, t, language } = useLanguage();
  const isRTL = dir === 'rtl';
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [masterPhases, setMasterPhases] = useState<MasterTimelinePhase[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch cities
    const { data: citiesData } = await supabase
      .from('cities')
      .select('*')
      .order('name');
    setCities(citiesData || []);

    // Fetch master timeline phases
    const { data: masterPhasesData } = await supabase
      .from('timeline_phases')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    setMasterPhases(masterPhasesData || []);

    // Fetch buildings with timeline phases
    const { data: buildingsData } = await supabase
      .from('buildings')
      .select('*')
      .not('timeline_phases', 'is', null)
      .order('created_at', { ascending: false });

    // Debug: Check what data is coming from database
    console.log('Buildings data from Supabase:', buildingsData);
    if (buildingsData && buildingsData.length > 0) {
      console.log('First building timeline_phases (raw):', buildingsData[0].timeline_phases);
      console.log('Type of timeline_phases:', typeof buildingsData[0].timeline_phases);
    }

    // Filter buildings that have timeline phases and parse JSON if needed
    const buildingsWithTimeline = (buildingsData || [])
      .map((b: any) => {
        // Parse timeline_phases if it's a string (shouldn't be, but just in case)
        if (b.timeline_phases && typeof b.timeline_phases === 'string') {
          try {
            b.timeline_phases = JSON.parse(b.timeline_phases);
            console.log('Parsed timeline_phases from string:', b.timeline_phases);
          } catch (e) {
            console.error('Error parsing timeline_phases:', e);
          }
        }
        return b;
      })
      .filter((b: Building) => b.timeline_phases && Array.isArray(b.timeline_phases) && b.timeline_phases.length > 0);
    
    console.log('Buildings with timeline after processing:', buildingsWithTimeline);
    if (buildingsWithTimeline.length > 0) {
      console.log('First building phases after processing:', buildingsWithTimeline[0].timeline_phases);
    }
    
    // Set debug info to display on screen
    if (buildingsWithTimeline.length > 0) {
      const firstBuilding = buildingsWithTimeline[0];
      const firstPhase = firstBuilding.timeline_phases[0];
      setDebugInfo({
        buildingName: firstBuilding.name,
        phasesCount: firstBuilding.timeline_phases.length,
        firstPhase: {
          phase_id: firstPhase.phase_id,
          phase_name_ar: firstPhase.phase_name_ar,
          status: firstPhase.status,
          hasArabicName: !!firstPhase.phase_name_ar,
          allKeys: Object.keys(firstPhase)
        },
        rawJSON: JSON.stringify(firstPhase, null, 2)
      });
    }
    
    setBuildings(buildingsWithTimeline);
    setLoading(false);
  };

  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    return city ? (language === 'ar' ? city.name_ar || city.name : city.name) : cityId;
  };

  const getPhaseName = (phase: BuildingTimelinePhase) => {
    // Debug: Log the phase object to see what data we're getting
    console.log('Phase data:', phase);
    console.log('Language:', language);
    console.log('phase_name_ar:', phase.phase_name_ar);
    console.log('phase_id:', phase.phase_id);
    
    // For custom free-text phases (new system):
    // - Use phase_name_ar when language is Arabic
    // - Use phase_id (English name) otherwise
    if (phase.phase_id) {
      const arabicName = language === 'ar' 
        ? (phase.phase_name_ar || phase.phase_id)  // Arabic name or fallback to English
        : phase.phase_id;  // English name
      
      console.log('Returning:', arabicName);
      return arabicName;
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
        return 'bg-green-100 text-green-700 border-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'upcoming':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'upcoming':
        return <Clock className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getPhaseStatusText = (status: string) => {
    if (language === 'ar') {
      switch (status) {
        case 'completed': return 'مكتمل';
        case 'in_progress': return 'جاري التنفيذ';
        case 'upcoming': return 'قادم';
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

  const getProgressPercentage = (phases: BuildingTimelinePhase[]) => {
    if (!phases || phases.length === 0) return 0;
    const completed = phases.filter(p => p.status === 'completed').length;
    return Math.round((completed / phases.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666] text-[18px]">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header Section */}
      <div className="bg-[#a74b48] text-white py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Breadcrumb */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <Calendar className="w-12 h-12" />
            <h1 className="text-[42px] font-bold">
              {language === 'ar' ? 'الجدول الزمني للإنشاءات' : 'Construction Timeline'}
            </h1>
          </div>
          <p className="text-[18px] text-white/90 max-w-[800px]">
            {language === 'ar' 
              ? 'تابع التقدم الإنشائي لجميع مشاريعنا الحالية والقادمة'
              : 'Track the construction progress of all our current and upcoming projects'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Debug Panel - Temporary for Testing */}
        {debugInfo && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-8" dir="ltr">
            <h3 className="text-[18px] font-bold text-yellow-900 mb-4">🔍 DEBUG INFO (Current Language: {language})</h3>
            <div className="space-y-2 text-[14px] text-yellow-900 font-mono">
              <p><strong>Building:</strong> {debugInfo.buildingName}</p>
              <p><strong>Phases Count:</strong> {debugInfo.phasesCount}</p>
              <p><strong>First Phase ID:</strong> {debugInfo.firstPhase.phase_id}</p>
              <p><strong>First Phase Arabic Name:</strong> {debugInfo.firstPhase.phase_name_ar || 'NOT FOUND'}</p>
              <p><strong>Has Arabic Name?:</strong> {debugInfo.firstPhase.hasArabicName ? '✅ YES' : '❌ NO'}</p>
              <p><strong>All Keys in Phase Object:</strong> {debugInfo.firstPhase.allKeys.join(', ')}</p>
              <div className="mt-4">
                <strong>Raw JSON:</strong>
                <pre className="bg-white p-2 rounded mt-2 text-[12px] overflow-auto max-h-[200px]">{debugInfo.rawJSON}</pre>
              </div>
            </div>
          </div>
        )}

        {buildings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-[24px] font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا توجد جداول زمنية متاحة' : 'No Timelines Available'}
            </h3>
            <p className="text-[16px] text-gray-500">
              {language === 'ar' 
                ? 'لا توجد مباني مع جداول زمنية للإنشاءات حالياً'
                : 'There are no buildings with construction timelines at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {buildings.map((building) => {
              const phases = building.timeline_phases || [];
              const progress = getProgressPercentage(phases);
              const isExpanded = selectedBuilding === building.id;

              return (
                <div
                  key={building.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Building Header */}
                  <div 
                    className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 cursor-pointer"
                    onClick={() => setSelectedBuilding(isExpanded ? null : building.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Building2 className="w-8 h-8 text-[#a74b48]" />
                          <h2 className="text-[28px] font-bold text-black">
                            {building.name}
                          </h2>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-[14px] text-gray-600 mb-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {getCityName(building.city_id)}
                          </span>
                          {building.address && (
                            <span>{building.address}</span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${
                            building.status === 'available' ? 'bg-green-100 text-green-700' :
                            building.status === 'coming_soon' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {building.status === 'available' ? (language === 'ar' ? 'متاح' : 'Available') :
                             building.status === 'coming_soon' ? (language === 'ar' ? 'قريباً' : 'Coming Soon') :
                             (language === 'ar' ? 'مباع' : 'Sold Out')}
                          </span>
                        </div>

                        {building.description && (
                          <p className="text-[14px] text-gray-600 mb-4 line-clamp-2">
                            {language === 'ar' ? building.description_ar || building.description : building.description}
                          </p>
                        )}

                        {/* Progress Bar */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[14px] font-semibold text-gray-700">
                              {language === 'ar' ? 'نسبة الإنجاز' : 'Progress'}
                            </span>
                            <span className="text-[18px] font-bold text-[#a74b48]">{progress}%</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#a74b48] to-[#d45d59] transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Phase Summary */}
                        <div className="flex items-center gap-4 text-[14px]">
                          <span className="text-green-600 font-semibold">
                            ✓ {phases.filter(p => p.status === 'completed').length} {language === 'ar' ? 'مكتمل' : 'Completed'}
                          </span>
                          <span className="text-blue-600 font-semibold">
                            ⟳ {phases.filter(p => p.status === 'in_progress').length} {language === 'ar' ? 'جاري' : 'In Progress'}
                          </span>
                          <span className="text-gray-600 font-semibold">
                            ○ {phases.filter(p => p.status === 'upcoming').length} {language === 'ar' ? 'قادم' : 'Upcoming'}
                          </span>
                        </div>
                      </div>

                      {/* Expand/Collapse Icon */}
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Timeline Phases - Expandable */}
                  {isExpanded && (
                    <div className="p-6">
                      <h3 className="text-[20px] font-bold text-black mb-6 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-[#a74b48]" />
                        {language === 'ar' ? 'مراحل التنفيذ' : 'Construction Phases'}
                      </h3>

                      {/* Timeline Vertical */}
                      <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute top-0 bottom-0 w-1 bg-gray-200" style={{ [isRTL ? 'right' : 'left']: '20px' }} />

                        <div className="space-y-6">
                          {phases.map((phase, index) => {
                            const phaseName = getPhaseName(phase);
                            const statusColor = getPhaseStatusColor(phase.status);
                            const statusIcon = getPhaseIcon(phase.status);
                            const statusText = getPhaseStatusText(phase.status);

                            return (
                              <div key={index} className={`relative flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {/* Phase Number Circle */}
                                <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                                  phase.status === 'completed' ? 'bg-green-500' :
                                  phase.status === 'in_progress' ? 'bg-blue-500' :
                                  'bg-gray-400'
                                }`}>
                                  {phase.status === 'completed' ? '✓' : index + 1}
                                </div>

                                {/* Phase Content */}
                                <div className={`flex-1 bg-white border-2 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow ${statusColor.replace('text-', 'border-').split(' ')[0]}`}>
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <h4 className="text-[18px] font-bold text-black mb-2">
                                        {phaseName}
                                      </h4>
                                      {masterPhases.find(p => p.id === phase.phase_id)?.description && (
                                        <p className="text-[14px] text-gray-600">
                                          {language === 'ar' 
                                            ? masterPhases.find(p => p.id === phase.phase_id)?.description_ar 
                                            : masterPhases.find(p => p.id === phase.phase_id)?.description}
                                        </p>
                                      )}
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${statusColor}`}>
                                      {statusIcon}
                                      <span className="text-[14px] font-bold whitespace-nowrap">
                                        {statusText}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}