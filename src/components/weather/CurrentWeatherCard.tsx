import {Cloud, Droplets, Clock, Thermometer, ThermometerSun, ThermometerSnowflake, CloudRain, Sunrise, Sunset} from 'lucide-react';
// import { CurrentWeather } from '@/lib/weatherAdapter';
import {
  formatTemperature,
  getTemperatureGradient,
  formatTime,
  getWeatherIconCode,
} from '@/lib/temperatureUtils';
import {RootWeather} from "@/types/weather";
import Image from 'next/image';
import { normalizeImageUrl } from '@/lib/utils';

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

  // Calculate min/max temperature including current temperature and hourly forecast
  const getMinMaxTemp = () => {
    const currentTemp = weather.current.temp_c;
    const todayHourly = weather.forecast.forecastday[0].hour;
    
    // Get all temperatures from hourly forecast
    const hourlyTemps = todayHourly.map(hour => hour.temp_c);
    
    // Include current temperature in the calculation
    const allTemps = [currentTemp, ...hourlyTemps];
    
    return {
      min: Math.min(...allTemps),
      max: Math.max(...allTemps)
    };
  };

  const { min, max } = getMinMaxTemp();

  return (
    <div className={`weather-card ${gradientClass} p-4 px-5 text-white shadow-2xl relative overflow-hidden h-full w-full`}>
      <div className="relative z-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 drop-shadow-lg tracking-tight">{locationName}, {weather.location.country}</h2>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-6xl sm:text-7xl font-bold mb-3 drop-shadow-2xl leading-none tracking-tighter">
              {formatTemperature(weather.current.temp_c, unit)}
            </h1>

            <div className="space-y-2 drop-shadow-lg">
              <p className="text-2xl font-bold">{weather.current.condition.text}</p>
              <div className="text-lg font-semibold flex items-center">
                <svg
                  className="size-4 fill-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  width="32"
                  height="32"
                  data-name="Layer 1"
                  viewBox="0 0 32 32"
                >
                  <path d="M26 30h-4a2.006 2.006 0 0 1-2-2v-7a2.006 2.006 0 0 1-2-2v-6a2.947 2.947 0 0 1 3-3h6a2.947 2.947 0 0 1 3 3v6a2.006 2.006 0 0 1-2 2v7a2.006 2.006 0 0 1-2 2m-5-18a.945.945 0 0 0-1 1v6h2v9h4v-9h2v-6a.945.945 0 0 0-1-1ZM24 9a4 4 0 1 1 4-4 4.01 4.01 0 0 1-4 4m0-6a2 2 0 1 0 2 2 2.006 2.006 0 0 0-2-2M10 20.184V12H8v8.184a3 3 0 1 0 2 0"></path>
                  <path d="M9 30a6.993 6.993 0 0 1-5-11.89V7a5 5 0 0 1 10 0v11.11A6.993 6.993 0 0 1 9 30M9 4a3.003 3.003 0 0 0-3 3v11.983l-.332.299a5 5 0 1 0 6.664 0L12 18.983V7a3.003 3.003 0 0 0-3-3"></path>
                  <path
                    id="_Transparent_Rectangle_"
                    fill="none"
                    d="M0 0h32v32H0z"
                    data-name="&lt;Transparent Rectangle&gt;"
                  ></path>
                </svg> <p> Feels like {formatTemperature(weather.current.feelslike_c, unit)}</p>
              </div>
              <p className="flex items-center gap-2 text-base font-medium">
                {/*<Droplets className="h-4 w-4" />*/}
                <CloudRain className="size-4" />
                Rain {Math.round(weather.forecast.forecastday[0].day.daily_chance_of_rain)}%
              </p>
            </div>
          </div>
          <Image className="size-30 md:size-40 opacity-70" src={normalizeImageUrl(weather.current.condition.icon, '128x128')} alt={weather.current.condition.text} width={100} height={100} />
        </div>

        <div className="mt-2 pt-2 border-t border-white/40 flex items-center justify-between gap-4 flex-wrap text-sm font-medium drop-shadow-md">
          <div className="flex items-center gap-2">
            <ThermometerSun className="size-4" />
            Max {formatTemperature(max, unit).replace('°C', '°').replace('°F', '°')} / Min {formatTemperature(min, unit).replace('°C', '°').replace('°F', '°')}
          </div>
          <div className="flex items-center gap-2">
            <Sunrise className="size-3.5" />
            {weather.forecast.forecastday[0].astro.sunrise} / 
            <Sunset className="size-3.5 ml-1" />
            {weather.forecast.forecastday[0].astro.sunset}
          </div>
        </div>
      </div>

      <div className="absolute left-1/4  bottom-0 sm:right-0 sm:left-auto w-50 sm:w-72 h-50 sm:h-72 opacity-10">
        <Cloud className="w-full h-full" />
      </div>
    </div>
  );
}
