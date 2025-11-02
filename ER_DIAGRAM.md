# ER-диаграмма базы данных "АвтоПрофи"

## Концептуальная ER-диаграмма

```
┌─────────────────────────────────────────────────┐
│                   COURSES                        │
│  (Курсы обучения)                               │
├─────────────────────────────────────────────────┤
│ PK  id              INTEGER                      │
│     title           VARCHAR(255)   NOT NULL      │
│     category        VARCHAR(50)    NOT NULL      │
│     description     TEXT                         │
│     duration        VARCHAR(100)                 │
│     price           INTEGER        NOT NULL      │
│     image_url       TEXT                         │
│     features        ARRAY                        │
│     created_at      TIMESTAMP                    │
└─────────────────────────────────────────────────┘
                          △
                          │
                          │ 1
                          │
                          │ записывается на
                          │
                          │ N
                          │
┌─────────────────────────────────────────────────┐
│                 ENROLLMENTS                      │
│  (Заявки на обучение)                           │
├─────────────────────────────────────────────────┤
│ PK  id              INTEGER                      │
│     full_name       VARCHAR(255)   NOT NULL      │
│     phone           VARCHAR(50)    NOT NULL      │
│     email           VARCHAR(255)                 │
│ FK  course_id       INTEGER        → courses.id │
│     message         TEXT                         │
│     status          VARCHAR(50)    DEFAULT 'new' │
│     created_at      TIMESTAMP                    │
└─────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────┐
│                 INSTRUCTORS                      │
│  (Инструкторы)                                  │
├─────────────────────────────────────────────────┤
│ PK  id              INTEGER                      │
│     name            VARCHAR(255)   NOT NULL      │
│     specialization  VARCHAR(255)                 │
│     experience      INTEGER                      │
│     rating          NUMERIC(3,2)                 │
│     avatar_url      TEXT                         │
│     bio             TEXT                         │
│     created_at      TIMESTAMP                    │
└─────────────────────────────────────────────────┘
```

---

## Детальное описание таблиц

### 1. Таблица: **courses** (Курсы)

**Назначение**: Хранит информацию о доступных курсах обучения вождению

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| **id** | INTEGER | PRIMARY KEY, AUTO INCREMENT | Уникальный идентификатор курса |
| **title** | VARCHAR(255) | NOT NULL | Название курса (например, "Категория B") |
| **category** | VARCHAR(50) | NOT NULL | Категория водительских прав (A, B, C) |
| **description** | TEXT | NULL | Подробное описание программы обучения |
| **duration** | VARCHAR(100) | NULL | Длительность курса (например, "3 месяца") |
| **price** | INTEGER | NOT NULL | Стоимость курса в рублях |
| **image_url** | TEXT | NULL | Ссылка на изображение курса |
| **features** | ARRAY | NULL | Список преимуществ курса (массив строк) |
| **created_at** | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Дата создания записи |

**Примеры данных**:
```sql
id=1, title="Категория B (легковой автомобиль)", category="B", price=35000, duration="3 месяца"
id=2, title="Категория A (мотоцикл)", category="A", price=28000, duration="2 месяца"
id=3, title="Категория C (грузовой автомобиль)", category="C", price=45000, duration="4 месяца"
```

**Индексы**:
- PRIMARY KEY на `id`
- Рекомендуется индекс на `category` для быстрого поиска по категориям

---

### 2. Таблица: **enrollments** (Заявки на обучение)

**Назначение**: Хранит заявки клиентов на запись на курсы

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| **id** | INTEGER | PRIMARY KEY, AUTO INCREMENT | Уникальный идентификатор заявки |
| **full_name** | VARCHAR(255) | NOT NULL | Полное имя клиента |
| **phone** | VARCHAR(50) | NOT NULL | Телефон для связи (обязательно) |
| **email** | VARCHAR(255) | NULL | Email клиента (опционально) |
| **course_id** | INTEGER | FOREIGN KEY → courses.id | ID выбранного курса |
| **message** | TEXT | NULL | Комментарий или пожелание клиента |
| **status** | VARCHAR(50) | DEFAULT 'new' | Статус заявки (new, contacted, enrolled, completed, cancelled) |
| **created_at** | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Дата создания заявки |

**Связи**:
- `course_id` → `courses.id` (FOREIGN KEY) — многие заявки к одному курсу

**Возможные значения `status`**:
- `new` — новая заявка (по умолчанию)
- `contacted` — менеджер связался с клиентом
- `enrolled` — клиент записан на курс
- `completed` — обучение завершено
- `cancelled` — заявка отменена

**Примеры данных**:
```sql
id=1, full_name="Иванов Петр", phone="+79001234567", course_id=1, status="new"
id=2, full_name="Сидорова Анна", phone="+79009876543", course_id=2, status="contacted"
```

**Индексы**:
- PRIMARY KEY на `id`
- INDEX на `course_id` (для JOIN с courses)
- INDEX на `status` (для фильтрации заявок)
- INDEX на `created_at` (для сортировки по дате)

---

### 3. Таблица: **instructors** (Инструкторы)

**Назначение**: Хранит информацию об инструкторах автошколы

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| **id** | INTEGER | PRIMARY KEY, AUTO INCREMENT | Уникальный идентификатор инструктора |
| **name** | VARCHAR(255) | NOT NULL | ФИО инструктора |
| **specialization** | VARCHAR(255) | NULL | Категории, которые преподает (например, "Категории B, C") |
| **experience** | INTEGER | NULL | Опыт работы в годах |
| **rating** | NUMERIC(3,2) | NULL | Рейтинг инструктора (от 1.00 до 5.00) |
| **avatar_url** | TEXT | NULL | Ссылка на фото инструктора |
| **bio** | TEXT | NULL | Биография / описание инструктора |
| **created_at** | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Дата добавления в систему |

**Примеры данных**:
```sql
id=1, name="Петров Иван Сергеевич", specialization="Категория B", experience=15, rating=4.90
id=2, name="Сидорова Мария Ивановна", specialization="Категории A, B", experience=8, rating=4.80
id=3, name="Кузнецов Алексей Петрович", specialization="Категория C", experience=12, rating=4.95
```

**Индексы**:
- PRIMARY KEY на `id`
- INDEX на `rating` (для сортировки по рейтингу)

---

## Кардинальность связей

### Enrollments → Courses (N:1)

- **Связь**: Многие к одному
- **Описание**: Одна заявка относится к одному курсу, но один курс может иметь множество заявок
- **Реализация**: `enrollments.course_id` → `courses.id` (FOREIGN KEY)
- **Обязательность**: Опциональная (NULL разрешен) — заявка может быть на пробное занятие без привязки к курсу

**SQL для создания связи**:
```sql
ALTER TABLE enrollments 
ADD CONSTRAINT fk_enrollment_course 
FOREIGN KEY (course_id) 
REFERENCES courses(id) 
ON DELETE SET NULL;  -- При удалении курса, заявки останутся с course_id = NULL
```

---

## Дополнительные ограничения и правила

### Constraints:

```sql
-- Цена курса должна быть положительной
ALTER TABLE courses 
ADD CONSTRAINT chk_price_positive 
CHECK (price >= 0);

-- Рейтинг инструктора от 1.00 до 5.00
ALTER TABLE instructors 
ADD CONSTRAINT chk_rating_range 
CHECK (rating >= 1.00 AND rating <= 5.00);

-- Опыт инструктора не может быть отрицательным
ALTER TABLE instructors 
ADD CONSTRAINT chk_experience_positive 
CHECK (experience >= 0);

-- Статус заявки может быть только из заданного списка
ALTER TABLE enrollments 
ADD CONSTRAINT chk_status_valid 
CHECK (status IN ('new', 'contacted', 'enrolled', 'completed', 'cancelled'));
```

---

## Визуализация связей (нотация Crow's Foot)

```
COURSES ||────────< ENROLLMENTS
   1                    N

Легенда:
||  = обязательное наличие (NOT NULL)
o|  = опциональное (NULL)
────< = "многие" (N)
────  = "один" (1)
```

**Объяснение**:
- Один курс может иметь **много заявок** (или ни одной)
- Каждая заявка связана **с одним курсом** (или с пробным занятием без курса)

---

## SQL-запросы для создания таблиц

### 1. Создание таблицы courses

```sql
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

CREATE INDEX idx_courses_category ON courses(category);
```

