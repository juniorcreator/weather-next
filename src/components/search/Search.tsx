"use client";

import { Search as SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getWeather } from "@/utils/api-weatherapi";
import { RootWeather } from "@/types/weather";
import AllIcons from "@/components/Icons";
import { getAppleStyleTempColor, lighten } from "@/utils/colorByTems";
import {gbDefraIndex, getHoursInterval, getWeatherIcon} from "@/utils/helpers";
import ToggleCF from "@/components/ToggleCF";
import DayDetails from "@/components/DayDetails";
import SunDetails from "@/components/SunDetails";
import SevenDaysItems from "@/components/SevenDaysItems";
import HourlyDetails from "@/components/HourlyDetails";
import SevenDayItem from "@/components/SevenDayItem";

const Search = () => {
  const [city, setCity] = useState("");
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
    getHoursInterval(data.forecast.forecastday[0].hour);
    // setBg(getAppleStyleTempColor(24));
    setBg(getAppleStyleTempColor(Math.floor(data.current.temp_c)));

    console.log(
      "getTemperatureColor >> ",
      getAppleStyleTempColor(Math.floor(data.current.temp_c)),
    );
    console.log("data >>> client ", data);
    if (!data) {
      setError("City not found");
    }
    setWeather(data);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleFetchData(city);
    }
  };

  useEffect(() => {
    (async function () {
      await handleFetchData("cherkasy");
    })();
  }, []);

  return (
    <>
      {/*search and settings*/}
      <div className="flex items-center gap-3">
        <div className="relative max-w-[300px] w-full">
          <SearchIcon
            onClick={() => handleFetchData(city)}
            className="absolute cursor-pointer hover:scale-110 inset-x-0 size-5 left-2 top-1.5 text-[#8F9395]"
          />
          <input
            type="text"
            onKeyDown={handleKeyDown}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Select a city"
            className="rounded-[10px] text-[#8F9395] border border-[#8F9395] py-1 pl-8 pr-2 w-full"
          />
        </div>
        <ToggleCF />
      </div>
      {/*search and settings*/}

      {error && <div className="text-center">{error}</div>}

      {weather && (
        <div>
          {/*header */}
          <p className="text-white/85 text-1xl font-bold mt-4">Current weather</p>
          <div className="flex items-start mt-2 mb-2 gap-5">
            <div
              className={`flex items-center relative justify-between p-4 py-4 w-120 rounded-[10px]`}
            >
              <div
                className="absolute left-0 top-0 w-full h-full rounded-[10px]  z-[-1] backdrop-blur-2xl transition-all duration-150 opacity-70"
                style={{
                  background: `linear-gradient(to bottom right, ${bg} 50%, ${lighten(bg, 20)} 70%)`
                }}
              ></div>
              <div className="weather-details w-2/3 text-white/85">
                <div className="text-lg font-bold ">
                  <div>
                    {weather.location.name}, {weather.location.country}
                  </div>
                </div>
                <h2 className="text-8xl font-extrabold ">
                  {Math.floor(weather.current.temp_c)}°
                  <span className="text-7xl">C</span>
                </h2>
                <div className="text-lg font-bold ">
                  <div className="text-2xl mb-2">
                    {weather.current.condition.text}
                  </div>
                  <div>
                    Feels like {Math.floor(weather.current.feelslike_c)}°C
                  </div>
                  <div className="">
                    Chance of rain{" "}
                    {Math.floor(
                      weather.forecast.forecastday[0].day.daily_chance_of_rain,
                    )}{" "}
                    %
                  </div>
                  <div className="text-sm font-bold ">
                    Local time {weather.location.localtime.split(" ")[1]}
                  </div>
                </div>
              </div>
              <div className="p-2 w-1/3">
                <img
                  className="size-30"
                  src={getWeatherIcon(weather.current.condition.icon)}
                  // src={weather.current.condition.icon}
                  // src="/cloudy.svg"
                  alt="Icon"
                />
              </div>
            </div>
            <div>

              <DayDetails weather={weather} />
              <SunDetails weather={weather} />
            </div>
          </div>
          {/*header */}

          {/*hourly */}
          <HourlyDetails weather={weather} />
          {/*hourly */}

          {/*5 days */}
          <div className="flex flex-wrap items-center mb-1">
            <p className="text-white/85 text-1xl font-bold">5 days forecast</p>
            <div className="p-3 ml-3 w-170">
              <img src="/Slice22.png" alt="slice" className="rounded-[5px]" />
            </div>
          </div>
          {/*7 days */}

          {/*7 days items */}
          <SevenDaysItems weather={weather} />
          {/*7 days items */}
          <SevenDayItem selectedIndex={1} weather={weather} />



          <div className="mb-20"></div>
          {/*<AllIcons />*/}
        </div>
      )}
    </>
  );
};

export default Search;
