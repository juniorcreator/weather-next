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

  const saveLocation = useCallback((locationData: { cityName?: string; lat?: number; lon?: number }) => {
    try {
      localStorage.setItem('weather-location', JSON.stringify(locationData));
      
      const cookieValue = JSON.stringify(locationData);
      const maxAge = 365 * 24 * 60 * 60;
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
    
    if (weather?.location.name?.toLowerCase() === city.toLowerCase()) {
      return;
    }
    
    setError("");
    setSelectedDay(null);
    
    const data: RootWeather = await getWeather(city);

    if(data.error) {
      setError(data.error.message);
      return;
    }
    
    const locationData: {
      cityName?: string;
      lat?: number;
      lon?: number;
    } = {};
    
    if (data.location?.name) {
      locationData.cityName = data.location.name;
    }
    
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
    setSelectedDay(null);
    
    const query = `${lat},${lon}`;
    const data: RootWeather = await getWeather(query);

    if(data.error) {
      setError(data.error.message);
      return;
    }
    
    const locationData: {
      cityName?: string;
      lat?: number;
      lon?: number;
    } = {
      lat,
      lon,
    };
    
    if (data.location?.name) {
      locationData.cityName = data.location.name;
    }
    
    saveLocation(locationData);
    
    getHoursInterval(data.forecast.forecastday[0].hour);
    setWeather(data);
  };

  const handleFetchDataByIP = async () => {
    setError("");
    setSelectedDay(null);
    
    try {
      const data: RootWeather = await getWeatherByIP();

      if(data.error) {
        setError(data.error.message);
        return;
      }
      
      if (data.location?.lat && data.location?.lon) {
        const locationData: {
          cityName?: string;
          lat?: number;
          lon?: number;
        } = {
          lat: data.location.lat,
          lon: data.location.lon,
        };
        
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

  useEffect(() => {
    if (initialWeatherData) {
      getHoursInterval(initialWeatherData.forecast.forecastday[0].hour);
      
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

  useEffect(() => {
    if (initialWeatherData) {
      return;
    }
    
    const loadSavedLocation = async () => {
      try {
        const saved = localStorage.getItem('weather-location');
        if (saved) {
          const parsed = JSON.parse(saved);
          
          if (parsed.lat && parsed.lon) {
            await handleFetchDataByLocation(parsed.lat, parsed.lon);
            return;
          }
          
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
      
      await handleFetchData("New York");
    };
    
    loadSavedLocation();
  }, []);

  useEffect(() => {
    if (weather?.forecast.forecastday) {
      if (!selectedDay) {
        setSelectedDay(weather.forecast.forecastday[1]);
      } else {
        const dayExistsInCurrentWeather = weather.forecast.forecastday.some(
          day => day.date === selectedDay.date
        );
        
        if (!dayExistsInCurrentWeather) {
          setSelectedDay(weather.forecast.forecastday[1]);
        }
      }
    }
  }, [weather]);

  if (!weather) {
    return null;
  }

  return (
    <>
      <WeatherHeader
        unit={unit}
        onToggleUnit={toggleUnit}
        onLocationSelect={handleFetchDataByLocation}
        onHandleKeyDown={handleKeyDown}
        onHandleFetchData={handleFetchData}
        onHandleFetchDataByIP={handleFetchDataByIP}
      />

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
