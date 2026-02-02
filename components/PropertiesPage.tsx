import { useState, useEffect } from 'react';
import { Building2, MapPin, Maximize2, Home, Filter, X, ChevronDown, Search, Grid3x3, List, BedDouble, Bath, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../utils/supabase/client';
import type { Unit, Building, Project } from '../utils/supabase/client';
import { formatPrice } from '../utils/supabase/queries';

interface PropertiesPageProps {
  onViewUnit: (unitId: string) => void;
  onNavigateHome: () => void;
}

export function PropertiesPage({ onViewUnit, onNavigateHome }: PropertiesPageProps) {
  const { t, language, dir } = useLanguage();
  const [units, setUnits] = useState<Unit[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter states
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('all');
  const [selectedBathrooms, setSelectedBathrooms] = useState<string>('all');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    // Fetch all units
    const { data: unitsData } = await supabase
      .from('units')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Fetch all buildings
    const { data: buildingsData } = await supabase
      .from('buildings')
      .select('*');

    // Fetch all projects
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .order('name');

    if (unitsData) setUnits(unitsData);
    if (buildingsData) setBuildings(buildingsData);
    if (projectsData) setProjects(projectsData);
    
    setLoading(false);
  }

  // Get building by ID
  const getBuildingById = (buildingId: string) => {
    return buildings.find(b => b.id === buildingId);
  };

  // Get project by building ID
  const getProjectByBuildingId = (buildingId: string) => {
    const building = getBuildingById(buildingId);
    if (!building) return null;
    return projects.find(p => p.id === building.project_id);
  };

  // Get project name by building ID
  const getProjectName = (buildingId: string) => {
    const project = getProjectByBuildingId(buildingId);
    return project?.name || 'Unknown Project';
  };

  // Get building name
  const getBuildingName = (buildingId: string) => {
    const building = getBuildingById(buildingId);
    return building?.name || 'Unknown Building';
  };

  // Filter units
  const filteredUnits = units.filter(unit => {
    // Project filter
    if (selectedProject !== 'all') {
      const building = getBuildingById(unit.building_id);
      if (!building || building.project_id !== selectedProject) {
        return false;
      }
    }

    // Bedrooms filter
    if (selectedBedrooms !== 'all' && unit.bedrooms.toString() !== selectedBedrooms) {
      return false;
    }

    // Bathrooms filter
    if (selectedBathrooms !== 'all' && unit.bathrooms.toString() !== selectedBathrooms) {
      return false;
    }

    // Floor filter
    if (selectedFloor !== 'all' && unit.floor.toString() !== selectedFloor) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const unitNumberMatch = unit.unit_number?.toLowerCase().includes(query);
      const buildingMatch = getBuildingName(unit.building_id).toLowerCase().includes(query);
      const projectMatch = getProjectName(unit.building_id).toLowerCase().includes(query);
      
      if (!unitNumberMatch && !buildingMatch && !projectMatch) {
        return false;
      }
    }

    return true;
  });

  // Get unique values for filters
  const uniqueBedrooms = Array.from(new Set(units.map(u => u.bedrooms))).sort((a, b) => a - b);
  const uniqueBathrooms = Array.from(new Set(units.map(u => u.bathrooms))).sort((a, b) => a - b);
  const uniqueFloors = Array.from(new Set(units.map(u => u.floor))).sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 bg-[#F8F8F8]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666] text-[18px]">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]" dir={dir}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#a74b48] to-[#8a3c39] pt-32 pb-16">
        <div className="max-w-[1440px] mx-auto px-[70px]">
          <button
            onClick={onNavigateHome}
            className="text-white/80 hover:text-white mb-4 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dir === 'rtl' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
            {t('common.backToHome')}
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[48px] font-bold text-white mb-4">
                {language === 'ar' ? 'جميع العقارات' : 'All Properties'}
              </h1>
              <p className="text-white/90 text-[20px]">
                {language === 'ar' 
                  ? `اكتشف ${filteredUnits.length} وحدة متاحة للاستثمار` 
                  : `Discover ${filteredUnits.length} available units for investment`}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-[12px] p-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-[8px] transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-[#a74b48]' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-[8px] transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-[#a74b48]' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-[70px] py-12">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'w-[320px]' : 'w-0'} transition-all duration-300 flex-shrink-0`}>
            {showFilters && (
              <div className="bg-white rounded-[24px] p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#a74b48]" />
                    <h2 className="text-[24px] font-bold text-black">
                      {language === 'ar' ? 'تصفية' : 'Filters'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-[#666] hover:text-black transition-colors lg:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-[14px] font-semibold text-black mb-2 block">
                      {language === 'ar' ? 'بحث' : 'Search'}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={language === 'ar' ? 'ابحث عن وحدة...' : 'Search units...'}
                        className="w-full pl-10 pr-4 py-3 border-2 border-[#E5E5E5] rounded-[12px] focus:border-[#a74b48] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Project Filter */}
                  <div>
                    <label className="text-[14px] font-semibold text-black mb-2 block">
                      {language === 'ar' ? 'المشروع' : 'Project'}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-[#E5E5E5] rounded-[12px] focus:border-[#a74b48] outline-none transition-colors appearance-none bg-white"
                      >
                        <option value="all">{language === 'ar' ? 'جميع المشاريع' : 'All Projects'}</option>
                        {projects.map(project => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] pointer-events-none" />
                    </div>
                  </div>

                  {/* Bedrooms Filter */}
                  <div>
                    <label className="text-[14px] font-semibold text-black mb-2 block">
                      {language === 'ar' ? 'غرف النوم' : 'Bedrooms'}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedBedrooms}
                        onChange={(e) => setSelectedBedrooms(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-[#E5E5E5] rounded-[12px] focus:border-[#a74b48] outline-none transition-colors appearance-none bg-white"
                      >
                        <option value="all">{language === 'ar' ? 'جميع الغرف' : 'All Bedrooms'}</option>
                        {uniqueBedrooms.map(bedroom => (
                          <option key={bedroom} value={bedroom}>
                            {bedroom}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] pointer-events-none" />
                    </div>
                  </div>

                  {/* Bathrooms Filter */}
                  <div>
                    <label className="text-[14px] font-semibold text-black mb-2 block">
                      {language === 'ar' ? 'حمامات' : 'Bathrooms'}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedBathrooms}
                        onChange={(e) => setSelectedBathrooms(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-[#E5E5E5] rounded-[12px] focus:border-[#a74b48] outline-none transition-colors appearance-none bg-white"
                      >
                        <option value="all">{language === 'ar' ? 'جميع الحمامات' : 'All Bathrooms'}</option>
                        {uniqueBathrooms.map(bathroom => (
                          <option key={bathroom} value={bathroom}>
                            {bathroom}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] pointer-events-none" />
                    </div>
                  </div>

                  {/* Floor Filter */}
                  <div>
                    <label className="text-[14px] font-semibold text-black mb-2 block">
                      {language === 'ar' ? 'الطابق' : 'Floor'}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedFloor}
                        onChange={(e) => setSelectedFloor(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-[#E5E5E5] rounded-[12px] focus:border-[#a74b48] outline-none transition-colors appearance-none bg-white"
                      >
                        <option value="all">{language === 'ar' ? 'جميع الطوابق' : 'All Floors'}</option>
                        {uniqueFloors.map(floor => (
                          <option key={floor} value={floor}>
                            {floor}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] pointer-events-none" />
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <button
                    onClick={() => {
                      setSelectedProject('all');
                      setSelectedBedrooms('all');
                      setSelectedBathrooms('all');
                      setSelectedFloor('all');
                      setSearchQuery('');
                    }}
                    className="w-full py-3 border-2 border-[#a74b48] text-[#a74b48] rounded-[12px] font-semibold hover:bg-[#a74b48] hover:text-white transition-all"
                  >
                    {language === 'ar' ? 'إعادة تعيين' : 'Reset Filters'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Properties Grid/List */}
          <div className="flex-1">
            {/* Show Filters Button (Mobile) */}
            {!showFilters && (
              <button
                onClick={() => setShowFilters(true)}
                className="mb-6 flex items-center gap-2 px-6 py-3 bg-white rounded-[12px] shadow-sm hover:shadow-md transition-all"
              >
                <Filter className="w-5 h-5 text-[#a74b48]" />
                <span className="font-semibold text-black">
                  {language === 'ar' ? 'إظهار الفلاتر' : 'Show Filters'}
                </span>
              </button>
            )}

            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[16px] text-[#666]">
                {language === 'ar' 
                  ? `عرض ${filteredUnits.length} من ${units.length} وحدة`
                  : `Showing ${filteredUnits.length} of ${units.length} units`}
              </p>
            </div>

            {/* No Results */}
            {filteredUnits.length === 0 && (
              <div className="text-center py-16 bg-white rounded-[24px]">
                <Building2 className="w-16 h-16 text-[#999] mx-auto mb-4" />
                <h3 className="text-[24px] font-bold text-black mb-2">
                  {language === 'ar' ? 'لا توجد نتائج' : 'No Results Found'}
                </h3>
                <p className="text-[#666]">
                  {language === 'ar' 
                    ? 'حاول تغيير معايير البحث'
                    : 'Try adjusting your search criteria'}
                </p>
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && filteredUnits.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUnits.map(unit => (
                  <div
                    key={unit.id}
                    className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    onClick={() => onViewUnit(unit.id)}
                  >
                    <div className="relative h-[240px] overflow-hidden">
                      <img
                        src={unit.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'}
                        alt={unit.unit_number}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <span className={`px-4 py-2 rounded-full text-[12px] font-semibold ${
                          unit.status === 'available'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}>
                          {unit.status === 'available'
                            ? (language === 'ar' ? 'متاح' : 'Available')
                            : (language === 'ar' ? 'مباع' : 'Sold Out')}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-[22px] font-bold text-black mb-2 group-hover:text-[#a74b48] transition-colors">
                        {unit.unit_number}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-[#666] mb-4">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-[14px] truncate">{getBuildingName(unit.building_id)}</span>
                      </div>

                      <p className="text-[14px] text-[#666] mb-4 line-clamp-2">
                        {unit.description || getProjectName(unit.building_id)}
                      </p>

                      <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-[#E5E5E5]">
                        <div className="text-center">
                          <BedDouble className="w-5 h-5 text-[#a74b48] mx-auto mb-1" />
                          <p className="text-[16px] font-bold text-black">{unit.bedrooms}</p>
                          <p className="text-[10px] text-[#999]">{language === 'ar' ? 'غرف' : 'Beds'}</p>
                        </div>
                        <div className="text-center">
                          <Bath className="w-5 h-5 text-[#a74b48] mx-auto mb-1" />
                          <p className="text-[16px] font-bold text-black">{unit.bathrooms}</p>
                          <p className="text-[10px] text-[#999]">{language === 'ar' ? 'حمام' : 'Baths'}</p>
                        </div>
                        <div className="text-center">
                          <Maximize2 className="w-5 h-5 text-[#a74b48] mx-auto mb-1" />
                          <p className="text-[16px] font-bold text-black">{unit.area}</p>
                          <p className="text-[10px] text-[#999]">{language === 'ar' ? 'م²' : 'm²'}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-[14px] text-[#999] mb-1">{language === 'ar' ? 'السعر' : 'Price'}</p>
                        <p className="text-[24px] font-bold text-[#a74b48]">{formatPrice(unit.price)}</p>
                      </div>

                      <button className="w-full py-3 bg-[#a74b48] text-white rounded-[12px] font-semibold hover:bg-[#8a3c39] transition-colors flex items-center justify-center gap-2">
                        {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dir === 'rtl' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && filteredUnits.length > 0 && (
              <div className="space-y-4">
                {filteredUnits.map(unit => (
                  <div
                    key={unit.id}
                    className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    onClick={() => onViewUnit(unit.id)}
                  >
                    <div className="flex gap-6 p-6">
                      <div className="w-[280px] h-[200px] flex-shrink-0 rounded-[16px] overflow-hidden">
                        <img
                          src={unit.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'}
                          alt={unit.unit_number}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-[28px] font-bold text-black group-hover:text-[#a74b48] transition-colors">
                            {unit.unit_number}
                          </h3>
                          <span className={`px-4 py-2 rounded-full text-[14px] font-semibold ${
                            unit.status === 'available'
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}>
                            {unit.status === 'available'
                              ? (language === 'ar' ? 'متاح' : 'Available')
                              : (language === 'ar' ? 'مباع' : 'Sold Out')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[#666] mb-4">
                          <MapPin className="w-5 h-5 flex-shrink-0" />
                          <span className="text-[16px]">{getBuildingName(unit.building_id)}</span>
                        </div>

                        <p className="text-[16px] text-[#666] mb-6 line-clamp-2">
                          {unit.description || getProjectName(unit.building_id)}
                        </p>

                        <div className="flex items-center gap-8 mb-6">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[#a74b48]" />
                            <span className="text-[16px] text-black">
                              <span className="font-bold">{unit.floor}</span> {language === 'ar' ? 'طابق' : 'Floor'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Home className="w-5 h-5 text-[#a74b48]" />
                            <span className="text-[16px] text-black">
                              <span className="font-bold">{unit.available_units}</span> {language === 'ar' ? 'وحدة متاحة' : 'Units Available'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Maximize2 className="w-5 h-5 text-[#a74b48]" />
                            <span className="text-[16px] text-black">
                              {language === 'ar' ? 'مساحات متنوعة' : 'Various Sizes'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-8 mb-6">
                          <div className="flex items-center gap-2">
                            <BedDouble className="w-5 h-5 text-[#a74b48]" />
                            <span className="text-[16px] text-black">
                              <span className="font-bold">{unit.bedrooms}</span> {language === 'ar' ? 'غرفة' : 'Bedrooms'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bath className="w-5 h-5 text-[#a74b48]" />
                            <span className="text-[16px] text-black">
                              <span className="font-bold">{unit.bathrooms}</span> {language === 'ar' ? 'حمام' : 'Bathrooms'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Maximize2 className="w-5 h-5 text-[#a74b48]" />
                            <span className="text-[16px] text-black">
                              <span className="font-bold">{unit.area}</span> {language === 'ar' ? 'م²' : 'm²'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[#a74b48]" />
                            <span className="text-[16px] text-black font-bold">
                              {formatPrice(unit.price)}
                            </span>
                          </div>
                        </div>

                        <button className="px-8 py-3 bg-[#a74b48] text-white rounded-[12px] font-semibold hover:bg-[#8a3c39] transition-colors inline-flex items-center gap-2">
                          {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dir === 'rtl' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}