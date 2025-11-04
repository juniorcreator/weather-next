"use client";

import { MapPin, Search as SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getWeather } from "@/utils/api-weatherapi";
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
    setError("");
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

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, value: string) => {
    if (e.key === "Enter") {
      await handleFetchData(value);
    }
  };

  useEffect(() => {
    (async function () {
      await handleFetchData("cherkasy");
    })();
  }, []);

  useEffect(() => {
    if (weather?.forecast.forecastday && !selectedDay) {
      console.log("if if useEffect");
      setSelectedDay(weather?.forecast.forecastday[1]);
    }
  }, [weather, selectedDay]);

  if (!weather) {
    return <h2>loading...</h2>;
  }

  return (
    <>
      {/*search and settings*/}
      <WeatherHeader
        unit={unit}
        onToggleUnit={toggleUnit}
        onLocationSelect={() => {}}
        onHandleKeyDown={handleKeyDown}
        onHandleFetchData={handleFetchData}
      />
      {/*<div className="flex items-center gap-3">*/}
      {/*  <div className="relative max-w-[300px] w-full">*/}
      {/*    <SearchIcon*/}
      {/*      onClick={() => handleFetchData(city)}*/}
      {/*      className="absolute cursor-pointer hover:scale-110 inset-x-0 size-5 left-2 top-1.5 text-white/80"*/}
      {/*    />*/}
      {/*    <input*/}
      {/*      type="text"*/}
      {/*      onKeyDown={handleKeyDown}*/}
      {/*      onChange={(e) => setCity(e.target.value)}*/}
      {/*      placeholder="Search location..."*/}
      {/*      className="rounded-[10px] bg-c2 text-white border border-c2/60 outline-none focus:border-c4 py-1 pl-8 pr-2 w-full"*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*  <div className="cursor-pointer p-2 bg-black border-c2 rounded-[10px] hover:bg-c4 hover:text-black border">*/}
      {/*    <MapPin className="size-4" />*/}
      {/*  </div>*/}
      {/*  <ToggleCF />*/}
      {/*</div>*/}
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
        />

        <DailyForecast
          daily={weather.forecast.forecastday}
          unit={unit}
          onDayClick={setSelectedDay}
          selectedDay={selectedDay || undefined}
        />

        {selectedDay && (
          <DayDetailView
            day={selectedDay}
            unit={unit}
          />
        )}

        <PollenAirQuality pollen={weather.current.pollen} airQuality={weather.current.air_quality} />

        <div className="text-center text-xs text-muted-foreground py-4">
          Last updated: {weather.current.last_updated.toLocaleString()}
        </div>
      </main>

      {/*{weather && (*/}
      {/*  <div>*/}
      {/*    /!*header *!/*/}
      {/*    <p className="text-white/85 text-1xl font-bold mt-4">*/}
      {/*      Current weather*/}
      {/*    </p>*/}
      {/*    <div className="flex items-start mt-2 mb-2 gap-5">*/}
      {/*      <div*/}
      {/*        className={`flex flex-1 items-center relative justify-between p-4 py-4 w-120 rounded-[10px]`}*/}
      {/*      >*/}
      {/*        <div*/}
      {/*          className="absolute left-0 top-0 w-full h-full rounded-[10px]  z-[-1] transition-all duration-150 opacity-80"*/}
      {/*          style={{*/}
      {/*            background: `linear-gradient(to bottom right, ${bg} 50%, ${lighten(bg, 20)} 70%)`,*/}
      {/*          }}*/}
      {/*        ></div>*/}
      {/*        <div className="weather-details w-2/3 text-white/85">*/}
      {/*          <div className="text-lg font-bold ">*/}
      {/*            <div>*/}
      {/*              {weather.location.name}, {weather.location.country}*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          <h2 className="text-8xl font-extrabold ">*/}
      {/*            {Math.floor(weather.current.temp_c)}°*/}
      {/*            <span className="text-7xl">C</span>*/}
      {/*          </h2>*/}
      {/*          <div className="text-lg font-bold ">*/}
      {/*            <div className="text-2xl mb-2">*/}
      {/*              {weather.current.condition.text}*/}
      {/*            </div>*/}
      {/*            <div>*/}
      {/*              Feels like {Math.floor(weather.current.feelslike_c)}°C*/}
      {/*            </div>*/}
      {/*            <div className="">*/}
      {/*              Chance of rain{" "}*/}
      {/*              {Math.floor(*/}
      {/*                weather.forecast.forecastday[0].day.daily_chance_of_rain,*/}
      {/*              )}{" "}*/}
      {/*              %*/}
      {/*            </div>*/}
      {/*            <div className="text-sm font-bold ">*/}
      {/*              Local time {weather.location.localtime.split(" ")[1]}*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*        <div className="p-2 w-1/3">*/}
      {/*          <img*/}
      {/*            className="size-30"*/}
      {/*            src={getWeatherIcon(weather.current.condition.icon)}*/}
      {/*            // src={weather.current.condition.icon}*/}
      {/*            // src="/cloudy.svg"*/}
      {/*            alt="Icon"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*      <div>*/}
      {/*        <DayDetails weather={weather} />*/}
      {/*        <SunDetails weather={weather} />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    /!*header *!/*/}

      {/*    /!*hourly *!/*/}
      {/*    <HourlyDetails weather={weather} />*/}
      {/*    /!*hourly *!/*/}

      {/*    /!*5 days *!/*/}
      {/*    <div className="flex flex-wrap items-center mb-1">*/}
      {/*      <p className="text-white/85 text-1xl font-bold">5 days forecast</p>*/}
      {/*      <div className="p-3 ml-3 w-170">*/}
      {/*        <img src="/Slice22.png" alt="slice" className="rounded-[5px]" />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    /!*7 days *!/*/}

      {/*    /!*7 days items *!/*/}
      {/*    <SevenDaysItems weather={weather} />*/}
      {/*    /!*7 days items *!/*/}
      {/*    <SevenDayItem selectedIndex={1} weather={weather} />*/}

      {/*    <div className="mb-20"></div>*/}
      {/*    /!*<AllIcons />*!/*/}
      {/*  </div>*/}
      {/*)}*/}
    </>
  );
};

export default Search;
