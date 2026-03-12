"use client";

import { Cookie, Droplet, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function HardwareButtons() {
  const handleCommand = async (type: string) => {
    try {
      const { error } = await supabase
        .from("device_commands")
        .insert([{ type, executed: false, created_at: new Date().toISOString() }]);
      
      if (error) throw error;
      alert(`${type === 'feed' ? '간식 주기' : '물 채우기'} 명령이 전송되었습니다!`);
    } catch (error: any) {
      console.error("Error sending command:", error.message);
      alert("명령 전송에 실패했습니다.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <button 
        onClick={() => handleCommand("feed")}
        className="action-button bg-[#d97706] text-white hover:bg-[#b45309]"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Cookie className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="text-xl font-bold">간식 주기</div>
            <div className="text-sm text-white/70">킁킁이가 좋아하는 연어 간식</div>
          </div>
        </div>
        <ChevronRight className="w-6 h-6" />
      </button>

      <button 
        onClick={() => handleCommand("water")}
        className="action-button bg-[#7c2d12] text-white hover:bg-[#6c2810]"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Droplet className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="text-xl font-bold">물 채우기</div>
            <div className="text-sm text-white/70">신선한 물로 교체합니다</div>
          </div>
        </div>
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
