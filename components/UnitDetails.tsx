import { useState, useEffect } from 'react';
import { MapPin, Home, BedDouble, Bath, Maximize, DollarSign, Calendar, Check, X, Phone, Mail, User, MessageSquare, ArrowLeft, Building2 } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import type { Unit, Building, City } from '../utils/supabase/client';
import { Map } from './Map';
import { formatPrice, submitInquiry } from '../utils/supabase/queries';

interface UnitDetailsProps {
  unitId: string;
  onBack: () => void;
  onBackToHome: () => void;
}

export function UnitDetails({ unitId, onBack, onBackToHome }: UnitDetailsProps) {
  const [unit, setUnit] = useState<Unit | null>(null);
  const [building, setBuilding] = useState<Building | null>(null);
  const [city, setCity] = useState<City | null>(null);
  const [similarUnits, setSimilarUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Inquiry form state
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Payment calculator state
  const [downPayment, setDownPayment] = useState(20);
  const [years, setYears] = useState(5);

  useEffect(() => {
    async function fetchUnitData() {
      setLoading(true);

      // Fetch unit details
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('*')
        .eq('id', unitId)
        .maybeSingle();

      if (unitError || !unitData) {
        console.error('Error fetching unit:', unitError);
        setLoading(false);
        return;
      }

      setUnit(unitData);

      // Fetch building details
      const { data: buildingData } = await supabase
        .from('buildings')
        .select('*')
        .eq('id', unitData.building_id)
        .maybeSingle();

      setBuilding(buildingData);

      // Fetch city details
      const { data: cityData } = await supabase
        .from('cities')
        .select('*')
        .eq('id', unitData.city_id)
        .maybeSingle();

      setCity(cityData);

      // Fetch similar units (same city, similar price range)
      const priceRange = unitData.price * 0.2; // 20% price range
      const { data: similarData } = await supabase
        .from('units')
        .select('*')
        .eq('city_id', unitData.city_id)
        .neq('id', unitId)
        .eq('status', 'available')
        .gte('price', unitData.price - priceRange)
        .lte('price', unitData.price + priceRange)
        .limit(3);

      setSimilarUnits(similarData || []);
      setLoading(false);
    }

    fetchUnitData();
  }, [unitId]);

  useEffect(() => {
    if (unit?.installment_years) {
      setYears(unit.installment_years);
    }
    if (unit?.down_payment_percentage) {
      setDownPayment(unit.down_payment_percentage);
    }
  }, [unit]);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await submitInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      city_id: unit?.city_id || null,
      unit_id: unitId,
      message: formData.message || null
    });

    setSubmitting(false);

    if (result.success) {
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setShowInquiryForm(false);
        setSubmitSuccess(false);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666] text-[18px]">Loading unit details...</p>
        </div>
      </div>
    );
  }

  if (!unit || !city) {
    return (
      <div className="min-h-screen pt-32 px-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[32px] font-bold text-black mb-4">Unit not found</h2>
          <button 
            onClick={onBack}
            className="bg-[#a74b48] text-white px-6 py-3 rounded-[8px] hover:bg-[#8f3f3c] transition-colors"
          >
            Back to Project
          </button>
        </div>
      </div>
    );
  }

  // Gallery images
  const galleryImages = unit.images && unit.images.length > 0 
    ? unit.images 
    : [
        unit.image || 'https://images.unsplash.com/photo-1738168246881-40f35f8aba0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
        'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
        'https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
      ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const principal = unit.price * (1 - downPayment / 100);
    const months = years * 12;
    return principal / months;
  };

  const monthlyPayment = calculateMonthlyPayment();

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-[#F8F8F8] pt-[120px] pb-6">
        <div className="max-w-[1440px] mx-auto px-[70px]">
          <div className="flex items-center gap-2 text-[14px]">
            <button onClick={onBackToHome} className="text-[#666] hover:text-[#a74b48] transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </button>
            <MapPin className="w-4 h-4 text-[#999]" />
            <button onClick={onBack} className="text-[#666] hover:text-[#a74b48] transition-colors">
              {city.name}
            </button>
            <MapPin className="w-4 h-4 text-[#999]" />
            <span className="text-black font-medium">{unit.unit_number}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-[70px] py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative h-[500px] rounded-[16px] overflow-hidden mb-4">
                <img 
                  src={galleryImages[currentImageIndex]} 
                  alt={`Unit ${unit.unit_number}`}
                  className="w-full h-full object-cover"
                />
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <ArrowLeft className="w-6 h-6 text-black" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <MapPin className="w-6 h-6 text-black" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {galleryImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Grid */}
              {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {galleryImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-[100px] rounded-[8px] overflow-hidden ${
                        index === currentImageIndex ? 'ring-4 ring-[#a74b48]' : ''
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Unit Specifications */}
            <div className="bg-white rounded-[16px] border border-[#E5E5E5] p-8 mb-8">
              <h2 className="text-[28px] font-bold text-black mb-6">Unit Specifications</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#a74b48]/10 rounded-[12px] flex items-center justify-center shrink-0">
                    <Maximize className="w-6 h-6 text-[#a74b48]" />
                  </div>
                  <div>
                    <p className="text-[14px] text-[#666] mb-1">Area</p>
                    <p className="text-[18px] font-bold text-black">{unit.area} sqm</p>
                  </div>
                </div>

                {unit.bedrooms && (
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-[#a74b48]/10 rounded-[12px] flex items-center justify-center shrink-0">
                      <BedDouble className="w-6 h-6 text-[#a74b48]" />
                    </div>
                    <div>
                      <p className="text-[14px] text-[#666] mb-1">Bedrooms</p>
                      <p className="text-[18px] font-bold text-black">{unit.bedrooms}</p>
                    </div>
                  </div>
                )}

                {unit.bathrooms && (
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-[#a74b48]/10 rounded-[12px] flex items-center justify-center shrink-0">
                      <Bath className="w-6 h-6 text-[#a74b48]" />
                    </div>
                    <div>
                      <p className="text-[14px] text-[#666] mb-1">Bathrooms</p>
                      <p className="text-[18px] font-bold text-black">{unit.bathrooms}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#a74b48]/10 rounded-[12px] flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#a74b48]" />
                  </div>
                  <div>
                    <p className="text-[14px] text-[#666] mb-1">Floor</p>
                    <p className="text-[18px] font-bold text-black">{unit.floor}</p>
                  </div>
                </div>

                {building && (
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-[#a74b48]/10 rounded-[12px] flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-[#a74b48]" />
                    </div>
                    <div>
                      <p className="text-[14px] text-[#666] mb-1">Building</p>
                      <p className="text-[18px] font-bold text-black">{building.name}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#a74b48]/10 rounded-[12px] flex items-center justify-center shrink-0">
                    <Check className="w-6 h-6 text-[#a74b48]" />
                  </div>
                  <div>
                    <p className="text-[14px] text-[#666] mb-1">Status</p>
                    <p className="text-[18px] font-bold text-black capitalize">{unit.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Calculator */}
            {(unit.payment_type === 'Installments' || unit.payment_type === 'Both') && (
              <div className="bg-[#F8F8F8] rounded-[16px] p-8 mb-8">
                <h2 className="text-[28px] font-bold text-black mb-6">Payment Calculator</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center justify-between mb-3">
                      <span className="text-[16px] font-semibold text-black">Down Payment</span>
                      <span className="text-[18px] font-bold text-[#a74b48]">{downPayment}%</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full h-2 bg-[#E5E5E5] rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #a74b48 0%, #a74b48 ${downPayment * 2}%, #E5E5E5 ${downPayment * 2}%, #E5E5E5 100%)`
                      }}
                    />
                    <div className="flex justify-between text-[12px] text-[#666] mt-1">
                      <span>10%</span>
                      <span>50%</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between mb-3">
                      <span className="text-[16px] font-semibold text-black">Installment Period</span>
                      <span className="text-[18px] font-bold text-[#a74b48]">{years} Years</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-full h-2 bg-[#E5E5E5] rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #a74b48 0%, #a74b48 ${years * 10}%, #E5E5E5 ${years * 10}%, #E5E5E5 100%)`
                      }}
                    />
                    <div className="flex justify-between text-[12px] text-[#666] mt-1">
                      <span>1 Year</span>
                      <span>10 Years</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E5E5]">
                    <div>
                      <p className="text-[14px] text-[#666] mb-1">Down Payment Amount</p>
                      <p className="text-[20px] font-bold text-black">
                        {formatPrice(unit.price * (downPayment / 100), unit.price_currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[14px] text-[#666] mb-1">Monthly Payment</p>
                      <p className="text-[20px] font-bold text-[#a74b48]">
                        {formatPrice(monthlyPayment, unit.price_currency)}/mo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Location Map */}
            <Map 
              projectName={building?.name || city?.name || 'Building Location'} 
              location={city?.location || undefined}
              address={building?.address}
              latitude={building?.latitude}
              longitude={building?.longitude}
            />
          </div>

          {/* Right Column - Pricing and CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              {/* Pricing Card */}
              <div className="bg-white rounded-[16px] border-2 border-[#a74b48] p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-6 h-6 text-[#a74b48]" />
                  <h3 className="text-[20px] font-bold text-black">Pricing</h3>
                </div>
                
                <div className="mb-6">
                  <p className="text-[14px] text-[#666] mb-2">Unit Number</p>
                  <p className="text-[32px] font-bold text-black mb-4">{unit.unit_number}</p>
                  
                  <p className="text-[14px] text-[#666] mb-2">Total Price</p>
                  <p className="text-[36px] font-bold text-[#a74b48]">
                    {formatPrice(unit.price, unit.price_currency)}
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-[#666]" />
                  <span className={`px-3 py-1 rounded-full text-[14px] font-medium ${
                    unit.payment_type === 'Cash' 
                      ? 'bg-green-100 text-green-700' 
                      : unit.payment_type === 'Installments'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {unit.payment_type}
                  </span>
                </div>

                {unit.installment_years && (
                  <div className="bg-[#F8F8F8] rounded-[12px] p-4 mb-6">
                    <p className="text-[14px] text-[#666] mb-1">Installment Plan</p>
                    <p className="text-[18px] font-bold text-black">
                      Up to {unit.installment_years} years
                    </p>
                    {unit.down_payment_percentage && (
                      <p className="text-[14px] text-[#666] mt-2">
                        Min. down payment: {unit.down_payment_percentage}%
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setShowInquiryForm(true)}
                  className="w-full bg-[#a74b48] text-white py-4 rounded-[12px] font-bold text-[16px] hover:bg-[#8f3f3c] transition-all shadow-lg hover:shadow-xl mb-3"
                >
                  Request Information
                </button>

                <button
                  onClick={onBack}
                  className="w-full border-2 border-[#E5E5E5] text-black py-4 rounded-[12px] font-semibold text-[16px] hover:border-[#a74b48] hover:text-[#a74b48] transition-all"
                >
                  Back to Project
                </button>
              </div>

              {/* Project Info */}
              <div className="bg-[#F8F8F8] rounded-[16px] p-6">
                <h3 className="text-[18px] font-bold text-black mb-4">{city.name}</h3>
                {city.location && (
                  <div className="flex items-center gap-2 text-[#666] mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[14px]">{city.location}</span>
                  </div>
                )}
                <p className="text-[14px] text-[#666]">{city.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Units */}
        {similarUnits.length > 0 && (
          <div className="mt-20">
            <h2 className="text-[32px] font-bold text-black mb-8">Similar Units</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarUnits.map((similarUnit) => (
                <div
                  key={similarUnit.id}
                  className="bg-white rounded-[12px] border border-[#E5E5E5] overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // This will trigger a re-render with new unitId
                    window.location.hash = similarUnit.id;
                  }}
                >
                  <div className="relative h-[200px]">
                    <img 
                      src={similarUnit.image || 'https://images.unsplash.com/photo-1738168246881-40f35f8aba0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'}
                      alt={similarUnit.unit_number}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[20px] font-bold text-black">{similarUnit.unit_number}</h3>
                      <span className="text-[14px] text-[#666]">Floor {similarUnit.floor}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-3 text-[14px] text-[#666]">
                      <span>{similarUnit.area} sqm</span>
                      {similarUnit.bedrooms && <span>{similarUnit.bedrooms} BR</span>}
                      {similarUnit.bathrooms && <span>{similarUnit.bathrooms} BA</span>}
                    </div>
                    <p className="text-[24px] font-bold text-[#a74b48]">
                      {formatPrice(similarUnit.price, similarUnit.price_currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Form Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] max-w-[500px] w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInquiryForm(false)}
              className="absolute top-4 right-4 text-[#666] hover:text-black"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-[28px] font-bold text-black mb-2">Request Information</h3>
            <p className="text-[14px] text-[#666] mb-6">
              Fill out the form below and we'll get back to you shortly about Unit {unit.unit_number}.
            </p>

            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-[12px] p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-[20px] font-bold text-green-800 mb-2">Thank You!</h4>
                <p className="text-[14px] text-green-700">Your inquiry has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-[14px] font-semibold text-black mb-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[8px] focus:outline-none focus:border-[#a74b48] transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[14px] font-semibold text-black mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[8px] focus:outline-none focus:border-[#a74b48] transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[14px] font-semibold text-black mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[8px] focus:outline-none focus:border-[#a74b48] transition-colors"
                    placeholder="+20 123 456 7890"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[14px] font-semibold text-black mb-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[8px] focus:outline-none focus:border-[#a74b48] transition-colors resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#a74b48] text-white py-4 rounded-[12px] font-bold text-[16px] hover:bg-[#8f3f3c] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}