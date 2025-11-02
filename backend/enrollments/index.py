import json
import os
import re
from typing import Dict, Any, Optional, List
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def validate_phone(phone: str) -> bool:
    """Валидация формата телефона"""
    return bool(re.match(r'^\+?[78][\d\s\-\(\)]{9,}$', phone))

def validate_email(email: str) -> bool:
    """Валидация формата email"""
    return bool(re.match(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$', email))

def normalize_name(name: str) -> str:
    """Нормализация имени"""
    return name.strip().title()

def get_db_connection():
    """Создание подключения к БД"""
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise Exception('DATABASE_URL не найден')
    return psycopg2.connect(database_url)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: API для управления заявками автошколы (создание, получение, обновление статуса)
    Args: event с httpMethod (GET/POST/PUT/OPTIONS), body, queryStringParameters
          context с request_id
    Returns: HTTP response с данными заявок или результатом операции
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            enrollment_id = params.get('id')
            status = params.get('status')
            limit = int(params.get('limit', 100))
            offset = int(params.get('offset', 0))
            
            if enrollment_id:
                cursor.execute("""
                    SELECT 
                        e.id,
                        e.full_name,
                        e.phone,
                        e.email,
                        e.course_id,
                        c.title as course_title,
                        c.category as course_category,
                        c.price as course_price,
                        e.status,
                        e.message,
                        e.created_at,
                        e.updated_at
                    FROM t_p22853855_driving_school_app.enrollments e
                    LEFT JOIN t_p22853855_driving_school_app.courses c ON e.course_id = c.id
                    WHERE e.id = %s
                """, (enrollment_id,))
                result = cursor.fetchone()
                
                if not result:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заявка не найдена'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(result), default=str),
                    'isBase64Encoded': False
                }
            
            query = """
                SELECT 
                    e.id,
                    e.full_name,
                    e.phone,
                    e.email,
                    e.course_id,
                    c.title as course_title,
                    c.category as course_category,
                    c.price as course_price,
                    e.status,
                    e.message,
                    e.created_at,
                    e.updated_at
                FROM t_p22853855_driving_school_app.enrollments e
                LEFT JOIN t_p22853855_driving_school_app.courses c ON e.course_id = c.id
            """
            
            if status:
                query += f" WHERE e.status = '{status}'"
            
            query += " ORDER BY e.created_at DESC LIMIT %s OFFSET %s"
            
            cursor.execute(query, (limit, offset))
            results = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(row) for row in results], default=str),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            full_name = body_data.get('full_name', '').strip()
            phone = body_data.get('phone', '').strip()
            email = body_data.get('email', '').strip() if body_data.get('email') else None
            course_id = body_data.get('course_id')
            message = body_data.get('message', '').strip() if body_data.get('message') else None
            
            if not full_name or not phone or not course_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Обязательные поля: full_name, phone, course_id'}),
                    'isBase64Encoded': False
                }
            
            if not validate_phone(phone):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Некорректный формат телефона'}),
                    'isBase64Encoded': False
                }
            
            if email and not validate_email(email):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Некорректный формат email'}),
                    'isBase64Encoded': False
                }
            
            full_name = normalize_name(full_name)
            
            cursor.execute("""
                INSERT INTO t_p22853855_driving_school_app.enrollments 
                (full_name, phone, email, course_id, message, status, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, 'new', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                RETURNING id, full_name, phone, email, course_id, status, message, created_at, updated_at
            """, (full_name, phone, email, course_id, message))
            
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(result), default=str),
                'isBase64Encoded': False
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            enrollment_id = body_data.get('id')
            new_status = body_data.get('status')
            
            if not enrollment_id or not new_status:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Обязательные поля: id, status'}),
                    'isBase64Encoded': False
                }
            
            valid_statuses = ['new', 'contacted', 'enrolled', 'completed', 'cancelled']
            if new_status not in valid_statuses:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': f'Допустимые статусы: {", ".join(valid_statuses)}'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("""
                UPDATE t_p22853855_driving_school_app.enrollments
                SET status = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, full_name, phone, email, course_id, status, message, created_at, updated_at
            """, (new_status, enrollment_id))
            
            result = cursor.fetchone()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заявка не найдена'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(result), default=str),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        if conn:
            cursor.close()
            conn.close()
