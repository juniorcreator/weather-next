type ColorRGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): ColorRGB {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(c: ColorRGB): string {
  const { r, g, b } = c;
  const toHex = (x: number) => {
    const h = Math.round(x).toString(16);
    return h.length === 1 ? "0" + h : h;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

// Линейная интерполяция
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Интерпортируем цвета
function interpColor(c1: ColorRGB, c2: ColorRGB, t: number): ColorRGB {
  return {
    r: lerp(c1.r, c2.r, t),
    g: lerp(c1.g, c2.g, t),
    b: lerp(c1.b, c2.b, t),
  };
}

/**
 * Возвращает цвет для температуры по заданной шкале
 */
export function getAppleStyleTempColor(temp: number): string {
  // узловые точки
  const stops: [number, string][] = [
    [-45, "#0033aa"],
    [-10, "#3366ff"],
    [0, "#00ccff"],
    [15, "#66ffcc"],
    [30, "#ffcc66"],
    [35, "#ff6600"],
    [45, "#cc0000"],
  ];

  // если temp ниже минимума или выше максимума — зажать
  if (temp <= stops[0][0]) {
    return stops[0][1];
  }
  if (temp >= stops[stops.length - 1][0]) {
    return stops[stops.length - 1][1];
  }

  // найти между какими двумя узловыми точками находится temp
  for (let i = 0; i < stops.length - 1; i++) {
    const [t1, hex1] = stops[i];
    const [t2, hex2] = stops[i + 1];
    if (temp >= t1 && temp <= t2) {
      const ratio = (temp - t1) / (t2 - t1);
      const c1 = hexToRgb(hex1);
      const c2 = hexToRgb(hex2);
      const ci = interpColor(c1, c2, ratio);
      return rgbToHex(ci);
    }
  }

  // запасной вариант
  return "#000000";
}
