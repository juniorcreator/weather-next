import React from "react";

interface ToggleCFProps {
  onToggleUnit: () => void;
  unit: 'C' | 'F';
}

const ToggleCF = ({onToggleUnit, unit} : ToggleCFProps) => {
  return (
    <div className="flex items-center gap-1">
      <span>°C</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input checked={unit === 'F'} onChange={onToggleUnit} type="checkbox" className="sr-only peer" />
        <div className="w-12 h-6 bg-border/50 rounded-full peer-checked:bg-ring/50 transition"></div>
        <div className="absolute left-1 top-1 w-4 h-4 bg-white/95 rounded-full transition-transform peer-checked:translate-x-6"></div>
      </label>
      <span>°F</span>
    </div>
  );
};

export default ToggleCF;
