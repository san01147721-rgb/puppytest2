"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Schedule {
  id: string;
  action_type: 'feed_snack' | 'fill_water';
  scheduled_time: string;
  is_active: boolean;
}

interface ScheduleExecutorProps {
  schedules: Schedule[];
  onRefresh: () => void;
}

export default function ScheduleExecutor({ schedules, onRefresh }: ScheduleExecutorProps) {
  // Use a ref to keep track of the last executed minute to avoid double triggers
  const lastExecutedMinute = useRef<string | null>(null);

  useEffect(() => {
    const checkSchedules = async () => {
      const now = new Date();
      const currentHHmm = now.toTimeString().substring(0, 5); // "HH:mm"
      
      // If we already checked this minute, skip
      if (lastExecutedMinute.current === currentHHmm) return;
      
      console.log(`[ScheduleExecutor] Checking schedules for ${currentHHmm}...`);
      lastExecutedMinute.current = currentHHmm;

      const activeSchedules = schedules.filter(s => s.is_active);
      
      for (const schedule of activeSchedules) {
        // schedule.scheduled_time is "HH:mm:ss"
        const scheduleHHmm = schedule.scheduled_time.substring(0, 5);
        
        if (scheduleHHmm === currentHHmm) {
          console.log(`[ScheduleExecutor] Match found! Triggering ${schedule.action_type} for ${scheduleHHmm}`);
          
          try {
            // Anti-duplicate check: check if a similar command was sent in the last 55 seconds
            const oneMinuteAgo = new Date(Date.now() - 55000).toISOString();
            const { data: existing, error: checkError } = await supabase
              .from('device_commands')
              .select('id')
              .eq('action_type', schedule.action_type)
              .gte('created_at', oneMinuteAgo);

            if (checkError) {
              console.error("[ScheduleExecutor] Anti-duplicate check query failed:", checkError);
              // We proceed anyway to try the insert, or we could return. 
              // Let's proceed but log it.
            }

            if (existing && existing.length > 0) {
              console.log(`[ScheduleExecutor] ${schedule.action_type} already triggered recently. Skipping.`);
              continue;
            }

            // Trigger the command (Simplified to bypass schema cache issues)
            const { error: cmdError } = await supabase
              .from('device_commands')
              .insert([{ 
                action_type: schedule.action_type, 
                status: 'pending'
              }]);

            if (cmdError) throw cmdError;
            
            // Log activity
            const { error: logError } = await supabase
              .from("activity_logs")
              .insert([{
                event_type: schedule.action_type === "feed_snack" ? "feed" : "water",
                description: `[자동] ${schedule.action_type === "feed_snack" ? "간식을 지급했습니다" : "신선한 물로 교체했습니다"}`
              }]);

            if (logError) console.error("[ScheduleExecutor] Activity logging failed:", logError);

            // Record execution time (NEW for "Completed" UI)
            const { error: scheduleUpdateError } = await supabase
              .from('schedules')
              .update({ last_executed_at: new Date().toISOString() })
              .eq('id', schedule.id);

            if (scheduleUpdateError) {
              console.error("[ScheduleExecutor] Error updating schedule execution time:", scheduleUpdateError);
            } else {
              onRefresh(); // Trigger UI refresh immediately
            }

            console.log(`[ScheduleExecutor] Successfully triggered ${schedule.action_type}!`);
          } catch (error: any) {
            console.error(`[ScheduleExecutor] Error triggering ${schedule.action_type}:`, JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
            // Also log a simpler object for the console preview
            console.error("Error details:", {
              message: error.message,
              code: error.code,
              status: error.status,
              details: error.details
            });
          }
        }
      }
    };

    // Check immediately and then every 30 seconds to catch the minute change
    const interval = setInterval(checkSchedules, 30000);
    checkSchedules();

    return () => clearInterval(interval);
  }, [schedules]);

  return null; // This component doesn't render anything
}
