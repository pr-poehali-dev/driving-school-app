# ПРОЕКТИРОВАНИЕ И РАЗРАБОТКА МОДЕЛЕЙ ДАННЫХ
## Автошкола "АвтоПрофи" - Полный анализ моделей данных

---

## 1. КОНЦЕПТУАЛЬНАЯ МОДЕЛЬ ДАННЫХ

### 1.1 Описание предметной области

**Предметная область:** Система управления автошколой

**Основные бизнес-процессы:**
- Управление курсами обучения
- Регистрация заявок на обучение
- Управление информацией об инструкторах

### 1.2 ER-диаграмма (Entity-Relationship)

```
┌─────────────────┐
│    COURSES      │
│   (Курсы)       │
│─────────────────│
│ • Название      │
│ • Категория     │
│ • Описание      │
│ • Длительность  │
│ • Цена          │
└────────┬────────┘
         │
         │ 1
         │
         │ N
         │
┌────────▼────────┐
│  ENROLLMENTS    │
│   (Заявки)      │
│─────────────────│
│ • ФИО           │
│ • Телефон       │
│ • Email         │
│ • Сообщение     │
│ • Статус        │
└─────────────────┘


┌─────────────────┐
│  INSTRUCTORS    │
│  (Инструкторы)  │
│─────────────────│
│ • Имя           │
│ • Специализация │
│ • Опыт          │
│ • Рейтинг       │
│ • Биография     │
└─────────────────┘
```

### 1.3 Описание сущностей

#### Сущность 1: COURSES (Курсы)
**Назначение:** Хранение информации о доступных курсах обучения вождению

**Атрибуты:**
- Название курса
- Категория (A, B, C, D и т.д.)
- Описание программы
- Длительность обучения
- Стоимость
- Изображение курса
- Особенности курса

#### Сущность 2: ENROLLMENTS (Заявки)
**Назначение:** Регистрация заявок студентов на обучение

**Атрибуты:**
- ФИО студента
- Контактный телефон
- Email (опционально)
- Выбранный курс
- Дополнительное сообщение
- Статус заявки (новая, обработана, отменена)

#### Сущность 3: INSTRUCTORS (Инструкторы)
**Назначение:** Информация о преподавательском составе

**Атрибуты:**
- Имя инструктора
- Специализация (категории обучения)
- Стаж работы (лет)
- Рейтинг (оценка студентов)
- Фотография
- Биография

### 1.4 Связи между сущностями

**Связь: ENROLLMENTS → COURSES**
- Тип: Многие к одному (N:1)
- Описание: Одна заявка относится к одному курсу, но на один курс может быть много заявок
- Кардинальность: (0,N) к (1,1)

---

## 2. ЛОГИЧЕСКАЯ МОДЕЛЬ ДАННЫХ

### 2.1 Таблица: courses

**Назначение:** Справочник курсов обучения

| Атрибут     | Тип данных      | Обязательность | Описание                    |
|-------------|-----------------|----------------|-----------------------------|
| id          | INTEGER         | NOT NULL, PK   | Уникальный идентификатор    |
| title       | VARCHAR(255)    | NOT NULL       | Название курса              |
| category    | VARCHAR(50)     | NOT NULL       | Категория ТС (A, B, C...)   |
| description | TEXT            | NULL           | Подробное описание курса    |
| duration    | VARCHAR(100)    | NULL           | Длительность (напр. "3 мес")|
| price       | INTEGER         | NOT NULL       | Стоимость в рублях          |
| image_url   | TEXT            | NULL           | URL изображения курса       |
| features    | TEXT[]          | NULL           | Массив особенностей курса   |
| created_at  | TIMESTAMP       | NULL           | Дата создания записи        |

**Ограничения:**
- PRIMARY KEY (id)
- CHECK (price >= 0)
- NOT NULL для критичных полей (title, category, price)

### 2.2 Таблица: enrollments

**Назначение:** Заявки студентов на обучение

| Атрибут    | Тип данных      | Обязательность | Описание                      |
|------------|-----------------|----------------|-------------------------------|
| id         | INTEGER         | NOT NULL, PK   | Уникальный идентификатор      |
| full_name  | VARCHAR(255)    | NOT NULL       | ФИО студента                  |
| phone      | VARCHAR(50)     | NOT NULL       | Телефон для связи             |
| email      | VARCHAR(255)    | NULL           | Email (опционально)           |
| course_id  | INTEGER         | NULL, FK       | Ссылка на курс                |
| message    | TEXT            | NULL           | Дополнительное сообщение      |
| status     | VARCHAR(50)     | NULL           | Статус заявки (new, processed)|
| created_at | TIMESTAMP       | NULL           | Дата создания заявки          |
| updated_at | TIMESTAMP       | NULL           | Дата последнего обновления    |

