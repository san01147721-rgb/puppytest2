"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Camera } from "lucide-react";

export default function PetStatusHeader() {
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=200&h=200");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const fetchProfileImage = async () => {
    try {
      const { data, error } = await supabase
        .from("pet_metrics")
        .select("profile_image_url")
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile image (detailed):", error);
        return;
      }

      if (data?.profile_image_url) {
        setImageUrl(data.profile_image_url);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from("puppy-profiles")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("puppy-profiles")
        .getPublicUrl(filePath);

      // Try to update existing row, or insert new one if not exists
      const { data: existingData } = await supabase
        .from("pet_metrics")
        .select("id")
        .maybeSingle();

      let updateError;
      if (existingData?.id) {
        const { error } = await supabase
          .from("pet_metrics")
          .update({ profile_image_url: publicUrl })
          .eq("id", existingData.id);
        updateError = error;
      } else {
        const { error } = await supabase
          .from("pet_metrics")
          .insert({ profile_image_url: publicUrl });
        updateError = error;
      }

      if (updateError) {
        throw updateError;
      }

      setImageUrl(publicUrl);
      alert("프로필 사진이 성공적으로 변경되었습니다!");
    } catch (error: any) {
      console.error("Upload error detail:", error);
      alert("이미지 업로드 중 오류가 발생했습니다: " + (error.message || "알 수 없는 오류"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-card p-6 flex items-center gap-6 mb-8 relative">
      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <img 
          src={imageUrl} 
          alt="Keung-Keungi" 
          className={`w-full h-full object-cover transition-opacity ${uploading ? 'opacity-50' : 'opacity-100'}`}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="text-white w-8 h-8" />
        </div>
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
          </div>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />
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
