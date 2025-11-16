# ПРОЕКТИРОВАНИЕ И РАЗРАБОТКА МОДЕЛЕЙ ДАННЫХ
## Веб-приложение "АвтоПрофи"

---

## 1. КОНЦЕПТУАЛЬНАЯ МОДЕЛЬ ДАННЫХ

### 1.1 Описание предметной области

Веб-приложение "АвтоПрофи" — это информационная система для автошколы, предназначенная для:
- Управления курсами обучения вождению
- Учёта информации об инструкторах
- Приёма и обработки заявок на обучение от клиентов

### 1.2 Основные бизнес-сущности

#### Сущность 1: **КУРС ОБУЧЕНИЯ (Course)**
**Назначение:** Представляет образовательную программу автошколы

**Атрибуты:**
- Название курса
- Категория водительских прав
- Описание программы
- Продолжительность обучения
- Стоимость
- Перечень преимуществ

**Бизнес-правила:**
- Каждый курс имеет уникальный идентификатор
- Курс может быть связан с множеством заявок
- Стоимость курса указывается в рублях

#### Сущность 2: **ИНСТРУКТОР (Instructor)**
**Назначение:** Представляет преподавателя автошколы

**Атрибуты:**
- Полное имя
- Специализация (категории, которые преподаёт)
- Стаж работы (годы)
- Рейтинг (от 0 до 5)
- Биография / дополнительная информация

**Бизнес-правила:**
- Каждый инструктор имеет уникальный идентификатор
- Рейтинг не может превышать 5.0
- Стаж указывается в годах (целое число)

#### Сущность 3: **ЗАЯВКА НА ОБУЧЕНИЕ (Enrollment)**
**Назначение:** Представляет запрос клиента на прохождение курса

**Атрибуты:**
- ФИО клиента
- Контактный телефон
- Email (опционально)
- Выбранный курс
- Сообщение / комментарий (опционально)
- Статус заявки
- Дата и время создания
- Дата и время последнего обновления

**Бизнес-правила:**
- Заявка обязательно связана с конкретным курсом
- Статус по умолчанию: "new" (новая)
- Телефон и ФИО — обязательные поля
- Email валидируется по формату
- Телефон валидируется по формату (+7/8 и 10+ цифр)

### 1.3 Связи между сущностями

```
КУРС (Course) ──────────┐
                        │
                        │ 1:M (один ко многим)
                        │
                        ▼
               ЗАЯВКА (Enrollment)

ИНСТРУКТОР (Instructor) [независимая сущность]
```

**Описание связей:**
- **Course ↔ Enrollment**: Один курс может иметь множество заявок (связь 1:M)
- **Instructor**: Не имеет прямых связей с другими сущностями в текущей версии (справочная информация)

### 1.4 ER-диаграмма (Entity-Relationship)

```
┌─────────────────────┐
│     COURSE          │
├─────────────────────┤
│ • id (PK)           │
│ • title             │
│ • category          │
│ • description       │
│ • duration          │
│ • price             │
│ • features          │
└──────────┬──────────┘
           │
           │ 1
           │
           │
           │ M
┌──────────▼──────────┐
│    ENROLLMENT       │
├─────────────────────┤
│ • id (PK)           │
│ • full_name         │
│ • phone             │
│ • email             │
│ • course_id (FK)    │
│ • message           │
│ • status            │
│ • created_at        │
│ • updated_at        │
└─────────────────────┘

┌─────────────────────┐
│    INSTRUCTOR       │
├─────────────────────┤
│ • id (PK)           │
│ • name              │
│ • specialization    │
│ • experience        │
│ • rating            │
│ • bio               │
└─────────────────────┘
```

---

## 2. ЛОГИЧЕСКАЯ МОДЕЛЬ ДАННЫХ

### 2.1 Таблицы и атрибуты

#### Таблица: **courses**

| Атрибут      | Тип данных      | Ограничения               | Описание                          |
|--------------|-----------------|---------------------------|-----------------------------------|
| id           | SERIAL          | PRIMARY KEY               | Уникальный идентификатор курса    |
| title        | VARCHAR(200)    | NOT NULL                  | Название курса                    |
| category     | VARCHAR(50)     | NOT NULL                  | Категория водительских прав       |
| description  | TEXT            | NOT NULL                  | Описание программы обучения       |
| duration     | VARCHAR(100)    | NOT NULL                  | Продолжительность обучения        |
| price        | INTEGER         | NOT NULL                  | Стоимость курса в рублях          |
| features     | TEXT            | NOT NULL                  | Перечень преимуществ (JSON array) |

