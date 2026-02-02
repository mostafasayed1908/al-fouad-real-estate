import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Home } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import type { Unit, Building, City } from '../utils/supabase/client';

export function UnitsManager() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState('all');
  const [filterBuilding, setFilterBuilding] = useState('all');
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    city_id: '',
    building_id: '',
    unit_number: '',
    type: 'apartment' as 'apartment' | 'penthouse' | 'villa' | 'townhouse' | 'studio',
    bedrooms: 2,
    bathrooms: 2,
    area: 100,
    floor: 1,
    price_egp: 1000000,
    price_installment: 1200000,
    installment_years: 5,
    status: 'available' as 'available' | 'reserved' | 'sold',
    description: '',
    features: '',
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

    // Fetch buildings
    const { data: buildingsData } = await supabase
      .from('buildings')
      .select('*')
      .order('name');
    setBuildings(buildingsData || []);

    // Fetch units
    const { data: unitsData, error } = await supabase
      .from('units')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching units:', error);
      alert('Error loading units');
    } else {
      setUnits(unitsData || []);
    }
    setLoading(false);
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setFormData({
      id: unit.id,
      city_id: unit.city_id,
      building_id: unit.building_id,
      unit_number: unit.unit_number,
      type: unit.type,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      area: unit.area,
      floor: unit.floor,
      price_egp: unit.price_egp,
      price_installment: unit.price_installment || unit.price_egp * 1.2,
      installment_years: unit.installment_years || 5,
      status: unit.status,
      description: unit.description || '',
      features: unit.features || '',
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingUnit(null);
    setFormData({
      id: '',
      city_id: cities[0]?.id || '',
      building_id: buildings[0]?.id || '',
      unit_number: '',
      type: 'apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: 100,
      floor: 1,
      price_egp: 1000000,
      price_installment: 1200000,
      installment_years: 5,
      status: 'available',
      description: '',
      features: '',
    });
  };

  const handleSave = async () => {
    if (!formData.unit_number || !formData.building_id || !formData.city_id) {
      alert('Please fill in required fields: Unit Number, Building, City');
      return;
    }

    try {
      if (isAddingNew) {
        const id = `unit-${formData.building_id}-${formData.unit_number}-${Date.now()}`;
        const { error } = await supabase
          .from('units')
          .insert([{ ...formData, id }]);

        if (error) throw error;
        alert('Unit added successfully!');
      } else if (editingUnit) {
        const { error } = await supabase
          .from('units')
          .update(formData)
          .eq('id', editingUnit.id);

        if (error) throw error;
        alert('Unit updated successfully!');
      }

      setEditingUnit(null);
      setIsAddingNew(false);
      fetchData();
    } catch (error: any) {
      console.error('Error saving unit:', error);
      alert('Error saving unit: ' + error.message);
    }
  };

  const handleDelete = async (unitId: string) => {
    if (!confirm('Are you sure you want to delete this unit?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', unitId);

      if (error) throw error;
      alert('Unit deleted successfully!');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting unit:', error);
      alert('Error deleting unit: ' + error.message);
    }
  };

  const handleCancel = () => {
    setEditingUnit(null);
    setIsAddingNew(false);
  };

  const getBuildingName = (buildingId: string) => {
    return buildings.find(b => b.id === buildingId)?.name || buildingId;
  };

  const getCityName = (cityId: string) => {
    return cities.find(c => c.id === cityId)?.name || cityId;
  };

  const filteredUnits = units.filter(unit => {
    if (filterCity !== 'all' && unit.city_id !== filterCity) return false;
    if (filterBuilding !== 'all' && unit.building_id !== filterBuilding) return false;
    return true;
  });

  const filteredBuildings = filterCity === 'all' 
    ? buildings 
    : buildings.filter(b => b.city_id === filterCity);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666]">Loading units...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[28px] font-bold text-black">Units Management</h2>
          <p className="text-[#666] mt-1">Manage property units and their details</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3 bg-[#a74b48] hover:bg-[#8a3a37] text-white rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Unit
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[14px] font-semibold text-black mb-2">Filter by City</label>
            <select
              value={filterCity}
              onChange={(e) => {
                setFilterCity(e.target.value);
                setFilterBuilding('all');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-black mb-2">Filter by Building</label>
            <select
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
            >
              <option value="all">All Buildings</option>
              {filteredBuildings.map(building => (
                <option key={building.id} value={building.id}>{building.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Edit/Add Form */}
      {(editingUnit || isAddingNew) && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-[20px] font-bold text-black mb-4">
            {isAddingNew ? 'Add New Unit' : 'Edit Unit'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">City *</label>
              <select
                value={formData.city_id}
                onChange={(e) => setFormData({ ...formData, city_id: e.target.value, building_id: '' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
              >
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            {/* Building */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">Building *</label>
              <select
                value={formData.building_id}
                onChange={(e) => setFormData({ ...formData, building_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
              >
                <option value="">Select Building</option>
                {buildings.filter(b => b.city_id === formData.city_id).map(building => (
                  <option key={building.id} value={building.id}>{building.name}</option>
                ))}
              </select>
            </div>

            {/* Unit Number */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">Unit Number *</label>
              <input
                type="text"
                value={formData.unit_number}
                onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                placeholder="e.g., A101"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
              >
                <option value="apartment">Apartment</option>
                <option value="penthouse">Penthouse</option>
                <option value="villa">Villa</option>
                <option value="townhouse">Townhouse</option>
                <option value="studio">Studio</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            {/* Floor */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">Floor</label>
              <input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">Bedrooms</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
              />
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">Bathrooms</label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">Area (m²)</label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
              />
            </div>

            {/* Price Cash */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">Price (Cash EGP)</label>
              <input
                type="number"
                value={formData.price_egp}
                onChange={(e) => setFormData({ ...formData, price_egp: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
              />
            </div>

            {/* Price Installment */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">Price (Installment EGP)</label>
              <input
                type="number"
                value={formData.price_installment}
                onChange={(e) => setFormData({ ...formData, price_installment: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
              />
            </div>

            {/* Installment Years */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">Installment Years</label>
              <input
                type="number"
                value={formData.installment_years}
                onChange={(e) => setFormData({ ...formData, installment_years: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-3">
              <label className="block text-[14px] font-semibold text-black mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none resize-none"
                placeholder="Describe the unit..."
              />
            </div>

            {/* Features */}
            <div className="md:col-span-3">
              <label className="block text-[14px] font-semibold text-black mb-2">
                Features (comma-separated)
              </label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a74b48] focus:outline-none"
                placeholder="e.g., Balcony, Parking, Garden View"
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

      {/* Units List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[18px] font-bold text-black">{unit.unit_number}</h3>
                  <span className="text-[14px] text-[#666]">
                    {getBuildingName(unit.building_id)} • {getCityName(unit.city_id)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                    unit.status === 'available' ? 'bg-green-100 text-green-700' :
                    unit.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {unit.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-[13px] text-[#666]">
                  <span>{unit.type}</span>
                  <span>{unit.bedrooms} bed • {unit.bathrooms} bath</span>
                  <span>{unit.area} m²</span>
                  <span>Floor {unit.floor}</span>
                  <span className="font-semibold text-[#a74b48]">
                    {(unit.price_egp / 1000000).toFixed(2)}M EGP
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleEdit(unit)}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(unit.id)}
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

      {filteredUnits.length === 0 && (
        <div className="text-center py-20">
          <Home className="w-16 h-16 text-[#ccc] mx-auto mb-4" />
          <h3 className="text-[20px] font-semibold text-[#666] mb-2">No units found</h3>
          <p className="text-[#999]">
            {units.length === 0 
              ? 'Click "Add New Unit" to create your first unit'
              : 'Try adjusting your filters'
            }
          </p>
        </div>
      )}
    </div>
  );
}
