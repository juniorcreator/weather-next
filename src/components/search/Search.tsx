"use client";

import { MapPin, Search as SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getWeather, getWeatherByIP } from "@/utils/api-weatherapi";
import { Forecastday, RootWeather } from "@/types/weather";
import AllIcons from "@/components/Icons";
import { getAppleStyleTempColor, lighten } from "@/utils/colorByTems";
import {
  gbDefraIndex,
  getHoursInterval,
  getWeatherIcon,
} from "@/utils/helpers";
import ToggleCF from "@/components/ToggleCF";
import DayDetails from "@/components/DayDetails";
import SunDetails from "@/components/SunDetails";
import SevenDaysItems from "@/components/SevenDaysItems";
import HourlyDetails from "@/components/HourlyDetails";
import SevenDayItem from "@/components/SevenDayItem";
import { WeatherHeader } from "@/components/weather/WeatherHeader";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { MetricsGrid } from "@/components/ui/MetricsGrid";
import { SunriseSunset } from "@/components/ui/SunriseSunset";
import { HourlyForecast } from "@/components/HourlyForecast";
import { DailyForecast } from "@/components/DailyForecast";
import { useTemperatureUnit } from "@/hooks/useWeatherData";
import {DayDetailView} from "@/components/DayDetailView";
import {PollenAirQuality} from "@/components/PollenAirQuality";

const Search = () => {
  const [city, setCity] = useState("");
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
    console.log(data, ' data in handleFetchData');

    if(data.error) {
      setError(data.error.message);
      return;
    }
    getHoursInterval(data.forecast.forecastday[0].hour);
    // setBg(getAppleStyleTempColor(24));
    setBg(getAppleStyleTempColor(Math.floor(data.current.temp_c)));

    console.log(
      "getTemperatureColor >> ",
      getAppleStyleTempColor(Math.floor(data.current.temp_c)),
    );
    console.log("data >>> client ", data);
    setWeather(data);
  };

  const handleFetchDataByLocation = async (lat: number, lon: number) => {
    setError("");
    // Reset selectedDay before fetching new data
    setSelectedDay(null);
    
    // Format coordinates as "lat,lon" for WeatherAPI.com
    const query = `${lat},${lon}`;
    const data: RootWeather = await getWeather(query);
    console.log(data, ' data in handleFetchDataByLocation');

    if(data.error) {
      setError(data.error.message);
      return;
    }
    
    // Save location to localStorage after successful fetch
    try {
      localStorage.setItem('weather-location', JSON.stringify({ lat, lon }));
    } catch (err) {
      console.error('Failed to save location to localStorage:', err);
    }
    
    getHoursInterval(data.forecast.forecastday[0].hour);
    setBg(getAppleStyleTempColor(Math.floor(data.current.temp_c)));

    console.log(
      "getTemperatureColor >> ",
      getAppleStyleTempColor(Math.floor(data.current.temp_c)),
    );
    console.log("data >>> client ", data);
    setWeather(data);
  };

  const handleFetchDataByIP = async () => {
    setError("");
    // Reset selectedDay before fetching new data
    setSelectedDay(null);
    
    try {
      const data: RootWeather = await getWeatherByIP();
      console.log(data, ' data in handleFetchDataByIP');

      if(data.error) {
        setError(data.error.message);
        return;
      }
      
      // Save location to localStorage after successful fetch
      if (data.location?.lat && data.location?.lon) {
        try {
          localStorage.setItem('weather-location', JSON.stringify({ 
            lat: data.location.lat, 
            lon: data.location.lon 
          }));
        } catch (err) {
          console.error('Failed to save location to localStorage:', err);
        }
      }
      
      getHoursInterval(data.forecast.forecastday[0].hour);
      setBg(getAppleStyleTempColor(Math.floor(data.current.temp_c)));

      console.log(
        "getTemperatureColor >> ",
        getAppleStyleTempColor(Math.floor(data.current.temp_c)),
      );
      console.log("data >>> client ", data);
      setWeather(data);
    } catch (err) {
      console.error('Failed to fetch weather by IP:', err);
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
          if (parsed.lat && parsed.lon) {
            // Load weather by saved coordinates
            await handleFetchDataByLocation(parsed.lat, parsed.lon);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load saved location:', err);
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

  if (!weather) {
    return <h2>loading...</h2>;
  }

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
      <main className="container mx-auto p-6 space-y-6 max-w-5xl">
        <div className="grid lg:grid-cols-20 gap-3 lg:items-stretch">
          <div className="lg:col-span-12 flex">
            <CurrentWeatherCard
              weather={weather}
              unit={unit}
              locationName={weather?.location.name}
            />
          </div>
          <div className="space-y-3 lg:col-span-8 flex flex-col">
            <MetricsGrid
              weather={weather.current}
              airQuality={weather?.current.air_quality}
            />
            <SunriseSunset
              sunrise={weather.forecast.forecastday[0].astro.sunrise}
              sunset={weather.forecast.forecastday[0].astro.sunset}
            />
          </div>
        </div>

        <HourlyForecast
          hourly={weather.forecast.forecastday[0].hour}
          unit={unit}
          localtime={weather.location.localtime}
        />

        <DailyForecast
          daily={weather.forecast.forecastday}
          unit={unit}
          onDayClick={setSelectedDay}
          selectedDay={selectedDay || undefined}
        />

        {selectedDay && weather && (
          <DayDetailView
            key={`${weather.location.name}-${selectedDay.date}`}
            day={selectedDay}
            unit={unit}
          />
        )}

        <PollenAirQuality pollen={weather.current.pollen} airQuality={weather.current.air_quality} />

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
