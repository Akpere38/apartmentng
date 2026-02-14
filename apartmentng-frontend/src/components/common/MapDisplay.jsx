import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom teal marker
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgMEMxMS4zIDAgOC45IDIuMyA3LjEgNC4yIDIuOSA4LjYgMCAxNC4xIDAgMjBjMCA5LjcgMTYgMjggMTYgMjhzMTYtMTguMyAxNi0yOGMwLTUuOS0yLjktMTEuNC03LjEtMTUuOEMyMy4xIDIuMyAyMC43IDAgMTYgMHptMCAyNGMtNC40IDAtOC0zLjYtOC04czMuNi04IDgtOCA4IDMuNiA4IDgtMy42IDgtOCA4eiIgZmlsbD0iIzE0YjhhNiIvPjwvc3ZnPg==',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48]
});

// Component to recenter map when coordinates change
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
};

const MapDisplay = ({ address, title }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    geocodeAddress(address);
  }, [address]);

  const geocodeAddress = async (addr) => {
    setLoading(true);
    setError(null);

    try {
      // Using Nominatim (OpenStreetMap's free geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&limit=1`,
        {
          headers: {
            'User-Agent': 'ApartmentNG/1.0' // Nominatim requires a user agent
          }
        }
      );

      const data = await response.json();

      if (data && data.length > 0) {
        setCoordinates({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
      } else {
        setError('Location not found on map');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Unable to load map');
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = () => {
    if (coordinates) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
  };

  if (!address) {
    return (
      <div className="card p-8 text-center">
        <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600">Location not available for this property</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Location</h3>
          <button onClick={openInGoogleMaps} className="btn-ghost text-sm">
            <Navigation className="w-4 h-4 mr-1" />
            Open in Maps
          </button>
        </div>
        <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 mb-1">Map Unavailable</p>
            <p className="text-sm text-amber-800">{error}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
          <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900 mb-1">Address</p>
            <p className="text-slate-700">{address}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900">Location</h3>
        <button onClick={openInGoogleMaps} className="btn-ghost text-sm">
          <Navigation className="w-4 h-4 mr-1" />
          Get Directions
        </button>
      </div>

      {loading ? (
        <div className="w-full h-96 rounded-xl border-2 border-slate-200 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-teal-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-600">Loading map...</p>
          </div>
        </div>
      ) : coordinates ? (
        <div className="mb-4 rounded-xl overflow-hidden border-2 border-slate-200" style={{ height: '400px' }}>
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coordinates.lat, coordinates.lng]} icon={customIcon}>
              <Popup>
                <div className="text-center">
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="text-sm text-slate-600">{address}</p>
                </div>
              </Popup>
            </Marker>
            <MapUpdater center={[coordinates.lat, coordinates.lng]} />
          </MapContainer>
        </div>
      ) : null}

      <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
        <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-slate-900 mb-1">Address</p>
          <p className="text-slate-700">{address}</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
        <p className="text-xs text-teal-800">
          📍 <strong>Map powered by OpenStreetMap</strong> - 100% free and open source
        </p>
      </div>
    </div>
  );
};

export default MapDisplay;