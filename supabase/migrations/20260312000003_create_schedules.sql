-- 4. 예약 급식/급수 시간표 테이블 생성
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL, -- 'feed_snack', 'fill_water'
  scheduled_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) 설정
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 후 재생성 (에러 방지)
DROP POLICY IF EXISTS "Allow authenticated users to read schedules" ON schedules;
CREATE POLICY "Allow authenticated users to read schedules" 
ON schedules FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert schedules" ON schedules;
CREATE POLICY "Allow authenticated users to insert schedules" 
ON schedules FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to update schedules" ON schedules;
CREATE POLICY "Allow authenticated users to update schedules" 
ON schedules FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to delete schedules" ON schedules;
CREATE POLICY "Allow authenticated users to delete schedules" 
ON schedules FOR DELETE TO authenticated USING (true);

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE schedules;
-- 만약 이미 publication에 추가되어 있다면 에러를 무시하는 로직은 SQL Editor에서 직접 실행하는 것이 좋지만,
-- 여기서는 단순히 추가 시도 (이미 있을 경우 경고만 발생)

