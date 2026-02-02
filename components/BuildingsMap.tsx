import { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Building2, Home, DollarSign, X, Calendar, Layers, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Building, City } from '../utils/supabase/client';
import { supabase } from '../utils/supabase/client';
import { formatPrice } from '../utils/supabase/queries';
import { useLanguage } from '../contexts/LanguageContext';

interface BuildingsMapProps {
  cities: City[];
}

// Custom icon
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="position: relative;">
      <div style="
        background: linear-gradient(135deg, #a74b48 0%, #8a3c39 100%);
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg style="transform: rotate(45deg); margin-top: -4px; margin-left: -2px;" width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

interface BuildingComplete extends Building {
  city?: City;
  name_ar?: string;
  description_ar?: string;
}

interface BuildingImage {
  id: string;
  building_id: string;
  image_url: string;
  image_type: 'exterior' | 'interior' | 'amenity' | 'general';
  display_order: number;
  is_featured: boolean;
  created_at: string;
}

interface BuildingWithCity extends Building {
  city?: City;
}

export function BuildingsMap({ cities }: BuildingsMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [buildings, setBuildings] = useState<BuildingWithCity[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingWithCity | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [buildingImages, setBuildingImages] = useState<BuildingImage[]>([]);

  // Fetch all buildings with coordinates
  useEffect(() => {
    async function fetchBuildings() {
      const { data: buildingsData, error } = await supabase
        .from('buildings')
        .select('*');

      if (error) {
        console.error('Error fetching buildings:', error);
        setLoading(false);
        return;
      }

      // Fetch city data for each building
      const buildingsWithCities = await Promise.all(
        (buildingsData || []).map(async (building) => {
          const { data: cityData } = await supabase
            .from('cities')
            .select('*')
            .eq('id', building.city_id)
            .maybeSingle();

          return {
            ...building,
            city: cityData
          };
        })
      );

      setBuildings(buildingsWithCities);
      setLoading(false);
    }

    fetchBuildings();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map centered on Cairo
    const map = L.map(mapContainerRef.current, {
      center: [30.0444, 31.2357],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tiles with grayscale styling
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      className: 'grayscale-tiles',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add markers for buildings
  useEffect(() => {
    if (!mapRef.current || buildings.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add marker for each building
    const markers = buildings.map((building) => {
      if (!building.latitude || !building.longitude) return null;

      const marker = L.marker([building.latitude, building.longitude], {
        icon: customIcon,
      }).addTo(mapRef.current!);

      marker.on('click', () => {
        setSelectedBuilding(building);
        // Center map on clicked marker
        mapRef.current?.setView([building.latitude!, building.longitude!], 13, {
          animate: true,
          duration: 0.5,
        });
      });

      return marker;
    }).filter((m): m is L.Marker => m !== null);

    markersRef.current = markers;

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      mapRef.current.fitBounds(group.getBounds(), {
        padding: [50, 50],
        maxZoom: 12,
      });
    }
  }, [buildings]);

  // Fetch images for the selected building
  useEffect(() => {
    if (!selectedBuilding) {
      setBuildingImages([]);
      return;
    }

    async function fetchImages() {
      const { data: imagesData, error } = await supabase
        .from('building_images')
        .select('*')
        .eq('building_id', selectedBuilding.id)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching images:', error);
        return;
      }

      setBuildingImages(imagesData || []);
      setSelectedImageIndex(0);
    }

    fetchImages();
  }, [selectedBuilding]);

  return (
    <div className="relative w-full">
      <div className="bg-[rgb(0,0,0)] py-[16px] px-[0px]">
        <div className="max-w-[1440px] mx-auto p-[0px] mb-8 px-[40px] py-[0px]">
          <h2 className="text-[40px] font-bold text-[rgb(255,255,255)] mb-3">
            {t('map.title')}
          </h2>
          <p className="text-[18px] text-[rgb(202,202,202)] max-w-[600px]">
            {t('map.description')}
          </p>
        </div>
      </div>

      <div className="relative w-full h-[600px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#666] text-[16px]">Loading map...</p>
            </div>
          </div>
        )}

        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Top Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent pointer-events-none z-[500]" />

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none z-[500]" />

        {/* Building Details Card */}
        {selectedBuilding && (
          <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] bg-white rounded-[16px] shadow-2xl z-[1000] overflow-hidden">
            <button
              onClick={() => setSelectedBuilding(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5 text-[#666]" />
            </button>

            {/* Building Image */}
            {(selectedBuilding.gallery_image_1 || selectedBuilding.image) && (
              <div className="relative h-[200px]">
                <img
                  src={selectedBuilding.gallery_image_1 || selectedBuilding.image}
                  alt={selectedBuilding.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-[24px] font-bold text-white mb-1">
                    {selectedBuilding.name}
                  </h3>
                  {selectedBuilding.city && (
                    <p className="text-white/90 text-[14px]">
                      {selectedBuilding.city.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Building Details */}
            <div className="p-6">
              {!selectedBuilding.gallery_image_1 && !selectedBuilding.image && (
                <div className="mb-4">
                  <h3 className="text-[24px] font-bold text-black mb-1">
                    {selectedBuilding.name}
                  </h3>
                  {selectedBuilding.city && (
                    <p className="text-[#666] text-[14px]">
                      {selectedBuilding.city.name}
                    </p>
                  )}
                </div>
              )}

              {selectedBuilding.description && (
                <p className="text-[14px] text-[#666] mb-4 line-clamp-3">
                  {selectedBuilding.description}
                </p>
              )}

              {/* Address */}
              {selectedBuilding.address && (
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-[#a74b48] mt-0.5 flex-shrink-0" />
                  <p className="text-[14px] text-[#666]">
                    {selectedBuilding.address}
                  </p>
                </div>
              )}

              {/* Building Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {selectedBuilding.floors && (
                  <div className="bg-[#F8F8F8] rounded-[12px] p-3">
                    <p className="text-[12px] text-[#666] mb-1">Floors</p>
                    <p className="text-[18px] font-bold text-black">
                      {selectedBuilding.floors}
                    </p>
                  </div>
                )}

                {selectedBuilding.total_units && (
                  <div className="bg-[#F8F8F8] rounded-[12px] p-3">
                    <p className="text-[12px] text-[#666] mb-1">Total Units</p>
                    <p className="text-[18px] font-bold text-black">
                      {selectedBuilding.total_units}
                    </p>
                  </div>
                )}

                {selectedBuilding.available_units !== undefined && (
                  <div className="bg-[#F8F8F8] rounded-[12px] p-3">
                    <p className="text-[12px] text-[#666] mb-1">Available</p>
                    <p className="text-[18px] font-bold text-[#a74b48]">
                      {selectedBuilding.available_units}
                    </p>
                  </div>
                )}

                {selectedBuilding.status && (
                  <div className="bg-[#F8F8F8] rounded-[12px] p-3">
                    <p className="text-[12px] text-[#666] mb-1">Status</p>
                    <p className={`text-[14px] font-bold capitalize ${
                      selectedBuilding.status === 'available' 
                        ? 'text-green-600' 
                        : selectedBuilding.status === 'sold_out'
                        ? 'text-red-600'
                        : 'text-orange-600'
                    }`}>
                      {selectedBuilding.status.replace('_', ' ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedBuilding.latitude},${selectedBuilding.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#a74b48] text-white py-3 rounded-[12px] font-semibold text-[14px] hover:bg-[#8f3f3c] transition-all text-center flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBuilding.address || selectedBuilding.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border-2 border-[#E5E5E5] text-black py-3 rounded-[12px] font-semibold text-[14px] hover:border-[#a74b48] hover:text-[#a74b48] transition-all text-center"
                >
                  View on Map
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-[12px] shadow-lg p-4 z-[1000]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#a74b48] rounded-full flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[12px] text-[#666]">Total Buildings</p>
              <p className="text-[16px] font-bold text-black">{buildings.length}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 12px;
        }

        .leaflet-popup-content {
          margin: 0;
        }

        .leaflet-container {
          font-family: inherit;
        }

        .grayscale-tiles {
          filter: grayscale(100%) contrast(1.1);
        }
      `}</style>
    </div>
  );
}