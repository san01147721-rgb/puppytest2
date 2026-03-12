"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import TopBar from "@/components/TopBar";
import PetStatusHeader from "@/components/PetStatusHeader";
import LiveStream from "@/components/LiveStream";
import MetricCard from "@/components/MetricCard";
import HardwareButtons from "@/components/HardwareButtons";
import ActivityTimeline from "@/components/ActivityTimeline";
import ScheduleManager from "@/components/ScheduleManager";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    food: 0,
    water: 0,
    activity: "데이터 분석 중...",
  });

  const fetchTodayStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();
      
      console.log("Fetching stats from 'device_commands' table...");

      const { data, error, status, statusText } = await supabase
        .from("device_commands")
        .select("action_type, created_at")
        .gte("created_at", todayISO);

      if (error) {
        console.error("Supabase Error Details:", {
          status,
          statusText,
          message: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details
        });
        
        // 만약 테이블이 없다면(404), 사용자에게 안내
        if (status === 404) {
          console.error("CRITICAL: 'device_commands' table not found. Did you run the migration?");
        }
        throw error;
      }

      console.log(`Successfully fetched ${data?.length || 0} records.`);

      if (data) {
        const foodCount = data.filter(d => d.action_type === 'feed_snack').length;
        const waterCount = data.filter(d => d.action_type === 'fill_water').length;

        setMetrics(prev => ({
          ...prev,
          food: foodCount * 15,
          water: waterCount,
        }));
      }
    } catch (error: any) {
      // 에러 객체가 빈 상태로 출력되는 것을 방지하기 위해 속성을 직접 출력
      console.error("Error fetching stats - Full Object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
        // 인증 성공 후 데이터 페칭
        fetchTodayStats();
      }
    };

    checkAuth();

    // Subscribe to realtime changes in device_commands
    const channel = supabase
      .channel("commands_realtime")
      .on("postgres_changes", { 
        event: "INSERT", 
        schema: "public", 
        table: "device_commands" 
      }, (payload) => {
        console.log("Realtime INSERT detected:", payload);
        fetchTodayStats();
      })
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fdfaf3]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf3] text-[#4a3728]">
      <TopBar />
      
      <main className="max-w-[1440px] mx-auto px-8 py-8 grid grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="col-span-8 flex flex-col gap-8">
          <PetStatusHeader />
          
          <LiveStream />
          
          <div className="grid grid-cols-3 gap-6">
            <MetricCard 
              type="food"
              title="오늘 먹은 사료량"
              value={metrics.food}
              unit="g"
              progress={Math.min((metrics.food / 200) * 100, 100)}
            />
            <MetricCard 
              type="water"
              title="물 마신 횟수"
              value={metrics.water}
              unit="회"
              subtitle={
                metrics.water === 0 
                  ? "아직 물을 마시지 않았어요 💧" 
                  : metrics.water <= 3 
                    ? "조금씩 수분을 보충하고 있어요 🐾" 
                    : "오늘 수분 충전 완벽해요! ✨"
              }
            />
            <MetricCard 
              type="activity"
              title="활동량 (AI 분석)"
              value={metrics.activity}
              subtitle="OpenCV 분석: 걷기 40분, 뛰기 15분"
            />
          </div>
          
          <HardwareButtons onCommandSuccess={fetchTodayStats} />
          
          <ScheduleManager />
        </div>
        
        {/* Sidebar / Timeline Area */}
        <div className="col-span-4 h-full">
          <ActivityTimeline />
        </div>
      </main>
    </div>
  );
}
