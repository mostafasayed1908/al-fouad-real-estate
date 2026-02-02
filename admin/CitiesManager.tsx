import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, MapPin, Globe } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import type { City } from '../utils/supabase/client';

export function CitiesManager() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    name_ar: '',
    description: '',
    location: '',
    latitude: 30.0444,
    longitude: 31.2357,
    hero_image: '',
    status: 'active' as 'active' | 'upcoming' | 'completed' | 'sold_out',
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching cities:', error);
      alert('Error loading cities');
    } else {
      setCities(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({
      id: city.id,
      name: city.name,
      name_ar: city.name_ar || '',
      description: city.description || '',
      location: city.location || '',
      latitude: city.latitude,
      longitude: city.longitude,
      hero_image: city.hero_image || '',
      status: city.status,
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingCity(null);
    setFormData({
      id: '',
      name: '',
      name_ar: '',
      description: '',
      location: '',
      latitude: 30.0444,
      longitude: 31.2357,
      hero_image: '',
      status: 'active',
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.latitude || !formData.longitude) {
      alert('Please fill in required fields: Name, Latitude, Longitude');
      return;
    }

    try {
      if (isAddingNew) {
        // Generate ID from name
        const id = formData.name.toLowerCase().replace(/\s+/g, '-');
        const { error } = await supabase
          .from('cities')
          .insert([{ ...formData, id }]);

        if (error) throw error;
        alert('City added successfully!');
      } else if (editingCity) {
        const { error } = await supabase
          .from('cities')
          .update(formData)
          .eq('id', editingCity.id);

        if (error) throw error;
        alert('City updated successfully!');
      }

      setEditingCity(null);
      setIsAddingNew(false);
      fetchCities();
    } catch (error: any) {
      console.error('Error saving city:', error);
      alert('Error saving city: ' + error.message);
    }
  };

  const handleDelete = async (cityId: string) => {
    if (!confirm('Are you sure you want to delete this city? This will also affect related buildings and units.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', cityId);

      if (error) throw error;
      alert('City deleted successfully!');
      fetchCities();
    } catch (error: any) {
      console.error('Error deleting city:', error);
      alert('Error deleting city: ' + error.message);
    }
  };

  const handleCancel = () => {
    setEditingCity(null);
    setIsAddingNew(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666]">Loading cities...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[28px] font-bold text-black">Cities Management</h2>
          <p className="text-[#666] mt-1">Manage your city listings and locations</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3 bg-[#a74b48] hover:bg-[#8a3a37] text-white rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New City
        </button>
      </div>

      {/* Edit/Add Form */}
      {(editingCity || isAddingNew) && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-[20px] font-bold text-black mb-4">
            {isAddingNew ? 'Add New City' : 'Edit City'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name (English) */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">
                Name (English) *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                placeholder="e.g., New Heliopolis"
              />
            </div>

            {/* Name (Arabic) */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">
                Name (Arabic)
              </label>
              <input
                type="text"
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                placeholder="مثلاً، هليوبوليس الجديدة"
                dir="rtl"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                placeholder="e.g., New Cairo, Cairo Governorate"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="sold_out">Sold Out</option>
              </select>
            </div>

            {/* Latitude */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">
                Latitude *
              </label>
              <input
                type="number"
                step="0.00001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                placeholder="e.g., 30.08442"
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">
                Longitude *
              </label>
              <input
                type="number"
                step="0.00001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                placeholder="e.g., 31.32499"
              />
            </div>

            {/* Hero Image URL */}
            <div className="md:col-span-2">
              <label className="block text-[14px] font-semibold text-black mb-2">
                Hero Image URL
              </label>
              <input
                type="text"
                value={formData.hero_image}
                onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                placeholder="https://..."
              />
            </div>

            {/* Description (English) */}
            <div className="md:col-span-2">
              <label className="block text-[14px] font-semibold text-black mb-2">
                Description (English)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none resize-none"
                placeholder="Describe the city..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cities List */}
      <div className="grid grid-cols-1 gap-4">
        {cities.map((city) => (
          <div
            key={city.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[20px] font-bold text-black">{city.name}</h3>
                  {city.name_ar && (
                    <span className="text-[18px] text-[#666]" dir="rtl">({city.name_ar})</span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${
                    city.status === 'active' ? 'bg-green-100 text-green-700' :
                    city.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    city.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {city.status.toUpperCase()}
                  </span>
                </div>
                
                {city.location && (
                  <div className="flex items-center gap-2 text-[#666] mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[14px]">{city.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-[14px] text-[#666] mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{city.latitude.toFixed(5)}, {city.longitude.toFixed(5)}</span>
                  </div>
                </div>

                {city.description && (
                  <p className="text-[14px] text-[#666] mt-2 line-clamp-2">{city.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleEdit(city)}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(city.id)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cities.length === 0 && (
        <div className="text-center py-20">
          <MapPin className="w-16 h-16 text-[#ccc] mx-auto mb-4" />
          <h3 className="text-[20px] font-semibold text-[#666] mb-2">No cities yet</h3>
          <p className="text-[#999]">Click "Add New City" to create your first city</p>
        </div>
      )}
    </div>
  );
}