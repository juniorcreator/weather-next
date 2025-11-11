"use client";

import { MapPin } from "lucide-react";
import React, { useEffect, useState, Suspense } from "react";
import dynamic from 'next/dynamic';
import { getWeather, getWeatherByIP } from "@/utils/api-weatherapi";
import { Forecastday, RootWeather } from "@/types/weather";
import { getAppleStyleTempColor } from "@/utils/colorByTems";
import {
  getHoursInterval,
} from "@/utils/helpers";
import { WeatherHeader } from "@/components/weather/WeatherHeader";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { MetricsGrid } from "@/components/ui/MetricsGrid";
import { CompactWeeklyForecast } from "@/components/ui/CompactWeeklyForecast";
import { HourlyForecast } from "@/components/HourlyForecast";
import { useTemperatureUnit } from "@/hooks/useWeatherData";

// Dynamic imports for components below fold
const DayDetailView = dynamic(() => import('@/components/DayDetailView').then(mod => ({ default: mod.DayDetailView })), {
  loading: () => <div className="weather-card bg-card/50 p-6 border border-border/50">Loading day details...</div>,
});

const PollenAirQuality = dynamic(() => import('@/components/PollenAirQuality').then(mod => ({ default: mod.PollenAirQuality })), {
  loading: () => <div className="weather-card bg-card/50 p-6 border border-border/50">Loading air quality data...</div>,
});

