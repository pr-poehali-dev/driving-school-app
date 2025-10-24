-- Таблица курсов обучения
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    price INTEGER NOT NULL,
    features TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица инструкторов
CREATE TABLE IF NOT EXISTS instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    experience INTEGER NOT NULL,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
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

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_created_at ON enrollments(created_at DESC);
