import {useState, useEffect} from "react";

export function useGeolocation() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Failed to get location');
        setLoading(false);
      }
    );
  };

  return { location, error, loading, requestLocation };
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


