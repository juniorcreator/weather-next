import { Sunrise, Sunset } from 'lucide-react';
import { formatTime } from '@/lib/temperatureUtils';

interface SunriseSunsetProps {
  sunrise: string;
  sunset: string;
}

export function SunriseSunset({ sunrise, sunset }: SunriseSunsetProps) {
  return (
    <div className="metric-card px-3 py-3 bg-card/50 flex items-center justify-around">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <Sunrise className="h-5 w-5 text-orange-400" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase text-muted-foreground">Sunrise</div>
          <div className="font-bold">{sunrise}</div>
        </div>
      </div>

      <div className="w-px h-12 bg-border" />

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/10">
          <Sunset className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <div className="text-xs uppercase font-bold text-muted-foreground">Sunset</div>
          <div className="font-bold">{sunset}</div>
        </div>
      </div>
    </div>
  );
}