**Ограничения:**
- PRIMARY KEY (id)
- FOREIGN KEY (course_id) REFERENCES courses(id)
- DEFAULT 'new' для status
- DEFAULT CURRENT_TIMESTAMP для created_at, updated_at

### 2.3 Таблица: instructors

**Назначение:** Информация об инструкторах автошколы

| Атрибут        | Тип данных      | Обязательность | Описание                    |
|----------------|-----------------|----------------|-----------------------------|
| id             | INTEGER         | NOT NULL, PK   | Уникальный идентификатор    |
| name           | VARCHAR(255)    | NOT NULL       | Имя инструктора             |
| specialization | VARCHAR(255)    | NULL           | Специализация (категории)   |
| experience     | INTEGER         | NULL           | Опыт работы (лет)           |
| rating         | NUMERIC(3,2)    | NULL           | Рейтинг (например, 4.85)    |
| avatar_url     | TEXT            | NULL           | URL фотографии инструктора  |
| bio            | TEXT            | NULL           | Биография инструктора       |
| created_at     | TIMESTAMP       | NULL           | Дата создания записи        |

**Ограничения:**
- PRIMARY KEY (id)
- CHECK (rating >= 0 AND rating <= 5.00)
- CHECK (experience >= 0)

### 2.4 Нормализация данных

**Текущий уровень нормализации:** 3НФ (Третья нормальная форма)

**Обоснование:**

✅ **1НФ (Первая нормальная форма):**
- Все атрибуты атомарны
- Нет повторяющихся групп
- Каждая таблица имеет первичный ключ

✅ **2НФ (Вторая нормальная форма):**
- Выполнены условия 1НФ
- Все неключевые атрибуты полностью зависят от первичного ключа
- Нет частичных зависимостей

✅ **3НФ (Третья нормальная форма):**
- Выполнены условия 2НФ
- Нет транзитивных зависимостей неключевых атрибутов

**Примечание:** Таблица `instructors` в текущей версии не связана с другими таблицами. В будущем рекомендуется добавить связь "многие ко многим" между instructors и courses через промежуточную таблицу `instructor_courses`.

---

## 3. ФИЗИЧЕСКАЯ МОДЕЛЬ ДАННЫХ

### 3.1 SQL DDL (Data Definition Language)

```sql
-- Создание схемы
CREATE SCHEMA IF NOT EXISTS t_p22853855_driving_school_app;
SET search_path TO t_p22853855_driving_school_app;

-- Таблица курсов
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    price INTEGER NOT NULL CHECK (price >= 0),
    image_url TEXT,
    features TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заявок
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица инструкторов
CREATE TABLE instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    experience INTEGER CHECK (experience >= 0),
    rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5.00),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для оптимизации запросов
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_created_at ON enrollments(created_at DESC);
CREATE INDEX idx_courses_category ON courses(category);
```

### 3.2 Индексы и оптимизация

| Индекс                        | Таблица      | Столбцы       | Тип   | Назначение                           |
|-------------------------------|--------------|---------------|-------|--------------------------------------|
| courses_pkey                  | courses      | id            | B-tree| Первичный ключ                       |
| enrollments_pkey              | enrollments  | id            | B-tree| Первичный ключ                       |
| instructors_pkey              | instructors  | id            | B-tree| Первичный ключ                       |
| idx_enrollments_course_id     | enrollments  | course_id     | B-tree| Ускорение JOIN с courses             |
| idx_enrollments_status        | enrollments  | status        | B-tree| Фильтрация по статусу заявок         |
| idx_enrollments_created_at    | enrollments  | created_at    | B-tree| Сортировка по дате (DESC)            |
| idx_courses_category          | courses      | category      | B-tree| Фильтрация курсов по категории       |

### 3.3 Ограничения целостности

**Референциальная целостность:**
```sql
ALTER TABLE enrollments 
ADD CONSTRAINT fk_enrollments_courses 
FOREIGN KEY (course_id) 
REFERENCES courses(id) 
ON DELETE SET NULL;
```

**Проверочные ограничения:**
```sql
-- Цена не может быть отрицательной
ALTER TABLE courses ADD CONSTRAINT check_price_positive 
CHECK (price >= 0);

-- Рейтинг от 0 до 5
ALTER TABLE instructors ADD CONSTRAINT check_rating_range 
CHECK (rating >= 0 AND rating <= 5.00);

-- Опыт не может быть отрицательным
ALTER TABLE instructors ADD CONSTRAINT check_experience_positive 
CHECK (experience >= 0);
```

### 3.4 Триггеры и автоматизация

