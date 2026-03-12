-- [데이터베이스 복구 및 최적화]
-- 모든 필수 컬럼이 있는지 확인하고 스키마 캐시를 강제로 갱신합니다.

-- 1. device_commands 테이블 점검
ALTER TABLE IF EXISTS device_commands ADD COLUMN IF NOT EXISTS metadata JSONB;
ALTER TABLE IF EXISTS device_commands ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- 2. schedules 테이블 점검 (완료 배지용)
ALTER TABLE IF EXISTS schedules ADD COLUMN IF NOT EXISTS last_executed_at TIMESTAMP WITH TIME ZONE;

-- 3. RLS 정책 재점검
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated users to update schedules" ON schedules;
CREATE POLICY "Allow authenticated users to update schedules" 
ON schedules FOR UPDATE TO authenticated USING (true);

-- 4. 스키마 캐시 갱신
NOTIFY pgrst, 'reload schema';
