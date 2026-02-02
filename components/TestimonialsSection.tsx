import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Testimonial {
  id: string;
  name_en: string;
  name_ar: string;
  role_en: string;
  role_ar: string;
  content_en: string;
  content_ar: string;
  rating: number;
  image: string;
  display_order: number;
}

export function TestimonialsSection() {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-74e21526/testimonials`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }

      const data = await response.json();
      setTestimonials(data);
      setError(null);
    } catch (err) {
      // Silently fall back to default testimonials if database isn't set up yet
      console.log('Using default testimonials (database not configured yet)');
      setError(null); // Don't show error to user
      // Fallback to hardcoded testimonials
      setTestimonials([
        {
          id: '1',
          name_en: 'Ahmed Hassan',
          name_ar: 'أحمد حسن',
          role_en: 'Property Owner',
          role_ar: 'مالك عقار',
          content_en: 'Al-Fouad exceeded my expectations. The quality of construction and attention to detail in New Heliopolis is outstanding. Highly recommended!',
          content_ar: 'فاقت شركة الفؤاد توقعاتي. جودة البناء والاهتمام بالتفاصيل في هليوبوليس الجديدة رائعة. أنصح بها بشدة!',
          rating: 5,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
          display_order: 1
        },
        {
          id: '2',
          name_en: 'Sarah Mohamed',
          name_ar: 'سارة محمد',
          role_en: 'Investor',
          role_ar: '<|im_start|>رزمرة',
          content_en: 'Professional team and transparent process. They guided me through every step of purchasing my villa in Beit El-Watan. Couldn\'t be happier!',
          content_ar: 'فريق محترف وعملية شفافة. أرشدوني في كل خطوة لشراء فيلتي في بيت الوطن. لا يمكن أن أكون أكثر سعادة!',
          rating: 5,
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
          display_order: 2
        },
        {
          id: '3',
          name_en: 'Khaled Ibrahim',
          name_ar: 'خالد إبراهيم',
          role_en: 'Homeowner',
          role_ar: 'صاحب منزل',
          content_en: 'The best real estate investment I\'ve made. Premium location, excellent amenities, and a company that truly cares about its clients.',
          content_ar: 'أفضل استثمار عقاري قمت به. موقع مميز، ومرافق ممتازة، وشركة تهتم حقاً بعملائها.',
          rating: 5,
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
          display_order: 3
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[70px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a74b48] mx-auto"></div>
            <p className="text-white mt-4">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#1a1a1a]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[70px]">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-bold text-white mb-3 md:mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-[15px] md:text-[17px] lg:text-[18px] text-[#b3b3b3] max-w-[700px] mx-auto px-4">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonials Slider Container */}
        <div className="relative">
          {/* Arrow Controls - Hidden on mobile */}
          <button
            onClick={handlePrevious}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-[#2a2a2a] rounded-full p-3 shadow-lg hover:bg-[#a74b48] hover:text-white transition-all duration-300 group border border-[#3a3a3a]"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-[#a74b48] group-hover:text-white" />
          </button>

          <button
            onClick={handleNext}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-[#2a2a2a] rounded-full p-3 shadow-lg hover:bg-[#a74b48] hover:text-white transition-all duration-300 group border border-[#3a3a3a]"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-[#a74b48] group-hover:text-white" />
          </button>

          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(${language === 'ar' ? currentIndex * (100 / 3) : -currentIndex * (100 / 3)}%)` 
              }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="w-full md:w-1/3 flex-shrink-0 px-2 md:px-4"
                >
                  <div className="bg-[#2a2a2a] rounded-[20px] p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative h-full border border-[#3a3a3a]">
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 opacity-10">
                      <Quote className="w-12 h-12 text-[#a74b48]" />
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" 
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-[16px] text-[#b3b3b3] leading-relaxed mb-6">
                      "{language === 'ar' ? testimonial.content_ar : testimonial.content_en}"
                    </p>

                    {/* Client Info */}
                    <div className="flex items-center gap-4 pt-6 border-t border-[#3a3a3a]">
                      <img 
                        src={testimonial.image} 
                        alt={language === 'ar' ? testimonial.name_ar : testimonial.name_en}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-[16px] font-bold text-white">
                          {language === 'ar' ? testimonial.name_ar : testimonial.name_en}
                        </h4>
                        <p className="text-[14px] text-[#888]">
                          {language === 'ar' ? testimonial.role_ar : testimonial.role_en}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#a74b48] w-8' 
                    : 'bg-[#4a4a4a] hover:bg-[#a74b48]/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}