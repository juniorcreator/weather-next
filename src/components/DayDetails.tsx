import {gbDefraIndex} from "@/utils/helpers";
import React from "react";
import {RootWeather} from "@/types/weather";

const DayDetails = ({weather}: {weather: RootWeather}) => {
  return (
    <ul className="grid grid-cols-3 w-full gap-3 text-center">
      <li>
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
      <li>
        <div>Humidity</div>
        <div className="flex justify-center py-1">
          <img className="size-7" src="/humidity.png" alt="icon" />
        </div>
        <div>{weather.current.humidity}%</div>
      </li>
      <li>
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
      <li>
        <div>UV index</div>
        <div className="flex justify-center py-1">
          <img className="size-7" src="/uv-index.png" alt="icon" />
        </div>
        <div>{weather.current.uv}</div>
      </li>
      <li>
        <div>Pressure</div>
        <div className="flex justify-center py-1">
          <img className="size-7" src="/pressure.png" alt="icon" />
        </div>
        <div>{weather.current.pressure_in} in</div>
      </li>
      <li>
        <div>Visibility</div>
        <div className="flex justify-center py-1">
          <img className="size-7" src="/visibility.png" alt="icon" />
        </div>
        <div>{weather.current.vis_miles} mi</div>
      </li>
    </ul>
  );
}

export default DayDetails;