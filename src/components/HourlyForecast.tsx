"use client";

// import { HourlyForecast as HourlyData } from '@/lib/weatherAdapter';
import { formatTime, formatTemperature, getWeatherIconCode } from '@/lib/temperatureUtils';
import { Wind, Droplets } from 'lucide-react';
import { Hour } from "@/types/weather";
import { useEffect, useRef, useState, useMemo } from 'react';
import { getClosestTimeIndex } from '@/utils/helpers';
import { TemperatureRangeBar } from '@/components/TemperatureRangeBar';
import { TempCenterBar } from '@/components/TempCenterBar';

interface HourlyForecastProps {
  hourly: Hour[];
  unit: 'C' | 'F';
  localtime: string;
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

// Find closest hour across all groups and return group info
const findClosestHourInGroups = (localtime: string, groupedHours: GroupedHours[]) => {
  // Flatten all hours from all groups
  const allHours: Hour[] = [];
  groupedHours.forEach(group => {
    allHours.push(...group.hours);
  });

  if (allHours.length === 0) return null;

  // Find closest hour index in flattened array
  const closestIndex = getClosestTimeIndex(localtime, allHours);
  const closestHour = allHours[closestIndex];

  // Find which group contains this hour and its index in that group
  for (const group of groupedHours) {
    const groupIndex = group.hours.findIndex(h => h.time === closestHour.time);
    if (groupIndex !== -1) {
      return {
        groupPeriod: group.period,
        hourIndex: groupIndex,
        elementId: `${group.period}-${groupIndex}`
      };
    }
  }

  return null;
};

export function HourlyForecast({ hourly, unit, localtime }: HourlyForecastProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [closestHourInfo, setClosestHourInfo] = useState<{
    groupPeriod: TimeOfDay;
    hourIndex: number;
    elementId: string;
  } | null>(null);

  // Memoize filtered and grouped hours to prevent infinite loops
  const filteredHours = useMemo(() => filterHours(hourly), [hourly]);
  const groupedHours = useMemo(() => groupHoursByPeriod(filteredHours), [filteredHours]);

  // Calculate global min/max temperatures from all filtered hours
  const { globalMin, globalMax } = useMemo(() => {
    if (filteredHours.length === 0) return { globalMin: 0, globalMax: 0 };
    
    const temps = filteredHours.map(hour => hour.temp_c);
    const globalMin = Math.min(...temps);
    const globalMax = Math.max(...temps);
    
    return { globalMin, globalMax };
  }, [filteredHours]);

  // Find closest hour
  useEffect(() => {
    const closest = findClosestHourInGroups(localtime, groupedHours);
    setClosestHourInfo(closest);
  }, [localtime, groupedHours]);

  // Auto-scroll to closest hour on mobile/tablet
  useEffect(() => {
    if (!closestHourInfo || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const elementId = closestHourInfo.elementId;
    const targetElement = container.querySelector(`[data-hour-id="${elementId}"]`) as HTMLElement;

    if (targetElement) {
      // Check if mobile/tablet (viewport width < 1024px)
      const isMobile = window.innerWidth < 1024;
      
      if (isMobile) {
        // Scroll to center the element
        const containerRect = container.getBoundingClientRect();
        const elementRect = targetElement.getBoundingClientRect();
        const scrollLeft = container.scrollLeft + (elementRect.left - containerRect.left) - (containerRect.width / 2) + (elementRect.width / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [closestHourInfo]);

  return (
    <div className="weather-card bg-card/50 p-6 border border-border/50">
      <h3 className="text-xl font-bold mb-5">Today's 24-Hour Forecast</h3>

      <div 
        ref={scrollContainerRef}
        className="flex justify-between gap-6 overflow-x-auto overflow-y-hidden px-1"
      >
        {groupedHours.map((group) => (
          <div key={group.period} className="flex-1">
            <h4 className="text-sm text-center font-semibold text-muted-foreground capitalize">
              {group.period}
            </h4>
            
            <div className="flex gap-3 pt-2 pb-2">
              {group.hours.map((hour, index) => {
                const hourId = `${group.period}-${index}`;
                const isActive = closestHourInfo?.groupPeriod === group.period && 
                                 closestHourInfo?.hourIndex === index;

                return (
                  <div
                    key={index}
                    data-hour-id={hourId}
                    className={`bg-muted/30 flex-1 min-w-23 rounded-lg p-3 text-center hover:bg-muted/50 transition-all flex flex-col border border-border/30 snap-start ${
                      isActive ? 'bg-muted/50 ring-2 ring-primary/50' : ''
                    }`}
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

                    <TempCenterBar maxTemp={globalMax} minTemp={globalMin} temp={hour.temp_c} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
