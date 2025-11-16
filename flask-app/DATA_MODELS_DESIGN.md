# ПРОЕКТИРОВАНИЕ И РАЗРАБОТКА МОДЕЛЕЙ ДАННЫХ
## Веб-приложение "АвтоПрофи" - Автошкола

---

## СОДЕРЖАНИЕ

1. [Введение](#введение)
2. [Концептуальная модель данных (ERD)](#концептуальная-модель-данных-erd)
3. [Логическая модель данных](#логическая-модель-данных)
4. [Физическая модель данных](#физическая-модель-данных)
5. [Нормализация базы данных](#нормализация-базы-данных)
6. [Индексы и оптимизация](#индексы-и-оптимизация)
7. [Бизнес-правила и ограничения](#бизнес-правила-и-ограничения)

---

## ВВЕДЕНИЕ

### Назначение системы
Веб-приложение "АвтоПрофи" предназначено для автоматизации процессов автошколы:
- Онлайн-запись на курсы обучения вождению
- Управление информацией о курсах и инструкторах
- Обработка заявок клиентов
- Административная панель для управления данными

### Технологический стек
- **СУБД**: PostgreSQL 15+
- **Backend**: Python 3.11 + Flask 3.0
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Хостинг БД**: Render.com
- **Протокол**: HTTP/HTTPS + REST API

---

## КОНЦЕПТУАЛЬНАЯ МОДЕЛЬ ДАННЫХ (ERD)

### Описание предметной области

**Основные сущности:**
1. **Курсы обучения** - образовательные программы автошколы
2. **Инструкторы** - преподаватели, ведущие занятия
3. **Заявки на обучение** - запросы клиентов на запись

### ER-диаграмма (нотация Чена)

```
┌─────────────────┐
│     КУРСЫ       │
│   (COURSES)     │
└────────┬────────┘
         │
         │ 1
         │
         │ имеет
         │
         │ N
         │
┌────────▼────────┐         ┌─────────────────┐
│     ЗАЯВКИ      │         │   ИНСТРУКТОРЫ   │
│  (ENROLLMENTS)  │         │  (INSTRUCTORS)  │
└─────────────────┘         └─────────────────┘
```

### Описание связей

**1. КУРСЫ ↔ ЗАЯВКИ (1:N)**
- Один курс может иметь много заявок
- Каждая заявка относится к одному курсу
- Тип связи: обязательная для заявки, необязательная для курса
- Кардинальность: 1:∞

**2. ИНСТРУКТОРЫ (независимая сущность)**
- Инструкторы хранятся отдельно для справочной информации
- Потенциальная связь с курсами (не реализована в текущей версии)

### Атрибуты сущностей

#### Сущность: КУРСЫ
- **id** (PK) - уникальный идентификатор
- title - название курса
- category - категория (A, B, C, D, BE)
- description - описание программы
- duration - продолжительность (часы)
- price - стоимость (рубли)
- features - особенности (JSON)

#### Сущность: ИНСТРУКТОРЫ
- **id** (PK) - уникальный идентификатор
- name - ФИО инструктора
- specialization - специализация
- experience - опыт работы (лет)
- rating - рейтинг (0-5)
- bio - биография

#### Сущность: ЗАЯВКИ
- **id** (PK) - уникальный идентификатор
- full_name - ФИО клиента
- phone - номер телефона
- email - электронная почта
- **course_id** (FK) - ссылка на курс
- message - дополнительное сообщение
- status - статус заявки
- created_at - дата создания
- updated_at - дата обновления

---

## ЛОГИЧЕСКАЯ МОДЕЛЬ ДАННЫХ

### Реляционная схема базы данных

#### Таблица: **courses** (Курсы обучения)

```sql
courses (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL,
    price INTEGER NOT NULL,
    features TEXT NOT NULL
)
```

**Домены атрибутов:**
- `id` - целое положительное число, автоинкремент
- `title` - строка до 255 символов, обязательна
- `category` - строка до 50 символов (A, B, C, D, BE, и т.д.)
- `description` - текст произвольной длины
- `duration` - целое число (часы обучения)
- `price` - целое число (стоимость в рублях)
- `features` - текст в формате массива строк

**Ключи:**
- Первичный ключ: `id`
- Уникальные ключи: нет
- Внешние ключи: нет

---

#### Таблица: **instructors** (Инструкторы)

```sql
instructors (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    experience INTEGER NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    bio TEXT NOT NULL
)
```

**Домены атрибутов:**
- `id` - целое положительное число, автоинкремент
- `name` - ФИО инструктора, до 255 символов
- `specialization` - специализация, до 255 символов
- `experience` - целое число (годы опыта)
- `rating` - десятичное число с 1 знаком после запятой (0.0-5.0)
- `bio` - текст произвольной длины

**Ключи:**
- Первичный ключ: `id`
- Уникальные ключи: нет
- Внешние ключи: нет

---

#### Таблица: **enrollments** (Заявки на обучение)

```sql
enrollments (
    id INTEGER PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    course_id INTEGER NOT NULL,
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
)
```

**Домены атрибутов:**
- `id` - целое положительное число, автоинкремент
- `full_name` - ФИО клиента, до 255 символов, обязательно
- `phone` - номер телефона, до 20 символов, обязательно
- `email` - адрес электронной почты, до 255 символов, необязательно
- `course_id` - ссылка на курс, целое число, обязательно
- `message` - дополнительное сообщение, текст, необязательно
- `status` - статус заявки (new, processing, completed, cancelled)
- `created_at` - дата и время создания
- `updated_at` - дата и время последнего обновления

**Ключи:**
- Первичный ключ: `id`
- Внешний ключ: `course_id` → `courses(id)` с каскадным удалением

---

### Диаграмма связей (Crow's Foot Notation)

```
┌──────────────────────────┐
│       COURSES            │
│ ─────────────────────    │
│ PK  id                   │
│     title                │
│     category             │
│     description          │
│     duration             │
│     price                │
│     features             │
└────────┬─────────────────┘
         │
         │ 1
         │
         ├───────────┐
         │           │
         │ N         │
         │           │
┌────────▼───────────▼─────┐        ┌──────────────────────────┐
│      ENROLLMENTS         │        │      INSTRUCTORS         │
│ ──────────────────────   │        │ ──────────────────────   │
│ PK  id                   │        │ PK  id                   │
│     full_name            │        │     name                 │
│     phone                │        │     specialization       │
│     email                │        │     experience           │
│ FK  course_id ───────────┤        │     rating               │
│     message              │        │     bio                  │
│     status               │        └──────────────────────────┘
│     created_at           │
│     updated_at           │
└──────────────────────────┘
```

---

## ФИЗИЧЕСКАЯ МОДЕЛЬ ДАННЫХ

### DDL-скрипты создания таблиц

#### 1. Создание таблицы courses

```sql
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    price INTEGER NOT NULL CHECK (price >= 0),
    features TEXT NOT NULL
);

-- Комментарии к таблице и столбцам
COMMENT ON TABLE courses IS 'Справочник курсов обучения вождению';
COMMENT ON COLUMN courses.id IS 'Уникальный идентификатор курса';
COMMENT ON COLUMN courses.title IS 'Название курса';
COMMENT ON COLUMN courses.category IS 'Категория прав (A, B, C, D, BE и т.д.)';
COMMENT ON COLUMN courses.description IS 'Подробное описание программы обучения';
COMMENT ON COLUMN courses.duration IS 'Продолжительность курса в часах';
COMMENT ON COLUMN courses.price IS 'Стоимость курса в рублях';
COMMENT ON COLUMN courses.features IS 'Особенности и преимущества курса (текстовый массив)';
```

#### 2. Создание таблицы instructors

```sql
CREATE TABLE IF NOT EXISTS instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    experience INTEGER NOT NULL CHECK (experience >= 0),
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    bio TEXT NOT NULL
);

-- Комментарии к таблице и столбцам
COMMENT ON TABLE instructors IS 'Справочник инструкторов автошколы';
COMMENT ON COLUMN instructors.id IS 'Уникальный идентификатор инструктора';
COMMENT ON COLUMN instructors.name IS 'Фамилия Имя Отчество инструктора';
COMMENT ON COLUMN instructors.specialization IS 'Специализация (категории, экзамены)';
COMMENT ON COLUMN instructors.experience IS 'Опыт работы в годах';
COMMENT ON COLUMN instructors.rating IS 'Средний рейтинг (0.0 до 5.0)';
COMMENT ON COLUMN instructors.bio IS 'Краткая биография и достижения';
```

#### 3. Создание таблицы enrollments

```sql
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NULL,
    course_id INTEGER NOT NULL,
    message TEXT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_enrollments_course 
        FOREIGN KEY (course_id) 
        REFERENCES courses(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_status 
        CHECK (status IN ('new', 'processing', 'completed', 'cancelled'))
);

-- Комментарии к таблице и столбцам
COMMENT ON TABLE enrollments IS 'Заявки клиентов на обучение';
COMMENT ON COLUMN enrollments.id IS 'Уникальный идентификатор заявки';
COMMENT ON COLUMN enrollments.full_name IS 'Фамилия Имя Отчество клиента';
COMMENT ON COLUMN enrollments.phone IS 'Контактный номер телефона';
COMMENT ON COLUMN enrollments.email IS 'Адрес электронной почты (опционально)';
COMMENT ON COLUMN enrollments.course_id IS 'Ссылка на выбранный курс';
COMMENT ON COLUMN enrollments.message IS 'Дополнительное сообщение от клиента';
COMMENT ON COLUMN enrollments.status IS 'Статус обработки заявки';
COMMENT ON COLUMN enrollments.created_at IS 'Дата и время создания заявки';
COMMENT ON COLUMN enrollments.updated_at IS 'Дата и время последнего обновления';
```

#### 4. Создание индексов

```sql
-- Индекс для связи enrollments -> courses
CREATE INDEX idx_enrollments_course_id 
    ON enrollments(course_id);

-- Индекс для фильтрации по статусу
CREATE INDEX idx_enrollments_status 
    ON enrollments(status);

-- Индекс для сортировки по дате создания
CREATE INDEX idx_enrollments_created_at 
    ON enrollments(created_at DESC);

-- Индекс для поиска по телефону
CREATE INDEX idx_enrollments_phone 
    ON enrollments(phone);

-- Индекс для категорий курсов
CREATE INDEX idx_courses_category 
    ON courses(category);

-- Комментарии к индексам
COMMENT ON INDEX idx_enrollments_course_id IS 'Ускорение JOIN с таблицей courses';
COMMENT ON INDEX idx_enrollments_status IS 'Фильтрация заявок по статусу';
COMMENT ON INDEX idx_enrollments_created_at IS 'Сортировка заявок по дате (DESC)';
COMMENT ON INDEX idx_enrollments_phone IS 'Поиск заявок по номеру телефона';
COMMENT ON INDEX idx_courses_category IS 'Фильтрация курсов по категории';
```

#### 5. Создание триггера для updated_at

```sql
-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер на таблицу enrollments
CREATE TRIGGER trigger_enrollments_updated_at
    BEFORE UPDATE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON FUNCTION update_updated_at_column() IS 
    'Автоматическое обновление временной метки при изменении записи';
```

---

### Типы данных и размеры

| Таблица       | Столбец        | Тип данных      | Размер (байт) | Пример значения                |
|---------------|----------------|-----------------|---------------|--------------------------------|
| courses       | id             | SERIAL          | 4             | 1                              |
| courses       | title          | VARCHAR(255)    | переменный    | "Категория B - Легковые авто" |
| courses       | category       | VARCHAR(50)     | переменный    | "B"                            |
| courses       | description    | TEXT            | переменный    | "Полный курс обучения..."      |
| courses       | duration       | INTEGER         | 4             | 120                            |
| courses       | price          | INTEGER         | 4             | 35000                          |
| courses       | features       | TEXT            | переменный    | "Теория онлайн\nПрактика..."   |
| instructors   | id             | SERIAL          | 4             | 1                              |
| instructors   | name           | VARCHAR(255)    | переменный    | "Иванов Сергей Петрович"      |
| instructors   | specialization | VARCHAR(255)    | переменный    | "Категории B, C"               |
| instructors   | experience     | INTEGER         | 4             | 15                             |
| instructors   | rating         | DECIMAL(2,1)    | 4             | 4.9                            |
| instructors   | bio            | TEXT            | переменный    | "Опытный инструктор..."        |
| enrollments   | id             | SERIAL          | 4             | 1                              |
| enrollments   | full_name      | VARCHAR(255)    | переменный    | "Петрова Анна Ивановна"       |
| enrollments   | phone          | VARCHAR(20)     | переменный    | "+79991234567"                 |
| enrollments   | email          | VARCHAR(255)    | переменный    | "anna@example.com"             |
| enrollments   | course_id      | INTEGER         | 4             | 1                              |
| enrollments   | message        | TEXT            | переменный    | "Хочу учиться вечером"        |
| enrollments   | status         | VARCHAR(50)     | переменный    | "new"                          |
| enrollments   | created_at     | TIMESTAMP       | 8             | 2024-11-16 12:30:00            |
| enrollments   | updated_at     | TIMESTAMP       | 8             | 2024-11-16 12:30:00            |

---

### Настройки производительности

```sql
-- Оптимизация параметров PostgreSQL для OLTP системы

-- Увеличение кеша для часто используемых данных
ALTER TABLE courses SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_analyze_scale_factor = 0.02
);

ALTER TABLE enrollments SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05,
    fillfactor = 90  -- Резерв для UPDATE операций
);

-- Статистика для оптимизатора запросов
ALTER TABLE enrollments ALTER COLUMN status SET STATISTICS 1000;
ALTER TABLE enrollments ALTER COLUMN course_id SET STATISTICS 1000;
```

---

## НОРМАЛИЗАЦИЯ БАЗЫ ДАННЫХ

### Первая нормальная форма (1NF)

**Требования:**
- Все атрибуты атомарны (неделимы)
- Нет повторяющихся групп
- Определён первичный ключ

**Анализ:**

✅ **Таблица courses:**
- Атрибут `features` хранится как TEXT (массив строк через перенос строки)
- Формально нарушает 1NF, но оправдано для простоты (редко изменяется)
- Альтернатива: создать таблицу `course_features` (избыточно для данной задачи)

✅ **Таблица instructors:**
- Все атрибуты атомарны
- Соответствует 1NF

✅ **Таблица enrollments:**
- Все атрибуты атомарны
- Соответствует 1NF

### Вторая нормальная форма (2NF)

**Требования:**
- Соответствие 1NF
- Нет частичных зависимостей (для составных ключей)

**Анализ:**

✅ Все таблицы имеют простые (не составные) первичные ключи
✅ Частичные зависимости невозможны
✅ База данных соответствует 2NF

### Третья нормальная форма (3NF)

**Требования:**
- Соответствие 2NF
- Нет транзитивных зависимостей

**Анализ:**

✅ **Таблица courses:**
- `price` зависит только от `id`, не зависит от других неключевых атрибутов
- Нет транзитивных зависимостей

✅ **Таблица instructors:**
- `rating` рассчитывается независимо, не зависит от `experience`
- Нет транзитивных зависимостей

✅ **Таблица enrollments:**
- Атрибут `course_id` является внешним ключом, а не транзитивной зависимостью
- Атрибуты `full_name`, `phone`, `email` относятся непосредственно к заявке
- Нет транзитивных зависимостей

**Вывод:** База данных соответствует 3NF

### Нормальная форма Бойса-Кодда (BCNF)

**Требования:**
- Соответствие 3NF
- Каждый детерминант является потенциальным ключом

**Анализ:**

✅ В текущей схеме все зависимости определяются первичными ключами
✅ Нет детерминантов, которые не являются потенциальными ключами
✅ База данных соответствует BCNF

---

## ИНДЕКСЫ И ОПТИМИЗАЦИЯ

### Стратегия индексирования

#### Индексы для таблицы enrollments

1. **idx_enrollments_course_id** (B-Tree)
   - Назначение: JOIN с таблицей courses
   - Запрос: `SELECT e.*, c.title FROM enrollments e JOIN courses c ON e.course_id = c.id`
   - Ожидаемая эффективность: 95% запросов используют этот индекс

2. **idx_enrollments_status** (B-Tree)
   - Назначение: Фильтрация по статусу заявки
   - Запрос: `SELECT * FROM enrollments WHERE status = 'new'`
   - Селективность: 4 возможных значения (25% на каждое в среднем)

3. **idx_enrollments_created_at** (B-Tree DESC)
   - Назначение: Сортировка по дате (самые новые первыми)
   - Запрос: `SELECT * FROM enrollments ORDER BY created_at DESC`
   - Используется в 100% выборок для админ-панели

4. **idx_enrollments_phone** (B-Tree)
   - Назначение: Поиск дубликатов, проверка повторных заявок
   - Запрос: `SELECT * FROM enrollments WHERE phone = '+79991234567'`
   - Уникальность: высокая (каждый телефон уникален)

#### Индексы для таблицы courses

1. **idx_courses_category** (B-Tree)
   - Назначение: Фильтрация курсов по категории прав
   - Запрос: `SELECT * FROM courses WHERE category = 'B'`
   - Селективность: 5-10 категорий (10-20% на каждую)

### Анализ покрытия запросов

| Запрос                                      | Индекс                        | Тип сканирования | Стоимость |
|---------------------------------------------|-------------------------------|------------------|-----------|
| `SELECT * FROM enrollments WHERE status=?`  | idx_enrollments_status        | Index Scan       | Низкая    |
| `SELECT * FROM enrollments ORDER BY created`| idx_enrollments_created_at    | Index Scan       | Низкая    |
| `SELECT * FROM enrollments WHERE phone=?`   | idx_enrollments_phone         | Index Scan       | Низкая    |
| `SELECT * FROM courses WHERE category=?`    | idx_courses_category          | Index Scan       | Низкая    |
| `SELECT e.*, c.* FROM enrollments e JOIN...`| idx_enrollments_course_id + PK| Nested Loop      | Средняя   |

### План выполнения критических запросов

#### Запрос 1: Получение заявок с информацией о курсе

```sql
EXPLAIN ANALYZE
SELECT 
    e.*,
    c.title as course_title
FROM enrollments e
LEFT JOIN courses c ON e.course_id = c.id
ORDER BY e.created_at DESC;
```

**Ожидаемый план:**
```
Sort  (cost=X..Y rows=Z)
  Sort Key: e.created_at DESC
  ->  Hash Left Join  (cost=A..B rows=Z)
        Hash Cond: (e.course_id = c.id)
        ->  Index Scan using idx_enrollments_created_at on enrollments e
        ->  Hash
              ->  Seq Scan on courses c
```

**Оптимизация:** Индекс `idx_enrollments_created_at` обеспечивает быструю сортировку

---

## БИЗНЕС-ПРАВИЛА И ОГРАНИЧЕНИЯ

### Ограничения целостности

#### 1. Ссылочная целостность

```sql
-- Заявка должна ссылаться на существующий курс
ALTER TABLE enrollments
    ADD CONSTRAINT fk_enrollments_course
    FOREIGN KEY (course_id) 
    REFERENCES courses(id)
    ON DELETE CASCADE       -- При удалении курса удаляются заявки
    ON UPDATE CASCADE;      -- При изменении ID курса обновляются ссылки
```

**Обоснование:**
- Заявка без курса не имеет смысла
- Каскадное удаление предотвращает "висячие" записи
- В реальной системе лучше использовать `ON DELETE RESTRICT` и архивировать курсы

#### 2. Доменные ограничения

```sql
-- Курс не может иметь отрицательную продолжительность или цену
ALTER TABLE courses
    ADD CONSTRAINT chk_duration_positive CHECK (duration > 0),
    ADD CONSTRAINT chk_price_non_negative CHECK (price >= 0);

-- Рейтинг инструктора в диапазоне 0.0 - 5.0
ALTER TABLE instructors
    ADD CONSTRAINT chk_rating_range CHECK (rating >= 0 AND rating <= 5);

-- Статус заявки из предопределённого списка
ALTER TABLE enrollments
    ADD CONSTRAINT chk_status CHECK (
        status IN ('new', 'processing', 'completed', 'cancelled')
    );

-- Опыт работы не может быть отрицательным
ALTER TABLE instructors
    ADD CONSTRAINT chk_experience_non_negative CHECK (experience >= 0);
```

#### 3. Ограничения на уровне приложения (Flask)

```python
# Валидация телефона (регулярное выражение)
def validate_phone(phone):
    return bool(re.match(r'^\+?[78][\d\s\-\(\)]{9,}$', phone))

# Валидация email (RFC 5322)
def validate_email(email):
    return bool(re.match(
        r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$', 
        email
    ))

# Проверка обязательных полей
if not full_name or not phone or not course_id:
    return jsonify({'error': 'Required fields missing'}), 400

# Нормализация данных (приведение имени к Title Case)
full_name = full_name.strip().title()
```

### Бизнес-правила

#### 1. Управление статусами заявок

| Статус      | Описание                     | Переходы                            |
|-------------|------------------------------|-------------------------------------|
| new         | Новая заявка (только создана)| → processing, cancelled             |
| processing  | Заявка в обработке           | → completed, cancelled              |
| completed   | Обучение завершено           | (конечное состояние)                |
| cancelled   | Заявка отменена              | (конечное состояние)                |

```sql
-- Триггер для проверки допустимых переходов статусов (опционально)
CREATE OR REPLACE FUNCTION check_status_transition()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
        RAISE EXCEPTION 'Cannot change status of completed enrollment';
    END IF;
    
    IF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
        RAISE EXCEPTION 'Cannot change status of cancelled enrollment';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_status_transition
    BEFORE UPDATE OF status ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION check_status_transition();
```

#### 2. Правила формирования цен

```sql
-- Представление для отображения цен со скидками (пример)
CREATE OR REPLACE VIEW courses_with_discounts AS
SELECT 
    id,
    title,
    category,
    description,
    duration,
    price as original_price,
    CASE 
        WHEN duration >= 100 THEN ROUND(price * 0.9)  -- 10% скидка на длинные курсы
        WHEN category = 'A' THEN ROUND(price * 0.95)  -- 5% скидка на мотоциклы
        ELSE price
    END as discounted_price,
    features
FROM courses;

COMMENT ON VIEW courses_with_discounts IS 
    'Курсы с автоматически рассчитанными скидками';
```

#### 3. Правила аудита и логирования

```sql
-- Таблица для аудита изменений заявок
CREATE TABLE enrollments_audit (
    audit_id SERIAL PRIMARY KEY,
    enrollment_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(255)
);

-- Триггер для логирования изменений
CREATE OR REPLACE FUNCTION log_enrollment_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO enrollments_audit (enrollment_id, action, new_data)
        VALUES (NEW.id, 'INSERT', row_to_json(NEW)::jsonb);
        
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO enrollments_audit (enrollment_id, action, old_data, new_data)
        VALUES (NEW.id, 'UPDATE', row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
        
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO enrollments_audit (enrollment_id, action, old_data)
        VALUES (OLD.id, 'DELETE', row_to_json(OLD)::jsonb);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_enrollments
    AFTER INSERT OR UPDATE OR DELETE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION log_enrollment_changes();
```

---

## ПРИЛОЖЕНИЕ: SQL-СКРИПТЫ

### A. Полный скрипт создания БД

```sql
-- ============================================
-- Создание базы данных "АвтоПрофи"
-- Версия: 1.0
-- Дата: 2024-11-16
-- ============================================

-- 1. Создание таблиц
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    price INTEGER NOT NULL CHECK (price >= 0),
    features TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    experience INTEGER NOT NULL CHECK (experience >= 0),
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    bio TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NULL,
    course_id INTEGER NOT NULL,
    message TEXT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_enrollments_course 
        FOREIGN KEY (course_id) 
        REFERENCES courses(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_status 
        CHECK (status IN ('new', 'processing', 'completed', 'cancelled'))
);

-- 2. Создание индексов
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_created_at ON enrollments(created_at DESC);
CREATE INDEX idx_enrollments_phone ON enrollments(phone);
CREATE INDEX idx_courses_category ON courses(category);

-- 3. Создание триггеров
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

-- 4. Заполнение тестовыми данными
INSERT INTO courses (title, category, description, duration, price, features) VALUES
('Категория B - Легковые автомобили', 'B', 'Полный курс обучения вождению легкового автомобиля с механической или автоматической коробкой передач.', 120, 35000, E'Теория онлайн\nПрактика на новых авто\nПомощь с ГИБДД\nГарантия сдачи экзамена'),
('Категория A - Мотоциклы', 'A', 'Обучение вождению мотоцикла, включая теоретическую и практическую части.', 80, 25000, E'Современные мотоциклы\nЭкипировка предоставляется\nМалые группы\nГибкий график'),
('Категория C - Грузовые автомобили', 'C', 'Профессиональная подготовка водителей грузовых автомобилей.', 150, 45000, E'Грузовики MAN, Volvo\nОпытные инструкторы\nПомощь в трудоустройстве\nДокументы ДОПОГ');

INSERT INTO instructors (name, specialization, experience, rating, bio) VALUES
('Иванов Сергей Петрович', 'Категории B, C', 15, 4.9, 'Опытный инструктор с 15-летним стажем. Специализируется на обучении начинающих водителей. Имеет награды за безаварийную работу.'),
('Петрова Анна Михайловна', 'Категория B (автомат)', 8, 4.8, 'Терпеливый и внимательный инструктор. Особый подход к студентам, которые боятся дороги. 98% учеников сдают экзамен с первого раза.'),
('Смирнов Дмитрий Александрович', 'Категория A', 12, 5.0, 'Мастер спорта по мотоспорту. Обучает безопасной езде на мотоцикле в любых условиях. Проводит дополнительные занятия по экстремальному вождению.');

-- 5. Комментарии к объектам БД
COMMENT ON TABLE courses IS 'Справочник курсов обучения вождению';
COMMENT ON TABLE instructors IS 'Справочник инструкторов автошколы';
COMMENT ON TABLE enrollments IS 'Заявки клиентов на обучение';

-- ============================================
-- Конец скрипта
-- ============================================
```

### B. Скрипт тестовых запросов

```sql
-- ============================================
-- Тестовые SQL-запросы для проверки БД
-- ============================================

-- 1. Количество заявок по статусам
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM enrollments
GROUP BY status
ORDER BY count DESC;

-- 2. Популярность курсов (количество заявок)
SELECT 
    c.title,
    c.category,
    COUNT(e.id) as enrollments_count,
    c.price,
    COUNT(e.id) * c.price as potential_revenue
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.title, c.category, c.price
ORDER BY enrollments_count DESC;

-- 3. Активность по дням (последние 30 дней)
SELECT 
    DATE(created_at) as date,
    COUNT(*) as enrollments_count
FROM enrollments
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 4. Средний рейтинг инструкторов по специализациям
SELECT 
    specialization,
    AVG(rating) as avg_rating,
    COUNT(*) as instructors_count,
    AVG(experience) as avg_experience
FROM instructors
GROUP BY specialization
ORDER BY avg_rating DESC;

-- 5. Заявки с полной информацией о курсе
SELECT 
    e.id,
    e.full_name,
    e.phone,
    e.email,
    c.title as course,
    c.price,
    e.status,
    e.created_at,
    EXTRACT(DAY FROM CURRENT_TIMESTAMP - e.created_at) as days_ago
FROM enrollments e
JOIN courses c ON e.course_id = c.id
ORDER BY e.created_at DESC
LIMIT 10;

-- 6. Анализ заполненности email (опциональное поле)
SELECT 
    COUNT(*) as total_enrollments,
    COUNT(email) as with_email,
    COUNT(*) - COUNT(email) as without_email,
    ROUND(COUNT(email) * 100.0 / COUNT(*), 2) as email_fill_rate
FROM enrollments;

-- ============================================
-- Конец скрипта
-- ============================================
```

---

## ВЫВОДЫ

### Характеристики спроектированной БД

1. **Нормализация:** соответствует 3NF и BCNF
2. **Целостность:** обеспечена через PK, FK и CHECK constraints
3. **Производительность:** оптимизирована через систему индексов
4. **Масштабируемость:** архитектура допускает расширение (добавление таблиц расписаний, платежей, отзывов)
5. **Аудит:** возможность логирования всех изменений

### Рекомендации по развитию

**Ближайшие улучшения:**
1. Добавить таблицу `schedules` (расписание занятий)
2. Создать связь `instructors ↔ courses` (многие-ко-многим)
3. Реализовать таблицу `payments` (платежи и транзакции)
4. Добавить таблицу `reviews` (отзывы студентов)

**Долгосрочные цели:**
1. Внедрение полнотекстового поиска (PostgreSQL FTS)
2. Партиционирование таблицы `enrollments` по дате
3. Репликация БД для высокой доступности
4. Интеграция с внешними системами (CRM, 1С)

---

**Документ подготовлен:** 2024-11-16  
**Версия:** 1.0  
**Автор:** АвтоПрофи - Отдел разработки
