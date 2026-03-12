"use client";

import { useEffect, useState } from "react";
import { Maximize2, Volume2 } from "lucide-react";

export default function LiveStream() {
  const [streamUrl, setStreamUrl] = useState<string>("https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80&w=1280&h=720");

  // In a real scenario, this URL would come from a configuration or state
  // const [streamUrl, setStreamUrl] = useState<string>("");

  return (
    <div className="relative w-full aspect-video bg-[#e5e7eb] rounded-[32px] overflow-hidden border-4 border-[#1f2937] shadow-xl">
      <img 
        src={streamUrl} 
        alt="ESP32-CAM Live Stream" 
        className="w-full h-full object-cover"
      />
      
      {/* Overlay controls */}
      <div className="absolute top-4 left-6 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-white text-xs font-bold tracking-wider">LIVE • ESP32-CAM</span>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center gap-3">
        <button className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 text-white hover:bg-black/60 transition-colors">
          <Maximize2 className="w-5 h-5" />
        </button>
        <button className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 text-white hover:bg-black/60 transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Stream Placeholder Text for Design Accuracy */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
         <h3 className="text-6xl font-bold tracking-widest text-[#1f2937]">LIVE</h3>
         <h4 className="text-4xl font-medium tracking-[0.2em] mt-2 text-[#1f2937]">STTREAM</h4>
      </div>
    </div>
  );
}
