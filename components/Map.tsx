import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  projectName: string;
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function Map({ projectName, location, address, latitude, longitude }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 30.0444, lng: 31.2357 });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  const displayAddress = address || location || 'Cairo, Egypt';

  // Use latitude/longitude from database if available, otherwise geocode address
  useEffect(() => {
    // Priority 1: Use direct coordinates from database
    if (latitude && longitude) {
      console.log('📍 Using database coordinates:', { latitude, longitude });
      setCoordinates({ lat: latitude, lng: longitude });
      setGeocodingError(null);
      return;
    }

    // Priority 2: Geocode address if coordinates not available
    const addressToGeocode = address || location;
    
    if (addressToGeocode && addressToGeocode !== 'Cairo, Egypt') {
      setIsGeocoding(true);
      setGeocodingError(null);
      console.log('🗺️ Geocoding address:', addressToGeocode);
      
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressToGeocode)}`;
      
      fetch(geocodeUrl)
        .then(res => res.json())
        .then(data => {
          console.log('📍 Geocoding response:', data);
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            console.log('✅ Setting coordinates from geocoding:', { lat, lng, address: addressToGeocode });
            setCoordinates({ lat, lng });
          } else {
            const error = `No location found for: ${addressToGeocode}`;
            console.warn('⚠️', error);
            setGeocodingError(error);
          }
          setIsGeocoding(false);
        })
        .catch(error => {
          console.error('❌ Geocoding error:', error);
          setGeocodingError('Failed to load location');
          setIsGeocoding(false);
        });
    } else {
      console.log('ℹ️ No coordinates or address provided, using default Cairo coordinates');
    }
  }, [address, location, latitude, longitude]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map with OpenStreetMap tiles
    const map = L.map(mapContainerRef.current).setView([coordinates.lat, coordinates.lng], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Create custom branded marker icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background-color: #a74b48;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg style="transform: rotate(45deg); width: 20px; height: 20px;" fill="white" viewBox="0 0 24 24" stroke="white" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    // Add marker with popup
    const marker = L.marker([coordinates.lat, coordinates.lng], { icon: customIcon }).addTo(map);
    marker.bindPopup(`
      <div style="text-align: center; padding: 8px;">
        <strong style="font-size: 16px; color: #a74b48;">${projectName}</strong><br/>
        <span style="font-size: 14px; color: #666; margin-top: 4px; display: block;">${displayAddress}</span>
      </div>
    `).openPopup();

    mapRef.current = map;
    markerRef.current = marker;

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
      mapRef.current.setView([coordinates.lat, coordinates.lng], 13);
      markerRef.current.setPopupContent(`
        <div style="text-align: center; padding: 8px;">
          <strong style="font-size: 16px; color: #a74b48;">${projectName}</strong><br/>
          <span style="font-size: 14px; color: #666; margin-top: 4px; display: block;">${displayAddress}</span>
        </div>
      `);
    }
  }, [coordinates, projectName, displayAddress]);

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E5E5] overflow-hidden">
      <div className="p-4 border-b border-[#E5E5E5]">
        <h3 className="text-[20px] font-bold text-black flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#a74b48]" />
          Location
        </h3>
      </div>
      <div className="relative">
        {/* Leaflet Map Container */}
        <div 
          ref={mapContainerRef} 
          className="h-[400px] w-full z-0"
          style={{ background: '#f0f0f0' }}
        />

        {/* Loading Overlay */}
        {isGeocoding && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-[14px] text-[#666]">Loading location...</p>
            </div>
          </div>
        )}

        {/* Location Info Card */}
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] pointer-events-auto">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#a74b48] rounded-full flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[16px] font-bold text-black mb-1">{projectName}</h4>
              <p className="text-[14px] text-[#666] mb-2 break-words">{displayAddress}</p>
              {geocodingError && (
                <p className="text-[12px] text-orange-600 mb-1">⚠️ {geocodingError}</p>
              )}
              <div className="flex items-center gap-2 text-[12px] text-[#999]">
                <span>Lat: {coordinates.lat.toFixed(4)}</span>
                <span>•</span>
                <span>Lng: {coordinates.lng.toFixed(4)}</span>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a74b48] hover:text-[#8f3f3c] transition-colors text-[13px] font-semibold whitespace-nowrap shrink-0"
            >
              Open in Maps →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}