**Индексы:**
- PRIMARY KEY на `id` (автоматически)

#### Таблица: **instructors**

| Атрибут       | Тип данных      | Ограничения     | Описание                           |
|---------------|-----------------|-----------------|-----------------------------------|
| id            | SERIAL          | PRIMARY KEY     | Уникальный идентификатор           |
| name          | VARCHAR(200)    | NOT NULL        | ФИО инструктора                    |
| specialization| VARCHAR(100)    | NOT NULL        | Специализация (категории)          |
| experience    | INTEGER         | NOT NULL        | Стаж работы в годах                |
| rating        | NUMERIC(2,1)    | NOT NULL        | Рейтинг (0.0-5.0)                  |
| bio           | TEXT            | NOT NULL        | Биография, дополнительная информация|

**Индексы:**
- PRIMARY KEY на `id` (автоматически)

#### Таблица: **enrollments**

| Атрибут      | Тип данных       | Ограничения                                | Описание                          |
|--------------|------------------|--------------------------------------------|-----------------------------------|
| id           | SERIAL           | PRIMARY KEY                                | Уникальный идентификатор заявки   |
| full_name    | VARCHAR(200)     | NOT NULL                                   | ФИО клиента                       |
| phone        | VARCHAR(20)      | NOT NULL                                   | Контактный телефон                |
| email        | VARCHAR(200)     | NULL                                       | Email клиента (опционально)       |
| course_id    | INTEGER          | NOT NULL, FOREIGN KEY → courses(id)        | ID выбранного курса               |
| message      | TEXT             | NULL                                       | Комментарий от клиента            |
| status       | VARCHAR(50)      | NOT NULL, DEFAULT 'new'                    | Статус заявки                     |
| created_at   | TIMESTAMP        | NOT NULL, DEFAULT CURRENT_TIMESTAMP        | Дата и время создания             |
| updated_at   | TIMESTAMP        | NOT NULL, DEFAULT CURRENT_TIMESTAMP        | Дата и время последнего изменения |

**Индексы:**
- PRIMARY KEY на `id` (автоматически)
- INDEX на `course_id` (для оптимизации JOIN)
- INDEX на `created_at` (для сортировки по дате)

### 2.2 Ограничения целостности

#### Ограничения на уровне столбцов:
- **NOT NULL**: Все обязательные поля (title, price, full_name, phone, course_id)
- **DEFAULT**: Автоматическое присвоение значений (status='new', timestamps)
- **SERIAL**: Автоинкрементный первичный ключ для всех таблиц

#### Ссылочная целостность (Foreign Keys):
```sql
enrollments.course_id → courses.id
  ON DELETE: RESTRICT (нельзя удалить курс, если есть заявки)
  ON UPDATE: CASCADE (обновление ID курса распространяется на заявки)
```

#### Бизнес-правила на уровне приложения:
- Валидация телефона: `^+?[78][\d\s\-\(\)]{9,}$`
- Валидация email: `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$`
- Приведение ФИО к заглавным буквам (title case)
- Рейтинг инструктора: 0.0 ≤ rating ≤ 5.0

### 2.3 Нормализация данных

**Текущая модель соответствует 3-й нормальной форме (3NF):**

1. **1NF (Первая нормальная форма):**
   - Все атрибуты атомарны
   - Каждая таблица имеет первичный ключ
   - Нет повторяющихся групп

2. **2NF (Вторая нормальная форма):**
   - Выполнены требования 1NF
   - Все неключевые атрибуты полностью функционально зависят от первичного ключа
   - Нет частичных зависимостей

3. **3NF (Третья нормальная форма):**
   - Выполнены требования 2NF
   - Нет транзитивных зависимостей
   - Каждый неключевой атрибут зависит только от первичного ключа

**Примечание:** Атрибут `features` в таблице `courses` хранится как TEXT (JSON array), что является компромиссом между нормализацией и удобством использования. Для полной нормализации можно создать отдельную таблицу `course_features`.

---

