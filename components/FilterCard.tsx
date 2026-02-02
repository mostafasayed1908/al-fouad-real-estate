import { useState } from 'react';
import svgPaths from '../imports/svg-xd1tsi0116';
import type { SearchFilters } from './SearchResults';
import { useLanguage } from '../contexts/LanguageContext';

function WeuiArrowOutlined() {
  return (
    <div className="h-[24px] relative w-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 24">
        <g>
          <path d={svgPaths.p18a2a6f0} fill="black" />
        </g>
      </svg>
    </div>
  );
}

function MingcuteSearchLine() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-[8.33%_12.05%_0.78%_8.34%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.108 21.814">
          <g>
            <g></g>
            <path clipRule="evenodd" d={svgPaths.p3651e400} fill="white" fillRule="evenodd" />
          </g>
        </svg>
      </div>
    </div>
  );
}

interface FilterCardProps {
  onSearch: (filters: SearchFilters) => void;
}

export function FilterCard({ onSearch }: FilterCardProps) {
  const { t, language } = useLanguage();
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [floor, setFloor] = useState('');

  const handleSearch = () => {
    const filters: SearchFilters = {
      location: location || undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      floor: floor ? parseInt(floor) : undefined
    };
    onSearch(filters);
  };

  const isRTL = language === 'ar';

  return (
    <div className="relative -mt-[51px] md:-mt-[51px] mt-0 z-30 mb-[32px] md:mb-[52px] bg-[rgba(0,0,0,0)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[74px]">
        <div className="bg-white flex flex-col items-center justify-center py-[24px] md:py-[32px] px-[20px] md:px-[50px] rounded-[20px] shadow-[0px_10px_40px_rgba(0,0,0,0.08)] border border-gray-100">
          <div className="flex flex-col md:flex-row gap-[16px] md:gap-[32px] items-stretch md:items-end w-full">
            {/* Location */}
            <div className="flex flex-col gap-[12px] items-start w-full md:w-[240px]">
              <label className="font-medium text-[#666] text-[12px] md:text-[14px] uppercase tracking-wide">{t('filter.location')}</label>
              <div className="bg-white relative rounded-[12px] w-full border-2 border-gray-200 hover:border-[#a74b48] transition-colors duration-200 shadow-sm">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-[14px] md:px-[18px] py-[12px] md:py-[14px] bg-transparent text-[16px] md:text-[18px] text-black font-medium appearance-none cursor-pointer rounded-[12px] focus:outline-none"
                  style={{ 
                    paddingLeft: isRTL ? '40px' : '18px',
                    paddingRight: isRTL ? '18px' : '40px',
                    direction: isRTL ? 'rtl' : 'ltr'
                  }}
                >
                  <option value="">{t('filter.location.all')}</option>
                  <option>{t('filter.location.newCairo')}</option>
                  <option>{t('filter.location.cairo')}</option>
                  <option>{t('filter.location.newHeliopolis')}</option>
                  <option>{t('filter.location.beitAlWatan')}</option>
                </select>
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 pointer-events-none rotate-90 text-[#a74b48] ${
                    isRTL ? 'left-[14px] md:left-[18px]' : 'right-[14px] md:right-[18px]'
                  }`}
                >
                  <WeuiArrowOutlined />
                </div>
              </div>
            </div>

            {/* Bedrooms */}
            <div className="flex flex-col gap-[12px] items-start w-full md:w-[200px]">
              <label className="font-medium text-[#666] text-[12px] md:text-[14px] uppercase tracking-wide">{t('filter.bedrooms') || 'Bedrooms'}</label>
              <div className="bg-white relative rounded-[12px] w-full border-2 border-gray-200 hover:border-[#a74b48] transition-colors duration-200 shadow-sm">
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-[14px] md:px-[18px] py-[12px] md:py-[14px] bg-transparent text-[16px] md:text-[18px] text-black font-medium appearance-none cursor-pointer rounded-[12px] focus:outline-none"
                  style={{ 
                    paddingLeft: isRTL ? '40px' : '18px',
                    paddingRight: isRTL ? '18px' : '40px',
                    direction: isRTL ? 'rtl' : 'ltr'
                  }}
                >
                  <option value="">{t('filter.any') || 'Any'}</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 pointer-events-none rotate-90 text-[#a74b48] ${
                    isRTL ? 'left-[14px] md:left-[18px]' : 'right-[14px] md:right-[18px]'
                  }`}
                >
                  <WeuiArrowOutlined />
                </div>
              </div>
            </div>

            {/* Bathrooms */}
            <div className="flex flex-col gap-[12px] items-start w-full md:w-[200px]">
              <label className="font-medium text-[#666] text-[12px] md:text-[14px] uppercase tracking-wide">{t('filter.bathrooms') || 'Bathrooms'}</label>
              <div className="bg-white relative rounded-[12px] w-full border-2 border-gray-200 hover:border-[#a74b48] transition-colors duration-200 shadow-sm">
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-[14px] md:px-[18px] py-[12px] md:py-[14px] bg-transparent text-[16px] md:text-[18px] text-black font-medium appearance-none cursor-pointer rounded-[12px] focus:outline-none"
                  style={{ 
                    paddingLeft: isRTL ? '40px' : '18px',
                    paddingRight: isRTL ? '18px' : '40px',
                    direction: isRTL ? 'rtl' : 'ltr'
                  }}
                >
                  <option value="">{t('filter.any') || 'Any'}</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 pointer-events-none rotate-90 text-[#a74b48] ${
                    isRTL ? 'left-[14px] md:left-[18px]' : 'right-[14px] md:right-[18px]'
                  }`}
                >
                  <WeuiArrowOutlined />
                </div>
              </div>
            </div>

            {/* Floor */}
            <div className="flex flex-col gap-[12px] items-start w-full md:w-[200px]">
              <label className="font-medium text-[#666] text-[12px] md:text-[14px] uppercase tracking-wide">{t('filter.floor') || 'Floor'}</label>
              <div className="bg-white relative rounded-[12px] w-full border-2 border-gray-200 hover:border-[#a74b48] transition-colors duration-200 shadow-sm">
                <select
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full px-[14px] md:px-[18px] py-[12px] md:py-[14px] bg-transparent text-[16px] md:text-[18px] text-black font-medium appearance-none cursor-pointer rounded-[12px] focus:outline-none"
                  style={{ 
                    paddingLeft: isRTL ? '40px' : '18px',
                    paddingRight: isRTL ? '18px' : '40px',
                    direction: isRTL ? 'rtl' : 'ltr'
                  }}
                >
                  <option value="">{t('filter.any') || 'Any'}</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10+</option>
                </select>
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 pointer-events-none rotate-90 text-[#a74b48] ${
                    isRTL ? 'left-[14px] md:left-[18px]' : 'right-[14px] md:right-[18px]'
                  }`}
                >
                  <WeuiArrowOutlined />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button 
              onClick={handleSearch}
              className="flex gap-[12px] h-[50px] md:h-[54px] items-center justify-center px-[24px] md:px-[32px] py-[12px] md:py-[14px] rounded-[12px] text-white font-semibold text-[14px] md:text-[16px] shrink-0 hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg w-full md:w-auto"
              style={{ backgroundImage: "linear-gradient(135deg, rgb(205, 35, 35) 0%, rgb(175, 5, 8) 100%)" }}
            >
              <MingcuteSearchLine />
              {t('filter.searchButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}