"use client";

import { Search as SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getWeather } from "@/utils/api-weatherapi";
import { RootWeather } from "@/types/weather";
import AllIcons from "@/components/Icons";
import { getAppleStyleTempColor, lighten } from "@/utils/colorByTems";
import { gbDefraIndex } from "@/utils/helpers";
import ToggleCF from "@/components/ToggleCF";

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
    <div className="">
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

      {error && <div className="text-center">{error}</div>}

      {weather && (
        <div>
          {/*header */}
          <div className="flex items-start mt-5 mb-5 gap-5">
            <div
              className={`flex items-center relative justify-between p-4 py-4 w-120 rounded-[10px]`}
            >
              <div
                className="absolute left-0 top-0 w-full h-full rounded-[10px]  z-[-1] backdrop-blur-2xl transition-all duration-150 opacity-70"
                style={{
                  background: `linear-gradient(to bottom right, ${bg} 50%, ${lighten(bg, 20)} 70%)`,
                  boxShadow: `1px 1px 3px 0px ${bg}`,
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
                  src={weather.current.condition.icon}
                  // src="/cloudy.svg"
                  alt="Icon"
                />
              </div>
            </div>
            <div>
              <ul className="grid grid-cols-3 w-full gap-3 text-center">
                <li className="current-item-details">
                  <div>AQI</div>
                  <div className="flex justify-center py-1">
                    <img
                      className="size-7"
                      src="/air-quality-sensor.png"
                      alt="icon"
                    />
                  </div>
                  <div>
                    {gbDefraIndex(
                      weather.current.air_quality["gb-defra-index"],
                    )}
                  </div>
                </li>
                <li className="current-item-details">
                  <div>Humidity</div>
                  <div className="flex justify-center py-1">
                    <img className="size-7" src="/humidity.png" alt="icon" />
                  </div>
                  <div>{weather.current.humidity}%</div>
                </li>
                <li className="current-item-details">
                  <div>Wind</div>
                  <div className="flex justify-center py-1 items-center">
                    <span className="text-xs pr-1">
                      {" "}
                      {weather.current.wind_dir}
                    </span>{" "}
                    <img className="size-7" src="/wind.png" alt="icon" />
                  </div>
                  <div>{Math.floor(weather.current.wind_mph)} mph</div>
                </li>
                <li className="current-item-details">
                  <div>UV index</div>
                  <div className="flex justify-center py-1">
                    <img className="size-7" src="/uv-index.png" alt="icon" />
                  </div>
                  <div>{weather.current.uv}</div>
                </li>
                <li className="current-item-details">
                  <div>Pressure</div>
                  <div className="flex justify-center py-1">
                    <img className="size-7" src="/pressure.png" alt="icon" />
                  </div>
                  <div>{weather.current.pressure_in} in</div>
                </li>
                <li className="current-item-details">
                  <div>Visibility</div>
                  <div className="flex justify-center py-1">
                    <img className="size-7" src="/visibility.png" alt="icon" />
                  </div>
                  <div>{weather.current.vis_miles} mi</div>
                </li>
              </ul>

              <div className="bg-[#2f3137] rounded-[10px] p-1 px-3 text-white/70 font-bold text-md mt-2 flex items-center justify-between">
                <div className="flex items-center">
                  <img className="size-5" src="/sunrise.png" alt="icon" />
                  {weather.forecast.forecastday[0].astro.sunrise}
                </div>
                <span className="px-3">|</span>
                <div className="flex items-center">
                  <img className="size-5" src="/sunset.png" alt="icon" />
                  {weather.forecast.forecastday[0].astro.sunset}
                </div>
              </div>
            </div>
          </div>
          {/*header */}

          {/*5 days */}
          <div className="flex flex-wrap items-center mb-5">
            <p className="text-white/85 text-1xl font-bold">5 days</p>
            <div className="p-3 ml-3 w-170">
              <img src="/Slice22.png" alt="slice" className="rounded-[5px]" />
            </div>
          </div>
          {/*7 days */}

          {/*7 days items */}
          <ul className="flex gap-2 mb-5">
            {weather.forecast.forecastday.map((day: any, index: number) => (
              <li
                className={`py-2 px-3 cursor-pointer rounded-md border-2 text-white/70 font-bold ${index === 0 ? "bg-[#65A6BD] border-[#81D4E9]" : "bg-[#2e3034] border-[#44494C]"}`}
                key={day.date}
              >
                <p className="text-center mb-2">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </p>
                <div className="flex justify-center mb-2">
                  <img
                    className="size-11"
                    src={day.day.condition.icon}
                    alt={"Icon " + day.day.condition.text}
                  />
                </div>
                <div className="flex gap-2 justify-center text-[16px]">
                  <div className="flex flex-col items-center">
                    <span>Max</span>
                    <span>{Math.floor(day.day.maxtemp_c)}°</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>Min</span>
                    <span>{Math.floor(day.day.mintemp_c)}°</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {/*7 days items */}

          {/*hourly */}
          <div className="mb-5">
            <p className="text-white/85 text-1xl font-bold mb-5">
              Hourly Forecast
            </p>
            <ul className="flex flex-wrap items-center gap-2">
              {weather.forecast.forecastday[0].hour
                .slice(0, 8)
                .map((hour: any, index: number) => (
                  <li
                    className="py-2 px-2 cursor-pointer rounded-md border-2 text-white/70 font-bold bg-[#2e3034] border-[#44494C] text-center"
                    key={hour.time}
                  >
                    <div className="mb-1">
                      {new Date(hour.time).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </div>
                    <div className="flex justify-center mb-2">
                      <img
                        className="size-12"
                        src={hour.condition.icon}
                        alt={"Icon " + hour.condition.text}
                      />
                    </div>
                    <div className="mb-1 flex items-center">
                      <img
                        className="size-5 mr-1"
                        src="/wind.png"
                        alt="wind icon"
                      />{" "}
                      {Math.floor(hour.wind_kph)} m/s
                    </div>
                    <div className="mb-1">{Math.floor(hour.temp_c)}°</div>
                    <div className="rounded-2xl p-1 relative bg-[#3f4249]">
                      <span className="absolute left-0 top-0 w-[55%] h-full rounded-2xl bg-amber-500"></span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          {/*hourly */}

          <div className="mb-300"></div>
          {/*<AllIcons />*/}
        </div>
      )}
    </div>
  );
};

export default Search;
