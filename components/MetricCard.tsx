"use client";

import { Utensils, Droplets, Activity } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  type: "food" | "water" | "activity";
  progress?: number;
}

export default function MetricCard({ title, value, unit, subtitle, type, progress }: MetricCardProps) {
  const icons = {
    food: <Utensils className="w-5 h-5 text-orange-500" />,
    water: <Droplets className="w-5 h-5 text-blue-500" />,
    activity: <Activity className="w-5 h-5 text-amber-600" />,
  };

  return (
    <div className="metric-card flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          {icons[type]}
          <span className="text-sm font-semibold text-gray-500">{title}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{value}</span>
          {unit && <span className="text-lg text-gray-400 font-medium">{unit}</span>}
        </div>
      </div>
      
      <div className="mt-4">
        {type === "food" && progress !== undefined && (
          <div className="w-full h-2 bg-orange-50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-gray-400 mt-2 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
