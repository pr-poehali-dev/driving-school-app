# РУКОВОДСТВА ПО РАБОТЕ С БАЗОЙ ДАННЫХ POSTGRESQL
## Автошкола "АвтоПрофи" - Практические гайды администрирования БД

---

## 1. ПРИМЕНЕНИЕ И СОЗДАНИЕ ТРИГГЕРОВ

### 1.1 Что такое триггеры?

**Триггер** - это функция базы данных, которая автоматически выполняется при возникновении определённых событий (INSERT, UPDATE, DELETE).

### 1.2 Триггер автоматического обновления даты изменения

**Задача:** Автоматически обновлять поле `updated_at` при изменении записи в таблице `enrollments`.

**Шаг 1: Создание функции триггера**

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Шаг 2: Создание триггера**

```sql
CREATE TRIGGER trigger_enrollments_updated_at
BEFORE UPDATE ON t_p22853855_driving_school_app.enrollments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**Проверка работы:**

```sql
-- Обновить статус заявки
UPDATE t_p22853855_driving_school_app.enrollments 
SET status = 'processed' 
WHERE id = 1;

-- Проверить, что updated_at автоматически обновилось
SELECT id, status, created_at, updated_at 
FROM t_p22853855_driving_school_app.enrollments 
WHERE id = 1;
```

### 1.3 Триггер проверки данных перед вставкой

**Задача:** Валидировать телефон перед добавлением заявки.

```sql
CREATE OR REPLACE FUNCTION validate_phone_before_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.phone !~ '^\+?[78][\d\s\-\(\)]{9,}$' THEN
        RAISE EXCEPTION 'Некорректный формат телефона: %', NEW.phone;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_phone
BEFORE INSERT ON t_p22853855_driving_school_app.enrollments
FOR EACH ROW
EXECUTE FUNCTION validate_phone_before_insert();
```

### 1.4 Триггер логирования изменений статуса заявки

**Задача:** Записывать все изменения статуса заявок в отдельную таблицу.

**Шаг 1: Создать таблицу логов**

```sql
CREATE TABLE t_p22853855_driving_school_app.enrollment_status_logs (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(100)
);
```

**Шаг 2: Создать триггер**

```sql
CREATE OR REPLACE FUNCTION log_enrollment_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO t_p22853855_driving_school_app.enrollment_status_logs 
        (enrollment_id, old_status, new_status)
        VALUES (OLD.id, OLD.status, NEW.status);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_status_change
AFTER UPDATE ON t_p22853855_driving_school_app.enrollments
FOR EACH ROW
EXECUTE FUNCTION log_enrollment_status_change();
```

### 1.5 Управление триггерами

**Список всех триггеров:**

```sql
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers
WHERE trigger_schema = 't_p22853855_driving_school_app';
```

**Отключить триггер:**

```sql
ALTER TABLE t_p22853855_driving_school_app.enrollments 
DISABLE TRIGGER trigger_enrollments_updated_at;
```

**Включить триггер:**

```sql
ALTER TABLE t_p22853855_driving_school_app.enrollments 
ENABLE TRIGGER trigger_enrollments_updated_at;
```

**Удалить триггер:**

```sql
DROP TRIGGER IF EXISTS trigger_enrollments_updated_at 
ON t_p22853855_driving_school_app.enrollments;
```

---

## 2. СОЗДАНИЕ ПОЛЬЗОВАТЕЛЕЙ

### 2.1 Создание пользователя для приложения

```sql
-- Создать пользователя с паролем
CREATE USER app_autoprofi WITH PASSWORD 'SecurePassword123!';

-- Создать пользователя для чтения (аналитики)
CREATE USER analytics_user WITH PASSWORD 'ReadOnly456!';

-- Создать администратора БД
CREATE USER db_admin WITH PASSWORD 'AdminPass789!' 
CREATEDB CREATEROLE;
```

### 2.2 Изменение пароля пользователя

```sql
ALTER USER app_autoprofi WITH PASSWORD 'NewSecurePassword456!';
```

### 2.3 Просмотр всех пользователей

```sql
SELECT 
    usename AS username,
    usecreatedb AS can_create_db,
    usesuper AS is_superuser,
    valuntil AS password_expiry
