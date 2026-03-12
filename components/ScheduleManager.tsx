"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ScheduleCard from "./ScheduleCard";
import AddScheduleModal from "./AddScheduleModal";
import ScheduleExecutor from "./ScheduleExecutor";

interface Schedule {
  id: string;
  action_type: 'feed_snack' | 'fill_water';
  scheduled_time: string;
  is_active: boolean;
  last_executed_at: string | null;
}

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .order("scheduled_time", { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      console.error("Error fetching schedules:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        ...error
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("schedules_realtime")
      .on("postgres_changes", { 
        event: "*", 
        schema: "public", 
        table: "schedules" 
      }, () => {
        fetchSchedules();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddSchedule = async (actionType: 'feed_snack' | 'fill_water', scheduledTime: string) => {
    try {
      // time: "HH:mm" -> "HH:mm:ss"
      const timeWithSeconds = `${scheduledTime}:00`;
      
      const { error } = await supabase
        .from("schedules")
        .insert([{ 
          action_type: actionType, 
          scheduled_time: timeWithSeconds,
          is_active: true
        }]);

      if (error) throw error;
      await fetchSchedules(); // Manual refresh fallback
    } catch (error: any) {
      console.error("Error adding schedule:", error);
      alert(`예약 추가에 실패했습니다: ${error.message || JSON.stringify(error)}`);
    }
  };

  const handleToggleSchedule = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from("schedules")
        .update({ is_active: active })
        .eq("id", id);

      if (error) throw error;
      await fetchSchedules(); // Manual refresh fallback
    } catch (error) {
      console.error("Error toggling schedule:", error);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm("이 예약을 삭제하시겠습니까?")) return;
    
    try {
      const { error } = await supabase
        .from("schedules")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchSchedules(); // Manual refresh fallback
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  return (
    <section className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#4a3728] flex items-center gap-2">
          ⏰ 예약 급식 / 급수 시간표
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white text-[#e67e22] border-2 border-[#e67e22] rounded-2xl font-bold hover:bg-orange-50 transition-colors shadow-sm"
        >
          <Plus size={20} />
          새 예약 추가
        </button>
      </div>

      <div className="bg-[#f0e6d2]/30 p-8 rounded-[2.5rem] border-2 border-[#f0e6d2]/50">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
          </div>
        ) : schedules.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {schedules.map((schedule) => (
              <ScheduleCard 
                key={schedule.id}
                {...schedule}
                onToggle={handleToggleSchedule}
                onDelete={handleDeleteSchedule}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">🐾</span>
            <p className="text-lg text-[#a08b7a] font-medium">
              아직 설정된 예약이 없어요 푹 쉬세요
            </p>
          </div>
        )}
      </div>

      <AddScheduleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSchedule}
      />

      <ScheduleExecutor schedules={schedules} onRefresh={fetchSchedules} />
    </section>
  );
}
