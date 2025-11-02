-- Добавляем колонку updated_at в enrollments для отслеживания изменений
ALTER TABLE t_p22853855_driving_school_app.enrollments 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP