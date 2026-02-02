import { useState } from 'react';
import { FileText, MessageSquare, BarChart3, Image } from 'lucide-react';

export function ContentManager() {
  const [activeTab, setActiveTab] = useState<'testimonials' | 'hero' | 'counters'>('testimonials');

  const tabs = [
    { id: 'testimonials' as const, label: 'Testimonials', icon: MessageSquare },
    { id: 'hero' as const, label: 'Hero Section', icon: Image },
    { id: 'counters' as const, label: 'Counters', icon: BarChart3 },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[28px] font-bold text-black">Content Management</h2>
        <p className="text-[#666] mt-1">Manage website content, testimonials, and counters</p>
      </div>

      {/* Sub Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-[15px] border-b-2 transition-all ${
                  isActive
                    ? 'border-[#a74b48] text-[#a74b48] bg-[#a74b48]/5'
                    : 'border-transparent text-[#666] hover:text-black hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'testimonials' && <TestimonialsContent />}
          {activeTab === 'hero' && <HeroContent />}
          {activeTab === 'counters' && <CountersContent />}
        </div>
      </div>
    </div>
  );
}

function TestimonialsContent() {
  return (
    <div>
      <div className="text-center py-12">
        <MessageSquare className="w-16 h-16 text-[#a74b48] mx-auto mb-4" />
        <h3 className="text-[20px] font-semibold text-black mb-2">Testimonials Management</h3>
        <p className="text-[#666] mb-4">
          Testimonials are currently managed in the KV store using the key <code className="bg-gray-100 px-2 py-1 rounded">testimonials</code>
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto text-left">
          <h4 className="font-semibold text-black mb-2">Current Structure:</h4>
          <pre className="text-[12px] text-[#666] overflow-x-auto">
{`{
  "testimonials": [
    {
      "id": "1",
      "name": "Ahmed Hassan",
      "role": "Property Owner",
      "content": "...",
      "rating": 5,
      "image": "https://..."
    }
  ]
}`}
          </pre>
          <p className="text-[13px] text-[#666] mt-3">
            💡 <strong>Tip:</strong> You can manage testimonials directly in the Supabase dashboard by editing the KV store table.
          </p>
        </div>
      </div>
    </div>
  );
}

function HeroContent() {
  return (
    <div>
      <div className="text-center py-12">
        <Image className="w-16 h-16 text-[#a74b48] mx-auto mb-4" />
        <h3 className="text-[20px] font-semibold text-black mb-2">Hero Section Management</h3>
        <p className="text-[#666] mb-4">
          Hero content is currently managed in the KV store using the key <code className="bg-gray-100 px-2 py-1 rounded">hero_content</code>
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto text-left">
          <h4 className="font-semibold text-black mb-2">Current Structure:</h4>
          <pre className="text-[12px] text-[#666] overflow-x-auto">
{`{
  "hero_content": {
    "title": "Find Your Perfect Investment",
    "subtitle": "Premium properties...",
    "background_image": "https://...",
    "cta_text": "Explore Properties",
    "featured_property": {
      "name": "Luxury Apartment",
      "price": "2.5M EGP",
      "image": "https://..."
    }
  }
}`}
          </pre>
          <p className="text-[13px] text-[#666] mt-3">
            💡 <strong>Tip:</strong> You can manage hero content directly in the Supabase dashboard by editing the KV store table.
          </p>
        </div>
      </div>
    </div>
  );
}

function CountersContent() {
  return (
    <div>
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-[#a74b48] mx-auto mb-4" />
        <h3 className="text-[20px] font-semibold text-black mb-2">Counters Management</h3>
        <p className="text-[#666] mb-4">
          Achievement counters are currently managed in the KV store using the key <code className="bg-gray-100 px-2 py-1 rounded">counters</code>
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto text-left">
          <h4 className="font-semibold text-black mb-2">Current Structure:</h4>
          <pre className="text-[12px] text-[#666] overflow-x-auto">
{`{
  "counters": {
    "buildings": 50,
    "clients": 1000,
    "awards": 15,
    "years": 20
  }
}`}
          </pre>
          <p className="text-[13px] text-[#666] mt-3">
            💡 <strong>Tip:</strong> You can manage counters directly in the Supabase dashboard by editing the KV store table.
          </p>
        </div>
      </div>
    </div>
  );
}
