import React from "react";
import {getAppleStyleTempColor} from "@/utils/colorByTems";

type Props = {
  minTemp: number; // наприклад -45
  maxTemp: number; // наприклад 45
  temp: number;    // поточна температура
  className?: string;
};

export const TempCenterBar: React.FC<Props> = ({ minTemp, maxTemp, temp, className = "" }) => {
  // безопасность: если max==min, возвращаем пустую шкалу
  const absMax = Math.max(Math.abs(minTemp), Math.abs(maxTemp));
  if (absMax === 0) {
    return (
      <div className={`w-full h-2 bg-gray-700 rounded ${className}`}>
        <div className="w-px h-full bg-gray-500 mx-auto" />
      </div>
    );
  }

  // percent от 0 до 50 (половина шкалы)
  const rawPercent = (Math.abs(temp) / absMax) * 50;
  const percent = Math.min(Math.max(rawPercent, 0), 50);

  const isPositive = temp > 0;
  const isNegative = temp < 0;
  const isZero = temp === 0;

  return (
    <div className={`relative w-full h-3 bg-gray-700 rounded overflow-hidden ${className}`}>
      {/* Центр (вертикальная линия) */}
      <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-gray-500" />

      {/* Левый fill (минус) */}
      {isNegative && (
        <div
          className="absolute top-0 bottom-0  rounded-l"
          // левый fill: начинается в (50 - percent)% и ширина = percent%
          style={{
            backgroundColor: getAppleStyleTempColor(Math.floor(temp)),
            left: `${50 - percent}%`,
            width: `${percent}%`,
          }}
        />
      )}

      {/* left fill (plus) */}
      {isPositive && (
        <div
          className="absolute top-0 bottom-0  rounded-r"
          // right fill: начинается в 50% и ширина = percent%
          style={{
            backgroundColor: getAppleStyleTempColor(Math.floor(temp)),
            left: `50%`,
            width: `${percent}%`,
          }}
        />
      )}

      {/* Небольшой индикатор для 0° (видимый при 0) */}
      {isZero && (
        <div
          className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 rounded"
          style={{
            width: 6,
            // слегка выше по высоте, чтобы было видно
            height: 10,
            marginTop: -4,
            background: "#08d6c7",
          }}
        />
      )}
    </div>
  );
};