## 3. ФИЗИЧЕСКАЯ МОДЕЛЬ ДАННЫХ

### 3.1 DDL-скрипты создания таблиц

```sql
-- Таблица курсов обучения
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    features TEXT NOT NULL
);

-- Таблица инструкторов
CREATE TABLE instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    experience INTEGER NOT NULL,
    rating NUMERIC(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5.0),
    bio TEXT NOT NULL
);

-- Таблица заявок на обучение
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(200),
    course_id INTEGER NOT NULL,
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_enrollment_course 
        FOREIGN KEY (course_id) 
        REFERENCES courses(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_created_at ON enrollments(created_at DESC);
CREATE INDEX idx_enrollments_status ON enrollments(status);
```

### 3.2 Инициализация данных

```sql
-- Добавление курсов
INSERT INTO courses (title, category, description, duration, price, features) VALUES
(
    'Категория B (механика)', 
    'B', 
    'Полный курс обучения вождению легкового автомобиля с механической коробкой передач', 
    '3 месяца', 
    45000, 
    '["56 часов теории", "56 часов практики", "Экзамен в ГИБДД", "Учебные материалы"]'
),
(
    'Категория B (автомат)', 
    'B', 
    'Курс обучения вождению легкового автомобиля с автоматической коробкой передач', 
    '3 месяца', 
    50000, 
    '["56 часов теории", "56 часов практики", "Современные автомобили", "Экзамен в ГИБДД"]'
),
(
    'Категория A (мотоцикл)', 
    'A', 
    'Обучение управлению мотоциклом с нуля до получения прав', 
    '2 месяца', 
    35000, 
    '["Теоретический курс", "Практика на площадке", "Практика в городе", "Защитная экипировка"]'
);

-- Добавление инструкторов
INSERT INTO instructors (name, specialization, experience, rating, bio) VALUES
(
    'Иванов Иван Петрович', 
    'Категории B, C', 
    15, 
    4.9, 
    'Мастер производственного обучения высшей категории. Опыт работы инструктором более 15 лет. Специализируется на обучении начинающих водителей.'
),
(
    'Петрова Мария Сергеевна', 
    'Категория B (автомат)', 
    8, 
    4.8, 
    'Инструктор с 8-летним стажем. Терпеливый подход к ученикам, высокий процент сдачи экзамена с первого раза.'
),
(
    'Сидоров Алексей Владимирович', 
    'Категории A, B', 
    12, 
    5.0, 
    'Опытный инструктор по обучению вождению легковых автомобилей и мотоциклов. Индивидуальный подход к каждому ученику.'
);
```

### 3.3 Типовые запросы к базе данных

#### Запрос 1: Получение всех курсов
```sql
SELECT * FROM courses ORDER BY id;
```

#### Запрос 2: Получение всех инструкторов
```sql
SELECT * FROM instructors ORDER BY rating DESC, experience DESC;
```

#### Запрос 3: Получение заявок с информацией о курсе
```sql
SELECT 
    e.id,
    e.full_name,
    e.phone,
    e.email,
    e.message,
    e.status,
    e.created_at,
    c.title as course_title,
    c.category,
    c.price
FROM enrollments e
LEFT JOIN courses c ON e.course_id = c.id
ORDER BY e.created_at DESC;
```

#### Запрос 4: Создание новой заявки
```sql
INSERT INTO enrollments 
(full_name, phone, email, course_id, message, status, created_at, updated_at)
VALUES 
('Петров Сергей Иванович', '+79001234567', 'petrov@mail.ru', 1, 'Хочу записаться на ближайший поток', 'new', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING *;
```

#### Запрос 5: Обновление статуса заявки
```sql
UPDATE enrollments
SET status = 'processed', updated_at = CURRENT_TIMESTAMP
WHERE id = 1
RETURNING *;
```

#### Запрос 6: Статистика по курсам
```sql
SELECT 
    c.title,
    c.category,
    c.price,
    COUNT(e.id) as total_enrollments,
    COUNT(CASE WHEN e.status = 'new' THEN 1 END) as new_enrollments,
    COUNT(CASE WHEN e.status = 'processed' THEN 1 END) as processed_enrollments
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.title, c.category, c.price
ORDER BY total_enrollments DESC;
```

### 3.4 Производительность и оптимизация