FROM pg_user
ORDER BY usename;
```

### 2.4 Удаление пользователя

```sql
-- Сначала отозвать все привилегии
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA t_p22853855_driving_school_app 
FROM app_autoprofi;

-- Затем удалить пользователя
DROP USER app_autoprofi;
```

---

## 3. РОЛИ И ПРИВИЛЕГИИ

### 3.1 Создание ролей

**Роль 1: Администратор автошколы (полный доступ)**

```sql
CREATE ROLE autoprofi_admin;

GRANT ALL PRIVILEGES ON SCHEMA t_p22853855_driving_school_app 
TO autoprofi_admin;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA t_p22853855_driving_school_app 
TO autoprofi_admin;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA t_p22853855_driving_school_app 
TO autoprofi_admin;
```

**Роль 2: Менеджер (чтение и изменение заявок)**

```sql
CREATE ROLE autoprofi_manager;

GRANT USAGE ON SCHEMA t_p22853855_driving_school_app TO autoprofi_manager;

GRANT SELECT, INSERT, UPDATE ON t_p22853855_driving_school_app.enrollments 
TO autoprofi_manager;

GRANT SELECT ON t_p22853855_driving_school_app.courses 
TO autoprofi_manager;

GRANT SELECT ON t_p22853855_driving_school_app.instructors 
TO autoprofi_manager;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA t_p22853855_driving_school_app 
TO autoprofi_manager;
```

**Роль 3: Аналитик (только чтение)**

```sql
CREATE ROLE autoprofi_analyst;

GRANT USAGE ON SCHEMA t_p22853855_driving_school_app TO autoprofi_analyst;

GRANT SELECT ON ALL TABLES IN SCHEMA t_p22853855_driving_school_app 
TO autoprofi_analyst;
```

### 3.2 Назначение ролей пользователям

```sql
-- Дать пользователю роль администратора
GRANT autoprofi_admin TO db_admin;

-- Дать пользователю роль менеджера
GRANT autoprofi_manager TO app_autoprofi;

-- Дать пользователю роль аналитика
GRANT autoprofi_analyst TO analytics_user;
```

### 3.3 Отзыв привилегий

```sql
-- Отозвать привилегии на таблицу
REVOKE INSERT, UPDATE, DELETE ON t_p22853855_driving_school_app.courses 
FROM autoprofi_manager;

-- Отозвать роль у пользователя
REVOKE autoprofi_manager FROM app_autoprofi;
```

### 3.4 Просмотр привилегий

```sql
-- Привилегии на таблицах
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 't_p22853855_driving_school_app'
ORDER BY grantee, table_name;

-- Роли пользователя
SELECT 
    r.rolname AS role_name,
    m.rolname AS member_of
