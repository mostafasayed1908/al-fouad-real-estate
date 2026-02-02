import { Building2, Users, Award, Target, MapPin, Phone, Mail, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AboutUsProps {
  onBackToHome: () => void;
}

export function AboutUs({ onBackToHome }: AboutUsProps) {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920" 
          alt="Al-Fouad Real Estate Investment" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1440px] mx-auto px-[70px] w-full">
            <h1 className="text-white text-[56px] font-bold mb-6">{t('about.hero.title')}</h1>
            <p className="text-white/90 text-[24px] max-w-[700px] leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-[1440px] mx-auto px-[70px] py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-[42px] font-bold text-black mb-6">{t('about.story.title')}</h2>
            <p className="text-[18px] text-[#666] leading-relaxed mb-6">
              {t('about.story.p1')}
            </p>
            <p className="text-[18px] text-[#666] leading-relaxed mb-6">
              {t('about.story.p2')}
            </p>
            <p className="text-[18px] text-[#666] leading-relaxed">
              {t('about.story.p3')}
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800" 
              alt="Modern Architecture" 
              className="w-full h-[500px] object-cover rounded-[24px] shadow-2xl"
            />
            <div className="absolute -bottom-8 -left-8 bg-[#a74b48] text-white p-8 rounded-[20px] shadow-xl">
              <p className="text-[48px] font-bold">10+</p>
              <p className="text-[18px]">{t('about.yearsExcellence')}</p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-gradient-to-br from-[#a74b48] to-[#8a3c39] rounded-[24px] p-10 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-white/20 rounded-full">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-[32px] font-bold">{t('about.mission.title')}</h3>
            </div>
            <p className="text-[18px] leading-relaxed text-white/90">
              {t('about.mission.text')}
            </p>
          </div>

          <div className="bg-[#F8F8F8] rounded-[24px] p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-[#a74b48]/10 rounded-full">
                <Award className="w-8 h-8 text-[#a74b48]" />
              </div>
              <h3 className="text-[32px] font-bold text-black">{t('about.vision.title')}</h3>
            </div>
            <p className="text-[18px] leading-relaxed text-[#666]">
              {t('about.vision.text')}
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-24">
          <h2 className="text-[42px] font-bold text-black mb-4 text-center">{t('about.coreValues.title')}</h2>
          <p className="text-[18px] text-[#666] text-center mb-12 max-w-[800px] mx-auto">
            {t('about.coreValues.subtitle')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-[20px] p-8 shadow-lg hover:shadow-xl transition-shadow border border-[#E5E5E5]">
              <div className="p-4 bg-[#a74b48]/10 rounded-full w-fit mb-6">
                <Award className="w-8 h-8 text-[#a74b48]" />
              </div>
              <h4 className="text-[22px] font-bold text-black mb-3">{t('about.values.excellence.title')}</h4>
              <p className="text-[15px] text-[#666] leading-relaxed">
                {t('about.values.excellence.text')}
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-8 shadow-lg hover:shadow-xl transition-shadow border border-[#E5E5E5]">
              <div className="p-4 bg-[#a74b48]/10 rounded-full w-fit mb-6">
                <Users className="w-8 h-8 text-[#a74b48]" />
              </div>
              <h4 className="text-[22px] font-bold text-black mb-3">{t('about.values.integrity.title')}</h4>
              <p className="text-[15px] text-[#666] leading-relaxed">
                {t('about.values.integrity.text')}
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-8 shadow-lg hover:shadow-xl transition-shadow border border-[#E5E5E5]">
              <div className="p-4 bg-[#a74b48]/10 rounded-full w-fit mb-6">
                <TrendingUp className="w-8 h-8 text-[#a74b48]" />
              </div>
              <h4 className="text-[22px] font-bold text-black mb-3">{t('about.values.innovation.title')}</h4>
              <p className="text-[15px] text-[#666] leading-relaxed">
                {t('about.values.innovation.text')}
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-8 shadow-lg hover:shadow-xl transition-shadow border border-[#E5E5E5]">
              <div className="p-4 bg-[#a74b48]/10 rounded-full w-fit mb-6">
                <Building2 className="w-8 h-8 text-[#a74b48]" />
              </div>
              <h4 className="text-[22px] font-bold text-black mb-3">{t('about.values.sustainability.title')}</h4>
              <p className="text-[15px] text-[#666] leading-relaxed">
                {t('about.values.sustainability.text')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-[#F8F8F8] to-white rounded-[32px] p-16 mb-24">
          <h2 className="text-[42px] font-bold text-black mb-12 text-center">{t('about.achievements.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="p-4 bg-[#a74b48]/10 rounded-full w-fit mx-auto mb-4">
                <Building2 className="w-10 h-10 text-[#a74b48]" />
              </div>
              <p className="text-[48px] font-bold text-[#a74b48] mb-2">15+</p>
              <p className="text-[18px] text-[#666]">{t('about.achievements.projects')}</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-[#a74b48]/10 rounded-full w-fit mx-auto mb-4">
                <Users className="w-10 h-10 text-[#a74b48]" />
              </div>
              <p className="text-[48px] font-bold text-[#a74b48] mb-2">5,000+</p>
              <p className="text-[18px] text-[#666]">{t('about.achievements.families')}</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-[#a74b48]/10 rounded-full w-fit mx-auto mb-4">
                <MapPin className="w-10 h-10 text-[#a74b48]" />
              </div>
              <p className="text-[48px] font-bold text-[#a74b48] mb-2">8</p>
              <p className="text-[18px] text-[#666]">{t('about.achievements.locations')}</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-[#a74b48]/10 rounded-full w-fit mx-auto mb-4">
                <Award className="w-10 h-10 text-[#a74b48]" />
              </div>
              <p className="text-[48px] font-bold text-[#a74b48] mb-2">12</p>
              <p className="text-[18px] text-[#666]">{t('about.achievements.awards')}</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-24">
          <h2 className="text-[42px] font-bold text-black mb-4 text-center">{t('about.whyChoose.title')}</h2>
          <p className="text-[18px] text-[#666] text-center mb-12 max-w-[800px] mx-auto">
            {t('about.whyChoose.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-white rounded-[20px] p-8 border-2 border-[#E5E5E5] hover:border-[#a74b48] transition-all h-full">
                <div className="text-[48px] font-bold text-[#a74b48] mb-4">01</div>
                <h4 className="text-[24px] font-bold text-black mb-4">{t('about.whyChoose.1.title')}</h4>
                <p className="text-[16px] text-[#666] leading-relaxed">
                  {t('about.whyChoose.1.text')}
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-[20px] p-8 border-2 border-[#E5E5E5] hover:border-[#a74b48] transition-all h-full">
                <div className="text-[48px] font-bold text-[#a74b48] mb-4">02</div>
                <h4 className="text-[24px] font-bold text-black mb-4">{t('about.whyChoose.2.title')}</h4>
                <p className="text-[16px] text-[#666] leading-relaxed">
                  {t('about.whyChoose.2.text')}
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-[20px] p-8 border-2 border-[#E5E5E5] hover:border-[#a74b48] transition-all h-full">
                <div className="text-[48px] font-bold text-[#a74b48] mb-4">03</div>
                <h4 className="text-[24px] font-bold text-black mb-4">{t('about.whyChoose.3.title')}</h4>
                <p className="text-[16px] text-[#666] leading-relaxed">
                  {t('about.whyChoose.3.text')}
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-[20px] p-8 border-2 border-[#E5E5E5] hover:border-[#a74b48] transition-all h-full">
                <div className="text-[48px] font-bold text-[#a74b48] mb-4">04</div>
                <h4 className="text-[24px] font-bold text-black mb-4">{t('about.whyChoose.4.title')}</h4>
                <p className="text-[16px] text-[#666] leading-relaxed">
                  {t('about.whyChoose.4.text')}
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-[20px] p-8 border-2 border-[#E5E5E5] hover:border-[#a74b48] transition-all h-full">
                <div className="text-[48px] font-bold text-[#a74b48] mb-4">05</div>
                <h4 className="text-[24px] font-bold text-black mb-4">{t('about.whyChoose.5.title')}</h4>
                <p className="text-[16px] text-[#666] leading-relaxed">
                  {t('about.whyChoose.5.text')}
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-[20px] p-8 border-2 border-[#E5E5E5] hover:border-[#a74b48] transition-all h-full">
                <div className="text-[48px] font-bold text-[#a74b48] mb-4">06</div>
                <h4 className="text-[24px] font-bold text-black mb-4">{t('about.whyChoose.6.title')}</h4>
                <p className="text-[16px] text-[#666] leading-relaxed">
                  {t('about.whyChoose.6.text')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-br from-[#a74b48] to-[#8a3c39] rounded-[32px] p-16 text-white text-center">
          <h2 className="text-[42px] font-bold mb-6">{t('about.cta.title')}</h2>
          <p className="text-[20px] text-white/90 mb-8 max-w-[700px] mx-auto">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onBackToHome}
              className="bg-white text-[#a74b48] px-8 py-4 rounded-full font-semibold text-[18px] hover:bg-gray-100 transition-colors"
            >
              {t('about.cta.explore')}
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-[18px] hover:bg-white/10 transition-colors">
              {t('about.cta.contact')}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/20">
            <div className="flex flex-col items-center">
              <MapPin className="w-8 h-8 mb-3" />
              <p className="text-[16px] text-white/80">{t('footer.contact.address')}</p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 mb-3" />
              <p className="text-[16px] text-white/80">{t('footer.contact.phone')}</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 mb-3" />
              <p className="text-[16px] text-white/80">{t('footer.contact.email')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}