-- ============================================
-- ИНДЕКСЫ ДЛЯ БАЗЫ ДАННЫХ АВТОШКОЛЫ
-- ============================================
-- Все индексы уже применены через миграцию V0003__add_indexes.sql
-- Этот файл содержит справочную информацию

-- ============================================
-- ТАБЛИЦА: courses
-- ============================================

-- Индекс для поиска по категории (A, B, C)
-- CREATE INDEX idx_courses_category ON t_p22853855_driving_school_app.courses(category);

-- Индекс для сортировки по цене
-- CREATE INDEX idx_courses_price ON t_p22853855_driving_school_app.courses(price);

-- Индекс для сортировки по дате создания
-- CREATE INDEX idx_courses_created_at ON t_p22853855_driving_school_app.courses(created_at DESC);


-- ============================================
-- ТАБЛИЦА: enrollments
-- ============================================

-- Индекс для фильтрации по статусу
-- CREATE INDEX idx_enrollments_status ON t_p22853855_driving_school_app.enrollments(status);

-- Индекс для JOIN с таблицей courses
-- CREATE INDEX idx_enrollments_course_id ON t_p22853855_driving_school_app.enrollments(course_id);

-- Индекс для сортировки по дате создания
-- CREATE INDEX idx_enrollments_created_at ON t_p22853855_driving_school_app.enrollments(created_at DESC);

-- Индекс для поиска по телефону
-- CREATE INDEX idx_enrollments_phone ON t_p22853855_driving_school_app.enrollments(phone);

-- Частичный индекс для поиска по email (только заполненные)
-- CREATE INDEX idx_enrollments_email ON t_p22853855_driving_school_app.enrollments(email) WHERE email IS NOT NULL;

-- Композитный индекс для фильтрации по статусу + дате
-- CREATE INDEX idx_enrollments_status_created ON t_p22853855_driving_school_app.enrollments(status, created_at DESC);


-- ============================================
-- ТАБЛИЦА: instructors
-- ============================================

-- Индекс для сортировки по рейтингу
-- CREATE INDEX idx_instructors_rating ON t_p22853855_driving_school_app.instructors(rating DESC NULLS LAST);

-- Индекс для сортировки по опыту
-- CREATE INDEX idx_instructors_experience ON t_p22853855_driving_school_app.instructors(experience DESC);

-- Индекс для поиска по специализации
-- CREATE INDEX idx_instructors_specialization ON t_p22853855_driving_school_app.instructors(specialization);


-- ============================================
-- ТРИГГЕРЫ (НЕ ПОДДЕРЖИВАЮТСЯ В SIMPLE QUERY POSTGRESQL)
-- ============================================
-- Следующие триггеры НЕ МОГУТ быть созданы из-за ограничений Simple Query Protocol
-- Функциональность реализована в backend-функциях

-- ============================================
-- ТРИГГЕР 1: Автоматическое обновление updated_at
-- ============================================
-- Назначение: Автоматически обновлять поле updated_at при изменении записи
-- Альтернатива: Обновлять вручную в backend-функции

/*
CREATE OR REPLACE FUNCTION t_p22853855_driving_school_app.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_enrollments_updated_at ON t_p22853855_driving_school_app.enrollments;
CREATE TRIGGER trigger_enrollments_updated_at
    BEFORE UPDATE ON t_p22853855_driving_school_app.enrollments
    FOR EACH ROW
    EXECUTE FUNCTION t_p22853855_driving_school_app.update_updated_at_column();
*/

-- Реализация в Python (backend/enrollments/index.py):
-- UPDATE enrollments SET status = 'contacted', updated_at = CURRENT_TIMESTAMP WHERE id = 1


-- ============================================
-- ТРИГГЕР 2: Нормализация имени
-- ============================================
-- Назначение: Приводить имя к формату "Иван Иванов" (Title Case)
-- Альтернатива: Валидация в backend-функции

/*
CREATE OR REPLACE FUNCTION t_p22853855_driving_school_app.normalize_full_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.full_name = INITCAP(TRIM(NEW.full_name));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_normalize_full_name ON t_p22853855_driving_school_app.enrollments;
CREATE TRIGGER trigger_normalize_full_name
    BEFORE INSERT OR UPDATE ON t_p22853855_driving_school_app.enrollments
    FOR EACH ROW
    EXECUTE FUNCTION t_p22853855_driving_school_app.normalize_full_name();
*/

-- Реализация в Python (backend/enrollments/index.py):
-- def normalize_name(name: str) -> str:
--     return name.strip().title()
-- full_name = normalize_name(body_data.get('full_name'))


-- ============================================
-- ТРИГГЕР 3: Валидация телефона
-- ============================================
-- Назначение: Проверять формат телефона перед сохранением
-- Альтернатива: Валидация в backend-функции

/*
CREATE OR REPLACE FUNCTION t_p22853855_driving_school_app.validate_phone()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.phone !~ '^\+?[78][\d\s\-\(\)]{9,}$' THEN
        RAISE EXCEPTION 'Некорректный формат телефона: %', NEW.phone;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_validate_phone ON t_p22853855_driving_school_app.enrollments;
CREATE TRIGGER trigger_validate_phone
    BEFORE INSERT OR UPDATE ON t_p22853855_driving_school_app.enrollments
    FOR EACH ROW
    EXECUTE FUNCTION t_p22853855_driving_school_app.validate_phone();
*/

