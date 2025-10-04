import React from "react";
import {RootWeather} from "@/types/weather";

const SevenDaysItems = ({weather}: {weather: RootWeather}) => {
  return (
    <ul className="flex gap-2 mb-5">
      {weather.forecast.forecastday.map((day: any, index: number) => (
        <li
          className={`py-2 px-3 cursor-pointer rounded-[10px] border-2 text-white/70 font-bold ${index === 0 ? "bg-[#65A6BD] border-[#81D4E9]" : "bg-[#2e3034] border-[#44494C]"}`}
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
  );
}

export default SevenDaysItems;