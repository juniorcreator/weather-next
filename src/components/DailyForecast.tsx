// import { DailyForecast as DailyData } from '@/lib/weatherAdapter';
import { formatDayName, formatTemperature, getWeatherIconCode } from '@/lib/temperatureUtils';
import {Forecastday} from "@/types/weather";
import Image from 'next/image';
import { normalizeImageUrl } from '@/lib/utils';

interface DailyForecastProps {
  daily: Forecastday[];
  unit: 'C' | 'F';
  onDayClick: (day: Forecastday) => void;
  selectedDay?: Forecastday;
}

export function DailyForecast({ daily, unit, onDayClick, selectedDay }: DailyForecastProps) {
  return (
    <div className="weather-card bg-card/50 p-6 border border-border/50">
      <h3 className="text-xl font-bold mb-5">6-Day Forecast</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {daily.slice(1).map((day) => {
          const isSelected = selectedDay?.date === day.date;

          return (
            <button
              key={day.date}
              onClick={() => onDayClick(day)}
              className={`bg-muted/30 rounded-lg p-4 text-center transition-all hover:bg-muted/90 hover:scale-103 border border-border/30 cursor-pointer ${
                isSelected ? 'ring-2 ring-primary bg-muted/90 scale-105' : ''
              }`}
            >
              <div className="text-sm font-bold mb-2">
                {formatDayName(new Date(day.date))}
              </div>

              <div className="text-5xl my-3 flex justify-center">
                <Image 
                  className="size-14" 
                  src={normalizeImageUrl(day.day.condition.icon)} 
                  alt={`${day.day.condition.text} weather icon`}
                  width={56}
                  height={56}
                  loading="lazy"
                />
                {/*{getWeatherIconCode(day.day.condition.code)}*/}
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Max · Min</div>
                <div className="font-black text-lg">
                  {formatTemperature(day.day.maxtemp_c, unit).replace('°C', '°').replace('°F', '°')} · {formatTemperature(day.day.mintemp_c, unit).replace('°C', '°').replace('°F', '°')}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
