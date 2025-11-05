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
      console.error('Failed to load saved location:', err);
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
      timeout: 20000, // 20 seconds - longer timeout to avoid premature failures
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
          console.error('Failed to save location to localStorage:', err);
        }
        
        setLoading(false);
      },
      (err: GeolocationPositionError) => {
        // Silently handle kCLErrorLocationUnknown - it's a browser/system warning
        // that doesn't affect functionality when we have IP fallback
        const isLocationUnknown = err.message?.includes('location unknown') || 
                                   err.message?.includes('kCLErrorLocationUnknown') ||
                                   err.code === 2; // POSITION_UNAVAILABLE
        
        let errorMessage = 'Failed to get location';
        
        // Error codes: 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
        switch (err.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
            console.warn('Geolocation permission denied:', err.message);
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location information is unavailable. Trying to use IP-based location...';
            // Don't log - this triggers IP fallback which works fine
            break;
          case 3: // TIMEOUT
            errorMessage = 'Location request timed out. Trying to use IP-based location...';
            // Don't log - this triggers IP fallback which works fine
            break;
          default:
            // Handle specific error messages
            if (err.message) {
              if (isLocationUnknown) {
                errorMessage = 'Unable to determine your location. Trying to use IP-based location...';
                // Don't log - this is expected and handled by IP fallback
              } else {
                errorMessage = err.message;
                // Only log non-expected errors
                if (!err.message.includes('kCLErrorLocationUnknown')) {
                  console.warn('Geolocation error:', err.message);
                }
              }
            }
        }
        
        // For POSITION_UNAVAILABLE and TIMEOUT, set a special flag for IP fallback
        if (err.code === 2 || err.code === 3 || isLocationUnknown) {
          setError('IP_FALLBACK'); // Special flag to trigger IP-based location
        } else {
          setError(errorMessage);
        }
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
      console.error('Failed to clear saved location:', err);
    }
  };

  return { location, error, loading, requestLocation, clearSavedLocation };
}

export function useTemperatureUnit() {
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const toggleUnit = () => {
    setUnit((current) => {
      const newUnit = current === 'C' ? 'F' : 'C';
      localStorage.setItem('temperature-unit', newUnit);
      return newUnit;
    });
  };

  useEffect(() => {
    const saved = window.localStorage.getItem('temperature-unit');
    setUnit((saved === 'F' ? 'F' : 'C') as 'C' | 'F')
  }, [])

  return { unit, toggleUnit };
}