```sql
-- Триггер автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_enrollments_updated_at
BEFORE UPDATE ON enrollments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 3.5 Статистика и объём данных

**Текущее состояние базы данных:**

| Таблица      | Количество строк | Примерный размер |
|--------------|------------------|------------------|
| courses      | 3                | ~2 KB            |
| enrollments  | 6                | ~3 KB            |
| instructors  | 3                | ~2 KB            |

**Прогноз роста:**
- **enrollments** - основная растущая таблица (до 10,000+ записей в год)
- **courses** - стабильная (10-30 записей)
- **instructors** - медленный рост (5-20 записей)

---

## 4. ДИАГРАММА ФИЗИЧЕСКОЙ МОДЕЛИ (ASCII)

```
┌─────────────────────────────────────────┐
│         courses                          │
│─────────────────────────────────────────│
│ PK │ id              SERIAL               │
│    │ title           VARCHAR(255) NOT NULL│
│    │ category        VARCHAR(50) NOT NULL │
│    │ description     TEXT                 │
│    │ duration        VARCHAR(100)         │
│    │ price           INTEGER NOT NULL     │
│    │ image_url       TEXT                 │
│    │ features        TEXT[]               │
│    │ created_at      TIMESTAMP            │
└──────────┬──────────────────────────────┘
           │
           │ 1:N
           │
┌──────────▼──────────────────────────────┐
│         enrollments                      │
│─────────────────────────────────────────│
│ PK │ id              SERIAL               │
│    │ full_name       VARCHAR(255) NOT NULL│
│    │ phone           VARCHAR(50) NOT NULL │
│    │ email           VARCHAR(255)         │
│ FK │ course_id       INTEGER              │◄──┐
│    │ message         TEXT                 │   │
│    │ status          VARCHAR(50) = 'new'  │   │
│    │ created_at      TIMESTAMP            │   │
│    │ updated_at      TIMESTAMP            │   │
└─────────────────────────────────────────┘   │
                                               │
                                               │
┌─────────────────────────────────────────┐   │
│         instructors                      │   │
│─────────────────────────────────────────│   │
│ PK │ id              SERIAL               │   │
│    │ name            VARCHAR(255) NOT NULL│   │
│    │ specialization  VARCHAR(255)         │   │
│    │ experience      INTEGER              │   │
│    │ rating          NUMERIC(3,2)         │   │
│    │ avatar_url      TEXT                 │   │
│    │ bio             TEXT                 │   │
│    │ created_at      TIMESTAMP            │   │
└─────────────────────────────────────────┘   │
                                               │
                                        (FOREIGN KEY)
```

---

## 5. АНАЛИЗ ЗАПРОСОВ И ПРОИЗВОДИТЕЛЬНОСТЬ

### 5.1 Типовые запросы приложения

**Запрос 1: Получение всех курсов**
```sql
SELECT * FROM courses ORDER BY id;
```
**Сложность:** O(n log n) - из-за сортировки
**Индекс:** courses_pkey

**Запрос 2: Получение заявок с информацией о курсе**
```sql
SELECT 
    e.*,
    c.title as course_title
FROM enrollments e
LEFT JOIN courses c ON e.course_id = c.id
ORDER BY e.created_at DESC;
```
**Сложность:** O(n log n)
**Индексы:** idx_enrollments_course_id, idx_enrollments_created_at

**Запрос 3: Создание новой заявки**
```sql
INSERT INTO enrollments 
(full_name, phone, email, course_id, message, status, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, 'new', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING *;
```
**Сложность:** O(log n) - обновление индексов

### 5.2 План развития модели данных

**Рекомендации по расширению:**

1. **Добавить таблицу связи instructor_courses (многие ко многим)**
```sql
CREATE TABLE instructor_courses (
    id SERIAL PRIMARY KEY,
    instructor_id INTEGER REFERENCES instructors(id),
    course_id INTEGER REFERENCES courses(id),
    UNIQUE(instructor_id, course_id)
);
```

2. **Добавить таблицу студентов**
```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    passport_data VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. **Добавить таблицу расписания занятий**
```sql
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    instructor_id INTEGER REFERENCES instructors(id),
    student_id INTEGER REFERENCES students(id),
    lesson_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 90,
    status VARCHAR(50) DEFAULT 'scheduled'
);
```

---

## 6. ВЫВОДЫ

### 6.1 Сильные стороны текущей модели

✅ Соответствие 3НФ - отсутствие избыточности данных  
✅ Чёткое разделение сущностей по назначению  
✅ Наличие необходимых индексов для оптимизации запросов  
✅ Использование ограничений целостности (FK, CHECK)  
✅ Автоматическое проставление временных меток  

### 6.2 Рекомендации по улучшению

⚠️ Добавить связь между instructors и courses (многие ко многим)  
⚠️ Создать таблицу students для хранения полной информации о студентах  
⚠️ Добавить таблицу schedules для управления расписанием  
⚠️ Реализовать soft delete вместо физического удаления (добавить поле deleted_at)  
⚠️ Добавить полнотекстовый поиск (GIN индексы для поиска по названиям курсов)  

---

**Дата создания документа:** 2025-11-17  
**Версия модели данных:** 1.0  
**СУБД:** PostgreSQL 14+  
**Схема:** t_p22853855_driving_school_app
