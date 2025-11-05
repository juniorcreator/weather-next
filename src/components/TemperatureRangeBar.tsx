import React from "react";
import { getAppleStyleTempColor } from "@/utils/colorByTems";

interface TemperatureRangeBarProps {
  minTemp: number; // Actual minimum temperature (e.g., 5)
  maxTemp: number; // Actual maximum temperature (e.g., 25)
  className?: string;
}

// Absolute temperature range for the bar
const ABSOLUTE_MIN = -45;
const ABSOLUTE_MAX = 45;
const MIN_WIDTH_PCT = 2; // Minimum width of 2% for visibility when min === max

// Normalize temperature to percentage on absolute range (-45 to +45)
const toPct = (temp: number): number => {
  const range = ABSOLUTE_MAX - ABSOLUTE_MIN;
  if (range === 0) return 0;
  const normalized = ((temp - ABSOLUTE_MIN) / range) * 100;
  return Math.max(0, Math.min(100, normalized));
};

export const TemperatureRangeBar: React.FC<TemperatureRangeBarProps> = ({
  minTemp,
  maxTemp,
  className = "",
}) => {
  // Calculate position and width on absolute range
  const leftPct = Math.max(0, Math.min(100, toPct(minTemp)));
  const rightPct = Math.max(0, Math.min(100, toPct(maxTemp)));
  const calculatedWidthPct = rightPct - leftPct;
  
  // Use minimum width only if min equals max (zero range)
  // Otherwise use the calculated width, even if it's small
  const widthPct = minTemp === maxTemp 
    ? Math.max(MIN_WIDTH_PCT, calculatedWidthPct)
    : Math.max(0.5, calculatedWidthPct); // Minimum 0.5% for very small ranges, but not forcing 5%
  
  // Center the bar only if min equals max (zero range)
  const actualLeftPct = minTemp === maxTemp && calculatedWidthPct < MIN_WIDTH_PCT
    ? Math.max(0, Math.min(100 - MIN_WIDTH_PCT, leftPct - (MIN_WIDTH_PCT - calculatedWidthPct) / 2))
    : leftPct;

  return (
    <div
      className={`w-full h-2 bg-muted rounded-full overflow-hidden relative ${className}`}
    >
      {/* Gradient bar showing temperature range */}
      <div
        className="h-full rounded-full absolute"
        style={{
          left: `${actualLeftPct}%`,
          width: `${widthPct}%`,
          background: `linear-gradient(90deg, ${getAppleStyleTempColor(Math.floor(minTemp))}, ${getAppleStyleTempColor(Math.floor(maxTemp))})`,
        }}
      />
    </div>
  );
};

