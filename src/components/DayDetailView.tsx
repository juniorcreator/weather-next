// import { DailyForecast } from '@/lib/weatherAdapter';
import {
  formatTemperature,
  getWeatherIconCode,
  formatTime,
  formatDayName,
} from "@/lib/temperatureUtils";
import {Wind, Droplets, Eye, Gauge, Sun, Sunrise, Sunset} from "lucide-react";
import { Forecastday, Hour } from "@/types/weather";
import { usEpaIndexText } from "@/utils/airQuality";
import { useMemo, memo, useRef, useEffect, useCallback } from "react";
import { TempCenterBar } from "@/components/TempCenterBar";
import Image from 'next/image';
import { normalizeImageUrl } from '@/lib/utils';
import { DailyForecast } from "@/components/DailyForecast";

interface DayDetailViewProps {
  day: Forecastday;
  unit: "C" | "F";
  allDays: Forecastday[];
  onDayClick: (day: Forecastday) => void;
  selectedDay?: Forecastday;
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

// Memoized DailyForecast component for optimal performance during horizontal scrolling
const MemoizedDailyForecast = memo(DailyForecast);

export function DayDetailView({ day, unit, allDays, onDayClick, selectedDay }: DayDetailViewProps) {
  // Refs for scroll container and day elements
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const isProgrammaticScroll = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isIntersectionTriggered = useRef<boolean>(false);
  const lastSelectedDayRef = useRef<string | null>(null);
  const intersectionDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Filter and group hours for the current day
  const filteredHours = useMemo(() => filterHours(day.hour), [day.hour]);
  
  // Calculate global min/max temperatures from filtered hours of the current day
  const { globalMin, globalMax } = useMemo(() => {
    if (filteredHours.length === 0) return { globalMin: 0, globalMax: 0 };
    
    const temps = filteredHours.map(hour => hour.temp_c);
    const globalMin = Math.min(...temps);
    const globalMax = Math.max(...temps);
    
    return { globalMin, globalMax };
  }, [filteredHours]);

  // Set ref callback for each day
  const setDayRef = useCallback((date: string, element: HTMLDivElement | null) => {
    if (element) {
      dayRefs.current.set(date, element);
    } else {
      dayRefs.current.delete(date);
    }
  }, []);

  // Intersection Observer to detect which day is most visible during scroll
  useEffect(() => {
    if (!scrollContainerRef.current || dayRefs.current.size === 0) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Ignore during programmatic scroll
      if (isProgrammaticScroll.current) return;

      // Clear previous debounce timeout
      if (intersectionDebounceRef.current) {
        clearTimeout(intersectionDebounceRef.current);
      }

      // Debounce the day switching to avoid flickering
      // But check current scroll position when executing, not stale entries
      intersectionDebounceRef.current = setTimeout(() => {
        // Check current scroll position and find most visible day at this moment
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        let mostVisibleDate: string | null = null;
        let maxVisibility = 0;
        const containerRect = scrollContainer.getBoundingClientRect();
        // Use left edge + small offset (20% of width) instead of center for faster switching
        const referencePoint = containerRect.left + containerRect.width * 0.2;

        // Find the day element closest to the reference point (left edge + offset)
        dayRefs.current.forEach((element, date) => {
          const elementRect = element.getBoundingClientRect();
          
          // Check if element is visible in viewport
          if (elementRect.right > containerRect.left && elementRect.left < containerRect.right) {
            // Calculate distance from reference point (closer to left = better)
            const distanceFromRef = Math.abs(elementRect.left - referencePoint);
            // Higher visibility for elements closer to reference point
            const visibility = 1 / (1 + distanceFromRef / containerRect.width);

            if (visibility > maxVisibility) {
              maxVisibility = visibility;
              mostVisibleDate = date;
            }
          }
        });

        // Update selected day if we found a more visible one
        if (mostVisibleDate && mostVisibleDate !== selectedDay?.date && mostVisibleDate !== lastSelectedDayRef.current) {
          // Mark that this change is from Intersection Observer
          isIntersectionTriggered.current = true;
          lastSelectedDayRef.current = mostVisibleDate;
          
          const foundDay = allDays.find((d) => d.date === mostVisibleDate);
          if (foundDay) {
            onDayClick(foundDay);
          }
        }
      }, 50); // 50ms debounce delay - faster response
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: scrollContainerRef.current,
      rootMargin: '0px', // Use full viewport for more accurate detection
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    });

    // Observe all day elements
    dayRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      // Clear debounce timeout on cleanup
      if (intersectionDebounceRef.current) {
        clearTimeout(intersectionDebounceRef.current);
      }
    };
  }, [allDays, selectedDay, onDayClick]);

  // Handle manual scroll
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Reset programmatic scroll flag after scroll ends
    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 150);
  }, []);

  // Auto-scroll to selected day when it changes (only for manual clicks, not Intersection Observer)
  useEffect(() => {
    // Skip if this was triggered by Intersection Observer - don't scroll at all, keep current position
    if (isIntersectionTriggered.current) {
      // Reset flag after re-render completes
      const timeoutId = setTimeout(() => {
        isIntersectionTriggered.current = false;
      }, 0);
      return () => clearTimeout(timeoutId);
    }
    
    // Update last selected day ref for manual clicks
    if (selectedDay) {
      lastSelectedDayRef.current = selectedDay.date;
    }
    
    if (!selectedDay || !scrollContainerRef.current) return;

    const dayElement = dayRefs.current.get(selectedDay.date);
    const scrollContainer = scrollContainerRef.current;
    
    if (dayElement && scrollContainer) {
      // Set flag to prevent intersection observer from triggering
      isProgrammaticScroll.current = true;
      
      // Calculate position relative to scroll container
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = dayElement.getBoundingClientRect();
      const scrollLeft = scrollContainer.scrollLeft + (elementRect.left - containerRect.left);
      
      // Scroll only horizontally, avoiding vertical page scroll
      scrollContainer.scrollTo({
        left: scrollLeft,
        behavior: "auto",
      });

      // Reset flag after scroll completes
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 100);
    }
  }, [selectedDay]);

  return (
    <div className="weather-card bg-card/50 p-6 space-y-2 md:space-y-6">
       <h3 className="text-2xl font-bold mb-0">
            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
      <div className="flex flex-col lg:flex-row items-start md:items-center justify-between">
        
        <div className="flex-1 w-full">
         
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Image 
              className="size-14" 
              src={normalizeImageUrl(day.day.condition.icon, '128x128')} 
              alt={`${day.day.condition.text} weather icon`}
              width={44}
              height={44}
              loading="lazy"
            />
            <span>{day.day.condition.text}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Max {formatTemperature(day.day.maxtemp_c, unit)} / Min{" "}
            {formatTemperature(day.day.mintemp_c, unit)}
          </p>
        </div>
        <div className="testblock mt-1 flex-1 max-w-full lg:max-w-none">
          <MemoizedDailyForecast
            daily={allDays}
            unit={unit}
            onDayClick={onDayClick}
            selectedDay={selectedDay}
          />
        </div>
      </div>

      <div>
        <h4 className="hidden md:block font-semibold mb-2 md:mb-3">Hourly</h4>
        <div 
          ref={scrollContainerRef} 
          className="overflow-y-hidden overflow-x-auto styled-scroll"
          onScroll={handleScroll}
        >
          <div className="flex gap-3 lg:gap-4 min-w-max">
            {allDays.map((dayItem, dayIndex) => {
              const filteredHours = filterHours(dayItem.hour);
              const groupedHours = groupHoursByPeriod(filteredHours);
              
              return (
                <div 
                  key={dayItem.date} 
                  ref={(el) => setDayRef(dayItem.date, el)}
                  data-day-date={dayItem.date}
                  className="flex items-start gap-3 lg:gap-4"
                >
                  {/* Day separator */}
                  {dayIndex > 0 && (
                    <div className="flex flex-col items-center h-full justify-center flex-shrink-0 relative">
                      <div className="absolute rounded-full top-0 bottom-0 w-[2px] bg-border/50" />
                      <div className="relative bg-card/50 p-1 rounded-md border border-border/50">
                        <div className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                          {formatDayName(new Date(dayItem.date))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Day periods */}
                  <div className="flex justify-between gap-6">
                    {groupedHours.map((group) => (
                      <div key={`${dayItem.date}-${group.period}`} className="flex-1">
                        <h5 className="text-sm text-center font-semibold text-muted-foreground capitalize mb-2">
                          {group.period}
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                          {group.hours.map((hour) => (
                            <div key={hour.time} className="bg-muted/40 flex-1 rounded-lg p-3 text-center">
                              <div className="text-sm font-bold mb-1">
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
                              </div>
                              <div className="font-black text-xl mb-1">
                                {formatTemperature(hour.temp_c, unit).replace('°C', '°').replace('°F', '°')}°
                              </div>
                              <div className="text-sm font-medium text-muted-foreground space-y-0.5">
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
              );
            })}
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

          {usEpaIndexText(day.day.air_quality["us-epa-index"]) && (
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
          )}
        

          <div className="bg-muted/40 rounded-lg p-3 flex items-center gap-3">
            <Droplets className="h-5 w-5 text-purple-400" />
            <div>
              <div className="text-xs text-muted-foreground">Humidity</div>
              <div className="font-semibold">{day.day.avghumidity}%</div>
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