const Search = () => {
  const { unit, toggleUnit } = useTemperatureUnit();
  const [selectedDay, setSelectedDay] = useState<Forecastday | null>(null);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState<RootWeather | null>(null);
  const [bg, setBg] = useState("");

  const handleFetchData = async (city: string) => {
    if (!city) {
      setError("Enter city name");
      return;
    }
    
    // Optimize: skip API call if same city is searched
    if (weather?.location.name?.toLowerCase() === city.toLowerCase()) {
      return;
    }
    
    setError("");
    // Reset selectedDay before fetching new data to ensure DayDetailView gets fresh data
    setSelectedDay(null);
    
    // const data = await getCityWeatherSimple(city);
    const data: RootWeather = await getWeather(city);

    if(data.error) {
      setError(data.error.message);
      return;
    }
    
    // Save location to localStorage after successful fetch
    try {
      const locationData: {
        cityName?: string;
        lat?: number;
        lon?: number;
      } = {};
      
      // Save city name
      if (data.location?.name) {
        locationData.cityName = data.location.name;
      }
      
      // Save coordinates if available
      if (data.location?.lat && data.location?.lon) {
        locationData.lat = data.location.lat;
        locationData.lon = data.location.lon;
      }
      
      localStorage.setItem('weather-location', JSON.stringify(locationData));
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to save location to localStorage:', err);
      }
    }
    
    getHoursInterval(data.forecast.forecastday[0].hour);
    // setBg(getAppleStyleTempColor(24));
    setBg(getAppleStyleTempColor(Math.floor(data.current.temp_c)));
    setWeather(data);
  };

  const handleFetchDataByLocation = async (lat: number, lon: number) => {
    setError("");
    // Reset selectedDay before fetching new data
    setSelectedDay(null);
    
    // Format coordinates as "lat,lon" for WeatherAPI.com
    const query = `${lat},${lon}`;
    const data: RootWeather = await getWeather(query);

    if(data.error) {
      setError(data.error.message);
      return;
    }
    
    // Save location to localStorage after successful fetch
    try {
      const locationData: {
        cityName?: string;
        lat?: number;
        lon?: number;
      } = {
        lat,
        lon,
      };
      
      // Save city name from API response
      if (data.location?.name) {
        locationData.cityName = data.location.name;
      }
      
      localStorage.setItem('weather-location', JSON.stringify(locationData));
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to save location to localStorage:', err);
      }
    }
    
    getHoursInterval(data.forecast.forecastday[0].hour);
    setBg(getAppleStyleTempColor(Math.floor(data.current.temp_c)));
    setWeather(data);
  };

  const handleFetchDataByIP = async () => {
    setError("");
    // Reset selectedDay before fetching new data
    setSelectedDay(null);
    
    try {
      const data: RootWeather = await getWeatherByIP();

      if(data.error) {
        setError(data.error.message);
        return;
      }
      
      // Save location to localStorage after successful fetch
      if (data.location?.lat && data.location?.lon) {
        try {
          const locationData: {
            cityName?: string;
            lat?: number;
            lon?: number;
          } = {
            lat: data.location.lat,
            lon: data.location.lon,
          };
          
          // Save city name from API response
          if (data.location?.name) {
            locationData.cityName = data.location.name;
          }
          
          localStorage.setItem('weather-location', JSON.stringify(locationData));
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to save location to localStorage:', err);
          }
        }
      }
      
      getHoursInterval(data.forecast.forecastday[0].hour);
      setBg(getAppleStyleTempColor(Math.floor(data.current.temp_c)));
      setWeather(data);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch weather by IP:', err);
      }
      setError('Failed to determine your location. Please search for a city instead.');
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, value: string) => {
    if (e.key === "Enter") {
      await handleFetchData(value);
    }
  };

  // Check localStorage for saved location on mount
  useEffect(() => {
    const loadSavedLocation = async () => {
      try {
        const saved = localStorage.getItem('weather-location');
        if (saved) {
          const parsed = JSON.parse(saved);
          
          // If coordinates are available, use them (more accurate)
          if (parsed.lat && parsed.lon) {
            await handleFetchDataByLocation(parsed.lat, parsed.lon);
            return;
          }
          
          // If only city name is available, use it
          if (parsed.cityName) {
            await handleFetchData(parsed.cityName);
            return;
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to load saved location:', err);
        }
      }
      
      // Fallback to default city if no saved location
      await handleFetchData("New York");
    };
    
    loadSavedLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    if (weather?.forecast.forecastday) {
      // Always check if selectedDay belongs to current weather data
      if (!selectedDay) {
        // If no selectedDay, set it to second day
        setSelectedDay(weather.forecast.forecastday[1]);
      } else {
        // Check if selectedDay belongs to current weather by comparing dates
        const dayExistsInCurrentWeather = weather.forecast.forecastday.some(
          day => day.date === selectedDay.date
        );
        
        // If selectedDay doesn't belong to current weather, update it
        if (!dayExistsInCurrentWeather) {
          setSelectedDay(weather.forecast.forecastday[1]);
        }
      }
    }
  }, [weather]);

  // Prevent hydration mismatch by ensuring consistent initial render
  if (!weather) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <h2 className="text-foreground">loading...</h2>
      </div>
    );
  }
  console.log(weather, 'weather');

  return (
    <>
      {/*search and settings*/}
      <WeatherHeader
        unit={unit}
        onToggleUnit={toggleUnit}
        onLocationSelect={handleFetchDataByLocation}
        onHandleKeyDown={handleKeyDown}
        onHandleFetchData={handleFetchData}
        onHandleFetchDataByIP={handleFetchDataByIP}
      />
      {/*search and settings*/}

      {/*{error && <div className="text-center">{error}</div>}*/}
      <main className="container mx-auto p-4 sm:p-6 space-y-6 max-w-5xl">
        <h1 className="sr-only">Weather Forecast Application</h1>
        <div className="grid lg:grid-cols-20 gap-3 lg:items-stretch">
          <div className="lg:col-span-12 flex">
            <CurrentWeatherCard
              weather={weather}
              unit={unit}
              locationName={weather?.location.name}
            />
          </div>
          <div className="space-y-2 lg:col-span-8 flex flex-col">
            <MetricsGrid
              weather={weather.current}
              airQuality={weather?.current.air_quality}
            />
            <CompactWeeklyForecast
              forecastDays={weather.forecast.forecastday}
              unit={unit}
            />
          </div>
        </div>

        <HourlyForecast
          hourly={weather.forecast.forecastday[0].hour}
          unit={unit}
          localtime={weather.location.localtime}
        />

        {selectedDay && weather && (
          <Suspense fallback={<div className="weather-card bg-card/50 p-6 border border-border/50">Loading day details...</div>}>
            <DayDetailView
              key={`${weather.location.name}`}
              day={selectedDay}
              unit={unit}
              allDays={weather.forecast.forecastday}
              onDayClick={setSelectedDay}
              selectedDay={selectedDay || undefined}
            />
          </Suspense>
        )}

        <Suspense fallback={<div className="weather-card bg-card/50 p-6 border border-border/50">Loading air quality data...</div>}>
          <PollenAirQuality pollen={weather.current.pollen} airQuality={weather.current.air_quality} />
        </Suspense>

        <div className="text-center text-xs text-muted-foreground py-4">
          Last updated: {weather.current.last_updated.toLocaleString()}
        </div>

        <footer className="text-center text-xs text-muted-foreground py-6 border-t border-border/50 mt-8">
          <p>&copy; {new Date().getFullYear()} Weather App. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
};

export default Search;
