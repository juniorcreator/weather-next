import {useState, useEffect} from "react";

const STORAGE_KEY = 'weather-location';

export function useGeolocation() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lat && parsed.lon) {
          setLocation({ lat: parsed.lat, lon: parsed.lon });
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load saved location:', err);
      }
    }
  }, []);

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setLocation(coords);
        setError(null);
        
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to save location to localStorage:', err);
          }
        }
        
        setLoading(false);
      },
      (err: GeolocationPositionError) => {
        const errorMessageLower = err.message?.toLowerCase() || '';
        const isLocationUnknown = errorMessageLower.includes('location unknown') || 
                                   errorMessageLower.includes('kclerrorlocationunknown');
        
        if (isLocationUnknown || err.code === 2 || err.code === 3) {
          setError('IP_FALLBACK');
          setLoading(false);
          return;
        }
        
        if (err.code === 1) {
          setError('Location access denied. Please enable location permissions in your browser settings.');
          if (process.env.NODE_ENV === 'development') {
            console.warn('Geolocation permission denied:', err.message);
          }
          setLoading(false);
          return;
        }
        
        setError(err.message || 'Failed to get location');
        setLoading(false);
      },
      geoOptions
    );
  };

  const clearSavedLocation = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setLocation(null);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to clear saved location:', err);
      }
    }
  };

  return { location, error, loading, requestLocation, clearSavedLocation };
}

export function useTemperatureUnit() {
  const [unit, setUnit] = useState<'C' | 'F'>('F');
  const [mounted, setMounted] = useState(false);

  const toggleUnit = () => {
    setUnit((current) => {
      const newUnit = current === 'C' ? 'F' : 'C';
      if (typeof window !== 'undefined') {
        localStorage.setItem('temperature-unit', newUnit);
      }
      return newUnit;
    });
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('temperature-unit');
      if (saved === 'F' || saved === 'C') {
        setUnit(saved);
      }
    }
  }, [])

  return { unit, toggleUnit, mounted };
}


