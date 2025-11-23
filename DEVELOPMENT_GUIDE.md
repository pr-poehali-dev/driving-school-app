# Полный гайд по разработке веб-приложения
## На примере проекта автошколы "АвтоПрофи"

---

## Содержание

1. [Введение и архитектура](#введение-и-архитектура)
2. [Структура проекта](#структура-проекта)
3. [Frontend: React + TypeScript](#frontend-react--typescript)
4. [Backend: Cloud Functions](#backend-cloud-functions)
5. [База данных: PostgreSQL](#база-данных-postgresql)
6. [Интеграция компонентов](#интеграция-компонентов)
7. [Деплой и публикация](#деплой-и-публикация)
8. [Практические примеры](#практические-примеры)

---

## Введение и архитектура

### Что мы построили?

Сайт автошколы с функционалом:
- **Публичная страница** с курсами, инструкторами и формой записи
- **Админ-панель** для управления заявками, курсами и инструкторами
- **API** для работы с базой данных
- **Автоматический деплой** через GitHub

### Технологический стек

```
┌─────────────────────────────────────────┐
│         Frontend (React SPA)            │
│  React + TypeScript + Vite + Tailwind   │
└──────────────┬──────────────────────────┘
               │ HTTP Requests
               ↓
┌─────────────────────────────────────────┐
│    Backend (Cloud Functions)            │
│  Python 3.11 + TypeScript (Node.js 22)  │
└──────────────┬──────────────────────────┘
               │ SQL Queries
               ↓
┌─────────────────────────────────────────┐
│      Database (PostgreSQL)              │
│     Таблицы: courses, instructors,      │
│           enrollments                   │
└─────────────────────────────────────────┘
```

### Принципы архитектуры

1. **Разделение ответственности**: Frontend отвечает за UI, Backend за бизнес-логику, БД за хранение
2. **API-first подход**: Все взаимодействие через HTTP API
3. **Serverless функции**: Каждая функция деплоится независимо
4. **Миграции БД**: Все изменения схемы через версионированные SQL-файлы

---

## Структура проекта

```
project-root/
│
├── src/                          # Frontend код
│   ├── components/               # React компоненты
│   │   ├── ui/                   # Базовые UI компоненты
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── home/                 # Компоненты главной страницы
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CoursesSection.tsx
│   │   │   ├── InstructorsSection.tsx
│   │   │   └── Footer.tsx
│   │   └── admin/                # Компоненты админки
│   │       ├── LoginForm.tsx
│   │       ├── EnrollmentsTab.tsx
│   │       ├── CoursesTab.tsx
│   │       └── InstructorsTab.tsx
│   │
│   ├── pages/                    # Страницы приложения
│   │   ├── Index.tsx             # Главная страница
│   │   ├── Admin.tsx             # Админ-панель
│   │   └── NotFound.tsx          # 404 страница
│   │
│   ├── hooks/                    # React хуки
│   │   └── use-toast.ts
│   │
│   ├── lib/                      # Утилиты
│   │   └── utils.ts
│   │
│   ├── App.tsx                   # Главный компонент
│   ├── main.tsx                  # Точка входа
│   └── index.css                 # Глобальные стили
│
├── backend/                      # Backend функции
│   ├── api/                      # API для чтения данных
│   │   ├── index.py              # Обработчик запросов
│   │   ├── requirements.txt      # Python зависимости
│   │   └── tests.json            # Тесты функции
│   │
│   ├── enrollments/              # API для записи на курсы
│   │   ├── index.py
│   │   ├── requirements.txt
│   │   └── tests.json
│   │
│   ├── statistics/               # API для статистики
│   │   ├── index.py
│   │   ├── requirements.txt
│   │   └── tests.json
│   │
│   └── func2url.json             # Маппинг функций на URL (автоген)
│
├── db_migrations/                # Миграции базы данных
│   ├── V1__initial_schema.sql
│   ├── V2__add_enrollments.sql
│   └── V3__add_statistics.sql
│
├── public/                       # Статические файлы
│   └── favicon.ico
│
├── package.json                  # NPM зависимости
├── tsconfig.json                 # TypeScript конфигурация
├── vite.config.ts                # Vite конфигурация
├── tailwind.config.ts            # Tailwind конфигурация
└── postcss.config.js             # PostCSS конфигурация
```

---

## Frontend: React + TypeScript

### 1. Настройка окружения

#### Установка зависимостей

Проект использует **Bun** как пакетный менеджер (можно использовать npm/yarn):

```json
// package.json - основные зависимости
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "@tanstack/react-query": "^5.56.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "lucide-react": "^0.441.0"
  }
}
```

#### Конфигурация Vite

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 2. Создание компонентов

#### Базовый UI компонент (Button)

```typescript
// src/components/ui/button.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

export { Button }
```

#### Компонент страницы с формой

```typescript
// src/components/home/EnrollmentDialog.tsx - пример формы записи
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface EnrollmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  courseTitle: string;
}

export default function EnrollmentDialog({ 
  isOpen, 
  onClose, 
  courseId, 
  courseTitle 
}: EnrollmentDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://functions.poehali.dev/YOUR_FUNCTION_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          course_id: courseId
        })
      });

      if (response.ok) {
        toast({
          title: "Заявка отправлена!",
          description: "Мы свяжемся с вами в ближайшее время.",
        });
        setFormData({ full_name: '', phone: '', email: '', message: '' });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Запись на курс: {courseTitle}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name">ФИО</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="message">Комментарий</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>
          
          <Button type="submit" className="w-full">
            Отправить заявку
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### 3. Роутинг и навигация

```typescript
// src/App.tsx - настройка роутинга
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
```

### 4. Стилизация с Tailwind CSS

```typescript
// tailwind.config.ts
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(221.2 83.2% 53.3%)",
          foreground: "hsl(210 40% 98%)",
        },
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
};
```

---

## Backend: Cloud Functions

### 1. Выбор языка для функции

**Python 3.11** используется для:
- Работы с базой данных (CRUD операции)
- Обработки данных
- Интеграций с внешними API

**TypeScript (Node.js 22)** используется для:
- Аутентификации и JWT
- WebSocket соединений
- Высоконагруженных endpoint'ов

### 2. Структура функции (Python)

```python
# backend/api/index.py - функция для чтения данных из БД

import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для получения данных из БД (курсы, инструкторы)
    Args: event - dict с httpMethod, queryStringParameters
          context - объект с request_id, function_name
    Returns: HTTP response с данными из БД
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Обработка CORS preflight запроса
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Получение параметров запроса
    params = event.get('queryStringParameters', {})
    table = params.get('table', 'courses')
    
    # Подключение к БД
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    # Выполнение запроса
    if table == 'courses':
        cursor.execute('SELECT * FROM courses ORDER BY id')
    elif table == 'instructors':
        cursor.execute('SELECT * FROM instructors ORDER BY id')
    else:
        cursor.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Invalid table'})
        }
    
    # Формирование ответа
    columns = [desc[0] for desc in cursor.description]
    rows = cursor.fetchall()
    result = [dict(zip(columns, row)) for row in rows]
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(result, default=str)
    }
```

### 3. Зависимости функции

```txt
# backend/api/requirements.txt
psycopg2-binary==2.9.9
```

### 4. Тестирование функции

```json
// backend/api/tests.json
{
  "tests": [
    {
      "name": "Get courses from database",
      "method": "GET",
      "path": "/?table=courses",
      "expectedStatus": 200
    },
    {
      "name": "Get instructors from database",
      "method": "GET",
      "path": "/?table=instructors",
      "expectedStatus": 200
    }
  ]
}
```

### 5. Функция для записи в БД

```python
# backend/enrollments/index.py - функция для создания заявок

import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для создания заявок на курсы
    Args: event - dict с httpMethod, body
    Returns: HTTP response с результатом операции
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Парсинг тела запроса
    body = json.loads(event.get('body', '{}'))
    full_name = body.get('full_name')
    phone = body.get('phone')
    email = body.get('email')
    course_id = body.get('course_id')
    message = body.get('message', '')
    
    # Валидация
    if not all([full_name, phone, email, course_id]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Missing required fields'})
        }
    
    # Подключение к БД
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    # Вставка данных
    cursor.execute('''
        INSERT INTO enrollments (course_id, full_name, phone, email, message, status, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (course_id, full_name, phone, email, message, 'new', datetime.now()))
    
    enrollment_id = cursor.fetchone()[0]
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'id': enrollment_id, 'status': 'created'})
    }
```

### 6. Деплой функций

После создания/изменения функций, они деплоятся автоматически. Система генерирует `func2url.json`:

```json
{
  "api": "https://functions.poehali.dev/b0d7aa51-2c0f-4f88-bd58-959eec7781db",
  "enrollments": "https://functions.poehali.dev/127ff586-f47f-450b-81c4-f7bc88a67fea",
  "statistics": "https://functions.poehali.dev/8a3f2c1d-9e4b-4a2c-b5f1-3d8e7c9a2b1f"
}
```

---

## База данных: PostgreSQL

### 1. Создание схемы через миграции

```sql
-- db_migrations/V1__initial_schema.sql

-- Таблица курсов
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    price INTEGER,
    features JSONB
);

-- Таблица инструкторов
CREATE TABLE IF NOT EXISTS instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    experience INTEGER,
    rating DECIMAL(3,2),
    bio TEXT
);

-- Начальные данные
INSERT INTO courses (title, category, description, duration, price, features) VALUES
('Категория B (легковой автомобиль)', 'B', 'Полный курс обучения вождению', '3 месяца', 35000, 
 '["130 часов теории", "56 часов практики", "Современные автомобили", "Помощь в ГИБДД"]'::jsonb),
('Категория A (мотоцикл)', 'A', 'Обучение вождению мотоцикла', '2 месяца', 28000,
 '["Теория ПДД", "18 часов практики", "Современные мотоциклы", "Экипировка включена"]'::jsonb);

INSERT INTO instructors (name, specialization, experience, rating, bio) VALUES
('Иванов Сергей Петрович', 'Категории B, C', 15, 4.9, 'Мастер производственного обучения'),
('Петрова Анна Викторовна', 'Категория B', 8, 4.8, 'Терпеливый инструктор');
```

```sql
-- db_migrations/V2__add_enrollments.sql

CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_created_at ON enrollments(created_at DESC);
```

### 2. Применение миграций

Миграции применяются автоматически через систему. После создания SQL-файла:

1. Система проверяет синтаксис
2. Применяет миграцию к БД
3. Сохраняет версию в истории

### 3. Работа с данными

#### Чтение данных

```typescript
// Frontend: загрузка курсов
const [courses, setCourses] = useState([]);

useEffect(() => {
  fetch('https://functions.poehali.dev/b0d7aa51-2c0f-4f88-bd58-959eec7781db?table=courses')
    .then(res => res.json())
    .then(data => setCourses(data))
    .catch(err => console.error(err));
}, []);
```

#### Запись данных

```typescript
// Frontend: отправка формы
const handleSubmit = async (formData) => {
  const response = await fetch(
    'https://functions.poehali.dev/127ff586-f47f-450b-81c4-f7bc88a67fea',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }
  );
  
  if (response.ok) {
    const result = await response.json();
    console.log('Created:', result);
  }
};
```

---

## Интеграция компонентов

### 1. Связь Frontend → Backend → Database

```
[React Component]
      ↓ fetch()
[Cloud Function]
      ↓ psycopg2.connect()
[PostgreSQL]
      ↓ return rows
[Cloud Function]
      ↓ JSON response
[React Component]
```

### 2. Пример полного flow: Запись на курс

#### Шаг 1: Пользователь заполняет форму

```typescript
// src/pages/Index.tsx
const [formData, setFormData] = useState({
  full_name: '',
  phone: '',
  email: '',
  message: ''
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const response = await fetch(ENROLLMENTS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...formData,
      course_id: selectedCourse.id
    })
  });
  
  if (response.ok) {
    toast({ title: "Заявка отправлена!" });
  }
};
```

#### Шаг 2: Backend обрабатывает запрос

```python
# backend/enrollments/index.py
def handler(event, context):
    body = json.loads(event['body'])
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO enrollments (course_id, full_name, phone, email, message)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    ''', (body['course_id'], body['full_name'], body['phone'], 
          body['email'], body.get('message', '')))
    
    enrollment_id = cursor.fetchone()[0]
    conn.commit()
    
    return {
        'statusCode': 200,
        'body': json.dumps({'id': enrollment_id})
    }
```

#### Шаг 3: Database сохраняет данные

```sql
-- Результат в БД
SELECT * FROM enrollments ORDER BY created_at DESC LIMIT 1;

-- id | course_id | full_name | phone | email | status | created_at
-- 1  | 2         | Иван      | +7... | i@... | new    | 2024-11-23 ...
```

### 3. Админ-панель: Управление данными

```typescript
// src/pages/Admin.tsx
const Admin = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    // Загрузка заявок
    fetch(`${API_URL}?table=enrollments`)
      .then(res => res.json())
      .then(data => setEnrollments(data));
    
    // Загрузка курсов
    fetch(`${API_URL}?table=courses`)
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);
  
  const handleUpdateStatus = async (id: number, status: string) => {
    await fetch(`${API_URL}/enrollments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    
    // Обновление списка
    setEnrollments(prev => 
      prev.map(e => e.id === id ? {...e, status} : e)
    );
  };
  
  return (
    <div>
      <h1>Админ-панель</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ФИО</TableHead>
            <TableHead>Курс</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map(enrollment => (
            <TableRow key={enrollment.id}>
              <TableCell>{enrollment.full_name}</TableCell>
              <TableCell>
                {courses.find(c => c.id === enrollment.course_id)?.title}
              </TableCell>
              <TableCell>
                <Badge>{enrollment.status}</Badge>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleUpdateStatus(enrollment.id, 'processed')}>
                  Обработать
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

---

## Деплой и публикация

### 1. Автоматический деплой через GitHub

```bash
# 1. Подключить GitHub репозиторий через UI
# 2. Код автоматически пушится в репозиторий
# 3. Каждый коммит триггерит билд

# Структура в GitHub:
your-repo/
├── src/           # Frontend код
├── backend/       # Cloud functions
├── db_migrations/ # Миграции БД
└── package.json
```

### 2. Публикация в интернет

После успешного билда:

```
1. Проект доступен по URL: https://your-project.poehali.app
2. API функции доступны по своим URL из func2url.json
3. БД работает автоматически
```

### 3. Подключение своего домена

```
1. В UI: Опубликовать → Привязать свой домен
2. Добавить CNAME запись в DNS: your-domain.com → target.poehali.app
3. SSL сертификат выпускается автоматически
```

---

## Практические примеры

### Пример 1: Добавление нового раздела "Отзывы"

#### Шаг 1: Создать таблицу в БД

```sql
-- db_migrations/V4__add_reviews.sql

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL,
    course_id INTEGER REFERENCES courses(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO reviews (author_name, course_id, rating, comment) VALUES
('Алексей М.', 1, 5, 'Отличная автошкола! Сдал с первого раза'),
('Мария К.', 1, 5, 'Инструкторы очень терпеливые и профессиональные');
```

#### Шаг 2: Добавить endpoint для отзывов

```python
# backend/api/index.py - добавить обработку reviews

# В функции handler добавить:
elif table == 'reviews':
    cursor.execute('''
        SELECT r.*, c.title as course_title 
        FROM reviews r
        LEFT JOIN courses c ON r.course_id = c.id
        ORDER BY r.created_at DESC
    ''')
```

#### Шаг 3: Создать компонент на фронтенде

```typescript
// src/components/home/ReviewsSection.tsx

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Review {
  id: number;
  author_name: string;
  course_title: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  
  useEffect(() => {
    fetch('https://functions.poehali.dev/YOUR_API_URL?table=reviews')
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);
  
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Отзывы наших учеников
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map(review => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{review.author_name}</CardTitle>
                  <div className="flex gap-1">
                    {Array(review.rating).fill(0).map((_, i) => (
                      <Icon key={i} name="Star" className="text-yellow-500" size={16} />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {review.course_title}
                </p>
                <p>{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

#### Шаг 4: Добавить в главную страницу

```typescript
// src/pages/Index.tsx

import ReviewsSection from '@/components/home/ReviewsSection';

const Index = () => {
  return (
    <div>
      {/* ... другие секции ... */}
      <ReviewsSection />
      {/* ... */}
    </div>
  );
};
```

### Пример 2: Добавление аутентификации

#### Шаг 1: Создать таблицу пользователей

```sql
-- db_migrations/V5__add_users.sql

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Хеш для пароля "admin123" (bcrypt)
INSERT INTO users (email, password_hash, role) VALUES
('admin@autoprofi.ru', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8', 'admin');
```

#### Шаг 2: Создать функцию авторизации

```python
# backend/auth/index.py

import json
import os
import psycopg2
import bcrypt
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Аутентификация пользователей
    Args: event с email и password в body
    Returns: JWT token или ошибка
    '''
    method = event.get('httpMethod', 'POST')
    
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
    
    body = json.loads(event.get('body', '{}'))
    email = body.get('email')
    password = body.get('password')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Email and password required'})
        }
    
    # Проверка в БД
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    cursor.execute(
        'SELECT id, password_hash, role FROM users WHERE email = %s',
        (email,)
    )
    user = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    if not user:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Invalid credentials'})
        }
    
    user_id, password_hash, role = user
    
    # Проверка пароля
    if not bcrypt.checkpw(password.encode(), password_hash.encode()):
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Invalid credentials'})
        }
    
    # В реальном проекте здесь генерируется JWT token
    # import jwt
    # token = jwt.encode({'user_id': user_id, 'role': role}, SECRET_KEY)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'user_id': user_id,
            'role': role,
            'token': 'dummy_token_for_demo'
        })
    }
```

```txt
# backend/auth/requirements.txt
psycopg2-binary==2.9.9
bcrypt==4.0.1
```

### Пример 3: Добавление поиска по курсам

#### Backend функция с поиском

```python
# backend/api/index.py - добавить поиск

# В обработчике GET запросов:
if table == 'courses':
    search_query = params.get('search', '')
    
    if search_query:
        cursor.execute('''
            SELECT * FROM courses 
            WHERE title ILIKE %s OR description ILIKE %s
            ORDER BY id
        ''', (f'%{search_query}%', f'%{search_query}%'))
    else:
        cursor.execute('SELECT * FROM courses ORDER BY id')
```

#### Frontend компонент поиска

```typescript
// src/components/home/CourseSearch.tsx

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CourseSearchProps {
  onSearch: (query: string) => void;
}

export default function CourseSearch({ onSearch }: CourseSearchProps) {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <Input
        type="text"
        placeholder="Поиск курсов..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit">
        <Icon name="Search" size={20} />
      </Button>
    </form>
  );
}
```

```typescript
// Использование в Index.tsx

const [courses, setCourses] = useState([]);
const [searchQuery, setSearchQuery] = useState('');

const loadCourses = (search: string = '') => {
  const url = `${API_URL}?table=courses${search ? `&search=${search}` : ''}`;
  
  fetch(url)
    .then(res => res.json())
    .then(data => setCourses(data));
};

useEffect(() => {
  loadCourses(searchQuery);
}, [searchQuery]);

return (
  <div>
    <CourseSearch onSearch={setSearchQuery} />
    {/* Отображение курсов */}
  </div>
);
```

---

## Заключение

### Основные принципы разработки

1. **Разделяй и властвуй**: Frontend, Backend и Database - отдельные слои
2. **API-first**: Всё общение через HTTP API
3. **Миграции**: Все изменения БД версионируются
4. **Тестируй**: Каждая функция имеет tests.json
5. **CORS**: Всегда обрабатывай OPTIONS запросы
6. **Типизация**: TypeScript на фронте, type hints на бэке

### Чек-лист для нового проекта

- [ ] Спроектировать схему БД
- [ ] Создать миграции для таблиц
- [ ] Написать backend функции для CRUD
- [ ] Добавить tests.json для каждой функции
- [ ] Создать UI компоненты на React
- [ ] Интегрировать компоненты с API
- [ ] Протестировать на локальном стенде
- [ ] Подключить GitHub
- [ ] Опубликовать проект

### Полезные команды

```bash
# Разработка фронтенда
npm run dev          # Запуск dev-сервера
npm run build        # Билд проекта

# Работа с БД (через UI tools)
# - get_db_info()      # Просмотр структуры
# - perform_sql_query() # Выполнение SELECT
# - migrate_db()       # Применение миграций

# Деплой функций (автоматически)
# - sync_backend()     # После изменения /backend
```

### Дальнейшее развитие

1. **Добавить WebSocket** для real-time уведомлений
2. **Интегрировать оплату** через Stripe/PayPal
3. **Добавить email рассылки** через SendGrid
4. **Оптимизировать производительность** (кэширование, индексы БД)
5. **Добавить мониторинг** (логи, метрики)

---

**Автор**: Юра, личный разработчик poehali.dev  
**Дата**: Ноябрь 2024  
**Версия**: 1.0
