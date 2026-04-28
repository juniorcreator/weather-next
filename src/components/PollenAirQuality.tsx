import { Leaf, Wind } from 'lucide-react';
import {AirQuality, Pollen} from "@/types/weather";
import {usEpaIndexText} from "@/utils/airQuality";

interface PollenAirQualityProps {
  pollen: Pollen;
  airQuality: AirQuality;
}

export function PollenAirQuality({ pollen, airQuality }: PollenAirQualityProps) {
  const getPollenLevel = (value: number) => {
    if (value >= 1 && value < 20) return { text: 'Low', color: 'text-green-400' };
    if (value >= 20 && value < 100) return { text: 'Moderate', color: 'text-yellow-400' };
    if (value >= 100 && value < 300) return { text: 'High', color: 'text-orange-400' };
    if (value >= 300) return { text: 'Very High', color: 'text-red-500' };
    return { text: 'Low', color: 'text-green-400' };
  };

  const getPollenRecommendation = (pollen: Pollen): string => {
    const treeValue = pollen.Alder + pollen.Birch + pollen.Hazel + pollen.Oak;
    const weedValue = pollen.Mugwort + pollen.Ragweed;
    const grassValue = pollen.Grass;
    
    const maxValue = Math.max(treeValue, grassValue, weedValue);
    
    if (maxValue >= 1 && maxValue < 20) {
      return "Safe to go outside. Mild symptoms possible in sensitive individuals.";
    }
    if (maxValue >= 20 && maxValue < 100) {
      return "Caution advised. Noticeable symptoms for many allergic individuals.";
    }
    if (maxValue >= 100 && maxValue < 300) {
      return "Avoid outdoor activities if possible. Strong symptoms expected; most allergic individuals affected.";
    }
    if (maxValue >= 300) {
      return "Stay indoors if possible. Severe symptoms; avoidance measures strongly recommended.";
    }
    
    return "Safe to go outside. Minimal pollen levels.";
  };

  const getAirQualityRecommendation = (airQuality: AirQuality): string => {
    const epaIndex = airQuality["us-epa-index"];
    
    switch (epaIndex) {
      case 1:
        return "Air quality is excellent. Safe for everyone to be outdoors.";
      case 2:
        return "Air quality is acceptable. Most people can enjoy outdoor activities.";
      case 3:
        return "Sensitive individuals should limit outdoor activities. Consider staying indoors if you have respiratory issues.";
      case 4:
        return "Everyone should reduce outdoor activities. Sensitive groups should avoid outdoor exposure.";
      case 5:
        return "Avoid outdoor activities. Stay indoors with air filtration if possible. Health warnings in effect.";
      case 6:
        return "Emergency conditions. Stay indoors. Close windows and use air purifiers. Health alert for everyone.";
      default:
        return "Air quality data unavailable. Please check back later.";
    }
  };

  const recommendation = getPollenRecommendation(pollen);
  const airQualityRecommendation = getAirQualityRecommendation(airQuality);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="weather-card flex flex-col justify-between bg-card/50 p-6">
      <div>
      <div className="flex items-center gap-2 mb-4">
          <Leaf className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Pollen Levels</h3>
        </div>

        <div className="space-y-3 mb-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tree</div>
            <div className="space-y-1.5 pl-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Alder</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((pollen.Alder / 300) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">{Math.round(pollen.Alder)}</span>
                  <span className={`text-sm font-semibold ${getPollenLevel(pollen.Alder).color}`}>
                    {getPollenLevel(pollen.Alder).text}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Birch</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((pollen.Birch / 300) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">{Math.round(pollen.Birch)}</span>
                  <span className={`text-sm font-semibold ${getPollenLevel(pollen.Birch).color}`}>
                    {getPollenLevel(pollen.Birch).text}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Hazel</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((pollen.Hazel / 300) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">{Math.round(pollen.Hazel)}</span>
                  <span className={`text-sm font-semibold ${getPollenLevel(pollen.Hazel).color}`}>
                    {getPollenLevel(pollen.Hazel).text}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Oak</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((pollen.Oak / 300) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">{Math.round(pollen.Oak)}</span>
                  <span className={`text-sm font-semibold ${getPollenLevel(pollen.Oak).color}`}>
                    {getPollenLevel(pollen.Oak).text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Grass</div>
            <div className="space-y-1.5 pl-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Grass</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((pollen.Grass / 300) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">{Math.round(pollen.Grass)}</span>
                  <span className={`text-sm font-semibold ${getPollenLevel(pollen.Grass).color}`}>
                    {getPollenLevel(pollen.Grass).text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Weed</div>
            <div className="space-y-1.5 pl-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Mugwort</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((pollen.Mugwort / 300) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">{Math.round(pollen.Mugwort)}</span>
                  <span className={`text-sm font-semibold ${getPollenLevel(pollen.Mugwort).color}`}>
                    {getPollenLevel(pollen.Mugwort).text}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ragweed</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((pollen.Ragweed / 300) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">{Math.round(pollen.Ragweed)}</span>
                  <span className={`text-sm font-semibold ${getPollenLevel(pollen.Ragweed).color}`}>
                    {getPollenLevel(pollen.Ragweed).text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        

        <div className="text-sm font-semibold text-muted-foreground bg-muted/30 rounded-lg p-3">
          {recommendation}
        </div>
      </div>

      <div className="weather-card flex flex-col justify-between bg-card/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wind className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Air Quality</h3>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-bold">{airQuality["us-epa-index"]}</div>
          <div>
            <div className="font-semibold">{usEpaIndexText(airQuality["us-epa-index"])}</div>
            <div className="text-xs text-muted-foreground">US-EPA AQI</div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Particulate Matter</div>
            <div className="space-y-1.5 pl-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">PM2.5</span>
                <span className="font-semibold">{airQuality.pm2_5.toFixed(1)} μg/m³</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">PM10</span>
                <span className="font-semibold">{airQuality.pm10.toFixed(1)} μg/m³</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Gases</div>
            <div className="space-y-1.5 pl-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CO</span>
                <span className="font-semibold">{airQuality.co.toFixed(1)} μg/m³</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">NO₂</span>
                <span className="font-semibold">{airQuality.no2.toFixed(1)} μg/m³</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">O₃</span>
                <span className="font-semibold">{airQuality.o3.toFixed(1)} μg/m³</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SO₂</span>
                <span className="font-semibold">{airQuality.so2.toFixed(1)} μg/m³</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Indices</div>
            <div className="space-y-1.5 pl-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">US-EPA Index</span>
                <span className="font-semibold">{airQuality["us-epa-index"]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GB-DEFRA Index</span>
                <span className="font-semibold">{airQuality["gb-defra-index"]}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm font-semibold text-muted-foreground bg-muted/30 rounded-lg p-3">
          {airQualityRecommendation}
        </div>
      </div>
    </div>
  );
}
