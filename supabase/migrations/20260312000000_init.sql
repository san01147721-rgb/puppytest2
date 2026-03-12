-- 1. 센서 데이터 테이블 생성
CREATE TABLE IF NOT EXISTS sensor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  temperature FLOAT NOT NULL,
  humidity FLOAT NOT NULL,
  light_level FLOAT,
  motion_detected BOOLEAN DEFAULT false
);

-- 2. 활동 로그 테이블 생성
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  event_type TEXT NOT NULL, -- 'feed', 'camera_view', 'motion', etc.
  description TEXT,
  metadata JSONB
);

-- 3. 하드웨어 명령 테이블 생성
CREATE TABLE IF NOT EXISTS hardware_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  command_type TEXT NOT NULL, -- 'feed_now', 'camera_on', 'camera_off'
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'sent', 'executed', 'failed'
  executed_at TIMESTAMP WITH TIME ZONE
);

-- RLS (Row Level Security) 설정

-- sensor_data RLS
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read sensor data" 
ON sensor_data FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow service_role to manage sensor data" 
ON sensor_data FOR ALL TO service_role USING (true);

-- activity_logs RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read activity logs" 
ON activity_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert activity logs" 
ON activity_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow service_role to manage activity logs" 
ON activity_logs FOR ALL TO service_role USING (true);

-- hardware_commands RLS
ALTER TABLE hardware_commands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read hardware commands" 
ON hardware_commands FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert hardware commands" 
ON hardware_commands FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow service_role to manage hardware commands" 
ON hardware_commands FOR ALL TO service_role USING (true);
