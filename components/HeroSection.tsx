import { useLanguage } from '../contexts/LanguageContext';
import { Home, TrendingUp, Award, MapPin, Shield, Star as StarIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import newHeliopolisImage from 'figma:asset/a3e315afd60898a8457f09c34958b8da9b262b19.png';
import beitElWatanImage from 'figma:asset/536bcb0744e7d13cf680af57e786f5bd06f18426.png';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface HeroContent {
  id: string;
  main_headline_en: string;
  main_headline_ar: string;
  subheadline_en: string;
  subheadline_ar: string;
}

interface HeroChip {
  id: string;
  title_en: string;
  title_ar: string;
  icon_name: string;
  display_order: number;
}

interface HeroRating {
  id: string;
  rating_value: number;
  total_clients: number;
  rating_text_en: string;
  rating_text_ar: string;
}

interface HeroData {
  content: HeroContent | null;
  chips: HeroChip[];
  rating: HeroRating | null;
}

export function HeroSection({ onNavigateToProperties }: { onNavigateToProperties?: () => void }) {
  const { t, language } = useLanguage();
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-74e21526/hero-content`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch hero content');
      }

      const data = await response.json();
      setHeroData(data);
    } catch (err) {
      // Silently fall back to default content if database isn't set up yet
      console.log('Using default hero content (database not configured yet)');
      setHeroData(null); // Use translation keys as fallback
    } finally {
      setLoading(false);
    }
  };

  // Get content with fallback to translations
  const getHeadline = () => {
    if (heroData?.content) {
      return language === 'ar' 
        ? heroData.content.main_headline_ar 
        : heroData.content.main_headline_en;
    }
    return `${t('hero.title1')} ${t('hero.title2')} ${t('hero.title3')}`;
  };

  const getSubheadline = () => {
    if (heroData?.content) {
      return language === 'ar' 
        ? heroData.content.subheadline_ar 
        : heroData.content.subheadline_en;
    }
    return t('hero.subtitle');
  };

  const getChips = () => {
    if (heroData?.chips && heroData.chips.length > 0) {
      return heroData.chips;
    }
    // Fallback to default chips
    return [
      { id: '1', title_en: t('hero.premiumLocations'), title_ar: t('hero.premiumLocations'), icon_name: 'Home', display_order: 1 },
      { id: '2', title_en: t('hero.highROI'), title_ar: t('hero.highROI'), icon_name: 'TrendingUp', display_order: 2 },
      { id: '3', title_en: t('hero.trustedDeveloper'), title_ar: t('hero.trustedDeveloper'), icon_name: 'Award', display_order: 3 }
    ];
  };

  const getRating = () => {
    if (heroData?.rating) {
      return {
        value: heroData.rating.rating_value,
        clients: heroData.rating.total_clients,
        text: language === 'ar' ? heroData.rating.rating_text_ar : heroData.rating.rating_text_en
      };
    }
    return {
      value: 4.9,
      clients: 500,
      text: t('hero.fromClients')
    };
  };

  const headline = getHeadline();
  const subheadline = getSubheadline();
  const chips = getChips();
  const rating = getRating();
  
  // Don't render content until data is loaded to prevent flash
  if (loading) {
    return (
      <section id="home" className="relative bg-gradient-to-br from-[#fef6f5] via-white to-[#fff5f4] pt-[100px] md:pt-[110px] lg:pt-[120px] pb-[60px] md:pb-[70px] lg:pb-[80px] overflow-hidden w-full">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[70px] relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-[40px] md:gap-[60px] lg:gap-[80px]">
            <div className="flex flex-col gap-[20px] md:gap-[28px] lg:gap-[32px] items-start flex-1 max-w-full lg:max-w-[600px] text-center lg:text-left items-center lg:items-start">
              {/* Loading skeleton */}
              <div className="w-full max-w-[500px] h-[100px] md:h-[140px] lg:h-[200px] bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="w-full max-w-[400px] h-[60px] bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="flex gap-[10px]">
                <div className="w-[120px] h-[32px] bg-gray-200 animate-pulse rounded-full"></div>
                <div className="w-[120px] h-[32px] bg-gray-200 animate-pulse rounded-full"></div>
                <div className="w-[120px] h-[32px] bg-gray-200 animate-pulse rounded-full"></div>
              </div>
              <div className="w-[200px] h-[50px] bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="home" className="relative bg-gradient-to-br from-[#fef6f5] via-white to-[#fff5f4] pt-[100px] md:pt-[110px] lg:pt-[120px] pb-[60px] md:pb-[70px] lg:pb-[80px] overflow-hidden w-full">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[400px] md:w-[600px] lg:w-[800px] h-[400px] md:h-[600px] lg:h-[800px] bg-gradient-to-bl from-[#a74b48]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[300px] md:w-[450px] lg:w-[600px] h-[300px] md:h-[450px] lg:h-[600px] bg-gradient-to-tr from-black/3 to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[70px] relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-[40px] md:gap-[60px] lg:gap-[80px]">
          {/* Left Content - Text */}
          <div className="flex flex-col gap-[20px] md:gap-[28px] lg:gap-[32px] items-start flex-1 max-w-full lg:max-w-[600px] text-center lg:text-left items-center lg:items-start">
            <h1 className="font-bold text-[36px] md:text-[52px] lg:text-[72px] text-black leading-[1.15] lg:leading-[1.1] tracking-tight">
              <span className={`block ${language === 'ar' ? 'text-right' : 'text-left'}`}>{headline}</span>
            </h1>
            
            <p className="font-normal text-[#555] text-[16px] md:text-[18px] lg:text-[20px] leading-relaxed max-w-full md:max-w-[480px] lg:max-w-[500px] text-right">
              {subheadline}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-[10px] md:gap-[12px] mt-[4px] md:mt-[8px] justify-center lg:justify-start">
              {chips.map(chip => {
                const IconComponent = Icons[chip.icon_name as keyof typeof Icons] as any;
                return (
                  <div key={chip.id} className="flex items-center gap-[6px] px-[10px] md:px-[12px] py-[5px] md:py-[6px] bg-white rounded-full shadow-sm border border-gray-100">
                    <div className="p-[4px] bg-[#a74b48]/10 rounded-full">
                      {IconComponent && <IconComponent className="size-[12px] md:size-[14px] text-[#a74b48]" />}
                    </div>
                    <span className="text-[12px] md:text-[13px] font-medium text-black">{language === 'ar' ? chip.title_ar : chip.title_en}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <button 
              className="flex items-center gap-[10px] md:gap-[12px] px-[32px] md:px-[36px] lg:px-[40px] py-[14px] md:py-[16px] lg:py-[18px] rounded-full text-white font-semibold text-[16px] md:text-[17px] lg:text-[18px] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 mt-[12px] md:mt-[14px] lg:mt-[16px]"
              style={{ backgroundImage: "linear-gradient(135deg, #a74b48 0%, #8a3c39 100%)" }}
              onClick={onNavigateToProperties}
            >
              {t('hero.exploreProperties')}
              <svg className="size-[18px] md:size-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {/* Rating */}
            <div className="flex items-center gap-[10px] md:gap-[12px] mt-[6px] md:mt-[8px]">
              <div className="flex gap-[3px] md:gap-[4px]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="size-[16px] md:size-[20px] text-[#FFB800]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[15px] font-semibold text-black">{rating.value} {t('hero.rating')}</span>
              <span className="text-[15px] text-[#666]">{rating.text}</span>
            </div>
          </div>

          {/* Right Content - Floating Property Cards */}
          <div className="hidden lg:block relative flex-1 min-h-[600px]">
            {/* Large Property Card */}
            <div className="absolute top-[50px] right-[80px] w-[380px] bg-white rounded-[24px] shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 z-20 hover:z-50">
              <div className="relative h-[240px] overflow-hidden">
                <img 
                  src={newHeliopolisImage}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-[16px] right-[16px] px-[16px] py-[8px] bg-[#a74b48] text-white text-[14px] font-bold rounded-full shadow-lg">
                  {t('hero.featured')}
                </div>
              </div>
              <div className="p-[24px]">
                <div className="flex items-center justify-between mb-[12px]">
                  <h3 className="text-[22px] font-bold text-black">{t('projects.newHeliopolis.title')}</h3>
                  <div className="flex items-center gap-[4px]">
                    <svg className="size-[16px] text-[#FFB800]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[14px] font-semibold">4.8</span>
                  </div>
                </div>
                <p className="text-[14px] text-[#666] mb-[16px]">{t('hero.luxuryApartments')}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] text-[#999] mb-[4px]">{t('hero.startingFrom')}</p>
                    <p className="text-[24px] font-bold text-[#a74b48]">3.5{t('common.million')} {t('common.egp')}</p>
                  </div>
                  <button className="p-[12px] bg-[#a74b48] text-white rounded-full hover:bg-[#8a3c39] transition-colors">
                    <svg className="size-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Small Stats Card */}
            <div className="absolute top-[120px] left-[40px] w-[240px] bg-white rounded-[20px] shadow-xl p-[24px] transform hover:scale-105 transition-all duration-300 z-10 hover:z-50">
              <div className="flex items-center gap-[12px] mb-[16px]">
                <div className="p-[12px] bg-gradient-to-br from-[#a74b48] to-[#8a3c39] rounded-full">
                  <TrendingUp className="size-[24px] text-white" />
                </div>
                <div>
                  <p className="text-[12px] text-[#999]">{t('hero.investmentGrowth')}</p>
                  <p className="text-[20px] font-bold text-black">+23.5%</p>
                </div>
              </div>
              <div className="h-[4px] bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[75%] bg-gradient-to-r from-[#a74b48] to-[#8a3c39] rounded-full"></div>
              </div>
              <p className="text-[11px] text-[#666] mt-[8px]">{t('hero.aboveMarket')}</p>
            </div>

            {/* Agent Profile Card */}
            <div className="absolute bottom-[80px] right-[40px] w-[200px] bg-white rounded-[16px] shadow-lg p-[16px] transform hover:scale-105 transition-all duration-300 z-15 hover:z-50">
              <div className="flex items-center gap-[12px] mb-[12px]">
                <img 
                  src="https://images.unsplash.com/photo-1763479169474-728a7de108c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY4OTUwMjY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Agent"
                  className="size-[48px] rounded-full object-cover border-2 border-[#a74b48]"
                />
                <div>
                  <p className="text-[14px] font-semibold text-black">Sarah Ahmed</p>
                  <p className="text-[11px] text-[#666]">{t('hero.seniorAgent')}</p>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="flex -space-x-2">
                  <div className="size-[24px] rounded-full bg-[#a74b48] border-2 border-white"></div>
                  <div className="size-[24px] rounded-full bg-[#8a3c39] border-2 border-white"></div>
                  <div className="size-[24px] rounded-full bg-black border-2 border-white"></div>
                </div>
                <p className="text-[11px] text-[#666]">+150 {t('hero.clients')}</p>
              </div>
            </div>

            {/* Mini Property Card */}
            <div className="absolute top-[300px] left-[20px] w-[180px] bg-white rounded-[16px] shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 z-5 hover:z-50">
              <div className="relative h-[100px]">
                <img 
                  src={beitElWatanImage}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-[12px]">
                <p className="text-[14px] font-bold text-black mb-[4px]">{t('projects.beitElWatan.title')}</p>
                <p className="text-[16px] font-bold text-[#a74b48]">5.2{t('common.million')} {t('common.egp')}</p>
              </div>
            </div>

            {/* Decorative Circle */}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[2px] border-[#a74b48]/10 rounded-full -z-10"></div>
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[2px] border-[#a74b48]/5 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}