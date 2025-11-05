import {Hour} from "@/types/weather";

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

  return resultData;
}

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
