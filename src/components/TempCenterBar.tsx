import React from "react";
import {getAppleStyleTempColor} from "@/utils/colorByTems";

type Props = {
  minTemp: number;
  maxTemp: number;
  temp: number;
  className?: string;
};

const ABSOLUTE_MIN = -45;
const ABSOLUTE_MAX = 45;
const ABSOLUTE_RANGE = ABSOLUTE_MAX - ABSOLUTE_MIN;

export const TempCenterBar: React.FC<Props> = ({ minTemp, maxTemp, temp, className = "" }) => {
  const normalizeToAbsolute = (temp: number): number => {
    const normalized = (temp - ABSOLUTE_MIN) / ABSOLUTE_RANGE;
    return Math.max(0, Math.min(100, normalized * 100));
  };

  const tempPosition = normalizeToAbsolute(temp);
  const centerPosition = normalizeToAbsolute(0);

  const isPositive = temp > 0;
  const isNegative = temp < 0;
  const isZero = temp === 0;

  return (
    <div className={`relative w-full h-[10px] bg-muted rounded overflow-hidden mt-1 ${className}`}>
      <div className="absolute top-0 bottom-0 w-px bg-gray-500" style={{ left: `${centerPosition}%`, transform: 'translateX(-50%)' }} />

      {isNegative && (
        <div
          className="absolute top-0 bottom-0 rounded-l"
          style={{
            backgroundColor: getAppleStyleTempColor(Math.floor(temp)),
            left: `${tempPosition}%`,
            width: `${centerPosition - tempPosition}%`,
          }}
        />
      )}

      {isPositive && (
        <div
          className="absolute top-0 bottom-0 rounded-r"
          style={{
            backgroundColor: getAppleStyleTempColor(Math.floor(temp)),
            left: `${centerPosition}%`,
            width: `${tempPosition - centerPosition}%`,
          }}
        />
      )}

      {isZero && (
        <div
          className="absolute top-0 bottom-0 rounded"
          style={{
            left: `${centerPosition}%`,
            transform: 'translateX(-50%)',
            width: 6,
            height: 10,
            marginTop: 0,
            background: "#08d6c7",
          }}
        />
      )}
    </div>
  );
};