#### Созданные индексы:
1. **idx_enrollments_course_id** — ускоряет JOIN между enrollments и courses
2. **idx_enrollments_created_at** — оптимизирует сортировку заявок по дате
3. **idx_enrollments_status** — ускоряет фильтрацию по статусу заявки

#### Рекомендации по оптимизации:
- Использование `RealDictCursor` для удобной работы с результатами запросов
- Connection pooling при масштабировании (pg_bouncer или SQLAlchemy pool)
- Кэширование списка курсов и инструкторов (Redis)
- Партиционирование таблицы enrollments при большом объёме данных

### 3.5 Параметры СУБД

**Используемая СУБД:** PostgreSQL 14+

**Параметры подключения:**
- Host: dpg-d4bomnbipnbc7390422g-a.oregon-postgres.render.com
- Port: 5432
- Database: autoprofi
- SSL Mode: require

**Параметры безопасности:**
- Обязательное использование SSL для подключения
- Хранение учётных данных в переменных окружения
- Валидация входных данных на уровне приложения
- Использование параметризованных запросов (защита от SQL-инъекций)

---

## 4. АРХИТЕКТУРА ПРИЛОЖЕНИЯ

### 4.1 Технологический стек

**Backend:**
- Python 3.11
- Flask 3.0 (веб-фреймворк)
- psycopg2 2.9.9 (драйвер PostgreSQL)
- Gunicorn (production сервер)

**Frontend:**
- HTML5 + CSS3
- Vanilla JavaScript (ES6+)
- Google Fonts (Montserrat, Open Sans)

**Database:**
- PostgreSQL 14+ (Render)

### 4.2 API эндпоинты

#### Заявки (Enrollments)
- `GET /api/enrollments` — Получить все заявки
- `POST /api/enrollments` — Создать заявку

#### Курсы (Courses)
- `GET /api/courses` — Получить все курсы
- `POST /api/courses` — Создать курс
- `PUT /api/courses` — Обновить курс
- `DELETE /api/courses?id={id}` — Удалить курс

#### Инструкторы (Instructors)
- `GET /api/instructors` — Получить всех инструкторов
- `POST /api/instructors` — Создать инструктора
- `PUT /api/instructors` — Обновить инструктора
- `DELETE /api/instructors?id={id}` — Удалить инструктора

### 4.3 Слои приложения

```
┌─────────────────────────────────┐
│   Presentation Layer            │  ← HTML Templates (Jinja2)
│   (templates/)                  │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Application Layer             │  ← Flask Routes & Business Logic
│   (app.py)                      │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Data Access Layer             │  ← psycopg2 + SQL queries
│   (get_db, cursor operations)   │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Database Layer                │  ← PostgreSQL (Render)
│   (courses, instructors,        │
│    enrollments)                 │
└─────────────────────────────────┘
```

---

## 5. ВЫВОДЫ И РЕКОМЕНДАЦИИ

### 5.1 Достоинства текущей модели
✅ Соответствие 3-й нормальной форме
✅ Чёткое разделение сущностей
✅ Эффективные индексы для основных запросов
✅ Гибкая система статусов заявок
✅ Валидация данных на уровне приложения

### 5.2 Возможности для расширения

1. **Добавление новых сущностей:**
   - Пользователи (Users) — для авторизации и личного кабинета
   - Расписание (Schedule) — привязка инструкторов к курсам и времени
   - Платежи (Payments) — учёт оплат за обучение
   - Отзывы (Reviews) — отзывы учеников об инструкторах и курсах

2. **Улучшение существующих таблиц:**
   - Денормализация `features` в отдельную таблицу `course_features`
   - Добавление триггеров для автообновления `updated_at`
   - Soft delete для курсов и инструкторов (добавить поле `deleted_at`)

3. **Оптимизация производительности:**
   - Внедрение кэширования (Redis)
   - Партиционирование таблицы `enrollments` по дате
   - Добавление full-text search для курсов и инструкторов

4. **Безопасность:**
   - Шифрование персональных данных (email, phone)
   - Аудит изменений (таблица `audit_log`)
   - Rate limiting для API эндпоинтов

---

**Документ подготовлен:** 2025-01-16  
**Версия модели данных:** 1.0  
**Проект:** АвтоПрофи (Веб-приложение для автошколы)