FROM pg_roles r
LEFT JOIN pg_auth_members am ON r.oid = am.member
LEFT JOIN pg_roles m ON am.roleid = m.oid
WHERE r.rolname = 'app_autoprofi';
```

### 3.5 Матрица доступа (рекомендуемая)

| Роль              | courses | enrollments | instructors | Операции             |
|-------------------|---------|-------------|-------------|----------------------|
| autoprofi_admin   | ✅ CRUD | ✅ CRUD     | ✅ CRUD     | Полный доступ        |
| autoprofi_manager | ✅ R    | ✅ CRU      | ✅ R        | Управление заявками  |
| autoprofi_analyst | ✅ R    | ✅ R        | ✅ R        | Только чтение        |

**Легенда:** C - Create, R - Read, U - Update, D - Delete

---

## 4. ЖУРНАЛИЗАЦИЯ ИЗМЕНЕНИЙ

### 4.1 Создание универсальной таблицы аудита

```sql
CREATE TABLE t_p22853855_driving_school_app.audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    record_id INTEGER,
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_table_name ON t_p22853855_driving_school_app.audit_log(table_name);
CREATE INDEX idx_audit_log_operation ON t_p22853855_driving_school_app.audit_log(operation);
CREATE INDEX idx_audit_log_changed_at ON t_p22853855_driving_school_app.audit_log(changed_at DESC);
```

### 4.2 Универсальная функция аудита

```sql
CREATE OR REPLACE FUNCTION t_p22853855_driving_school_app.audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO t_p22853855_driving_school_app.audit_log 
        (table_name, operation, record_id, old_data, changed_by)
        VALUES (
            TG_TABLE_NAME, 
            'DELETE', 
            OLD.id, 
            row_to_json(OLD)::jsonb,
            current_user
        );
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO t_p22853855_driving_school_app.audit_log 
        (table_name, operation, record_id, old_data, new_data, changed_by)
        VALUES (
            TG_TABLE_NAME, 
            'UPDATE', 
            NEW.id, 
            row_to_json(OLD)::jsonb,
            row_to_json(NEW)::jsonb,
            current_user
        );
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO t_p22853855_driving_school_app.audit_log 
        (table_name, operation, record_id, new_data, changed_by)
        VALUES (
            TG_TABLE_NAME, 
            'INSERT', 
            NEW.id, 
            row_to_json(NEW)::jsonb,
            current_user
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### 4.3 Подключение аудита к таблицам

```sql
-- Аудит таблицы enrollments
CREATE TRIGGER audit_enrollments
AFTER INSERT OR UPDATE OR DELETE ON t_p22853855_driving_school_app.enrollments
FOR EACH ROW
EXECUTE FUNCTION t_p22853855_driving_school_app.audit_trigger_func();

-- Аудит таблицы courses
CREATE TRIGGER audit_courses
AFTER INSERT OR UPDATE OR DELETE ON t_p22853855_driving_school_app.courses
FOR EACH ROW
EXECUTE FUNCTION t_p22853855_driving_school_app.audit_trigger_func();

-- Аудит таблицы instructors
CREATE TRIGGER audit_instructors
AFTER INSERT OR UPDATE OR DELETE ON t_p22853855_driving_school_app.instructors
FOR EACH ROW
EXECUTE FUNCTION t_p22853855_driving_school_app.audit_trigger_func();
```

### 4.4 Примеры запросов к логу аудита

**Все изменения за последний день:**

```sql
SELECT 
    table_name,
    operation,
    record_id,
    changed_by,
    changed_at
FROM t_p22853855_driving_school_app.audit_log
WHERE changed_at >= CURRENT_DATE
ORDER BY changed_at DESC;
```

**История изменений конкретной заявки:**

```sql
SELECT 
    operation,
    old_data->>'status' AS old_status,
    new_data->>'status' AS new_status,
    changed_by,
    changed_at
FROM t_p22853855_driving_school_app.audit_log
WHERE table_name = 'enrollments' AND record_id = 1
ORDER BY changed_at DESC;
```

**Статистика изменений по таблицам:**

```sql
SELECT 
    table_name,
    operation,
    COUNT(*) AS count,
    MAX(changed_at) AS last_change
FROM t_p22853855_driving_school_app.audit_log
GROUP BY table_name, operation
ORDER BY table_name, operation;
```

---

## 5. УГРОЗЫ БЕЗОПАСНОСТИ СЕРВЕРА БАЗ ДАННЫХ

### 5.1 Основные угрозы

#### Угроза 1: SQL Injection (SQL-инъекции)

**Описание:** Вредоносный SQL-код, внедряемый через пользовательский ввод.

**Пример уязвимого кода (Python):**
```python
# ❌ НЕБЕЗОПАСНО!
cursor.execute(f"SELECT * FROM enrollments WHERE phone = '{phone}'")
```

**Безопасный вариант:**
```python
# ✅ БЕЗОПАСНО
cursor.execute("SELECT * FROM enrollments WHERE phone = %s", (phone,))
```

**Защита:**
- Всегда использовать параметризованные запросы
- Валидировать пользовательский ввод
- Использовать ORM (SQLAlchemy, Django ORM)

#### Угроза 2: Утечка учётных данных

**Опасность:**
- База данных в коде: `DATABASE_URL = "postgresql://user:password@host/db"`
- Доступ к незащищённой БД из интернета

**Защита:**
```python
# ✅ Использовать переменные окружения
import os
DATABASE_URL = os.environ.get('DATABASE_URL')
```

**Рекомендации:**
- Хранить пароли в `.env` файлах (не коммитить в Git!)
- Использовать секреты (Vault, AWS Secrets Manager)
- Регулярно менять пароли

#### Угроза 3: Отсутствие шифрования соединения

**Опасность:** Перехват данных при передаче

**Защита:**
```python
# ✅ Использовать SSL/TLS
DATABASE_URL = "postgresql://...?sslmode=require"
```

#### Угроза 4: Избыточные привилегии

**Опасность:** Приложение подключается от имени суперпользователя

**Защита:**
- Создавать отдельных пользователей для каждого приложения
- Выдавать минимальные необходимые привилегии (принцип наименьших привилегий)
- Использовать роли вместо прямых привилегий

#### Угроза 5: Отсутствие резервного копирования

**Опасность:** Потеря данных при сбое, атаке ransomware

**Защита:**
```bash
# Автоматическое резервное копирование
pg_dump -h host -U user -d database > backup_$(date +%Y%m%d).sql

# Восстановление
psql -h host -U user -d database < backup_20231117.sql
```

### 5.2 Чек-лист безопасности

- [ ] Параметризованные запросы во всём коде
- [ ] Пароли БД в переменных окружения
- [ ] SSL/TLS для подключения к БД
- [ ] Принцип наименьших привилегий для пользователей
- [ ] Регулярные резервные копии (автоматизировано)
- [ ] Логирование всех подключений и критичных операций
- [ ] Файрвол для ограничения доступа к порту PostgreSQL
- [ ] Обновление PostgreSQL до последней стабильной версии
- [ ] Мониторинг подозрительной активности
- [ ] Шифрование чувствительных данных (паспорта, карты)

### 5.3 Настройка pg_hba.conf для безопасности

```conf
# Разрешить подключение только с конкретных IP
host    autoprofi    app_user    192.168.1.100/32    md5

# Запретить подключение суперпользователя по сети
local   all          postgres                         peer
host    all          postgres    0.0.0.0/0            reject

# Обязательное SSL-соединение
hostssl all          all         0.0.0.0/0            md5
```

---

## 6. ЭКСПОРТ И ИМПОРТ ДАННЫХ

### 6.1 Экспорт всей базы данных

**Полный дамп структуры и данных:**

```bash
pg_dump -h dpg-d4bomnbipnbc7390422g-a.oregon-postgres.render.com \
        -U autoprofi_user \
        -d autoprofi \
        -F c \
        -f autoprofi_full_backup_$(date +%Y%m%d).dump
```

**Только схема (без данных):**

```bash
pg_dump -h dpg-d4bomnbipnbc7390422g-a.oregon-postgres.render.com \
        -U autoprofi_user \
        -d autoprofi \
        --schema-only \
        -f autoprofi_schema.sql
```

**Только данные (без схемы):**

```bash
pg_dump -h dpg-d4bomnbipnbc7390422g-a.oregon-postgres.render.com \
        -U autoprofi_user \
        -d autoprofi \
        --data-only \
        -f autoprofi_data.sql
```

### 6.2 Экспорт конкретной таблицы

**Экспорт таблицы enrollments:**

```bash
pg_dump -h dpg-d4bomnbipnbc7390422g-a.oregon-postgres.render.com \
        -U autoprofi_user \
        -d autoprofi \
        -t t_p22853855_driving_school_app.enrollments \
        -f enrollments_backup.sql
```

### 6.3 Импорт данных

**Восстановление из дампа (custom format):**

```bash
pg_restore -h localhost \
           -U postgres \
           -d autoprofi_new \
           -c \
           autoprofi_full_backup_20231117.dump
```

**Восстановление из SQL-файла:**

```bash
psql -h localhost \
     -U postgres \
     -d autoprofi_new \
     -f autoprofi_schema.sql
```

### 6.4 Экспорт в CSV

**Экспорт таблицы в CSV:**

```sql
COPY t_p22853855_driving_school_app.enrollments 
TO '/tmp/enrollments.csv' 
DELIMITER ',' 
CSV HEADER;
```

**Экспорт результата запроса в CSV:**

```sql
COPY (
    SELECT 
        e.id,
        e.full_name,
        e.phone,
        c.title AS course_title,
        e.status,
        e.created_at
    FROM t_p22853855_driving_school_app.enrollments e
    LEFT JOIN t_p22853855_driving_school_app.courses c ON e.course_id = c.id
    WHERE e.created_at >= '2023-01-01'
) TO '/tmp/enrollments_report.csv' DELIMITER ',' CSV HEADER;
```

### 6.5 Импорт из CSV

**Импорт CSV в таблицу:**

```sql
COPY t_p22853855_driving_school_app.enrollments 
(full_name, phone, email, course_id, message, status)
FROM '/tmp/enrollments_import.csv' 
DELIMITER ',' 
CSV HEADER;
```

### 6.6 Экспорт в JSON (Python)

```python
import psycopg2
import json

conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

cursor.execute("SELECT * FROM t_p22853855_driving_school_app.enrollments")
columns = [desc[0] for desc in cursor.description]
results = cursor.fetchall()

data = [dict(zip(columns, row)) for row in results]

with open('enrollments.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2, default=str)

cursor.close()
conn.close()
print("Данные экспортированы в enrollments.json")
```

### 6.7 Автоматическое резервное копирование (cron)

**Создать скрипт backup.sh:**

```bash
#!/bin/bash
BACKUP_DIR="/backups/autoprofi"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="autoprofi_backup_$DATE.dump"

pg_dump -h dpg-d4bomnbipnbc7390422g-a.oregon-postgres.render.com \
        -U autoprofi_user \
        -d autoprofi \
        -F c \
        -f "$BACKUP_DIR/$FILENAME"

# Удалить резервные копии старше 7 дней
find $BACKUP_DIR -name "*.dump" -mtime +7 -delete

echo "Резервная копия создана: $FILENAME"
```

**Добавить в crontab (каждый день в 3:00 ночи):**

```bash
0 3 * * * /path/to/backup.sh >> /var/log/autoprofi_backup.log 2>&1
```

---

## 7. ПРАКТИЧЕСКИЕ ПРИМЕРЫ ДЛЯ АВТОШКОЛЫ

### 7.1 Создание еженедельного отчёта по заявкам

```sql
-- Экспорт отчёта за неделю
COPY (
    SELECT 
        DATE(e.created_at) AS date,
        c.category,
        COUNT(*) AS applications,
        SUM(CASE WHEN e.status = 'processed' THEN 1 ELSE 0 END) AS processed,
        SUM(c.price) AS potential_revenue
    FROM t_p22853855_driving_school_app.enrollments e
    LEFT JOIN t_p22853855_driving_school_app.courses c ON e.course_id = c.id
    WHERE e.created_at >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY DATE(e.created_at), c.category
    ORDER BY date DESC, category
) TO '/tmp/weekly_report.csv' DELIMITER ',' CSV HEADER;
```

### 7.2 Резервное копирование перед миграцией

```bash
# Создать резервную копию перед обновлением схемы
pg_dump -h host -U user -d autoprofi \
        -F c \
        -f pre_migration_backup_$(date +%Y%m%d).dump

# Применить миграцию
psql -h host -U user -d autoprofi -f migration_v2.sql

# Если что-то пошло не так - восстановить
pg_restore -h host -U user -d autoprofi -c pre_migration_backup_20231117.dump
```

---

## 8. МОНИТОРИНГ И ОБСЛУЖИВАНИЕ

### 8.1 Проверка размера таблиц

```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 't_p22853855_driving_school_app'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 8.2 Очистка старых записей аудита

```sql
-- Удалить записи аудита старше 1 года
DELETE FROM t_p22853855_driving_school_app.audit_log
WHERE changed_at < CURRENT_DATE - INTERVAL '1 year';

-- Очистить таблицу с освобождением места
VACUUM FULL t_p22853855_driving_school_app.audit_log;
```

### 8.3 Анализ производительности запросов

```sql
-- Включить логирование медленных запросов (в postgresql.conf)
-- log_min_duration_statement = 1000  # миллисекунды

-- Анализ плана выполнения запроса
EXPLAIN ANALYZE
SELECT 
    e.*,
    c.title as course_title
FROM t_p22853855_driving_school_app.enrollments e
LEFT JOIN t_p22853855_driving_school_app.courses c ON e.course_id = c.id
ORDER BY e.created_at DESC;
```

---

**Дата создания:** 2025-11-17  
**Версия документа:** 1.0  
**СУБД:** PostgreSQL 14+
