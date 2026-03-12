"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Utensils, Droplets, Activity, Sun, Moon, Camera, Bell } from "lucide-react";

interface ActivityLog {
  id: string;
  type: string;
  time: string;
  description: string;
}

export default function ActivityTimeline() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 시간 포맷팅 유틸리티: '오전 10:15' 형식
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // DB의 event_type을 UI용 type으로 매핑
  const mapEventType = (eventType: string) => {
    switch (eventType) {
      case "feed": return "food";
      case "water": return "water";
      case "motion": return "activity";
      case "camera_view": return "camera";
      case "snack": return "snack";
      default: return "activity";
    }
  };

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);
    
    if (error) {
      console.error("Error fetching logs:", error);
      return;
    }

    if (data) {
      const formattedLogs = data.map((log: any) => ({
        id: log.id,
        type: mapEventType(log.event_type),
        time: formatTime(log.created_at),
        description: log.description || "",
      }));
      setLogs(formattedLogs);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLogs();

    // Supabase 실시간 구독 설정
    const channel = supabase
      .channel("activity_logs_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_logs" },
        (payload) => {
          const newLog = payload.new as any;
          const formattedNewLog = {
            id: newLog.id,
            type: mapEventType(newLog.event_type),
            time: formatTime(newLog.created_at),
            description: newLog.description || "",
          };

          // 새 항목을 리스트 맨 위에 추가하고 최대 6개 유지
          setLogs((prev) => [formattedNewLog, ...prev].slice(0, 6));
        }
      )
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
      case "camera": return <Camera className="w-4 h-4" />;
      case "wake": return <Moon className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "food": return "bg-orange-500";
      case "water": return "bg-blue-500";
      case "activity": return "bg-green-500";
      case "snack": return "bg-amber-500";
      case "camera": return "bg-purple-500";
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

      <div className="flex-1 space-y-8 relative overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            데이터를 불러오는 중...
          </div>
        ) : logs.length > 0 ? (
          <>
            <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-orange-100" />
            {logs.map((log) => (
              <div key={log.id} className="flex gap-6 relative animate-in fade-in slide-in-from-top-4 duration-500">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white z-10 ${getIconColor(log.type)}`}>
                  {getIcon(log.type)}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800 mb-1">{log.time}</div>
                  <div className="text-sm text-gray-500 leading-relaxed">{log.description}</div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            아직 최근 활동이 없습니다
          </div>
        )}
      </div>

      <div className="mt-auto pt-8">
         <div className="bg-orange-50/50 rounded-2xl p-4 text-center border border-orange-100">
            <p className="text-sm text-orange-700 font-medium">킁킁이가 현재 거실에서 쉬고 있어요</p>
         </div>
      </div>
    </div>
  );
}
