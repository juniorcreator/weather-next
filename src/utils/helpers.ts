import {Forecastday, Hour} from "@/types/weather";

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

export const getHoursInterval = (hours: Hour[]) => {
  const resultData = hours.filter((hour) => {
    const timeHour = hour.time.split(" ")[1];
    const allowedTimes = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00" , "18:00", "21:00"];

    return allowedTimes.includes(timeHour);
  });

  console.log(resultData, '<<< resultData');
  return resultData;
}

export const getHourRangeLine = (maxTemp: number, minTemp: number, temp: number
): number => {
  // Защита от деления на 0
  if (maxTemp === minTemp) return 0;

  // Обрезаем температуру в допустимые пределы
  const clamped = Math.max(Math.min(temp, maxTemp), minTemp);

  // Доля в диапазоне
  const ratio = (clamped - minTemp) / (maxTemp - minTemp);

  // Процент (0..100)
  const percent = ratio * 100;

  // Возвращаем целое (или можно вернуть Math.round(percent*100)/100 для двух знаков)
  return Math.round(percent);
};

export function getClosestTimeIndex(target: string, times: Hour[]): number {
  const targetDate = new Date(target).getTime();

  let minDiff = Infinity;
  let closestIndex = -1;

  times.forEach((t, i) => {
    const diff = Math.abs(new Date(t.time).getTime() - targetDate);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  });

  return closestIndex; // вернёт индекс ближайшего
};

export function getWeatherIcon(url: string, size: 64 | 128 = 128): string {
  return url.replace("64x64", `${size}x${size}`);
}
