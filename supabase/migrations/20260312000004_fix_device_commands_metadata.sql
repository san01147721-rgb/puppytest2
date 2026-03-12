-- 5. device_commands 테이블에 metadata 컬럼이 없을 경우 추가
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='device_commands' AND column_name='metadata') THEN
        ALTER TABLE device_commands ADD COLUMN metadata JSONB;
    END IF;
END $$;

-- PostgREST 스키마 캐시 갱신 (명시적으로 요청)
NOTIFY pgrst, 'reload schema';
