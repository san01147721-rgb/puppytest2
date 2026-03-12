"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (actionType: 'feed_snack' | 'fill_water', scheduledTime: string) => void;
}

export default function AddScheduleModal({
  isOpen,
  onClose,
  onAdd,
}: AddScheduleModalProps) {
  const [actionType, setActionType] = useState<'feed_snack' | 'fill_water'>('feed_snack');
  const [time, setTime] = useState("09:00");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(actionType, time);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div 
        className="bg-[#fdfaf3] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#f0e6d2] animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#f0e6d2] bg-white">
          <h2 className="text-xl font-bold text-[#4a3728]">⏰ 새 예약 추가</h2>
          <button 
            onClick={onClose}
            className="p-1 text-[#a08b7a] hover:bg-[#fdfaf3] rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Action Type Selection */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-[#a08b7a] block">어떤 작업을 예약할까요?</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`
                flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer
                ${actionType === 'feed_snack' 
                  ? 'bg-orange-50 border-orange-200' 
                  : 'bg-white border-[#f0e6d2] hover:border-orange-100'}
              `}>
                <input 
                  type="radio" 
                  name="action_type" 
                  value="feed_snack"
                  checked={actionType === 'feed_snack'}
                  onChange={() => setActionType('feed_snack')}
                  className="sr-only"
                />
                <span className="text-3xl">🦴</span>
                <span className={`text-sm font-bold ${actionType === 'feed_snack' ? 'text-orange-700' : 'text-[#4a3728]'}`}>
                  간식 주기
                </span>
              </label>

              <label className={`
                flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer
                ${actionType === 'fill_water' 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white border-[#f0e6d2] hover:border-blue-100'}
              `}>
                <input 
                  type="radio" 
                  name="action_type" 
                  value="fill_water"
                  checked={actionType === 'fill_water'}
                  onChange={() => setActionType('fill_water')}
                  className="sr-only"
                />
                <span className="text-3xl">💧</span>
                <span className={`text-sm font-bold ${actionType === 'fill_water' ? 'text-blue-700' : 'text-[#4a3728]'}`}>
                  물 채우기
                </span>
              </label>
            </div>
          </div>

          {/* Time Picker */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-[#a08b7a] block">시간을 선택해 주세요</label>
            <div className="flex justify-center">
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-4xl font-bold bg-white border-2 border-[#f0e6d2] rounded-2xl p-4 text-[#4a3728] focus:outline-none focus:border-orange-300 transition-colors"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-4 bg-[#e67e22] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#d35400] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
