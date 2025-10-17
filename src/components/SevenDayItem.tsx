import { Hour, RootWeather } from "@/types/weather";
import { gbDefraIndex, getHoursInterval } from "@/utils/helpers";
import React from "react";
import { TempCenterBar } from "@/components/TempCenterBar";

type SevenDayItemProps = { weather: RootWeather; selectedIndex: number };

const SevenDayItem = ({ weather, selectedIndex }: SevenDayItemProps) => {
  const day = weather.forecast.forecastday[selectedIndex];
  const filteredHours = getHoursInterval(day.hour);
  const dayDetailsItems = [
    {
      title: "Total precipitation",
      img: "/tot-prec.png",
      alt: "Total precipitation",
      data: day.day.totalprecip_mm,
      unit: "mm",
    },
    {
      title: "Chance of rain",
      img: "/chance-of-rain.png",
      alt: "Chance of rain",
      data: day.day.daily_chance_of_rain,
      unit: "%",
    },
    {
      title: "AQI",
      img: "/air-quality-sensor.png",
      alt: "Air quality index",
      data: gbDefraIndex(day.day.air_quality["gb-defra-index"]),
      unit: "",
    },
    {
      title: "Humidity",
      img: "/humidity.png",
      alt: "Humidity",
      data: day.day.avghumidity,
      unit: "%",
    },
    {
      title: "Wind",
      img: "/wind.png",
      alt: "Wind",
      data: Math.floor(day.day.maxwind_mph),
      unit: "mph",
    },
    {
      title: "UV index",
      img: "/uv-index.png",
      alt: "UI index",
      data: day.day.uv + " of 11",
      unit: "",
    },
    {
      title: "Visibility",
      img: "/visibility.png",
      alt: "Visibility",
      data: day.day.avgvis_miles,
      unit: "mi",
    },
  ];

  return (
    <div className="shadow-m rounded-[10px] p-3">
      <div className="flex flex-wrap items-start">
        <div className="w-75 mb-2">
          <h3 className="text-2xl font-bold mb-2 text-white/90">Saturday, 12 Sep</h3>
          <div className="flex items-center ml-4 text-white/90">
            <img className="size-20" src={day.day.condition.icon} alt="icon" />
            <div className="ml-4">
              <p>{day.day.condition.text}</p>
              <div className="flex flex-wrap">
                <p>Max {day.day.maxtemp_c}°</p> <span className="px-1">/</span>
                <p>Min {day.day.mintemp_c}°</p>
              </div>
            </div>
          </div>
        </div>
        {/*sun details*/}
        <div className="flex flex-1 justify-end">
          <div className="rounded-[10px] py-1 px-2 text-white/90 text-sm bg-c1-lighter">
            <span>Sun</span>
            <div className="flex items-center">
              Rise {" "}
              {weather.forecast.forecastday[0].astro.sunrise}
            </div>
            <div className="flex items-center">
              Set {" "}
              {weather.forecast.forecastday[0].astro.sunset}
            </div>
          </div>
        </div>

        {/*sun details*/}
      </div>

      <div>
        <h3 className="text-md font-bold flex-1 my-2 pl-1 text-white/90">Saturday, hourly</h3>
        <ul className="flex flex-wrap items-center gap-1">
          {filteredHours.map((hour: Hour, index: number) => {
            return (
              <li
                className={`flex-1 shadow-s py-2 px-3 cursor-pointer rounded-[10px] text-white/80 font-bold bg-c2/80  text-center`}
                key={hour.time}
              >
                <div className={`mb-1`}>
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
                <div className="mb-1 flex items-center justify-center">
                  <img
                    className="size-5 mr-1"
                    src="/chance-of-rain.png"
                    alt="Icon"
                  />{" "}
                  {hour.chance_of_rain}%
                </div>
                <div className="mb-1 flex items-center justify-center">
                  <img className="size-5 mr-1" src="/hot.png" alt="Icon" />{" "}
                  {Math.floor(hour.temp_c)}°
                </div>
                <TempCenterBar maxTemp={45} minTemp={-45} temp={hour.temp_c} />
                {/*<div className="rounded-2xl p-1 relative bg-[#3f4249]">*/}
                {/*  <span*/}
                {/*    style={{*/}
                {/*      backgroundColor: getAppleStyleTempColor(*/}
                {/*        Math.floor(hour.temp_c),*/}
                {/*      ),*/}
                {/*      width: `${getHourRangeLine(45, -45, Math.floor(25))}%`,*/}
                {/*    }}*/}
                {/*    className="absolute left-0 top-0 h-full rounded-2xl "*/}
                {/*  ></span>*/}
                {/*</div>*/}
              </li>
            );
          })}
        </ul>
      </div>

      <h3 className="text-md font-bold flex-1 my-2 pl-1 text-white/90">Saturday, Details</h3>

      <ul className="flex flex-wrap gap-2 mt-2 text-center">
        {/*<li className="bg-dark-1/50 flex flex-wrap items-center rounded-[10px] px-3 py-3 text-white/80 font-bold">*/}
        {/*  <div className="flex">*/}
        {/*    <div className="flex items-center">*/}
        {/*      <img className="size-6 mx-1" src="/sunrise.png" alt="icon" />*/}
        {/*      {weather.forecast.forecastday[0].astro.sunrise}*/}
        {/*    </div>*/}
        {/*    <div className="flex items-center">*/}
        {/*      <img className="size-6 mx-1" src="/sunset.png" alt="icon" />*/}
        {/*      {weather.forecast.forecastday[0].astro.sunset}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</li>*/}
        {dayDetailsItems.map((item, index) => {
          return (
            <li key={item.title} className="bg-c2/80 flex flex-wrap items-center rounded-[10px] px-3 py-3 text-white/80 font-bold">
              <div className="">{item.title}</div>
              <div className="flex justify-center px-3">
                <img className="size-7" src={item.img} alt={item.alt} />
              </div>
              <div>
                {item.data} {item.unit}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SevenDayItem;
