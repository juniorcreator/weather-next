// import { DailyForecast } from '@/lib/weatherAdapter';
import {
  formatTemperature,
  getWeatherIconCode,
  formatTime,
} from "@/lib/temperatureUtils";
import {Wind, Droplets, Eye, Gauge, Sun, Sunrise, Sunset} from "lucide-react";
import { Forecastday, Hour } from "@/types/weather";
import { usEpaIndexText } from "@/utils/airQuality";
import { useMemo } from "react";
import { TempCenterBar } from "@/components/TempCenterBar";
import Image from 'next/image';
import { normalizeImageUrl } from '@/lib/utils';

interface DayDetailViewProps {
  day: Forecastday;
  unit: "C" | "F";
}

type TimeOfDay = 'Night' | 'Morning' | 'Afternoon' | 'Evening';

interface GroupedHours {
  period: TimeOfDay;
  hours: Hour[];
}

// Filter hours to only include specific times (00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00)
const filterHours = (hours: Hour[]): Hour[] => {
  const allowedTimes = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
  
  return hours.filter((hour) => {
    const timeHour = hour.time.split(" ")[1];
    return allowedTimes.includes(timeHour);
  });
};

// Group hours by time of day
const groupHoursByPeriod = (hours: Hour[]): GroupedHours[] => {
  const grouped: { [key in TimeOfDay]: Hour[] } = {
    Night: [],
    Morning: [],
    Afternoon: [],
    Evening: [],
  };

  hours.forEach((hour) => {
    const timeHour = hour.time.split(" ")[1];
    const hourNum = parseInt(timeHour.split(":")[0]);

    if (hourNum === 0 || hourNum === 3) {
      grouped.Night.push(hour);
    } else if (hourNum === 6 || hourNum === 9) {
      grouped.Morning.push(hour);
    } else if (hourNum === 12 || hourNum === 15) {
      grouped.Afternoon.push(hour);
    } else if (hourNum === 18 || hourNum === 21) {
      grouped.Evening.push(hour);
    }
  });

  // Convert to array and filter out empty groups
  return Object.entries(grouped)
    .map(([period, hours]) => ({ period: period as TimeOfDay, hours }))
    .filter((group) => group.hours.length > 0);
};

export function DayDetailView({ day, unit }: DayDetailViewProps) {
  // Filter and group hours
  const filteredHours = useMemo(() => filterHours(day.hour), [day.hour]);
  const groupedHours = useMemo(() => groupHoursByPeriod(filteredHours), [filteredHours]);

  // Calculate global min/max temperatures from all filtered hours
  const { globalMin, globalMax } = useMemo(() => {
    if (filteredHours.length === 0) return { globalMin: 0, globalMax: 0 };
    
    const temps = filteredHours.map(hour => hour.temp_c);
    const globalMin = Math.min(...temps);
    const globalMax = Math.max(...temps);
    
    return { globalMin, globalMax };
  }, [filteredHours]);

  return (
    <div className="weather-card bg-card/50 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">
            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <span className="text-3xl">
              {getWeatherIconCode(day.day.condition.code)}
            </span>
            <span>{day.day.condition.text}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Max {formatTemperature(day.day.maxtemp_c, unit)} / Min{" "}
            {formatTemperature(day.day.mintemp_c, unit)}
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Hourly</h4>
        <div className="overflow-y-hidden overflow-x-auto">
          <div className="flex justify-between gap-6 min-w-190 lg:min-w-full ">
            {groupedHours.map((group) => (
              <div key={group.period} className="flex-1">
                <h5 className="text-sm text-center font-semibold text-muted-foreground capitalize mb-2">
                  {group.period}
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                  {group.hours.map((hour) => (
                    <div key={hour.time} className="bg-muted/40 flex-1 rounded-lg p-3 text-center">
                      <div className="text-xs font-medium mb-1">
                        {formatTime(new Date(hour.time))}
                      </div>
                      <div className="text-2xl my-1 flex justify-center">
                        <Image 
                          className="size-11" 
                          src={normalizeImageUrl(hour.condition.icon)} 
                          alt={`${hour.condition.text} weather icon`}
                          width={44}
                          height={44}
                          loading="lazy"
                        />
                        {/*{getWeatherIconCode(hour.condition.code)}*/}
                      </div>
                      <div className="text-xs font-semibold mb-1">
                        {formatTemperature(hour.temp_c, unit)}°
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <div
                          title="Chance of rain %"
                          className="flex items-center justify-center gap-1"
                        >
                          <Droplets className="size-4" />
                          {Math.round(hour.chance_of_rain)}%
                        </div>
                        <div title="Wind" className="flex items-center justify-center gap-1">
                          <Wind className="size-4" />
                          {Math.round(hour.wind_mph)}
                        </div>
                      </div>
                      <TempCenterBar
                        minTemp={globalMin}
                        maxTemp={globalMax}
                        temp={hour.temp_c}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Details</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-muted/40 rounded-lg p-3 flex items-center gap-3">
            <Droplets className="h-5 w-5 text-cyan-400" />
            <div>
              <div className="text-xs text-muted-foreground">
                Total precipitation
              </div>
              <div className="font-semibold">
                {day.day.totalprecip_mm.toFixed(2)} mm
              </div>
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 flex items-center gap-3">
            <Droplets className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-xs text-muted-foreground">
                Chance of rain
              </div>
              <div className="font-semibold">
                {Math.round(day.day.daily_chance_of_rain)}%
              </div>
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 flex items-center gap-3">
            <Gauge className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">AQI</div>
              <div className="font-semibold">
                {day.day.air_quality["us-epa-index"]}{" "}
                {usEpaIndexText(day.day.air_quality["us-epa-index"])}
              </div>
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 flex items-center gap-3">
            <Droplets className="h-5 w-5 text-purple-400" />
            <div>
              <div className="text-xs text-muted-foreground">Humidity</div>
              <div className="font-semibold">{day.day.avghumidity}%</div>
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 flex items-center gap-3">
            <Wind className="h-5 w-5 text-cyan-400" />
            <div>
              <div className="text-xs text-muted-foreground">Wind</div>
              <div className="font-semibold">
                {Math.floor(day.day.maxwind_mph)} mph
              </div>
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 flex items-center gap-3">
            <Sun className="h-5 w-5 text-orange-400" />
            <div>
              <div className="text-xs text-muted-foreground">UV Index</div>
              <div className="font-semibold">{day.day.uv} of 11</div>
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 flex items-center gap-3">
            <Eye className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Visibility</div>
              <div className="font-semibold">{day.day.avgvis_miles} mi</div>
            </div>
          </div>

          {/*sun details*/}
          <div className="bg-muted/40 col-span-2 rounded-lg p-3 flex items-center justify-around">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Sunrise className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Sunrise</div>
                <div className="font-semibold text-sm">{day.astro.sunrise}</div>
              </div>
            </div>

            <div className="w-px h-12 mx-3 bg-border" />

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <Sunset className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Sunset</div>
                <div className="font-semibold text-sm">{day.astro.sunset}</div>
              </div>
            </div>
          </div>
          {/*sun details*/}

        </div>
      </div>
    </div>
  );
}
