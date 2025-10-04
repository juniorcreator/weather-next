import React from "react";
import {RootWeather} from "@/types/weather";

const SunDetails = ({weather}: {weather: RootWeather}) => {
  return (
    <div className="bg-[#2f3137]/70 rounded-[10px] py-1 px-2 text-white/75 font-bold text-sm mt-2 inline-flex items-center justify-between">
      <div className="flex items-center mr-2">
        Sunrise
        <img className="size-6 mx-1" src="/sunrise.png" alt="icon" />
        {weather.forecast.forecastday[0].astro.sunrise}
      </div>
      <div className="flex items-center">
        Sunset
        <img className="size-6 mx-1" src="/sunset.png" alt="icon" />
        {weather.forecast.forecastday[0].astro.sunset}
      </div>
    </div>
  );
}

export default SunDetails;