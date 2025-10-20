// import { HourlyForecast as HourlyData } from '@/lib/weatherAdapter';
import { formatTime, formatTemperature, getWeatherIconCode } from '@/lib/temperatureUtils';
import { Wind, Droplets } from 'lucide-react';
import {Forecastday, Hour} from "@/types/weather";

interface HourlyForecastProps {
  hourly: Hour[];
  unit: 'C' | 'F';
}

export function HourlyForecast({ hourly, unit }: HourlyForecastProps) {
  return (
    <div className="weather-card bg-card/50 p-6 border border-border/50">
      <h3 className="text-xl font-bold mb-5">Todays 24-Hour Forecast</h3>

      <div className="flex gap-3 horizontal-scroll-wrapper overflow-x-auto overflow-y-hidden py-2 styled-scroll scroll-smooth snap-x snap-mandatory">
        {hourly.map((hour, index) => (
          <div
            key={index}
            className="bg-muted/30 min-w-23 rounded-lg p-3 text-center hover:bg-muted/50 transition-all hover:scale-105 flex flex-col border border-border/30 snap-start"
          >
            <div className="text-sm font-bold mb-2">{formatTime(new Date(hour.time))}</div>

            <div className="text-4xl my-2 flex justify-center">
              <img className="size-12" src={hour.condition.icon} alt="weather hourly icon"/>
              {/*{getWeatherIconCode(hour.condition.code)}*/}
            </div>

            <div className="font-black text-xl mb-2">
              {formatTemperature(hour.temp_c, unit).replace('°C', '°').replace('°F', '°')}
            </div>

            <div className="space-y-1.5 text-xs font-medium text-muted-foreground">
              <div title="Rain %" className="flex items-center justify-center gap-1">
                {/*<span className="text-xs">rain</span>*/}
                <Droplets className="h-3 w-3" />
                {Math.round(hour.chance_of_rain)}%
              </div>

              <div className="flex items-center justify-center gap-1">
                <Wind className="h-3 w-3" />
                {Math.round(hour.wind_mph)}
              </div>
            </div>

            <div className="mt-2 h-1.5 bg-primary/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${hour.precip_in}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
