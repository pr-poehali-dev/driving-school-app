-- Создание индексов для оптимизации запросов

-- Индексы для таблицы courses
CREATE INDEX IF NOT EXISTS idx_courses_category ON t_p22853855_driving_school_app.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_price ON t_p22853855_driving_school_app.courses(price);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON t_p22853855_driving_school_app.courses(created_at DESC);

-- Индексы для таблицы enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON t_p22853855_driving_school_app.enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON t_p22853855_driving_school_app.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_created_at ON t_p22853855_driving_school_app.enrollments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enrollments_phone ON t_p22853855_driving_school_app.enrollments(phone);
CREATE INDEX IF NOT EXISTS idx_enrollments_email ON t_p22853855_driving_school_app.enrollments(email) WHERE email IS NOT NULL;

-- Композитный индекс для фильтрации заявок по статусу и дате
CREATE INDEX IF NOT EXISTS idx_enrollments_status_created ON t_p22853855_driving_school_app.enrollments(status, created_at DESC);

-- Индексы для таблицы instructors
CREATE INDEX IF NOT EXISTS idx_instructors_rating ON t_p22853855_driving_school_app.instructors(rating DESC);
CREATE INDEX IF NOT EXISTS idx_instructors_experience ON t_p22853855_driving_school_app.instructors(experience DESC);
CREATE INDEX IF NOT EXISTS idx_instructors_specialization ON t_p22853855_driving_school_app.instructors(specialization);
