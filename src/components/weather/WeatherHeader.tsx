import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks/useWeatherData';
import ToggleCF from "@/components/ToggleCF";
// import { WeatherLocation } from '@/lib/weatherAdapter';

interface WeatherHeaderProps {
  unit: 'C' | 'F';
  onToggleUnit: () => void;
  onLocationSelect: (lat: number, lon: number) => void;
  onHandleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, value: string) => void;
  onHandleFetchData: (value: string) => void;
  onHandleFetchDataByIP?: () => void;
}

export function WeatherHeader({ unit, onToggleUnit, onLocationSelect, onHandleKeyDown, onHandleFetchData, onHandleFetchDataByIP }: WeatherHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  const [showError, setShowError] = useState(false);
  const { location, requestLocation, loading: geoLoading, error: geoError } = useGeolocation();

  const handleLocationSelect = (location: any) => {
    onLocationSelect(location.lat, location.lon);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleUseMyLocation = () => {
    setHasRequestedLocation(true);
    setShowError(false);
    requestLocation();
  };

  // When location is obtained from geolocation request (user clicked button), call onLocationSelect
  useEffect(() => {
    if (location && hasRequestedLocation) {
      onLocationSelect(location.lat, location.lon);
      setHasRequestedLocation(false);
      setShowError(false);
    }
  }, [location, hasRequestedLocation, onLocationSelect]);

  // Show error when it occurs after user requested location, or try IP fallback
  useEffect(() => {
    if (geoError && hasRequestedLocation && !geoLoading) {
      // If error is IP_FALLBACK, try to use IP-based location
      if (geoError === 'IP_FALLBACK' && onHandleFetchDataByIP) {
        setShowError(false);
        onHandleFetchDataByIP();
        setHasRequestedLocation(false);
        return;
      }
      
      setShowError(true);
      // Auto-hide error after 5 seconds
      const timer = setTimeout(() => {
        setShowError(false);
        setHasRequestedLocation(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [geoError, hasRequestedLocation, geoLoading, onHandleFetchDataByIP]);

  return (
    <header className="flex items-center justify-center gap-4 p-4 border-b border-border/50 relative">
      <div className="relative flex-1 max-w-md">
        <Search onClick={() => onHandleFetchData(searchQuery)} className="absolute h-full left-3 top-1/2 -translate-y-1/2 w-4 text-muted-foreground cursor-pointer" />
        <Input
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onKeyDown={(e) => onHandleKeyDown(e, searchQuery)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-10 h-10 bg-card/50 border-border/50"
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleUseMyLocation}
        disabled={geoLoading}
        className="shrink-0 cursor-pointer"
        title={geoError || "Use my location"}
      >
        {geoLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
      </Button>
      <ToggleCF unit={unit} onToggleUnit={onToggleUnit} />
      
      {/* Error message */}
      {showError && geoError && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-destructive text-destructive-foreground text-sm rounded-md shadow-lg z-50 max-w-md text-center">
          {geoError}
        </div>
      )}


      {/*<Button*/}
      {/*  variant="outline"*/}
      {/*  size="sm"*/}
      {/*  onClick={onToggleUnit}*/}
      {/*  className="font-semibold cursor-pointer"*/}
      {/*>*/}
      {/*  °{unit}*/}
      {/*</Button>*/}
    </header>
  );
}
