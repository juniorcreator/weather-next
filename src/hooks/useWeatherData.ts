import {useState, useEffect} from "react";

const STORAGE_KEY = 'weather-location';

export function useGeolocation() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load saved location from localStorage on mount
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

    // Try with less strict options first (no high accuracy requirement)
    // Using softer options to avoid CoreLocation errors on macOS/Safari
    const geoOptions: PositionOptions = {
      enableHighAccuracy: false, // Don't require GPS, use network-based location
      timeout: 10000, // 10 seconds - reduced timeout to fail faster and use IP fallback
      maximumAge: 300000, // Accept location cached up to 5 minutes (reduces requests)
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setLocation(coords);
        setError(null); // Clear any previous errors
        
        // Save to localStorage
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
        // Handle kCLErrorLocationUnknown - it's a browser/system warning that can occur
        // Check error message first, then error code
        const errorMessageLower = err.message?.toLowerCase() || '';
        const isLocationUnknown = errorMessageLower.includes('location unknown') || 
                                   errorMessageLower.includes('kclerrorlocationunknown');
        
        // Error codes: 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
        // For kCLErrorLocationUnknown (often appears as console warning but doesn't block),
        // treat as POSITION_UNAVAILABLE and use IP fallback
        if (isLocationUnknown || err.code === 2 || err.code === 3) {
          // Set IP_FALLBACK flag to trigger IP-based location
          setError('IP_FALLBACK');
          setLoading(false);
          return;
        }
        
        // Handle permission denied separately
        if (err.code === 1) {
          setError('Location access denied. Please enable location permissions in your browser settings.');
          if (process.env.NODE_ENV === 'development') {
            console.warn('Geolocation permission denied:', err.message);
          }
          setLoading(false);
          return;
        }
        
        // For any other error, set error message
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
  const [unit, setUnit] = useState<'C' | 'F'>('C');
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


