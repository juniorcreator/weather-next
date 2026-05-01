export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemperature(temp: number, unit: "C" | "F"): string {
  return unit === "C" ? `${Math.round(temp)}°C` : `${Math.round(celsiusToFahrenheit(temp))}°F`;
}

export function getTemperatureGradient(tempCelsius: number): string {
  if (tempCelsius < 0) {
    return "bg-gradient-to-br from-temp-cold-start/85 to-temp-cold-end/85";
  } else if (tempCelsius < 10) {
    return "bg-gradient-to-br from-temp-cool-start/75 to-temp-cool-end/75";
  } else if (tempCelsius < 20) {
    return "bg-gradient-to-br from-temp-mild-start/75 to-temp-mild-end/75";
  } else if (tempCelsius < 30) {
    return "bg-gradient-to-br from-temp-warm-start/75 to-temp-warm-end/75";
  } else {
    return "bg-gradient-to-br from-temp-hot-start/75 to-temp-hot-end/75";
  }
}

export function getWeatherIconCode(code: number): string {
  if (code >= 200 && code < 300) return "⛈️";
  if (code >= 300 && code < 400) return "🌧️";
  if (code >= 500 && code < 600) return "🌧️";
  if (code >= 600 && code < 700) return "❄️";
  if (code >= 700 && code < 800) return "🌫️";
  if (code === 800) return "☀️";
  if (code === 801) return "🌤️";
  if (code === 802) return "⛅";
  if (code === 803) return "🌥️";
  if (code === 804) return "☁️";
  return "🌤️";
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function formatDayName(date: Date, isFirst?: boolean): string {
  if (isFirst) return "Today";

  return date.toLocaleDateString("en-US", { weekday: "short", day: "2-digit" });
}
