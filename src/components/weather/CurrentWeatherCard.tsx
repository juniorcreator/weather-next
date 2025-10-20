import { Cloud, Droplets, Clock } from 'lucide-react';
// import { CurrentWeather } from '@/lib/weatherAdapter';
import { formatTemperature, getTemperatureGradient, formatTime, getWeatherIconCode } from '@/lib/temperatureUtils';
import {RootWeather} from "@/types/weather";

interface CurrentWeatherCardProps {
  weather: RootWeather | null;
  locationName: string | undefined;
  unit: 'C' | 'F';
}

export function CurrentWeatherCard({ weather, locationName, unit }: CurrentWeatherCardProps) {
  if (!weather) {
    return <h1>weather loading...</h1>;
  }
  const gradientClass = getTemperatureGradient(weather.current.temp_c);
  const weatherIcon = getWeatherIconCode(weather.current.condition.code);

  return (
    <div className={`weather-card ${gradientClass} p-6 text-white shadow-2xl relative overflow-hidden h-full w-full`}>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 drop-shadow-lg tracking-tight">{locationName}</h2>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-7xl font-bold mb-4 drop-shadow-2xl leading-none tracking-tighter">
              {formatTemperature(weather.current.temp_c, unit)}
            </h1>

            <div className="space-y-2 drop-shadow-lg">
              <p className="text-2xl font-bold">{weather.current.condition.text}</p>
              <p className="text-lg font-semibold">Feels like {formatTemperature(weather.current.feelslike_c, unit)}</p>
              <p className="flex items-center gap-2 text-base font-medium">
                <Droplets className="h-4 w-4" />
                Rain {Math.round(weather.forecast.forecastday[0].day.daily_chance_of_rain)}%
              </p>
            </div>
          </div>

          <div className="text-9xl opacity-20">
            {weatherIcon}
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-white/40 flex items-center gap-2 text-base font-medium drop-shadow-md">
          <Clock className="h-4 w-4" />
          Local time {weather.location.localtime.split(' ')[1]}
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-72 h-72 opacity-10">
        <Cloud className="w-full h-full" />
      </div>
    </div>
  );
}
