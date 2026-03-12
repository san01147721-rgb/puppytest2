-- 샘플 센서 데이터 삽입
INSERT INTO sensor_data (temperature, humidity, light_level, motion_detected)
VALUES 
  (24.5, 45.0, 80.0, false),
  (25.1, 44.5, 82.0, true),
  (23.9, 46.2, 75.0, false);

-- 샘플 활동 로그 삽입
INSERT INTO activity_logs (event_type, description, metadata)
VALUES 
  ('feed', '간식을 지급했습니다.', '{"amount": "10g"}'::jsonb),
  ('camera_view', '카메라를 확인했습니다.', '{"user_id": "system"}'::jsonb),
  ('motion', '움직임이 감지되었습니다.', null);
