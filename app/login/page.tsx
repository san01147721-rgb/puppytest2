"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf3]">
      <div className="glass-card p-10 w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#d97706]">
                    <path d="M12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.1716 8.5 10.5 9.17157 10.5 10C10.5 10.8284 11.1716 11.5 12 11.5Z" fill="currentColor"/>
                    <path d="M4.5 12C5.32843 12 6 11.3284 6 10.5C6 9.67157 5.32843 9 4.5 9C3.67157 9 3 9.67157 3 10.5C3 11.3284 3.67157 12 4.5 12Z" fill="currentColor"/>
                    <path d="M19.5 12C20.3284 12 21 11.3284 21 10.5C21 9.67157 20.3284 9 19.5 9C18.6716 9 18 9.67157 18 10.5C18 11.3284 18.6716 12 19.5 12Z" fill="currentColor"/>
                    <path d="M7.5 7.5C8.32843 7.5 9 6.82843 9 6C9 5.17157 8.32843 4.5 7.5 4.5C6.67157 4.5 6 5.17157 6 6C6 6.82843 6.67157 7.5 7.5 7.5Z" fill="currentColor"/>
                    <path d="M16.5 7.5C17.3284 7.5 18 6.82843 18 6C18 5.17157 17.3284 4.5 16.5 4.5C15.6716 4.5 15 5.17157 15 6C15 6.82843 15.6716 7.5 16.5 7.5Z" fill="currentColor"/>
                    <path d="M12 21C16.5 21 20 17.5 20 14C20 13.5 19.5 10.5 15 10.5C13.5 10.5 12 13.5 12 13.5C12 13.5 10.5 10.5 9 10.5C4.5 10.5 4 13.5 4 14C4 17.5 7.5 21 12 21Z" fill="currentColor"/>
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#4a3728]">반가워요! 집사님</h1>
            <p className="text-gray-500 mt-2">킁킁이의 하루를 체크해 볼까요?</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">이메일 주소</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/50"
              placeholder="example@email.com"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/50"
              placeholder="••••••••"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-[#d97706] text-white rounded-xl font-bold text-lg hover:bg-[#b45309] transition-all shadow-lg hover:shadow-orange-200"
          >
            로그인하기
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
           <p>계정이 없으신가요? 관리자에게 문의하세요.</p>
        </div>
      </div>
    </div>
  );
}
