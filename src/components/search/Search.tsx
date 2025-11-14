"use client";

import React, { useEffect, useState, Suspense, useCallback } from "react";
import dynamic from 'next/dynamic';
import { getWeather, getWeatherByIP } from "@/utils/api-weatherapi";
import { Forecastday, RootWeather } from "@/types/weather";
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
const DayDetailView = dynamic(() => import('@/components/DayDetailView').then(mod => ({ default: mod.DayDetailView })));

const PollenAirQuality = dynamic(() => import('@/components/PollenAirQuality').then(mod => ({ default: mod.PollenAirQuality })));

interface SearchProps {
  initialWeatherData?: RootWeather | null;
}

const Search = ({ initialWeatherData = null }: SearchProps) => {
  const { unit, toggleUnit } = useTemperatureUnit();
  const [selectedDay, setSelectedDay] = useState<Forecastday | null>(null);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState<RootWeather | null>(initialWeatherData);

  // Helper function to save location to both localStorage and cookies
  const saveLocation = useCallback((locationData: { cityName?: string; lat?: number; lon?: number }) => {
    try {
      // Save to localStorage for client-side use
      localStorage.setItem('weather-location', JSON.stringify(locationData));
      
      // Save to cookies for server-side use on next page load
      const cookieValue = JSON.stringify(locationData);
      const maxAge = 365 * 24 * 60 * 60; // 1 year
      document.cookie = `weather-location=${encodeURIComponent(cookieValue)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to save location:', err);
      }
    }
  }, []);

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
    
    // Save location to both localStorage and cookies after successful fetch
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
    
    saveLocation(locationData);
    
    getHoursInterval(data.forecast.forecastday[0].hour);
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
    
    // Save location to both localStorage and cookies after successful fetch
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
    
    saveLocation(locationData);
    
    getHoursInterval(data.forecast.forecastday[0].hour);
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
      
      // Save location to both localStorage and cookies after successful fetch
      if (data.location?.lat && data.location?.lon) {
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
        
        saveLocation(locationData);
      }
      
      getHoursInterval(data.forecast.forecastday[0].hour);
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

  // Initialize weather data from server-side props and process it
  useEffect(() => {
    if (initialWeatherData) {
      // Process initial data from server
      getHoursInterval(initialWeatherData.forecast.forecastday[0].hour);
      
      // Save location to both localStorage and cookies if not already saved
      try {
        const saved = localStorage.getItem('weather-location');
        if (!saved && initialWeatherData.location) {
          const locationData: {
            cityName?: string;
            lat?: number;
            lon?: number;
          } = {};
          
          if (initialWeatherData.location.name) {
            locationData.cityName = initialWeatherData.location.name;
          }
          
          if (initialWeatherData.location.lat && initialWeatherData.location.lon) {
            locationData.lat = initialWeatherData.location.lat;
            locationData.lon = initialWeatherData.location.lon;
          }
          
          if (Object.keys(locationData).length > 0) {
            saveLocation(locationData);
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to save initial location:', err);
        }
      }
    }
  }, [initialWeatherData, saveLocation]);

  // Check localStorage for saved location on mount (only if no initial data)
  useEffect(() => {
    // Skip if we already have initial weather data from server
    if (initialWeatherData) {
      return;
    }
    
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

  // Don't render anything until weather data is loaded
  if (!weather) {
    return null;
  }
  // console.log(weather, 'weather');

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
          <Suspense fallback={null}>
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

        <Suspense fallback={null}>
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
