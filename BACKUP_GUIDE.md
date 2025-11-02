# Руководство по автоматическому бэкапу PostgreSQL

## Содержание
1. [Ручной бэкап](#ручной-бэкап)
2. [Автоматический бэкап через cron (Linux/macOS)](#автоматический-бэкап-через-cron)
3. [Автоматический бэкап через Task Scheduler (Windows)](#автоматический-бэкап-через-windows-task-scheduler)
4. [Бэкап через облачные функции](#бэкап-через-облачные-функции)
5. [Восстановление из бэкапа](#восстановление-из-бэкапа)

---

## Ручной бэкап

### Простой бэкап через pg_dump

```bash
# Установи переменную окружения с подключением
export DATABASE_URL="postgresql://user:password@host:port/database"

# Создай папку для бэкапов
mkdir -p ~/backups/avtoprofi

# Создай бэкап
pg_dump $DATABASE_URL > ~/backups/avtoprofi/backup_$(date +%Y%m%d_%H%M%S).sql

# Или сжатый бэкап (занимает меньше места)
pg_dump $DATABASE_URL | gzip > ~/backups/avtoprofi/backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Бэкап только данных (без структуры)

```bash
pg_dump --data-only $DATABASE_URL > backup_data_only.sql
```

### Бэкап только структуры (без данных)

```bash
pg_dump --schema-only $DATABASE_URL > backup_schema_only.sql
```

### Бэкап конкретных таблиц

```bash
pg_dump -t courses -t instructors $DATABASE_URL > backup_courses_instructors.sql
```

---

## Автоматический бэкап через cron

### Для Linux и macOS

#### Шаг 1: Создай скрипт бэкапа

```bash
# Создай файл скрипта
nano ~/backup_avtoprofi.sh
```

Содержимое скрипта:

```bash
#!/bin/bash

# Настройки
DATABASE_URL="postgresql://user:password@host:port/database"
BACKUP_DIR="$HOME/backups/avtoprofi"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql.gz"
LOG_FILE="$BACKUP_DIR/backup.log"

# Максимальное количество бэкапов (удалять старые)
MAX_BACKUPS=30

# Создай папку если её нет
mkdir -p "$BACKUP_DIR"

# Запиши в лог начало
echo "$(date): Начало бэкапа..." >> "$LOG_FILE"

# Создай бэкап
if pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"; then
    echo "$(date): Бэкап успешно создан: $BACKUP_FILE" >> "$LOG_FILE"
    
    # Удали старые бэкапы (оставь только последние MAX_BACKUPS)
    ls -t "$BACKUP_DIR"/backup_*.sql.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm
    echo "$(date): Старые бэкапы очищены" >> "$LOG_FILE"
else
    echo "$(date): ОШИБКА при создании бэкапа!" >> "$LOG_FILE"
    exit 1
fi

# Проверка размера бэкапа
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "$(date): Размер бэкапа: $BACKUP_SIZE" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"
```

#### Шаг 2: Сделай скрипт исполняемым

```bash
chmod +x ~/backup_avtoprofi.sh
```

#### Шаг 3: Протестируй скрипт

```bash
~/backup_avtoprofi.sh
```

#### Шаг 4: Настрой автоматический запуск через cron

```bash
# Открой редактор cron
crontab -e
```

Добавь одну из строк (в зависимости от нужной частоты):

```bash
# Каждый день в 3:00 ночи
0 3 * * * /home/username/backup_avtoprofi.sh

# Каждые 6 часов
0 */6 * * * /home/username/backup_avtoprofi.sh

# Каждый час
0 * * * * /home/username/backup_avtoprofi.sh

# Каждый понедельник в 2:00
0 2 * * 1 /home/username/backup_avtoprofi.sh

# Каждый день в 3:00 и 15:00
0 3,15 * * * /home/username/backup_avtoprofi.sh
```

**Формат cron:**
```
* * * * * команда
│ │ │ │ │
│ │ │ │ └─── День недели (0-7, где 0 и 7 = воскресенье)
│ │ │ └───── Месяц (1-12)
│ │ └─────── День месяца (1-31)
│ └───────── Час (0-23)
└─────────── Минута (0-59)
```

#### Шаг 5: Проверь что cron работает

```bash
# Посмотри список задач cron
crontab -l

# Проверь логи cron (Linux)
grep CRON /var/log/syslog

# Проверь лог бэкапов
tail -f ~/backups/avtoprofi/backup.log
```

---

## Автоматический бэкап через Windows Task Scheduler

### Шаг 1: Создай PowerShell скрипт

Создай файл `C:\Scripts\backup_avtoprofi.ps1`:

```powershell
# Настройки
$DATABASE_URL = "postgresql://user:password@host:port/database"
$BACKUP_DIR = "C:\Backups\AvtoProfi"
$DATE = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_FILE = "$BACKUP_DIR\backup_$DATE.sql.gz"
$LOG_FILE = "$BACKUP_DIR\backup.log"
$MAX_BACKUPS = 30

# Создай папку
New-Item -ItemType Directory -Force -Path $BACKUP_DIR | Out-Null

# Запиши в лог
Add-Content $LOG_FILE "$(Get-Date): Начало бэкапа..."

# Создай бэкап (требуется установленный PostgreSQL)
try {
    & "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" $DATABASE_URL | & gzip > $BACKUP_FILE
    Add-Content $LOG_FILE "$(Get-Date): Бэкап создан: $BACKUP_FILE"
    
    # Удали старые бэкапы
    Get-ChildItem -Path $BACKUP_DIR -Filter "backup_*.sql.gz" | 
        Sort-Object LastWriteTime -Descending | 
        Select-Object -Skip $MAX_BACKUPS | 
        Remove-Item
    
    Add-Content $LOG_FILE "$(Get-Date): Старые бэкапы очищены"
}
catch {
    Add-Content $LOG_FILE "$(Get-Date): ОШИБКА: $_"
    exit 1
}

Add-Content $LOG_FILE "---"
```

### Шаг 2: Настрой Task Scheduler

1. Открой **Task Scheduler** (Планировщик заданий)
2. Нажми **Create Basic Task** (Создать простую задачу)
3. **Name**: "AvtoProfi Backup"
4. **Trigger**: Daily (Ежедневно) в 03:00
5. **Action**: Start a program
   - **Program**: `powershell.exe`
   - **Arguments**: `-ExecutionPolicy Bypass -File "C:\Scripts\backup_avtoprofi.ps1"`
6. Нажми **Finish**

### Шаг 3: Дополнительные настройки

1. Открой созданную задачу → **Properties**
2. Вкладка **General**:
   - ✅ **Run whether user is logged on or not**
   - ✅ **Run with highest privileges**
3. Вкладка **Settings**:
   - ✅ **Run task as soon as possible after a scheduled start is missed**

---

## Бэкап через облачные функции

### Вариант 1: Backend функция для ручного бэкапа

Создай файл `/backend/backup-database/index.py`:

```python
import os
import subprocess
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Создание бэкапа базы данных
    Args: event - HTTP запрос
    Returns: Статус выполнения бэкапа
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': '{"error": "Method not allowed"}'
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': '{"error": "DATABASE_URL not configured"}'
        }
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_filename = f'backup_{timestamp}.sql'
    
    try:
        # Создай бэкап через pg_dump
        result = subprocess.run(
            ['pg_dump', database_url],
            capture_output=True,
            text=True,
            check=True
        )
        
        backup_data = result.stdout
        backup_size = len(backup_data)
        
        # Здесь можно загрузить в S3 или другое хранилище
        # Для примера просто возвращаем статус
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': f'{{"success": true, "filename": "{backup_filename}", "size": {backup_size}}}'
        }
        
    except subprocess.CalledProcessError as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': f'{{"error": "Backup failed: {str(e)}"}}'
        }
```

### Вариант 2: Scheduled бэкап через Яндекс.Облако

Если у тебя есть доступ к Yandex Cloud Console:

1. Перейди в **Managed Service for PostgreSQL**
2. Выбери свой кластер
3. Вкладка **Backup**
4. Настрой автоматические бэкапы:
   - **Backup time**: 03:00
   - **Retention**: 7 дней

---

## Восстановление из бэкапа

### Восстановление обычного бэкапа

```bash
# Если бэкап не сжатый (.sql)
psql $DATABASE_URL < backup_20251102_030000.sql

# Если бэкап сжатый (.sql.gz)
gunzip -c backup_20251102_030000.sql.gz | psql $DATABASE_URL
```

### Восстановление в новую базу

```bash
# Создай новую базу
createdb avtoprofi_restore

# Восстанови данные
psql postgresql://user:pass@host:port/avtoprofi_restore < backup.sql
```

### Восстановление конкретной таблицы

```bash
# Извлеки данные одной таблицы из бэкапа
pg_restore -t courses backup.sql | psql $DATABASE_URL
```

### Восстановление с очисткой базы

```bash
# ВНИМАНИЕ: это удалит все текущие данные!
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql $DATABASE_URL < backup.sql
```

---

## Бэкап в облачное хранилище

### Бэкап в Яндекс.Диск через rclone

```bash
# Установи rclone
curl https://rclone.org/install.sh | sudo bash

# Настрой Яндекс.Диск
rclone config

# Создай бэкап и отправь на Яндекс.Диск
pg_dump $DATABASE_URL | gzip | rclone rcat yandex:Backups/AvtoProfi/backup_$(date +%Y%m%d).sql.gz
```

### Бэкап в Google Drive

```bash
# Настрой Google Drive в rclone
rclone config

# Отправь бэкап
pg_dump $DATABASE_URL | gzip | rclone rcat gdrive:Backups/backup_$(date +%Y%m%d).sql.gz
```

---

## Мониторинг бэкапов

### Скрипт проверки свежести бэкапа

```bash
#!/bin/bash

BACKUP_DIR="$HOME/backups/avtoprofi"
MAX_AGE_HOURS=24

# Найди последний бэкап
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/backup_*.sql.gz | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "ОШИБКА: Бэкапы не найдены!"
    exit 1
fi

# Проверь возраст
AGE_SECONDS=$(( $(date +%s) - $(stat -f %m "$LATEST_BACKUP") ))
AGE_HOURS=$(( AGE_SECONDS / 3600 ))

if [ $AGE_HOURS -gt $MAX_AGE_HOURS ]; then
    echo "ПРЕДУПРЕЖДЕНИЕ: Последний бэкап старше $MAX_AGE_HOURS часов!"
    echo "Последний бэкап: $LATEST_BACKUP ($AGE_HOURS часов назад)"
    exit 1
else
    echo "OK: Последний бэкап создан $AGE_HOURS часов назад"
fi
```

---

## Рекомендации по безопасности

1. **Шифруй бэкапы:**
   ```bash
   pg_dump $DATABASE_URL | gzip | gpg --encrypt --recipient your@email.com > backup.sql.gz.gpg
   ```

2. **Храни бэкапы в разных местах:**
   - Локальный диск
   - Облачное хранилище (Яндекс.Диск, Google Drive)
   - Внешний жёсткий диск

3. **Проверяй бэкапы:**
   Регулярно тестируй восстановление из бэкапов

4. **Ротация бэкапов:**
   - Ежедневные: 7 дней
   - Еженедельные: 4 недели
   - Ежемесячные: 12 месяцев

5. **Не храни пароли в скриптах:**
   Используй переменные окружения или `.pgpass` файл

---

## Создание .pgpass для автоматической аутентификации

### Linux/macOS

```bash
# Создай файл .pgpass
nano ~/.pgpass

# Добавь строку (формат: hostname:port:database:username:password)
rc1a-abc123.mdb.yandexcloud.net:6432:dbname:user:password

# Установи права доступа
chmod 600 ~/.pgpass
```

Теперь можно использовать `pg_dump` без пароля:
```bash
pg_dump -h rc1a-abc123.mdb.yandexcloud.net -p 6432 -U user -d dbname > backup.sql
```

### Windows

Создай файл `%APPDATA%\postgresql\pgpass.conf` с таким же содержимым.

---

## Готовые решения

### 1. Простой ежедневный бэкап (добавь в crontab)

```bash
0 3 * * * pg_dump $DATABASE_URL | gzip > ~/backups/avtoprofi_$(date +\%Y\%m\%d).sql.gz
```

### 2. Бэкап с ротацией (сохранять 7 дней)

```bash
0 3 * * * pg_dump $DATABASE_URL | gzip > ~/backups/backup_$(date +\%Y\%m\%d).sql.gz && find ~/backups -name "backup_*.sql.gz" -mtime +7 -delete
```

### 3. Бэкап + отправка на email

```bash
0 3 * * * pg_dump $DATABASE_URL | gzip | mail -s "DB Backup $(date)" -a backup.sql.gz your@email.com
```

---

**Бэкапы настроены! Ваши данные в безопасности 🛡️**
