import { Forecastday } from "@/types/weather";

export const simpleGraph = (days: Forecastday[]) => {
  const data = days.map((day) => {
    return { max: day.day.maxtemp_c, min: day.day.mintemp_c };
  });

  return data;
};

export const gbDefraIndex = (index: number): string => {
  const data: { [key: string]: string } = {
    1: "Low",
    2: "Low",
    3: "Low",
    4: "Moderate",
    5: "Moderate",
    6: "Moderate",
    7: "High",
    8: "High",
    9: "High",
    10: "Very High",
  };
  return data[index];
};
