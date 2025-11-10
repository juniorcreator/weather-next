// Temperature conversion and gradient utilities

import {Forecastday} from "@/types/weather";

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export function formatTemperature(temp: number, unit: 'C' | 'F'): string {
  return unit === 'C' ? `${Math.round(temp)}°C` : `${Math.round(celsiusToFahrenheit(temp))}°F`;
}

export function getTemperatureGradient(tempCelsius: number): string {
  if (tempCelsius < 0) {
    return 'bg-gradient-to-br from-temp-cold-start/85 to-temp-cold-end/85';
  } else if (tempCelsius < 10) {
    return 'bg-gradient-to-br from-temp-cool-start/75 to-temp-cool-end/75';
  } else if (tempCelsius < 20) {
    return 'bg-gradient-to-br from-temp-mild-start/75 to-temp-mild-end/75';
  } else if (tempCelsius < 30) {
    return 'bg-gradient-to-br from-temp-warm-start/75 to-temp-warm-end/75';
  } else {
    return 'bg-gradient-to-br from-temp-hot-start/75 to-temp-hot-end/75';
  }
}

export function getWeatherIconCode(code: number): string {
  // OpenWeatherMap icon codes
  if (code >= 200 && code < 300) return '⛈️'; // Thunderstorm
  if (code >= 300 && code < 400) return '🌧️'; // Drizzle
  if (code >= 500 && code < 600) return '🌧️'; // Rain
  if (code >= 600 && code < 700) return '❄️'; // Snow
  if (code >= 700 && code < 800) return '🌫️'; // Atmosphere
  if (code === 800) return '☀️'; // Clear
  if (code === 801) return '🌤️'; // Few clouds
  if (code === 802) return '⛅'; // Scattered clouds
  if (code === 803) return '🌥️'; // Broken clouds
  if (code === 804) return '☁️'; // Overcast
  return '🌤️';
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatDayName(date: Date): string {
  const today = new Date();
  // const tomorrow = new Date(today);
  // tomorrow.setDate(tomorrow.getDate() + 1);
  console.log(today.toDateString(), 'today.toDateString()');
  console.log(date.toDateString(), 'date.toDateString()');
  if (date.toDateString() === today.toDateString()) return 'Today';
  // if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit' });
}
