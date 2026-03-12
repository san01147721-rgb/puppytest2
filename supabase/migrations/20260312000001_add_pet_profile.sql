-- 1. pet_metrics 테이블 생성
CREATE TABLE IF NOT EXISTS pet_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  food_amount FLOAT DEFAULT 0,
  water_count INTEGER DEFAULT 0,
  activity_status TEXT DEFAULT '보통',
  profile_image_url TEXT
);

-- 초기 데이터 삽입 (하나의 레코드만 사용한다고 가정)
INSERT INTO pet_metrics (food_amount, water_count, activity_status)
SELECT 345, 12, '활발함'
WHERE NOT EXISTS (SELECT 1 FROM pet_metrics LIMIT 1);

-- RLS 설정
ALTER TABLE pet_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read pet metrics" 
ON pet_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to update pet metrics" 
ON pet_metrics FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow service_role to manage pet metrics" 
ON pet_metrics FOR ALL TO service_role USING (true);

-- 2. Storage Bucket 생성 (연속된 SQL 구문으로 실행하기 위해 supabase_admin 권한 필요할 수 있음)
-- Supabase 대시보드에서 직접 생성하는 것이 권장되지만, SQL로 시도 가능 (extensions 필요)
INSERT INTO storage.buckets (id, name, public)
VALUES ('puppy-profiles', 'puppy-profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 버킷 RLS 설정
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'puppy-profiles');
CREATE POLICY "Authenticated users can upload profiles" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'puppy-profiles');
CREATE POLICY "Authenticated users can update profiles" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'puppy-profiles');
CREATE POLICY "Authenticated users can delete profiles" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'puppy-profiles');
