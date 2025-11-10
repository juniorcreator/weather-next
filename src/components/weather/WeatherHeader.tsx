import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks/useWeatherData';
import ToggleCF from "@/components/ToggleCF";
import { searchLocations } from '@/utils/api-weatherapi';
import Image from 'next/image';

interface WeatherHeaderProps {
  unit: 'C' | 'F';
  onToggleUnit: () => void;
  onLocationSelect: (lat: number, lon: number) => void;
  onHandleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, value: string) => void;
  onHandleFetchData: (value: string) => void;
  onHandleFetchDataByIP?: () => void;
}

interface LocationSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export function WeatherHeader({ unit, onToggleUnit, onLocationSelect, onHandleKeyDown, onHandleFetchData, onHandleFetchDataByIP }: WeatherHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showError, setShowError] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { location, requestLocation, loading: geoLoading, error: geoError } = useGeolocation();
  const userRequestedRef = useRef(false);
  const locationProcessedRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search for autocomplete
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchLocations(searchQuery);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    onLocationSelect(suggestion.lat, suggestion.lon);
    setSearchQuery(suggestion.name);
    setShowResults(false);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    handleLocationSelect(suggestion);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUseMyLocation = () => {
    userRequestedRef.current = true;
    locationProcessedRef.current = false;
    setShowError(false);
    requestLocation();
  };

  // When location is obtained from geolocation request (user clicked button), call onLocationSelect
  useEffect(() => {
    if (location && userRequestedRef.current && !locationProcessedRef.current) {
      locationProcessedRef.current = true;
      onLocationSelect(location.lat, location.lon);
      setShowError(false);
      userRequestedRef.current = false;
    }
  }, [location, onLocationSelect]);

  // Show error when it occurs after user requested location, or try IP fallback
  useEffect(() => {
    if (geoError && userRequestedRef.current && !geoLoading) {
      // If error is IP_FALLBACK, try to use IP-based location
      if (geoError === 'IP_FALLBACK' && onHandleFetchDataByIP) {
        setShowError(false);
        onHandleFetchDataByIP();
        userRequestedRef.current = false;
        locationProcessedRef.current = false;
        return;
      }
      
      setShowError(true);
      // Auto-hide error after 5 seconds
      const timer = setTimeout(() => {
        setShowError(false);
        userRequestedRef.current = false;
        locationProcessedRef.current = false;
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [geoError, geoLoading, onHandleFetchDataByIP]);

  return (
    <header className="flex items-center justify-center gap-4 p-4 border-b border-border/50 relative">
      <nav className="flex flex-wrap items-center justify-start md:justify-center gap-4 w-full" aria-label="Main navigation">
        <Image src="/logo.svg" alt="Weather App Logo" width={180} height={30} />
        <div className="w-full order-1 sm:order-0 relative sm:flex-1 sm:max-w-md" ref={dropdownRef}>
          <Search onClick={() => onHandleFetchData(searchQuery)} className="absolute h-full left-3 top-1/2 -translate-y-1/2 w-4 text-muted-foreground cursor-pointer z-10" />
          <Input
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onKeyDown={(e) => {
              // Handle Enter key
              if (e.key === 'Enter') {
                onHandleKeyDown(e, searchQuery);
                setShowResults(false);
              }
              // Handle Escape key
              if (e.key === 'Escape') {
                setShowResults(false);
              }
            }}
            onFocus={() => {
              if (suggestions.length > 0 || searchQuery.length >= 2) {
                setShowResults(true);
              }
            }}
            className="pl-10 h-10 bg-card/50 border-border/50"
          />
          
          {/* Dropdown with suggestions */}
          {showResults && (suggestions.length > 0 || isLoadingSuggestions) && (
            <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
              {isLoadingSuggestions ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                  Searching...
                </div>
              ) : (
                suggestions.map((suggestion) => (
                  <button
                    key={`${suggestion.lat}-${suggestion.lon}`}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full cursor-pointer text-left px-4 py-3 hover:bg-accent/50 hover:text-accent-foreground transition-all flex items-center gap-2 rounded-md"
                  >
                    <MapPin className="h-4 w-4 text-primary transition-colors" />
                    <span>{suggestion.name}, {suggestion.country}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleUseMyLocation}
          disabled={geoLoading}
          className="shrink-0 cursor-pointer size-10"
          title={geoError || "Use my location"}
        >
          {geoLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
        <ToggleCF unit={unit} onToggleUnit={onToggleUnit} />
      </nav>
      
      {/* Error message */}
      {showError && geoError && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-destructive text-destructive-foreground text-sm rounded-md shadow-lg z-50 max-w-md text-center">
          {geoError}
        </div>
      )}
    </header>
  );
}
