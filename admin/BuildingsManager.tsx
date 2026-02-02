import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Building2, MapPin, Globe, Clock, CheckCircle2, Loader2, Calendar } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import type { Building, City, BuildingTimelinePhase, MasterTimelinePhase } from '../utils/supabase/client';

export function BuildingsManager() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [masterPhases, setMasterPhases] = useState<MasterTimelinePhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    city_id: '',
    description: '',
    description_ar: '',
    address: '',
    latitude: 0,
    longitude: 0,
    floors: 0,
    image: '',
    gallery_image_1: '',
    status: 'available' as 'available' | 'coming_soon' | 'sold_out',
    timeline_phases: [] as BuildingTimelinePhase[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch cities
    const { data: citiesData } = await supabase
      .from('cities')
      .select('*')
      .order('name');
    setCities(citiesData || []);

    // Fetch master timeline phases
    const { data: masterPhasesData } = await supabase
      .from('timeline_phases')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    setMasterPhases(masterPhasesData || []);

    // Fetch buildings
    const { data: buildingsData, error } = await supabase
      .from('buildings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching buildings:', error);
      alert('Error loading buildings');
    } else {
      setBuildings(buildingsData || []);
    }
    setLoading(false);
  };

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    setFormData({
      id: building.id,
      name: building.name,
      city_id: building.city_id,
      description: building.description || '',
      description_ar: building.description_ar || '',
      address: building.address || '',
      latitude: building.latitude || 0,
      longitude: building.longitude || 0,
      floors: building.floors || 0,
      image: building.image || '',
      gallery_image_1: building.gallery_image_1 || '',
      status: building.status || 'available',
      timeline_phases: building.timeline_phases || [],
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingBuilding(null);
    setFormData({
      id: '',
      name: '',
      city_id: cities[0]?.id || '',
      description: '',
      description_ar: '',
      address: '',
      latitude: 0,
      longitude: 0,
      floors: 0,
      image: '',
      gallery_image_1: '',
      status: 'coming_soon',
      timeline_phases: [],
    });
  };

  // Timeline phase management
  const addPhase = () => {
    // Create a new empty phase for free-text input (no master phases needed)
    const newPhase: BuildingTimelinePhase = {
      phase_id: '', // Phase name in English
      phase_name_ar: '', // Phase name in Arabic
      status: 'upcoming',
      order: formData.timeline_phases.length + 1,
    };
    setFormData({
      ...formData,
      timeline_phases: [...formData.timeline_phases, newPhase],
    });
  };

  const updatePhase = (index: number, field: keyof BuildingTimelinePhase, value: string) => {
    const updatedPhases = [...formData.timeline_phases];
    updatedPhases[index] = { ...updatedPhases[index], [field]: value };
    
    // Auto-complete previous phases logic
    if (field === 'status' && (value === 'completed' || value === 'in_progress')) {
      for (let i = 0; i < index; i++) {
        if (updatedPhases[i].status === 'upcoming') {
          updatedPhases[i].status = 'completed' as any;
        }
      }
    }
    
    setFormData({ ...formData, timeline_phases: updatedPhases });
  };

  const removePhase = (index: number) => {
    const updatedPhases = formData.timeline_phases.filter((_, i) => i !== index);
    // Reorder phases
    const reorderedPhases = updatedPhases.map((phase, i) => ({
      ...phase,
      order: i + 1,
    }));
    setFormData({ ...formData, timeline_phases: reorderedPhases });
  };

  const movePhase = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.timeline_phases.length) return;

    const updatedPhases = [...formData.timeline_phases];
    [updatedPhases[index], updatedPhases[newIndex]] = [updatedPhases[newIndex], updatedPhases[index]];
    
    // Update order numbers
    const reorderedPhases = updatedPhases.map((phase, i) => ({
      ...phase,
      order: i + 1,
    }));
    
    setFormData({ ...formData, timeline_phases: reorderedPhases });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.city_id) {
      alert('Please fill in required fields: Name, City');
      return;
    }

    try {
      const dataToSave = {
        name: formData.name,
        city_id: formData.city_id,
        description: formData.description,
        description_ar: formData.description_ar,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        floors: formData.floors,
        image: formData.image,
        gallery_image_1: formData.gallery_image_1,
        status: formData.status,
        timeline_phases: formData.timeline_phases,
      };

      if (isAddingNew) {
        const id = formData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        const { error } = await supabase
          .from('buildings')
          .insert([{ ...dataToSave, id }]);

        if (error) throw error;
        alert('Building added successfully!');
      } else if (editingBuilding) {
        const { error } = await supabase
          .from('buildings')
          .update(dataToSave)
          .eq('id', editingBuilding.id);

        if (error) throw error;
        alert('Building updated successfully!');
      }

      setEditingBuilding(null);
      setIsAddingNew(false);
      fetchData();
    } catch (error: any) {
      console.error('Error saving building:', error);
      alert('Error saving building: ' + error.message);
    }
  };

  const handleDelete = async (buildingId: string) => {
    if (!confirm('Are you sure you want to delete this building?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('buildings')
        .delete()
        .eq('id', buildingId);

      if (error) throw error;
      alert('Building deleted successfully!');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting building:', error);
      alert('Error deleting building: ' + error.message);
    }
  };

  const handleCancel = () => {
    setEditingBuilding(null);
    setIsAddingNew(false);
  };

  const getCityName = (cityId: string) => {
    return cities.find(c => c.id === cityId)?.name || cityId;
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'upcoming':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'in_progress':
        return <Loader2 className="w-4 h-4" />;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPhaseName = (phaseId: string) => {
    const masterPhase = masterPhases.find(mp => mp.id === phaseId);
    return masterPhase ? masterPhase.name : phaseId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666]">Loading buildings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[28px] font-bold text-black">Buildings Management</h2>
          <p className="text-[#666] mt-1">Manage buildings and construction progress</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3 bg-[#a74b48] hover:bg-[#8a3a37] text-white rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Building
        </button>
      </div>

      {/* Edit/Add Form */}
      {(editingBuilding || isAddingNew) && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-[20px] font-bold text-black mb-6">
            {isAddingNew ? 'Add New Building' : 'Edit Building'}
          </h3>
          
          {/* Basic Information */}
          <div className="mb-6">
            <h4 className="text-[16px] font-semibold text-black mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#a74b48]" />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-[14px] font-semibold text-black mb-2">
                  Building Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                  placeholder="e.g., Building A"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-[14px] font-semibold text-black mb-2">
                  City *
                </label>
                <select
                  value={formData.city_id}
                  onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
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
                  <option value="available">Available</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>

              {/* Total Floors */}
              <div>
                <label className="block text-[14px] font-semibold text-black mb-2">
                  Total Floors
                </label>
                <input
                  type="number"
                  value={formData.floors}
                  onChange={(e) => setFormData({ ...formData, floors: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
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
                  placeholder="Describe the building in English..."
                />
              </div>

              {/* Description (Arabic) */}
              <div className="md:col-span-2">
                <label className="block text-[14px] font-semibold text-black mb-2">
                  Description (Arabic) - الوصف بالعربية
                </label>
                <textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  rows={3}
                  dir="rtl"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none resize-none"
                  placeholder="اكتب وصف المبنى بالعربية..."
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="mb-6">
            <h4 className="text-[16px] font-semibold text-black mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#a74b48]" />
              Location
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-[14px] font-semibold text-black mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                  placeholder="Street address"
                />
              </div>

              {/* Latitude */}
              <div>
                <label className="block text-[14px] font-semibold text-black mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                  placeholder="e.g., 30.0444"
                />
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-[14px] font-semibold text-black mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                  placeholder="e.g., 31.2357"
                />
              </div>
            </div>
          </div>

          {/* Timeline Phases */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[16px] font-semibold text-black flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#a74b48]" />
                Construction Timeline Phases
              </h4>
              <button
                onClick={addPhase}
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-[#a74b48] hover:bg-[#8a3a37] text-white rounded-lg text-[14px] font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Phase
              </button>
            </div>

            {formData.timeline_phases.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-[14px] text-gray-500">No timeline phases added yet</p>
                <p className="text-[12px] text-gray-400">Click "Add Phase" to create construction milestones</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.timeline_phases.map((phase, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start gap-3">
                      {/* Order number */}
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => movePhase(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[14px] font-bold text-[#a74b48] border-2 border-[#a74b48]">
                          {index + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => movePhase(index, 'down')}
                          disabled={index === formData.timeline_phases.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ▼
                        </button>
                      </div>

                      {/* Phase details */}
                      <div className="flex-1 grid grid-cols-1 gap-3">
                        {/* Phase Name - English */}
                        <div>
                          <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                            Phase Name (English)
                          </label>
                          <input
                            type="text"
                            value={phase.phase_id}
                            onChange={(e) => updatePhase(index, 'phase_id', e.target.value)}
                            className="w-full px-3 py-2 text-[14px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                            placeholder="e.g., Foundation Work"
                          />
                        </div>

                        {/* Phase Name - Arabic */}
                        <div>
                          <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                            Phase Name (Arabic) - اسم المرحلة
                          </label>
                          <input
                            type="text"
                            value={phase.phase_name_ar || ''}
                            onChange={(e) => updatePhase(index, 'phase_name_ar', e.target.value)}
                            className="w-full px-3 py-2 text-[14px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                            placeholder="مثال: أعمال الأساسات"
                            dir="rtl"
                          />
                        </div>

                        <div>
                          <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                            Status
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={phase.status}
                              onChange={(e) => updatePhase(index, 'status', e.target.value)}
                              className="flex-1 px-3 py-2 text-[14px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                            >
                              <option value="upcoming">Upcoming</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getPhaseStatusColor(phase.status)}`}>
                              {getPhaseIcon(phase.status)}
                              <span className="text-[12px] font-semibold capitalize">
                                {phase.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          {(phase.status === 'completed' || phase.status === 'in_progress') && index > 0 && (
                            <p className="text-[11px] text-blue-600 mt-1">
                              ✓ Previous phases will be marked as completed automatically
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => removePhase(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove phase"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Building
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Buildings List */}
      <div className="grid grid-cols-1 gap-4">
        {buildings.map((building) => (
          <div
            key={building.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[20px] font-bold text-black">{building.name}</h3>
                  <span className="text-[14px] text-[#666]">in {getCityName(building.city_id)}</span>
                  <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${
                    building.status === 'available' ? 'bg-green-100 text-green-700' :
                    building.status === 'coming_soon' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {building.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-[14px] text-[#666] mt-2">
                  <span>Floors: {building.floors || 0}</span>
                  {building.timeline_phases && building.timeline_phases.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {building.timeline_phases.length} phases
                    </span>
                  )}
                  {building.latitude !== 0 && building.longitude !== 0 && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {building.latitude.toFixed(4)}, {building.longitude.toFixed(4)}
                    </span>
                  )}
                </div>

                {building.description && (
                  <p className="text-[14px] text-[#666] mt-2 line-clamp-2">{building.description}</p>
                )}

                {/* Timeline phases preview */}
                {building.timeline_phases && building.timeline_phases.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {building.timeline_phases.slice(0, 3).map((phase, idx) => (
                      <div key={idx} className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold border ${getPhaseStatusColor(phase.status)}`}>
                        {getPhaseIcon(phase.status)}
                        <span>{getPhaseName(phase.phase_id)}</span>
                      </div>
                    ))}
                    {building.timeline_phases.length > 3 && (
                      <div className="flex items-center px-2 py-1 text-[11px] text-gray-500">
                        +{building.timeline_phases.length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleEdit(building)}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(building.id)}
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

      {buildings.length === 0 && (
        <div className="text-center py-20">
          <Building2 className="w-16 h-16 text-[#ccc] mx-auto mb-4" />
          <h3 className="text-[20px] font-semibold text-[#666] mb-2">No buildings yet</h3>
          <p className="text-[#999]">Click "Add New Building" to create your first building</p>
        </div>
      )}
    </div>
  );
}