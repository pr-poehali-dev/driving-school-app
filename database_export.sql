-- АвтоПрофи - Экспорт базы данных для DBeaver
-- Дата экспорта: 2025-10-29
-- Схема: t_p22853855_driving_school_app

-- ============================================
-- Создание таблиц
-- ============================================

-- Таблица курсов
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    price INTEGER NOT NULL,
    image_url TEXT,
    features TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица инструкторов
CREATE TABLE IF NOT EXISTS instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    experience INTEGER,
    rating DECIMAL(3,2),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заявок на обучение
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    course_id INTEGER REFERENCES courses(id),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Данные таблицы courses
-- ============================================

INSERT INTO courses (id, title, category, description, duration, price, features, created_at) VALUES
(1, 'Категория B (легковой автомобиль)', 'B', 'Полный курс обучения вождению легкового автомобиля с нуля до получения прав', '3 месяца', 35000, ARRAY['130 часов теории', '56 часов практики', 'Современные автомобили', 'Помощь в ГИБДД'], '2025-10-24 22:04:12.588607'),
(2, 'Категория A (мотоцикл)', 'A', 'Обучение вождению мотоцикла для начинающих и опытных водителей', '2 месяца', 28000, ARRAY['Теория ПДД', '18 часов практики', 'Современные мотоциклы', 'Экипировка включена'], '2025-10-24 22:04:12.588607'),
(3, 'Категория C (грузовой автомобиль)', 'C', 'Профессиональная подготовка водителей грузовых автомобилей', '4 месяца', 45000, ARRAY['Расширенная теория', '72 часа практики', 'Грузовики разных типов', 'Допуск к экзамену'], '2025-10-24 22:04:12.588607');

-- Обновление sequence для courses
SELECT setval('courses_id_seq', (SELECT MAX(id) FROM courses));

-- ============================================
-- Данные таблицы instructors
-- ============================================

INSERT INTO instructors (id, name, specialization, experience, rating, bio, created_at) VALUES
(1, 'Иванов Сергей Петрович', 'Категории B, C', 15, 4.90, 'Мастер производственного обучения высшей категории. Более 1000 выпускников.', '2025-10-24 22:04:12.606734'),
(2, 'Петрова Анна Викторовна', 'Категория B', 8, 4.80, 'Терпеливый инструктор с индивидуальным подходом к каждому ученику.', '2025-10-24 22:04:12.606734'),
(3, 'Смирнов Дмитрий Александрович', 'Категории A, B', 12, 4.95, 'Специалист по обучению вождению мотоциклов и автомобилей.', '2025-10-24 22:04:12.606734');

-- Обновление sequence для instructors
SELECT setval('instructors_id_seq', (SELECT MAX(id) FROM instructors));

-- ============================================
-- Данные таблицы enrollments
-- ============================================

INSERT INTO enrollments (id, full_name, phone, email, course_id, message, status, created_at) VALUES
(1, 'Е К', '+71234567890', 'achshk@gmail.com', 2, 'хсфылж', 'new', '2025-10-24 23:26:54.355570'),
(2, 'Е.К.', '+70987654321', 'xochycpati@gmail.com', 3, '', 'new', '2025-10-25 01:31:45.522822'),
(3, 'Абдулла Сергеевич Думанов ', '+996777757577', 'durmanovish@gmail.com', 1, '', 'new', '2025-10-25 01:42:22.180630'),
(4, 'Кпе', '54578864', 'fokd7446@gmail.com', 1, 'Апа', 'new', '2025-10-25 07:02:24.931289'),
(5, 'Эдуард Весёлый', '89219347447', 'sosalk212@gmail.com', 1, '', 'new', '2025-10-25 07:43:56.584421'),
(6, 'Иван Мотохрустов', '89119119191', 'motohrust09@gmail.com', 2, '', 'new', '2025-10-25 07:45:04.157020');

-- Обновление sequence для enrollments
SELECT setval('enrollments_id_seq', (SELECT MAX(id) FROM enrollments));

-- ============================================
-- Конец экспорта
-- ============================================
