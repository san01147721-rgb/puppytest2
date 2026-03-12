"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface ScheduleCardProps {
  id: string;
  action_type: 'feed_snack' | 'fill_water';
  scheduled_time: string;
  is_active: boolean;
  last_executed_at?: string | null;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

export default function ScheduleCard({
  id,
  action_type,
  scheduled_time,
  is_active,
  last_executed_at,
  onToggle,
  onDelete,
}: ScheduleCardProps) {
  // Check if executed today
  const isExecutedToday = last_executed_at && 
    new Date(last_executed_at).toDateString() === new Date().toDateString();

  // TIME format (HH:mm:ss) to HH:mm
  const displayTime = scheduled_time.substring(0, 5);
  
  return (
    <div className={`relative flex flex-col items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-[#f0e6d2] min-w-[140px] transition-all ${is_active ? 'opacity-100' : 'opacity-60'}`}>
      {isExecutedToday && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center justify-center opacity-100 -rotate-12 text-[#e67e22] select-none">
            <span className="text-7xl mb-1 filter drop-shadow-sm">🐾</span>
            <span className="font-extrabold text-base whitespace-nowrap uppercase tracking-tighter text-center leading-tight bg-white/80 px-2 py-0.5 rounded-lg border-2 border-[#e67e22]">
              {action_type === 'feed_snack' ? '냠냠 완료 🦴' : '꿀꺽 완료 💧'}
            </span>
          </div>
        </div>
      )}
      
      <div className="w-full flex justify-end mb-1">
        <button 
          onClick={() => onDelete(id)}
          className="text-[#d1cbc0] hover:text-red-400 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="w-12 h-12 flex items-center justify-center bg-[#fdfaf3] rounded-full text-2xl">
          {action_type === 'feed_snack' ? '🦴' : '💧'}
        </div>
        <span className="text-2xl font-bold text-[#4a3728]">{displayTime}</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-[#a08b7a] font-medium">
          {action_type === 'feed_snack' ? '간식 주기' : '물 채우기'}
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={is_active}
            onChange={(e) => onToggle(id, e.target.checked)}
          />
          <div className="w-9 h-5 bg-[#e5e0d5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e67e22]"></div>
        </label>
      </div>
    </div>
  );
}
