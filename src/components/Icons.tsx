"use client";

import { weatherIcons } from "@/utils/weather_icons";

const AllIcons = () => {
  return (
    <ul className="flex flex-wrap">
      {weatherIcons.map((icon, index) => (
        <li className=" mb-3 mx-2" key={icon.code}>
          <p className="text-center text-xs border">
            {icon.name}-{index + 1}
          </p>
          <p className="text-center">code: {icon.icon}</p>
          <div className="flex">
            <div className="p-2">
              <p>night</p>
              <img
                className="size-15"
                alt="Icon"
                src={`//cdn.weatherapi.com/weather/64x64/night/${icon.icon}.png`}
              />
            </div>
            <div className="p-2">
              <p>day</p>
              <img
                className="size-15"
                alt="Icon"
                src={`//cdn.weatherapi.com/weather/64x64/day/${icon.icon}.png`}
              />
            </div>
            <span className="px-px bg-black"></span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AllIcons;
