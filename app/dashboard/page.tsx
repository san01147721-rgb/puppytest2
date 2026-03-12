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

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    food: 345,
    water: 12,
    activity: "활발함",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Redirect to login if not authenticated
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    // Fetch initial metrics
    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from("pet_metrics")
        .select("*")
        .single();
      
      if (data) {
        setMetrics({
          food: data.food_amount,
          water: data.water_count,
          activity: data.activity_status,
        });
      }
    };

    fetchMetrics();

    // Subscribe to realtime changes in metrics
    const channel = supabase
      .channel("metrics_realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "pet_metrics" }, (payload) => {
        setMetrics({
          food: payload.new.food_amount,
          water: payload.new.water_count,
          activity: payload.new.activity_status,
        });
      })
      .subscribe();

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
              progress={70}
            />
            <MetricCard 
              type="water"
              title="물 마신 횟수"
              value={metrics.water}
              unit="회"
              subtitle="평소보다 2회 더 마셨어요"
            />
            <MetricCard 
              type="activity"
              title="활동량 (AI 분석)"
              value={metrics.activity}
              subtitle="OpenCV 분석: 걷기 40분, 뛰기 15분"
            />
          </div>
          
          <HardwareButtons />
        </div>
        
        {/* Sidebar / Timeline Area */}
        <div className="col-span-4 h-full">
          <ActivityTimeline />
        </div>
      </main>
    </div>
  );
}
