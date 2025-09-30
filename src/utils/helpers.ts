import {Forecastday} from "@/types/weather";

export const simpleGraph = (days: Forecastday[]) => {
  const data = days.map(day => {
    return {max: day.day.maxtemp_c, min: day.day.mintemp_c};
  });

  return data;
}