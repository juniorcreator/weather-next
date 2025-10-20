import { Wind, Droplets, Eye, Gauge, Sun, Compass } from 'lucide-react';
// import { CurrentWeather, AirQuality } from '@/lib/weatherAdapter';
import { formatTime } from '@/lib/temperatureUtils';
import {Current, AirQuality, RootWeather} from "@/types/weather";
import {usEpaIndexText} from "@/utils/airQuality";

interface MetricsGridProps {
  weather: Current;
  airQuality: AirQuality;
}

export function MetricsGrid({ weather, airQuality }: MetricsGridProps) {
  const metrics = [
    {
      icon: Gauge,
      label: 'AQI',
      value: airQuality["us-epa-index"],
      subtitle: usEpaIndexText(airQuality["us-epa-index"]),
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${Math.round(weather.humidity)}%`,
      subtitle: '',
    },
    {
      icon: Wind,
      label: 'Wind',
      value: `${Math.round(weather.wind_mph)} mph`,
      subtitle: '',
    },
    {
      icon: Sun,
      label: 'UV Index',
      value: weather.uv,
      subtitle: weather.uv < 3 ? 'Low' : weather.uv < 6 ? 'Moderate' : 'High',
    },
    {
      icon: Compass,
      label: 'Pressure',
      value: `${weather.precip_in.toFixed(2)} in`,
      subtitle: '',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${weather.vis_miles} mi`,
      subtitle: '',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {metrics.map((metric) => (
        <div key={metric.label} className="metric-card">
          <div className="flex items-start justify-between mb-2">
            <metric.icon className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{metric.label}</span>
          </div>
          <div className="text-2xl font-black">{metric.value}</div>
          {metric.subtitle && (
            <div className="text-xs font-semibold text-muted-foreground mt-1">{metric.subtitle}</div>
          )}
        </div>
      ))}
    </div>
  );
}
