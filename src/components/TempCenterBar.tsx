import React from "react";
import {getAppleStyleTempColor} from "@/utils/colorByTems";

type Props = {
  minTemp: number; // глобальный минимум (например, 6)
  maxTemp: number; // глобальный максимум (например, 11)
  temp: number;    // текущая температура
  className?: string;
};

// Абсолютная шкала температур для бара
const ABSOLUTE_MIN = -45;
const ABSOLUTE_MAX = 45;
const ABSOLUTE_RANGE = ABSOLUTE_MAX - ABSOLUTE_MIN; // 90

export const TempCenterBar: React.FC<Props> = ({ minTemp, maxTemp, temp, className = "" }) => {
  // Нормализуем температуру на абсолютную шкалу от -45 до +45
  // Центр шкалы (0°) находится в 50% позиции
  const normalizeToAbsolute = (temp: number): number => {
    // Нормализуем к диапазону 0-1
    const normalized = (temp - ABSOLUTE_MIN) / ABSOLUTE_RANGE;
    // Преобразуем в процент от 0 до 100
    return Math.max(0, Math.min(100, normalized * 100));
  };

  // Позиция текущей температуры на шкале (0-100%)
  const tempPosition = normalizeToAbsolute(temp);
  // Позиция центра (0°) на шкале (50%)
  const centerPosition = normalizeToAbsolute(0);

  const isPositive = temp > 0;
  const isNegative = temp < 0;
  const isZero = temp === 0;

  return (
    <div className={`relative w-full h-[10px] bg-muted rounded overflow-hidden mt-1 ${className}`}>
      {/* Центр (вертикальная линия на позиции 0°) */}
      <div className="absolute top-0 bottom-0 w-px bg-gray-500" style={{ left: `${centerPosition}%`, transform: 'translateX(-50%)' }} />

      {/* Левый fill (для отрицательных температур) */}
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

      {/* Правый fill (для положительных температур) */}
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

      {/* Небольшой индикатор для 0° (видимый при 0) */}
      {isZero && (
        <div
          className="absolute top-0 bottom-0 rounded"
          style={{
            left: `${centerPosition}%`,
            transform: 'translateX(-50%)',
            width: 6,
            height: 10,
            marginTop: -4,
            background: "#08d6c7",
          }}
        />
      )}
    </div>
  );
};
