import svgPaths from '../imports/svg-a9cd8qe9is';
import imgRectangle6 from 'figma:asset/a3e315afd60898a8457f09c34958b8da9b262b19.png';
import imgRectangle5 from 'figma:asset/6383df93bc728442a36287ccea18969a4b4456f1.png';
import type { City } from '../utils/supabase/client';
import { useLanguage } from '../contexts/LanguageContext';

function BuildingIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_11_794)">
          <path d={svgPaths.p37143280} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1d7f0000} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2b722f80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 5H11.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 8.33333H11.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 11.6667H11.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 15H11.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_11_794">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ArrowIcon() {
  return (
    <div className="absolute left-[132.42px] size-[20px] top-[14px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g>
          <path d="M4.16667 10H15.8333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ae0b780} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

interface CityCardProps {
  id: string;
  title: string;
  description: string;
  units: number;
  image: string;
  gradientOverlay: string;
  onViewCity: (cityId: string) => void;
}

function CityCard({ id, title, description, units, image, gradientOverlay, onViewCity }: CityCardProps) {
  return (
    <div id={id} className="relative h-[400px] md:h-[500px] lg:h-[643px] w-full md:w-1/2">
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <img alt={title} className="absolute max-w-none object-cover size-full" src={image} />
        <div className="absolute inset-0" style={{ backgroundImage: gradientOverlay }} />
      </div>

      {/* Content */}
      <div className="absolute left-[20px] md:left-[35px] lg:left-[49px] bottom-[40px] md:bottom-[60px] lg:bottom-[85px] right-[20px] md:right-auto md:w-[450px] lg:w-[528px]">
        <h3 className="font-bold text-[22px] md:text-[26px] lg:text-[30px] text-white leading-[28px] md:leading-[32px] lg:leading-[36px] tracking-[0.3955px] mb-[24px] md:mb-[34px] lg:mb-[44px]">
          {title}
        </h3>
        
        <p className="font-normal text-[14px] md:text-[15px] lg:text-[16px] text-[rgba(255,255,255,0.9)] leading-[20px] md:leading-[22px] lg:leading-[24px] tracking-[-0.3125px] mb-[12px] md:mb-[14px] lg:mb-[16px]">
          {description}
        </p>
        
        <div className="flex gap-[8px] items-center mb-[16px] md:mb-[20px] lg:mb-[24px]">
          <BuildingIcon />
          <p className="font-semibold text-[14px] md:text-[15px] lg:text-[16px] text-white leading-[20px] md:leading-[22px] lg:leading-[24px] tracking-[-0.3125px]">
            {units} Available Units
          </p>
        </div>

        <button 
          onClick={() => onViewCity(id)}
          className="bg-[#a74b48] size-[44px] md:size-[46px] lg:size-[48px] rounded-full hover:bg-[#8f3f3c] transition-all hover:scale-110 flex items-center justify-center group"
          aria-label="View Listings"
        >
          <svg className="size-[20px] md:size-[22px] text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface CitiesSectionProps {
  cities: City[];
  onViewCity: (cityId: string) => void;
}

export function CitiesSection({ cities, onViewCity }: CitiesSectionProps) {
  const { language } = useLanguage();
  
  // Mapping of city IDs to fallback images and gradients
  const cityAssets: Record<string, { image: string; gradientOverlay: string }> = {
    'new-heliopolis': {
      image: imgRectangle6,
      gradientOverlay: "linear-gradient(rgba(0, 0, 0, 0) 62.442%, rgba(0, 0, 0, 0.87) 100%), linear-gradient(90deg, rgba(29, 29, 29, 0.26) 0%, rgba(29, 29, 29, 0.26) 100%)"
    },
    'bait-el-watan': {
      image: imgRectangle5,
      gradientOverlay: "linear-gradient(rgba(0, 0, 0, 0) 63.841%, rgba(0, 0, 0, 0.87) 100%), linear-gradient(90deg, rgba(25, 25, 25, 0.26) 0%, rgba(25, 25, 25, 0.26) 100%)"
    }
  };

  return (
    <section className="relative flex flex-col md:flex-row h-auto md:h-[500px] lg:h-[643px] w-full z-10">
      {cities.map((city) => {
        const assets = cityAssets[city.id] || {
          image: imgRectangle6,
          gradientOverlay: "linear-gradient(rgba(0, 0, 0, 0) 62.442%, rgba(0, 0, 0, 0.87) 100%), linear-gradient(90deg, rgba(29, 29, 29, 0.26) 0%, rgba(29, 29, 29, 0.26) 100%)"
        };
        
        // Use hero_image from database if available, otherwise use fallback
        const imageUrl = city.hero_image || assets.image;
        
        // Use Arabic name if available and language is Arabic
        const cityName = language === 'ar' && city.name_ar ? city.name_ar : city.name;
        
        return (
          <CityCard
            key={city.id}
            id={city.id}
            title={cityName}
            description={city.description || ''}
            units={city.available_units}
            image={imageUrl}
            gradientOverlay={assets.gradientOverlay}
            onViewCity={onViewCity}
          />
        );
      })}
    </section>
  );
}