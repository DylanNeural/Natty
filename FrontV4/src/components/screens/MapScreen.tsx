import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Star, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Fridge } from '../../types';
import { FRIDGES, PRODUCTS } from '../../constants';
import { searchHealthyPlaces, Place } from '../../services/geminiService';
import { getFridges } from '../../services/apiService';

interface MapScreenProps {
  onSelectFridge: (f: Fridge) => void;
}

// Custom Marker Icons
const createDivIcon = (color: string, text: string = 'N') => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #D7FF51; font-weight: 900; box-shadow: 0 4px 12px rgba(0,0,0,0.2); border: 2px solid white;">${text}</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const fridgeIcon = createDivIcon('#1F5B5A', 'N');
const restaurantIcon = createDivIcon('#F27D26', 'H'); // H for Healthy

// Map Controller to handle centering
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
};

const MapScreen = ({ onSelectFridge }: MapScreenProps) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [fridges, setFridges] = useState<Fridge[]>(FRIDGES as Fridge[]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([43.6047, 1.4442]); // Toulouse

  useEffect(() => {
    const fetchFridges = async () => {
      try {
        const response = await getFridges();
        const mapped: Fridge[] = (response.fridges || []).map((f) => ({
          id: f.id,
          name: f.name,
          address: f.address,
          distance: f.distance || '-',
          walkTime: f.walkTime || '-',
          isOpen: !!f.isOpen,
          stockCount: f.stockCount || 0,
          lat: f.lat,
          lng: f.lng,
          products: PRODUCTS,
        }));
        if (mapped.length) {
          setFridges(mapped);
        }
      } catch {
        // Keep static fallback fridges if API is unavailable.
      }
    };

    fetchFridges();
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      const results = await searchHealthyPlaces(mapCenter[0], mapCenter[1]);
      setPlaces(results);
      setLoading(false);
    };
    fetchPlaces();
  }, [mapCenter]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    // In a real app, we'd geocode the search query. 
    // For now, we'll just re-trigger the search with Gemini.
    setLoading(true);
    const results = await searchHealthyPlaces(mapCenter[0], mapCenter[1]);
    setPlaces(results);
    setLoading(false);
  };

  return (
    <div className="h-[100svh] relative bg-gray-100 overflow-hidden">
      {/* Real Interactive Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={mapCenter} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <MapController center={mapCenter} />
          
          {/* Fridge Markers (Static from constants) */}
          {fridges.map((f) => (
            <Marker 
              key={f.id} 
              position={[f.lat, f.lng]} 
              icon={fridgeIcon}
              eventHandlers={{
                click: () => onSelectFridge(f),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2">
                  <h3 className="font-bold text-natty-teal">{f.name}</h3>
                  <p className="text-xs text-natty-charcoal/60 mb-2">Frigo Connecté Natty</p>
                  <button 
                    onClick={() => onSelectFridge(f)}
                    className="w-full bg-natty-teal text-natty-lime py-1 rounded-lg text-[10px] font-black uppercase"
                  >
                    Voir le contenu
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Healthy Places from Gemini/Google Maps */}
          {places.map(p => (
            <Marker 
              key={p.id} 
              position={[p.latitude, p.longitude]} 
              icon={restaurantIcon}
            >
              <Popup className="custom-popup">
                <div className="p-2 max-w-[200px]">
                  <h3 className="font-bold text-natty-orange">{p.name}</h3>
                  <p className="text-[10px] text-natty-charcoal/60 mb-1">{p.address}</p>
                  {p.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] font-bold">{p.rating}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-natty-orange text-white py-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1">
                      <Navigation size={10} />
                      Y aller
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* User Marker */}
          <Marker position={[43.6047, 1.4442]} icon={L.divIcon({
            className: 'user-marker',
            html: '<div class="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })} />
        </MapContainer>
      </div>

      {/* UI Overlays */}
      <div className="absolute top-12 left-6 right-6 space-y-4 pt-safe z-10">
        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
          <Search className="text-natty-charcoal/30" size={20} />
          <input 
            type="text" 
            placeholder="Trouver un frigo ou resto healthy..." 
            className="flex-1 bg-transparent outline-none font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {loading && <div className="w-4 h-4 border-2 border-natty-teal border-t-transparent rounded-full animate-spin" />}
        </form>
        <div className="flex gap-2">
          <button className="bg-natty-teal text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
            <MapPin size={14} />
            Frigos Natty
          </button>
          <button className="bg-white text-natty-charcoal px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
            Restaurants Healthy
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && places.length === 0 && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-natty-teal border-t-transparent rounded-full animate-spin" />
            <p className="font-black text-natty-teal uppercase tracking-widest text-xs">Recherche via Google Maps...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapScreen;
