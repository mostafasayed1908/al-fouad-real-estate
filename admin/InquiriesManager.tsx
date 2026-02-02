import { useState, useEffect } from 'react';
import { Mail, Phone, User, MapPin, MessageSquare, Trash2, ExternalLink, Calendar, Filter } from 'lucide-react';
import { supabase } from '../utils/supabase/client';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city_id: string | null;
  unit_id: string | null;
  message: string | null;
  created_at: string;
}

interface City {
  id: string;
  name: string;
}

export function InquiriesManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch inquiries
    const { data: inquiriesData, error: inquiriesError } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (inquiriesError) {
      console.error('Error fetching inquiries:', inquiriesError);
      alert('Error loading inquiries');
    } else {
      setInquiries(inquiriesData || []);
    }

    // Fetch cities for filter
    const { data: citiesData } = await supabase
      .from('cities')
      .select('id, name')
      .order('name');
    setCities(citiesData || []);

    setLoading(false);
  };

  const handleDelete = async (inquiryId: string) => {
    if (!confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', inquiryId);

      if (error) throw error;
      alert('Inquiry deleted successfully!');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting inquiry:', error);
      alert('Error deleting inquiry: ' + error.message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredInquiries = () => {
    let filtered = inquiries;

    // Filter by city
    if (filterCity !== 'all') {
      filtered = filtered.filter(inq => inq.city_id === filterCity);
    }

    // Filter by date
    if (filterDate !== 'all') {
      const now = new Date();
      const filterDateObj = new Date();
      
      if (filterDate === 'today') {
        filterDateObj.setHours(0, 0, 0, 0);
      } else if (filterDate === 'week') {
        filterDateObj.setDate(now.getDate() - 7);
      } else if (filterDate === 'month') {
        filterDateObj.setMonth(now.getMonth() - 1);
      }

      filtered = filtered.filter(inq => new Date(inq.created_at) >= filterDateObj);
    }

    return filtered;
  };

  const filteredInquiries = getFilteredInquiries();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[28px] font-bold text-black">Contact Inquiries</h2>
          <p className="text-[16px] text-[#666] mt-1">
            Manage customer inquiries from contact form
          </p>
        </div>
        <div className="bg-[#a74b48] text-white px-6 py-3 rounded-lg">
          <div className="text-[14px] font-semibold">Total Inquiries</div>
          <div className="text-[32px] font-bold">{inquiries.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-[#666]" />
          <span className="text-[16px] font-semibold text-black">Filters:</span>
          
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
          >
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>

          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          {(filterCity !== 'all' || filterDate !== 'all') && (
            <button
              onClick={() => {
                setFilterCity('all');
                setFilterDate('all');
              }}
              className="px-4 py-2 text-[14px] text-[#a74b48] hover:bg-[#a74b48]/5 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}

          <div className="ml-auto text-[14px] text-[#666]">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-[#a74b48]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-[#a74b48]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[20px] font-semibold text-black mb-2">{inquiry.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-[14px] text-[#666]">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${inquiry.email}`} className="hover:text-[#a74b48] transition-colors">
                          {inquiry.email}
                        </a>
                      </div>
                      
                      {inquiry.phone && (
                        <div className="flex items-center gap-2 text-[14px] text-[#666]">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${inquiry.phone}`} className="hover:text-[#a74b48] transition-colors">
                            {inquiry.phone}
                          </a>
                        </div>
                      )}
                      
                      {inquiry.city_id && (
                        <div className="flex items-center gap-2 text-[14px] text-[#666]">
                          <MapPin className="w-4 h-4" />
                          <span>
                            City: {cities.find(c => c.id === inquiry.city_id)?.name || inquiry.city_id}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-[14px] text-[#666]">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(inquiry.created_at)}</span>
                      </div>
                    </div>

                    {inquiry.message && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-[#666] mt-1" />
                          <span className="text-[14px] font-semibold text-black">Message:</span>
                        </div>
                        <p className="text-[14px] text-[#666] leading-relaxed pl-6">
                          {inquiry.message}
                        </p>
                      </div>
                    )}

                    {inquiry.unit_id && (
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[12px] font-semibold">
                        <ExternalLink className="w-3 h-3" />
                        Interested in Unit: {inquiry.unit_id}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(inquiry.id)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex-shrink-0"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInquiries.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <Mail className="w-16 h-16 text-[#ccc] mx-auto mb-4" />
          <h3 className="text-[20px] font-semibold text-[#666] mb-2">
            {inquiries.length === 0 ? 'No inquiries yet' : 'No inquiries match your filters'}
          </h3>
          <p className="text-[#999]">
            {inquiries.length === 0 
              ? 'Customer inquiries from the contact form will appear here'
              : 'Try adjusting your filters to see more results'}
          </p>
        </div>
      )}
    </div>
  );
}
