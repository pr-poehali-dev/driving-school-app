
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

INSERT INTO courses (title, category, description, duration, price, features) VALUES
('Категория B (легковой автомобиль)', 'B', 'Полный курс обучения вождению легкового автомобиля с нуля до получения прав', '3 месяца', 35000, ARRAY['130 часов теории', '56 часов практики', 'Современные автомобили', 'Помощь в ГИБДД']),
('Категория A (мотоцикл)', 'A', 'Обучение вождению мотоцикла для начинающих и опытных водителей', '2 месяца', 28000, ARRAY['Теория ПДД', '18 часов практики', 'Современные мотоциклы', 'Экипировка включена']),
('Категория C (грузовой автомобиль)', 'C', 'Профессиональная подготовка водителей грузовых автомобилей', '4 месяца', 45000, ARRAY['Расширенная теория', '72 часа практики', 'Грузовики разных типов', 'Допуск к экзамену']);

INSERT INTO instructors (name, specialization, experience, rating, bio) VALUES
('Иванов Сергей Петрович', 'Категории B, C', 15, 4.9, 'Мастер производственного обучения высшей категории. Более 1000 выпускников.'),
('Петрова Анна Викторовна', 'Категория B', 8, 4.8, 'Терпеливый инструктор с индивидуальным подходом к каждому ученику.'),
('Смирнов Дмитрий Александрович', 'Категории A, B', 12, 4.95, 'Специалист по обучению вождению мотоциклов и автомобилей.');
