import { formatDayName, formatTemperature } from '@/lib/temperatureUtils';
import { Forecastday } from "@/types/weather";
import Image from 'next/image';
import { normalizeImageUrl } from '@/lib/utils';

interface CompactWeeklyForecastProps {
  forecastDays: Forecastday[];
  unit: 'C' | 'F';
}

export function CompactWeeklyForecast({ forecastDays, unit }: CompactWeeklyForecastProps) {
  const formatTemp = (temp: number) => {
    return formatTemperature(temp, unit).replace('°C', '°').replace('°F', '°');
  };

  const upcomingDays = forecastDays.slice(1);

  return (
    <div className="metric-card px-2.5 py-2 bg-card/50">
      <div className="grid grid-cols-6 gap-x-1 gap-y-1.5">
        {upcomingDays.map((day, index) => (
          <div
            key={day.date}
            className="flex flex-col items-center gap-1.5 text-[10px] relative"
          >
            {index !== upcomingDays.length - 1 && (
              <div className="absolute right-[-3px] top-0 bottom-0 w-px bg-border/50" />
            )}
          
            <div className="min-w-0 flex-1">
              <div className="text-[14px] lg:text-[13px] font-bold text-muted-foreground truncate">
                {formatDayName(new Date(day.date), false)}
              </div>
            </div>
            <div className="flex-shrink-0">
              <Image
                src={normalizeImageUrl(day.day.condition.icon, '64x64')}
                alt={day.day.condition.text}
                width={30}
                height={30}
                className="size-9"
              />
            </div>
            <div className="text-[13px] md:text-[14px] font-bold whitespace-nowrap">
              {formatTemp(day.day.maxtemp_c)}/{formatTemp(day.day.mintemp_c)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