-- Реализация в Python (backend/enrollments/index.py):
-- def validate_phone(phone: str) -> bool:
--     return bool(re.match(r'^\+?[78][\d\s\-\(\)]{9,}$', phone))
-- if not validate_phone(phone):
--     return {'statusCode': 400, 'body': json.dumps({'error': 'Некорректный формат телефона'})}


-- ============================================
-- ТРИГГЕР 4: Валидация email
-- ============================================
-- Назначение: Проверять формат email перед сохранением
-- Альтернатива: Валидация в backend-функции

/*
CREATE OR REPLACE FUNCTION t_p22853855_driving_school_app.validate_email()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email IS NOT NULL AND NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Некорректный формат email: %', NEW.email;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_validate_email ON t_p22853855_driving_school_app.enrollments;
CREATE TRIGGER trigger_validate_email
    BEFORE INSERT OR UPDATE ON t_p22853855_driving_school_app.enrollments
    FOR EACH ROW
    EXECUTE FUNCTION t_p22853855_driving_school_app.validate_email();
*/

-- Реализация в Python (backend/enrollments/index.py):
-- def validate_email(email: str) -> bool:
--     return bool(re.match(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$', email))
-- if email and not validate_email(email):
--     return {'statusCode': 400, 'body': json.dumps({'error': 'Некорректный формат email'})}


-- ============================================
-- ТРИГГЕР 5: Запрет удаления завершенных заявок
-- ============================================
-- Назначение: Предотвратить случайное удаление заявок со статусом 'completed'
-- Альтернатива: Проверка в backend-функции перед DELETE

/*
CREATE OR REPLACE FUNCTION t_p22853855_driving_school_app.prevent_completed_deletion()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'completed' THEN
        RAISE EXCEPTION 'Нельзя удалить завершенную заявку. Измените статус на cancelled';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_prevent_completed_deletion ON t_p22853855_driving_school_app.enrollments;
CREATE TRIGGER trigger_prevent_completed_deletion
    BEFORE DELETE ON t_p22853855_driving_school_app.enrollments
    FOR EACH ROW
    EXECUTE FUNCTION t_p22853855_driving_school_app.prevent_completed_deletion();
*/

-- Реализация: Не создавать DELETE endpoint или добавить проверку статуса


-- ============================================
-- ТРИГГЕР 6: Логирование изменений статуса
-- ============================================
-- Назначение: Сохранять историю изменений статуса заявки в отдельную таблицу
-- Альтернатива: Логировать в backend-функции + отдельная таблица audit_log

/*
CREATE TABLE IF NOT EXISTS t_p22853855_driving_school_app.enrollment_status_log (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES t_p22853855_driving_school_app.enrollments(id),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(100)
);

CREATE OR REPLACE FUNCTION t_p22853855_driving_school_app.log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO t_p22853855_driving_school_app.enrollment_status_log 
        (enrollment_id, old_status, new_status, changed_at)
        VALUES (NEW.id, OLD.status, NEW.status, CURRENT_TIMESTAMP);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_status_change ON t_p22853855_driving_school_app.enrollments;
CREATE TRIGGER trigger_log_status_change
    AFTER UPDATE ON t_p22853855_driving_school_app.enrollments
    FOR EACH ROW
    EXECUTE FUNCTION t_p22853855_driving_school_app.log_status_change();
*/

-- Реализация: Создать таблицу audit_log через миграцию + INSERT в backend-функции


-- ============================================
-- ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ ИНДЕКСОВ
-- ============================================

-- 1. Получить все новые заявки (использует idx_enrollments_status_created)
-- SELECT * FROM t_p22853855_driving_school_app.enrollments 
-- WHERE status = 'new' 
-- ORDER BY created_at DESC;

-- 2. Найти заявки по телефону (использует idx_enrollments_phone)
-- SELECT * FROM t_p22853855_driving_school_app.enrollments 
-- WHERE phone = '+79001234567';

-- 3. Статистика по курсам (использует idx_enrollments_course_id)
-- SELECT c.title, COUNT(e.id) as enrollments
-- FROM t_p22853855_driving_school_app.courses c
-- LEFT JOIN t_p22853855_driving_school_app.enrollments e ON c.id = e.course_id
-- GROUP BY c.id, c.title;

-- 4. Топ инструкторов (использует idx_instructors_rating)
-- SELECT name, rating FROM t_p22853855_driving_school_app.instructors
-- ORDER BY rating DESC NULLS LAST
-- LIMIT 5;


-- ============================================
-- РЕКОМЕНДАЦИИ
-- ============================================

-- 1. Мониторинг использования индексов:
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 't_p22853855_driving_school_app'
-- ORDER BY idx_scan DESC;

-- 2. Неиспользуемые индексы (если idx_scan = 0):
-- SELECT schemaname, tablename, indexname
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 't_p22853855_driving_school_app' AND idx_scan = 0;

-- 3. Размер индексов:
-- SELECT schemaname, tablename, indexname, 
--        pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 't_p22853855_driving_school_app'
-- ORDER BY pg_relation_size(indexrelid) DESC;
