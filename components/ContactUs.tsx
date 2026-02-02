import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Home as HomeIcon, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LeafletMap } from './LeafletMap';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';

interface ContactUsProps {
  onNavigateHome: () => void;
}

interface City {
  id: string;
  name: string;
  name_ar: string;
}

export function ContactUs({ onNavigateHome }: ContactUsProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    city: ''
  });
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    const { data, error } = await supabase
      .from('cities')
      .select('id, name, name_ar')
      .order('name');
    
    if (data && !error) {
      setCities(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-74e21526/inquiries`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: `Subject: ${formData.subject}\n\n${formData.message}`,
            city_id: formData.city || null,
            unit_id: null
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        city: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-white pt-[98px]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#a74b48] to-[#cd2323] text-white py-20">
        <div className="max-w-[1440px] mx-auto px-[70px]">
          <div className="text-center">
            <h1 className="text-[48px] font-bold mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-[20px] text-white/90 max-w-[700px] mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="max-w-[1440px] mx-auto px-[70px] py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h2 className="text-[36px] font-bold text-black mb-6">
              {t('contact.getInTouch')}
            </h2>
            <p className="text-[18px] text-[#666] mb-10 leading-relaxed">
              {t('contact.description')}
            </p>

            <div className="space-y-6">
              {/* Office Address */}
              <div className="flex items-start gap-4 p-6 bg-[#f5f5f5] rounded-[20px] hover:bg-[#fff5f5] transition-colors">
                <div className="bg-[#a74b48] p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-black mb-2">
                    {t('contact.address')}
                  </h3>
                  <p className="text-[16px] text-[#666]">
                    {t('contact.addressValue')}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-6 bg-[#f5f5f5] rounded-[20px] hover:bg-[#fff5f5] transition-colors">
                <div className="bg-[#a74b48] p-3 rounded-full">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-black mb-2">
                    {t('contact.phone')}
                  </h3>
                  <p className="text-[16px] text-[#666] dir-ltr">
                    +20 123 456 7890
                  </p>
                  <p className="text-[16px] text-[#666] dir-ltr">
                    +20 100 123 4567
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-6 bg-[#f5f5f5] rounded-[20px] hover:bg-[#fff5f5] transition-colors">
                <div className="bg-[#a74b48] p-3 rounded-full">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-black mb-2">
                    {t('contact.email')}
                  </h3>
                  <p className="text-[16px] text-[#666]">
                    info@alfouad-realestate.com
                  </p>
                  <p className="text-[16px] text-[#666]">
                    sales@alfouad-realestate.com
                  </p>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="mt-10 p-6 bg-black text-white rounded-[20px]">
              <h3 className="text-[24px] font-bold mb-4">
                {t('contact.workingHours')}
              </h3>
              <div className="space-y-2 text-[16px]">
                <p className="flex justify-between">
                  <span>{t('contact.weekdays')}</span>
                  <span className="text-[#a74b48] font-medium">9:00 AM - 6:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>{t('contact.saturday')}</span>
                  <span className="text-[#a74b48] font-medium">10:00 AM - 4:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>{t('contact.friday')}</span>
                  <span className="text-[#888]">{t('contact.closed')}</span>
                </p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-10 p-6 bg-black text-white rounded-[20px]">
              <h3 className="text-[24px] font-bold mb-4">
                {t('contact.socialMedia')}
              </h3>
              <div className="space-y-2 text-[16px]">
                <p className="flex justify-between">
                  <span>Facebook</span>
                  <a href="https://www.facebook.com/alfouadrealestate" target="_blank" className="text-[#a74b48] font-medium">Visit</a>
                </p>
                <p className="flex justify-between">
                  <span>Instagram</span>
                  <a href="https://www.instagram.com/alfouadrealestate" target="_blank" className="text-[#a74b48] font-medium">Visit</a>
                </p>
                <p className="flex justify-between">
                  <span>LinkedIn</span>
                  <a href="https://www.linkedin.com/company/alfouad-realestate" target="_blank" className="text-[#a74b48] font-medium">Visit</a>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white border-2 border-[#e5e5e5] rounded-[20px] p-8">
              <h2 className="text-[32px] font-bold text-black mb-6">
                {t('contact.sendMessage')}
              </h2>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  {t('contact.successMessage')}
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-[16px] font-medium text-black mb-2">
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-lg focus:border-[#a74b48] focus:outline-none transition-colors"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-[16px] font-medium text-black mb-2">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-lg focus:border-[#a74b48] focus:outline-none transition-colors"
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-[16px] font-medium text-black mb-2">
                    {t('contact.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-lg focus:border-[#a74b48] focus:outline-none transition-colors"
                    placeholder={t('contact.form.phonePlaceholder')}
                  />
                </div>

                {/* City Dropdown */}
                <div>
                  <label htmlFor="city" className="block text-[16px] font-medium text-black mb-2">
                    {t('contact.form.city')}
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-lg focus:border-[#a74b48] focus:outline-none transition-colors bg-white"
                  >
                    <option value="">{t('contact.form.cityPlaceholder')}</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {language === 'ar' ? city.name_ar : city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-[16px] font-medium text-black mb-2">
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-lg focus:border-[#a74b48] focus:outline-none transition-colors"
                    placeholder={t('contact.form.subjectPlaceholder')}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-[16px] font-medium text-black mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-lg focus:border-[#a74b48] focus:outline-none transition-colors resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#cd2323] to-[#a74b48] text-white py-4 px-6 rounded-lg font-medium text-[18px] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('contact.form.submit')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-[#f5f5f5] py-16">
        <div className="max-w-[1440px] mx-auto px-[70px]">
          <h2 className="text-[36px] font-bold text-black mb-8 text-center">
            {t('contact.findUs')}
          </h2>
          <div className="bg-white rounded-[20px] overflow-hidden shadow-lg h-[450px]">
            <LeafletMap />
          </div>
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="max-w-[1440px] mx-auto px-[70px] py-10">
        <button
          onClick={onNavigateHome}
          className="mx-auto block px-8 py-3 bg-black text-white rounded-lg hover:bg-[#a74b48] transition-colors"
        >
          {t('contact.backToHome')}
        </button>
      </div>
    </div>
  );
}