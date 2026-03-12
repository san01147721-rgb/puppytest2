"use client";

import { Cookie, Droplet, ChevronRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export default function HardwareButtons({ onCommandSuccess }: { onCommandSuccess?: () => void }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleCommand = async (actionType: string, successMessage: string) => {
    try {
      // 1. 하드웨어 명령 전송
      const { error: commandError } = await supabase
        .from("device_commands")
        .insert([{ 
          action_type: actionType, 
          status: 'pending'
        }]);
      
      if (commandError) throw commandError;

      // 2. 활동 로그 기록 추가
      const logData = {
        event_type: actionType === "feed_snack" ? "feed" : "water",
        description: actionType === "feed_snack" ? "간식을 지급했습니다" : "신선한 물로 교체했습니다"
      };

      const { error: logError } = await supabase
        .from("activity_logs")
        .insert([logData]);

      if (logError) {
        console.error("Error logging activity:", logError);
        // 로그 기록 실패는 치명적이지 않으므로 명령 성공 토스트는 띄움
      }
      
      setToastMessage(successMessage);
      setShowToast(true);
      if (onCommandSuccess) {
        onCommandSuccess();
      }
    } catch (error: any) {
      console.error("Error sending command:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      alert(`명령 전송에 실패했습니다: ${error.message || "알 수 없는 오류"}`);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white/90 backdrop-blur-md border border-amber-100 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-amber-900 font-bold">{toastMessage}</span>
          </div>
        </div>
      )}

      <button 
        onClick={() => handleCommand("feed_snack", "간식 지급 명령이 전송되었습니다 🐾")}
        className="action-button bg-[#d97706] text-white hover:bg-[#b45309] transition-all duration-300 active:scale-95 overflow-hidden group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Cookie className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="text-xl font-bold">간식 주기</div>
            <div className="text-sm text-white/70">킁킁이가 좋아하는 연어 간식</div>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>

      <button 
        onClick={() => handleCommand("fill_water", "물 채우기 명령이 전송되었습니다 💧")}
        className="action-button bg-[#7c2d12] text-white hover:bg-[#6c2810] transition-all duration-300 active:scale-95 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Droplet className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="text-xl font-bold">물 채우기</div>
            <div className="text-sm text-white/70">신선한 물로 교체합니다</div>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
