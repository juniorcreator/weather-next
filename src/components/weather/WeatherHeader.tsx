import { useState } from 'react';
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
}

export function WeatherHeader({ unit, onToggleUnit, onLocationSelect }: WeatherHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { requestLocation, loading: geoLoading } = useGeolocation();

  // const handleLocationSelect = (location: WeatherLocation) => {
  //   onLocationSelect(location.lat, location.lon);
  //   setSearchQuery('');
  //   setShowResults(false);
  // };

  const handleUseMyLocation = async () => {
    requestLocation();
    // This would trigger the location hook's callback which calls onLocationSelect
  };

  return (
    <header className="flex items-center justify-center gap-4 p-4 border-b border-border/50">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
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
      >
        {geoLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
      </Button>
      <ToggleCF />

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
