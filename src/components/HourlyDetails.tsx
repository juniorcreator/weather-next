import React from "react";
import { Hour, RootWeather } from "@/types/weather";
import {
  getClosestTimeIndex,
  getHourRangeLine,
  getHoursInterval,
} from "@/utils/helpers";
import { getAppleStyleTempColor } from "@/utils/colorByTems";
import { TempCenterBar } from "@/components/TempCenterBar";

const HourlyDetails = ({ weather }: { weather: RootWeather }) => {
  const filteredHours = getHoursInterval(weather.forecast.forecastday[0].hour);
  const closestTimeIndex = getClosestTimeIndex(
    weather.location.localtime,
    filteredHours,
  );
  console.log(closestTimeIndex, " closestTimeIndex");
  console.log(getHourRangeLine(45, -45, 10));
  return (
    <div className="mb-2">
      <p className="text-white/85 text-1xl font-bold mb-2">Hourly Forecast</p>
      <ul className="flex flex-wrap items-center gap-2">
        {filteredHours.map((hour: Hour, index: number) => {
          return (
            <li
              className={`py-2 px-2 cursor-pointer rounded-[10px] border-2 text-white/70 font-bold ${index === closestTimeIndex ? "bg-[#65A6BD]/80 border-[#81D4E9]/80" : "bg-[#2e3034] border-[#44494C]"} text-center`}
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
                <img className="size-5 mr-1" src="/wind.png" alt="wind icon" />{" "}
                {Math.floor(hour.wind_kph)} m/s
              </div>
              <div className="mb-1 flex items-center justify-center">
                <img className="size-5 mr-1" src="/chance-of-rain.png" alt="Icon" />{" "}
                {hour.chance_of_rain}%
              </div>
              <div className="mb-1">{Math.floor(hour.temp_c)}°</div>
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
  );
};

export default HourlyDetails;
