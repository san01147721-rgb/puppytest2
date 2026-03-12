"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Utensils, Droplets, Activity, Sun, Moon } from "lucide-react";

interface ActivityLog {
  id: string;
  type: "food" | "water" | "activity" | "snack" | "wake";
  time: string;
  description: string;
}

export default function ActivityTimeline() {
  const [logs, setLogs] = useState<ActivityLog[]>([
    { id: "1", type: "food", time: "12:30 PM", description: "킁킁이가 밥을 먹으러 왔어요 (15g 섭취)" },
    { id: "2", type: "water", time: "11:45 AM", description: "수분 섭취 감지됨" },
    { id: "3", type: "activity", time: "10:15 AM", description: "활동량이 증가했습니다 (우다다 타임)" },
    { id: "4", type: "snack", time: "09:00 AM", description: "예약된 오전 간식이 지급되었습니다" },
    { id: "5", type: "wake", time: "08:30 AM", description: "킁킁이가 잠에서 깨어났습니다" },
  ]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (data) {
        // Transform data if needed
        // setLogs(data.map(...));
      }
    };

    fetchLogs();

    const channel = supabase
      .channel("activity_logs_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "activity_logs" }, (payload) => {
        console.log("Realtime update:", payload);
        fetchLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "food": return <Utensils className="w-4 h-4" />;
      case "water": return <Droplets className="w-4 h-4" />;
      case "activity": return <Activity className="w-4 h-4" />;
      case "snack": return <Sun className="w-4 h-4" />;
      case "wake": return <Moon className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "food": return "bg-orange-500";
      case "water": return "bg-blue-500";
      case "activity": return "bg-green-500";
      case "snack": return "bg-amber-500";
      case "wake": return "bg-indigo-400";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="bg-white/50 rounded-[40px] p-8 h-full border border-orange-50 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold flex items-center gap-2">
           <Sun className="w-5 h-5 text-orange-500" /> 최근 활동 기록
        </h3>
        <button className="text-sm font-medium text-orange-400 hover:text-orange-500">전체보기</button>
      </div>

      <div className="flex-1 space-y-8 relative">
        <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-orange-100" />
        
        {logs.map((log) => (
          <div key={log.id} className="flex gap-6 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white z-10 ${getIconColor(log.type)}`}>
              {getIcon(log.type)}
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800 mb-1">{log.time}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{log.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8">
         <div className="bg-orange-50/50 rounded-2xl p-4 text-center border border-orange-100">
            <p className="text-sm text-orange-700 font-medium">킁킁이가 현재 거실에서 쉬고 있어요</p>
         </div>
      </div>
    </div>
  );
}
