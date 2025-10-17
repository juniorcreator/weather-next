import React from "react";
import {Forecastday, RootWeather} from "@/types/weather";

const SevenDaysItems = ({weather}: {weather: RootWeather}) => {
  return (
    <ul className="flex gap-2 mb-5">
      {weather.forecast.forecastday.map((day: Forecastday, index: number) => (
        <li
          className={`flex-1 py-2 px-3 cursor-pointer rounded-[10px] text-white/80 font-bold ${index === 0 ? "bg-c2/30 shadow-l " : "bg-c2 hover:bg-c2/30"}`}
          key={day.date}
        >
          <p className="text-center mb-2">
            {index === 0 ? "Today" : index === 1 ? "Tomorrow" : new Date(day.date).toLocaleDateString("en-US", {
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