-- 3. 디바이스 명령 테이블 생성 (이미 존재할 경우 컬럼 유무 확인 후 추가)
CREATE TABLE IF NOT EXISTS device_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL, 
  status TEXT DEFAULT 'pending' NOT NULL,
  metadata JSONB
);

-- created_at 컬럼이 없을 경우 추가
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='device_commands' AND column_name='created_at') THEN
        ALTER TABLE device_commands ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;

-- RLS (Row Level Security) 설정
ALTER TABLE device_commands ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 후 재생성 (에러 방지)
DROP POLICY IF EXISTS "Allow authenticated users to read device commands" ON device_commands;
CREATE POLICY "Allow authenticated users to read device commands" 
ON device_commands FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert device commands" ON device_commands;
CREATE POLICY "Allow authenticated users to insert device commands" 
ON device_commands FOR INSERT TO authenticated WITH CHECK (true);

-- Realtime 활성화 (중복 방지를 위해 테이블을 Publication에서 제거 후 다시 추가하거나, IF NOT EXISTS 로직이 수동으로 필요함)
-- 여기서는 단순히 추가 시도 (이미 있을 경우 경고만 발생)
ALTER PUBLICATION supabase_realtime ADD TABLE device_commands;
EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Table device_commands might already be in publication';
