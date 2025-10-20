import { Leaf, Wind } from 'lucide-react';
import {AirQuality, Pollen} from "@/types/weather";
import {usEpaIndexText} from "@/utils/airQuality";
// import { PollenData, AirQuality } from '@/lib/weatherAdapter';

interface PollenAirQualityProps {
  pollen: Pollen;
  airQuality: AirQuality;
}

export function PollenAirQuality({ pollen, airQuality }: PollenAirQualityProps) {
  const getPollenLevel = (value: number) => {
    if (value <= 1 || value < 20) return { text: 'Low', color: 'text-green-400' };
    if (value >= 20 || value < 100) return { text: 'Moderate', color: 'text-yellow-400' };
    if (value >= 100 || value < 300) return { text: 'High', color: 'text-red-200' };
    return { text: 'Very High', color: 'text-red-500' };
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="weather-card bg-card/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Pollen Levels</h3>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tree</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(pollen?.Alder / 5) * 100}%` }}
                />
              </div>
              <span className={`text-sm font-semibold ${getPollenLevel(pollen.Alder).color}`}>
                {getPollenLevel(pollen.Alder).text}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Grass</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(pollen.Grass / 5) * 100}%` }}
                />
              </div>
              <span className={`text-sm font-semibold ${getPollenLevel(pollen.Grass).color}`}>
                {getPollenLevel(pollen.Grass).text}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Weed</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(pollen.Mugwort / 5) * 100}%` }}
                />
              </div>
              <span className={`text-sm font-semibold ${getPollenLevel(pollen.Mugwort).color}`}>
                {getPollenLevel(pollen.Mugwort).text}
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/30 rounded p-3">
          {/*{pollen.advisory}*/}
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, sequi.
        </div>
      </div>

      <div className="weather-card bg-card/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wind className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Air Quality</h3>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-bold">{airQuality["us-epa-index"]}</div>
          <div>
            <div className="font-semibold">{usEpaIndexText(airQuality["us-epa-index"])}</div>
            <div className="text-xs text-muted-foreground">AQI</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">PM2.5</span>
            <span className="font-semibold">{airQuality.pm2_5.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">PM10</span>
            <span className="font-semibold">{airQuality.pm10.toFixed(1)} μg/m³</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/30 rounded p-3">
          {/*{airQuality.healthAdvice}*/}
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, tempora?
        </div>
      </div>
    </div>
  );
}
