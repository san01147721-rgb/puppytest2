"use client";

export default function PetStatusHeader() {
  return (
    <div className="glass-card p-6 flex items-center gap-6 mb-8">
      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200">
        <img 
          src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=200&h=200" 
          alt="Keung-Keungi" 
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          오늘의 킁킁이 상태: 행복함 🐾
        </h2>
        <p className="text-gray-500 mt-1">
          실시간 AI 케어 시스템이 킁킁이를 지켜보고 있어요
        </p>
      </div>
    </div>
  );
}
