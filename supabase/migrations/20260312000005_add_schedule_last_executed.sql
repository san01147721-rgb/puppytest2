-- 6. schedules 테이블에 last_executed_at 컬럼 추가
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schedules' AND column_name='last_executed_at') THEN
        ALTER TABLE schedules ADD COLUMN last_executed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;
