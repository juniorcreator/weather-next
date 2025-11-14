import { formatDayName, formatTemperature } from '@/lib/temperatureUtils';
import { Forecastday } from "@/types/weather";
import { useRef, useLayoutEffect, useEffect, useCallback } from "react";

interface DailyForecastProps {
  daily: Forecastday[];
  unit: 'C' | 'F';
  onDayClick: (day: Forecastday) => void;
  selectedDay?: Forecastday;
}

export function DailyForecast({ daily, unit, onDayClick, selectedDay }: DailyForecastProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const savedScroll = useRef(0);
  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const isManualClick = useRef(false);

  // Set ref callback for each day
  const setDayRef = useCallback((date: string, element: HTMLButtonElement | null) => {
    if (element) {
      dayRefs.current.set(date, element);
    } else {
      dayRefs.current.delete(date);
    }
  }, []);

  // Auto-scroll to selected day when it changes
  useEffect(() => {
    if (!selectedDay || !containerRef.current) return;

    // Skip auto-scroll if this was triggered by manual click
    if (isManualClick.current) {
      isManualClick.current = false;
      return;
    }

    const dayElement = dayRefs.current.get(selectedDay.date);
    const container = containerRef.current;

    if (dayElement && container) {
      // Check if element is visible in container
      const containerRect = container.getBoundingClientRect();
      const elementRect = dayElement.getBoundingClientRect();
      
      // Check if element is at least partially visible
      const isPartiallyVisible = 
        elementRect.right > containerRect.left && 
        elementRect.left < containerRect.right;
      
      // Check if element is fully visible
      const isFullyVisible = 
        elementRect.left >= containerRect.left && 
        elementRect.right <= containerRect.right;

      // Scroll only if element is not fully visible
      if (!isFullyVisible || !isPartiallyVisible) {
        dayElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedDay]);

  // Restore scroll position when selectedDay changes (only for manual clicks)
  useLayoutEffect(() => {
    if (containerRef.current && isManualClick.current) {
      containerRef.current.scrollLeft = savedScroll.current;
      isManualClick.current = false;
    }
  }, [selectedDay]);

  const handleClick = (day: Forecastday) => {
    // Mark as manual click
    isManualClick.current = true;
    
    // Save current scroll position before state update
    if (containerRef.current) {
      savedScroll.current = containerRef.current.scrollLeft;
    }
    onDayClick(day);
  };

  const formatTemp = (temp: number) => {
    return formatTemperature(temp, unit).replace('°C', '°').replace('°F', '°');
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div 
        ref={containerRef} 
        className="flex w-full md:w-auto max-w-full gap-1 md:gap-3 p-1 overflow-x-scroll overflow-y-hidden md:overflow-x-hidden"
      >
        {daily.map((day, index) => {
          const isSelected = selectedDay?.date === day.date;

          return (
            <button
              key={day.date}
              ref={(el) => setDayRef(day.date, el)}
              onClick={() => handleClick(day)}
              className={`min-w-20 bg-muted/30 rounded-lg p-2 lg:p-1 text-center transition-all hover:bg-muted/90 hover:scale-103 border border-border/30 cursor-pointer ${
                isSelected ? 'ring-1 ring-primary bg-muted/90 scale-105' : ''
              }`}
            >
              <div className="text-sm mb-2">
                {formatDayName(new Date(day.date), index === 0)}
              </div>

              <div className="space-y-1">
                <div className="font-black text-sm">
                  {formatTemp(day.day.maxtemp_c)}/{formatTemp(day.day.mintemp_c)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
