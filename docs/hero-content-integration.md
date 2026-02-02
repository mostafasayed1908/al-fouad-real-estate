# Hero Content Integration Guide

## Overview
This guide shows how to integrate dynamic hero section content from Supabase into your React components.

## 1. Create Types

First, create TypeScript types for the hero content:

```typescript
// types/hero.ts
export interface HeroContent {
  id: string;
  main_headline_en: string;
  main_headline_ar: string;
  subheadline_en: string;
  subheadline_ar: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroChip {
  id: string;
  title_en: string;
  title_ar: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

export interface HeroRating {
  id: string;
  rating_value: number;
  total_clients: number;
  rating_text_en: string;
  rating_text_ar: string;
  is_active: boolean;
}

export interface HeroData {
  content: HeroContent | null;
  chips: HeroChip[];
  rating: HeroRating | null;
}

export interface Counter {
  id: string;
  counter_value: number;
  counter_label_en: string;
  counter_label_ar: string;
  suffix_en?: string;
  suffix_ar?: string;
  icon_name?: string;
  display_order: number;
  is_active: boolean;
}
```

## 2. Create API Functions

Create utility functions to fetch the data:

```typescript
// utils/api/hero.ts
import { projectId, publicAnonKey } from '../supabase/info';

export async function fetchHeroContent(): Promise<HeroData> {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-74e21526/hero-content`,
    {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch hero content');
  }

  return response.json();
}

export async function fetchCounters(): Promise<Counter[]> {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-74e21526/counters`,
    {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch counters');
  }

  return response.json();
}
```

## 3. Update Hero Section Component

Update your HeroSection component to use dynamic content:

```typescript
// components/HeroSection.tsx
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchHeroContent } from '../utils/api/hero';
import { HeroData } from '../types/hero';
import * as Icons from 'lucide-react';

export function HeroSection() {
  const { language } = useLanguage();
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHeroContent() {
      try {
        const data = await fetchHeroContent();
        setHeroData(data);
      } catch (error) {
        console.error('Error loading hero content:', error);
      } finally {
        setLoading(false);
      }
    }

    loadHeroContent();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const content = heroData?.content;
  const chips = heroData?.chips || [];
  const rating = heroData?.rating;

  const headline = language === 'ar' ? content?.main_headline_ar : content?.main_headline_en;
  const subheadline = language === 'ar' ? content?.subheadline_ar : content?.subheadline_en;

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Headline */}
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          {headline || 'Find Your Perfect Investment'}
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-gray-600 mb-8">
          {subheadline || 'Premium properties in Egypt\'s most sought-after locations'}
        </p>

        {/* Feature Chips */}
        <div className="flex flex-wrap gap-4 mb-8">
          {chips.map((chip) => {
            const IconComponent = Icons[chip.icon_name as keyof typeof Icons] as any;
            const title = language === 'ar' ? chip.title_ar : chip.title_en;

            return (
              <div
                key={chip.id}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200"
              >
                {IconComponent && <IconComponent className="w-5 h-5 text-[#a74b48]" />}
                <span className="text-sm font-medium text-gray-700">{title}</span>
              </div>
            );
          })}
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Icons.Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(rating.rating_value) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="text-gray-700 font-medium">{rating.rating_value}</span>
            <span className="text-gray-500">
              {language === 'ar' ? rating.rating_text_ar : rating.rating_text_en} ({rating.total_clients}+)
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
```

## 4. Update Achievements/Counters Section

Update your AchievementsSection component:

```typescript
// components/AchievementsSection.tsx
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchCounters } from '../utils/api/hero';
import { Counter } from '../types/hero';
import * as Icons from 'lucide-react';

export function AchievementsSection() {
  const { language } = useLanguage();
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCounters() {
      try {
        const data = await fetchCounters();
        setCounters(data);
      } catch (error) {
        console.error('Error loading counters:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCounters();
  }, []);

  if (loading) {
    return <div className="py-20 text-center">Loading statistics...</div>;
  }

  return (
    <section className="bg-gradient-to-r from-[#cd2323] to-[#a74b48] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Our Achievements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {counters.map((counter) => {
            const IconComponent = counter.icon_name 
              ? Icons[counter.icon_name as keyof typeof Icons] as any
              : null;
            const label = language === 'ar' ? counter.counter_label_ar : counter.counter_label_en;
            const suffix = language === 'ar' ? counter.suffix_ar : counter.suffix_en;

            return (
              <div key={counter.id} className="text-center text-white">
                {IconComponent && (
                  <IconComponent className="w-12 h-12 mx-auto mb-4 opacity-80" />
                )}
                <div className="text-5xl font-bold mb-2">
                  {counter.counter_value.toLocaleString()}{suffix}
                </div>
                <div className="text-lg opacity-90">{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

## 5. Example with Animated Counters

For a more engaging experience, add counter animation:

```typescript
import { useState, useEffect, useRef } from 'react';

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);

  useEffect(() => {
    const increment = value / (duration / 16); // 60fps
    const timer = setInterval(() => {
      countRef.current += increment;
      if (countRef.current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(countRef.current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

// Usage in component:
<div className="text-5xl font-bold mb-2">
  <AnimatedCounter value={counter.counter_value} />
  {suffix}
</div>
```

## 6. Error Handling & Fallbacks

Always provide fallback content:

```typescript
const DEFAULT_HERO_CONTENT = {
  content: {
    main_headline_en: 'Find Your Perfect Investment',
    main_headline_ar: 'اعثر على الاستثمار المثالي لك',
    subheadline_en: 'Premium properties in Egypt\'s most sought-after locations',
    subheadline_ar: 'عقارات فاخرة في أكثر المواقع المرموقة في مصر'
  },
  chips: [
    { title_en: 'Premium Locations', title_ar: 'مواقع مميزة', icon_name: 'MapPin' },
    { title_en: 'High ROI', title_ar: 'عائد استثماري عالي', icon_name: 'TrendingUp' },
    { title_en: 'Trusted Developer', title_ar: 'مطور موثوق', icon_name: 'Award' }
  ],
  rating: {
    rating_value: 4.8,
    total_clients: 500,
    rating_text_en: 'from clients',
    rating_text_ar: 'من العملاء'
  }
};

// In your component:
const heroContent = heroData || DEFAULT_HERO_CONTENT;
```

## Best Practices

1. **Caching**: Cache the hero content since it doesn't change frequently
2. **Loading States**: Show skeleton loaders while fetching data
3. **Error Boundaries**: Wrap components in error boundaries
4. **Fallbacks**: Always have default content ready
5. **Performance**: Lazy load icons to reduce bundle size
6. **Accessibility**: Ensure proper ARIA labels for counters
7. **SEO**: Use proper heading hierarchy (h1, h2, etc.)

## Testing

Test your integration:

```typescript
// Test API endpoints
const testHeroContent = async () => {
  const data = await fetchHeroContent();
  console.log('Hero Content:', data);
};

const testCounters = async () => {
  const data = await fetchCounters();
  console.log('Counters:', data);
};
```

## Notes

- The content is fully bilingual (English & Arabic)
- Icons use Lucide React library
- All timestamps are in ISO 8601 format
- Display order determines the arrangement
- Active/inactive flags allow easy content management
