import { Building2, Users, Award, TrendingUp } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Counter {
  id: string;
  counter_value: number;
  counter_label_en: string;
  counter_label_ar: string;
  suffix_en?: string;
  suffix_ar?: string;
  icon_name?: string;
  display_order: number;
}

export function AchievementsSection() {
  const { t, language } = useLanguage();
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounters();
  }, []);

  const fetchCounters = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-74e21526/counters`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch counters');
      }

      const data = await response.json();
      setCounters(data);
    } catch (err) {
      // Silently fall back to default counters if database isn't set up yet
      console.log('Using default counters (database not configured yet)');
      // Fallback to hardcoded counters
      setCounters([
        {
          id: '1',
          counter_value: 150,
          counter_label_en: t('achievements.buildings'),
          counter_label_ar: t('achievements.buildings'),
          suffix_en: '+',
          suffix_ar: '+',
          icon_name: 'Building2',
          display_order: 1
        },
        {
          id: '2',
          counter_value: 10000,
          counter_label_en: t('achievements.clients'),
          counter_label_ar: t('achievements.clients'),
          suffix_en: '+',
          suffix_ar: '+',
          icon_name: 'Users',
          display_order: 2
        },
        {
          id: '3',
          counter_value: 24,
          counter_label_en: t('achievements.awards'),
          counter_label_ar: t('achievements.awards'),
          suffix_en: '+',
          suffix_ar: '+',
          icon_name: 'Award',
          display_order: 3
        },
        {
          id: '4',
          counter_value: 15,
          counter_label_en: t('achievements.years'),
          counter_label_ar: t('achievements.years'),
          suffix_en: '+',
          suffix_ar: '+',
          icon_name: 'TrendingUp',
          display_order: 4
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[70px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#F8F8F8] rounded-[16px] md:rounded-[20px] p-6 md:p-8 text-center animate-pulse">
                <div className="h-12 w-12 md:h-16 md:w-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-8 md:h-10 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[70px]">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {counters.map((counter) => {
            const IconComponent = counter.icon_name 
              ? (Icons[counter.icon_name as keyof typeof Icons] as any)
              : Building2;
            const label = language === 'ar' ? counter.counter_label_ar : counter.counter_label_en;
            const suffix = language === 'ar' ? counter.suffix_ar : counter.suffix_en;
            
            return (
              <div 
                key={counter.id}
                className="bg-[#F8F8F8] rounded-[16px] md:rounded-[20px] p-6 md:p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex justify-center mb-3 md:mb-4">
                  <div className="p-3 md:p-4 bg-white rounded-full shadow-md">
                    {IconComponent && <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-[#a74b48]" />}
                  </div>
                </div>
                <p className="text-[28px] md:text-[36px] lg:text-[40px] font-bold text-black mb-1 md:mb-2">
                  {counter.counter_value.toLocaleString()}{suffix || ''}
                </p>
                <p className="text-[13px] md:text-[15px] lg:text-[16px] text-[#666] font-medium">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}