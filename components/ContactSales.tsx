import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function ContactSales() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="relative bg-black text-white py-[60px] md:py-[80px] lg:py-[100px] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#a74b48]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#a74b48]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[70px] relative z-10">
        {/* Section Header */}
        <div className="text-center mb-[40px] md:mb-[50px] lg:mb-[60px]">
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold mb-[12px] md:mb-[16px]">
            {t('contact.title')} <span className="text-[#a74b48]">{t('contact.titleHighlight')}</span>
          </h2>
          <p className="text-[16px] md:text-[18px] lg:text-[20px] text-gray-400 max-w-[600px] mx-auto px-4">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] md:gap-[40px] lg:gap-[60px]">
          {/* Contact Info Cards */}
          <div className="flex flex-col gap-[16px] md:gap-[20px] lg:gap-[24px]">
            <h3 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold mb-[4px] md:mb-[8px]">{t('contact.getInTouch')}</h3>
            <p className="text-gray-400 mb-[8px] md:mb-[12px] lg:mb-[16px] text-[14px] md:text-[15px] lg:text-[16px]">
              {t('contact.availability')}
            </p>

            {/* Contact Cards */}
            <div className="flex flex-col gap-[12px] md:gap-[14px] lg:gap-[16px]">
              {/* Phone */}
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] md:rounded-[20px] p-[18px] md:p-[20px] lg:p-[24px] hover:bg-white/10 hover:border-[#a74b48]/50 transition-all duration-300">
                <div className="flex items-center gap-[12px] md:gap-[14px] lg:gap-[16px]">
                  <div className="p-[12px] md:p-[14px] lg:p-[16px] bg-[#a74b48]/20 rounded-full group-hover:bg-[#a74b48] transition-colors">
                    <Phone className="size-[20px] md:size-[22px] lg:size-[24px] text-[#a74b48] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] text-gray-400 mb-[4px]">{t('contact.callUs')}</p>
                    <p className="text-[20px] md:text-[22px] lg:text-[24px] font-semibold">{t('footer.contact.phone')}</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] md:rounded-[20px] p-[18px] md:p-[20px] lg:p-[24px] hover:bg-white/10 hover:border-[#a74b48]/50 transition-all duration-300">
                <div className="flex items-center gap-[12px] md:gap-[14px] lg:gap-[16px]">
                  <div className="p-[12px] md:p-[14px] lg:p-[16px] bg-[#a74b48]/20 rounded-full group-hover:bg-[#a74b48] transition-colors">
                    <Mail className="size-[20px] md:size-[22px] lg:size-[24px] text-[#a74b48] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] text-gray-400 mb-[4px]">{t('contact.emailUs')}</p>
                    <p className="text-[20px] md:text-[22px] lg:text-[24px] font-semibold">sales@alfouad.com</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] md:rounded-[20px] p-[18px] md:p-[20px] lg:p-[24px] hover:bg-white/10 hover:border-[#a74b48]/50 transition-all duration-300">
                <div className="flex items-center gap-[12px] md:gap-[14px] lg:gap-[16px]">
                  <div className="p-[12px] md:p-[14px] lg:p-[16px] bg-[#a74b48]/20 rounded-full group-hover:bg-[#a74b48] transition-colors">
                    <MapPin className="size-[20px] md:size-[22px] lg:size-[24px] text-[#a74b48] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] text-gray-400 mb-[4px]">{t('contact.visitUs')}</p>
                    <p className="text-[20px] md:text-[22px] lg:text-[24px] font-semibold">Cairo, Egypt</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-[24px] bg-gradient-to-br from-[#a74b48]/20 to-[#a74b48]/5 border border-[#a74b48]/30 rounded-[20px] p-[24px]">
              <h4 className="text-[18px] font-bold mb-[12px]">{t('contact.businessHours')}</h4>
              <div className="flex flex-col gap-[8px] text-[15px]">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('contact.hours.weekdays')}</span>
                  <span className="font-semibold">{t('contact.hours.weekdaysTime')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('contact.hours.saturday')}</span>
                  <span className="font-semibold">{t('contact.hours.saturdayTime')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('contact.hours.sunday')}</span>
                  <span className="font-semibold">{t('contact.hours.sundayTime')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[24px] p-[40px]">
            <h3 className="text-[28px] font-bold mb-[24px]">{t('contact.form.title')}</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-[14px] font-medium mb-[8px] text-gray-300">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-[20px] py-[14px] bg-white/10 border border-white/20 rounded-[12px] text-white placeholder-gray-500 focus:outline-none focus:border-[#a74b48] focus:ring-2 focus:ring-[#a74b48]/20 transition-all"
                  placeholder={t('contact.form.namePlaceholder')}
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-[14px] font-medium mb-[8px] text-gray-300">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-[20px] py-[14px] bg-white/10 border border-white/20 rounded-[12px] text-white placeholder-gray-500 focus:outline-none focus:border-[#a74b48] focus:ring-2 focus:ring-[#a74b48]/20 transition-all"
                  placeholder={t('contact.form.emailPlaceholder')}
                />
              </div>

              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-[14px] font-medium mb-[8px] text-gray-300">
                  {t('contact.form.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-[20px] py-[14px] bg-white/10 border border-white/20 rounded-[12px] text-white placeholder-gray-500 focus:outline-none focus:border-[#a74b48] focus:ring-2 focus:ring-[#a74b48]/20 transition-all"
                  placeholder={t('contact.form.phonePlaceholder')}
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="block text-[14px] font-medium mb-[8px] text-gray-300">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-[20px] py-[14px] bg-white/10 border border-white/20 rounded-[12px] text-white placeholder-gray-500 focus:outline-none focus:border-[#a74b48] focus:ring-2 focus:ring-[#a74b48]/20 transition-all resize-none"
                  placeholder={t('contact.form.messagePlaceholder')}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-[12px] px-[32px] py-[16px] bg-gradient-to-r from-[#a74b48] to-[#8a3c39] text-white font-semibold text-[18px] rounded-full hover:shadow-xl hover:shadow-[#a74b48]/20 hover:scale-105 transition-all duration-300 mt-[8px]"
              >
                {t('contact.form.submit')}
                <Send className="size-[20px]" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}