### 2. Создание таблицы enrollments

```sql
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'enrolled', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_created_at ON enrollments(created_at);
```

### 3. Создание таблицы instructors

```sql
CREATE TABLE instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    experience INTEGER CHECK (experience >= 0),
    rating NUMERIC(3,2) CHECK (rating >= 1.00 AND rating <= 5.00),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_instructors_rating ON instructors(rating DESC);
```

---

## Примеры SQL-запросов

### Получить все заявки с названием курса

```sql
SELECT 
    e.id,
    e.full_name,
    e.phone,
    e.email,
    c.title AS course_name,
    c.category,
    c.price,
    e.status,
    e.created_at
FROM enrollments e
LEFT JOIN courses c ON e.course_id = c.id
ORDER BY e.created_at DESC;
```

### Подсчитать количество заявок по каждому курсу

```sql
SELECT 
    c.title,
    c.category,
    COUNT(e.id) AS enrollments_count,
    c.price
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.title, c.category, c.price
ORDER BY enrollments_count DESC;
```

### Получить инструкторов с высоким рейтингом (> 4.5)

```sql
SELECT 
    name,
    specialization,
    experience,
    rating
FROM instructors
WHERE rating > 4.5
ORDER BY rating DESC;
```

### Получить новые заявки за последнюю неделю

```sql
SELECT 
    e.id,
    e.full_name,
    e.phone,
    c.title AS course_name,
    e.created_at
FROM enrollments e
LEFT JOIN courses c ON e.course_id = c.id
WHERE e.status = 'new' 
  AND e.created_at >= NOW() - INTERVAL '7 days'
ORDER BY e.created_at DESC;
```

### Статистика по статусам заявок

```sql
SELECT 
    status,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
FROM enrollments
GROUP BY status
ORDER BY count DESC;
```

---

## Диаграмма состояний для заявки (Enrollment)

```
    ┌─────┐
    │ new │ ← Начальное состояние при создании заявки
    └──┬──┘
       │
       ├─→ contacted ─→ enrolled ─→ completed
       │                              
       └──────────────────────────→ cancelled
```

**Описание переходов**:
1. `new` → `contacted` — менеджер связался с клиентом
2. `contacted` → `enrolled` — клиент записан на курс
3. `enrolled` → `completed` — клиент завершил обучение
4. `new/contacted/enrolled` → `cancelled` — заявка отменена на любом этапе

---

## Нормализация базы данных

Текущая схема находится в **3-й нормальной форме (3NF)**:

1. **1NF**: Все атрибуты атомарны (кроме `features`, который является массивом)
2. **2NF**: Нет частичных зависимостей (все неключевые атрибуты зависят от полного первичного ключа)
3. **3NF**: Нет транзитивных зависимостей

**Возможные улучшения**:
- Вынести `features` в отдельную таблицу `course_features` (для полной 3NF)
- Создать таблицу `categories` для нормализации категорий курсов
- Добавить таблицу `course_instructors` для связи курсов и инструкторов (M:N)

---

## Перспективы расширения схемы

### Краткосрочные:
1. **Таблица `payments`** — оплаты курсов
2. **Таблица `reviews`** — отзывы учеников об инструкторах

### Среднесрочные:
1. **Таблица `lessons`** — расписание занятий
2. **Таблица `users`** — личные кабинеты учеников
3. **Таблица `course_instructors`** — связь курсов и инструкторов (M:N)

### Долгосрочные:
1. **Таблица `exams`** — результаты экзаменов
2. **Таблица `attendance`** — посещаемость занятий
3. **Таблица `certificates`** — выданные сертификаты/права

---

## Заключение

Текущая структура базы данных **проста, понятна и эффективна** для задач автошколы:

✅ **Преимущества**:
- Минималистичная схема (3 таблицы)
- Легко поддерживать и расширять
- Быстрые JOIN-запросы
- Соответствует бизнес-логике

✅ **Покрывает основные потребности**:
- Управление курсами
- Обработка заявок клиентов
- Отображение инструкторов

✅ **Готова к масштабированию**:
- Можно добавить новые таблицы без изменения существующих
- Индексы обеспечивают производительность
- FOREIGN KEY гарантирует целостность данных
