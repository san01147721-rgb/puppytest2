"use client";

import { Bell, Settings, User, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#fdfaf3]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#d97706]">
                <path d="M12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.1716 8.5 10.5 9.17157 10.5 10C10.5 10.8284 11.1716 11.5 12 11.5Z" fill="currentColor"/>
                <path d="M4.5 12C5.32843 12 6 11.3284 6 10.5C6 9.67157 5.32843 9 4.5 9C3.67157 9 3 9.67157 3 10.5C3 11.3284 3.67157 12 4.5 12Z" fill="currentColor"/>
                <path d="M19.5 12C20.3284 12 21 11.3284 21 10.5C21 9.67157 20.3284 9 19.5 9C18.6716 9 18 9.67157 18 10.5C18 11.3284 18.6716 12 19.5 12Z" fill="currentColor"/>
                <path d="M7.5 7.5C8.32843 7.5 9 6.82843 9 6C9 5.17157 8.32843 4.5 7.5 4.5C6.67157 4.5 6 5.17157 6 6C6 6.82843 6.67157 7.5 7.5 7.5Z" fill="currentColor"/>
                <path d="M16.5 7.5C17.3284 7.5 18 6.82843 18 6C18 5.17157 17.3284 4.5 16.5 4.5C15.6716 4.5 15 5.17157 15 6C15 6.82843 15.6716 7.5 16.5 7.5Z" fill="currentColor"/>
                <path d="M12 21C16.5 21 20 17.5 20 14C20 13.5 19.5 10.5 15 10.5C13.5 10.5 12 13.5 12 13.5C12 13.5 10.5 10.5 9 10.5C4.5 10.5 4 13.5 4 14C4 17.5 7.5 21 12 21Z" fill="currentColor"/>
            </svg>
        </div>
        <h1 className="text-xl font-bold text-[#d97706]">AI 스마트 펫 집사</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full bg-[#fae8d2] text-[#d97706] hover:bg-orange-100 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full bg-[#fae8d2] text-[#d97706] hover:bg-orange-100 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="group relative">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#fae8d2] border-2 border-[#fae8d2] overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
            </button>
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 z-50">
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition-colors">
                    <LogOut className="w-4 h-4" />
                    로그아웃
                </button>
            </div>
        </div>
      </div>
    </header>
  );
}
