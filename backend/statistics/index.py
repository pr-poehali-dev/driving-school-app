import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Создание подключения к БД"""
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise Exception('DATABASE_URL не найден')
    return psycopg2.connect(database_url)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: API для получения статистики автошколы (заявки, курсы, доходы)
    Args: event с httpMethod (GET/OPTIONS), queryStringParameters (type: overview|courses|recent)
          context с request_id
    Returns: HTTP response со статистикой
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Только GET запросы'}),
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        params = event.get('queryStringParameters', {}) or {}
        stat_type = params.get('type', 'overview')
        
        if stat_type == 'overview':
            cursor.execute("""
                SELECT 
                    status,
                    COUNT(*) as total
                FROM t_p22853855_driving_school_app.enrollments
                GROUP BY status
            """)
            status_stats = cursor.fetchall()
            
            cursor.execute("""
                SELECT COUNT(*) as total
                FROM t_p22853855_driving_school_app.enrollments
            """)
            total_enrollments = cursor.fetchone()['total']
            
            cursor.execute("""
                SELECT COUNT(*) as total
                FROM t_p22853855_driving_school_app.courses
            """)
            total_courses = cursor.fetchone()['total']
            
            cursor.execute("""
                SELECT COUNT(*) as total
                FROM t_p22853855_driving_school_app.instructors
            """)
            total_instructors = cursor.fetchone()['total']
            
            cursor.execute("""
                SELECT 
                    SUM(c.price) as total_revenue
                FROM t_p22853855_driving_school_app.enrollments e
                JOIN t_p22853855_driving_school_app.courses c ON e.course_id = c.id
                WHERE e.status IN ('enrolled', 'completed')
            """)
            revenue_result = cursor.fetchone()
            total_revenue = float(revenue_result['total_revenue']) if revenue_result['total_revenue'] else 0
            
            result = {
                'total_enrollments': total_enrollments,
                'total_courses': total_courses,
                'total_instructors': total_instructors,
                'total_revenue': total_revenue,
                'status_breakdown': [dict(row) for row in status_stats]
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        if stat_type == 'courses':
            cursor.execute("""
                SELECT 
                    c.id,
                    c.title,
                    c.category,
                    c.price,
                    c.duration,
                    COUNT(e.id) as enrollment_count,
                    COUNT(CASE WHEN e.status = 'enrolled' THEN 1 END) as active_students,
                    COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_students,
                    SUM(CASE WHEN e.status IN ('enrolled', 'completed') THEN c.price ELSE 0 END) as total_revenue
                FROM t_p22853855_driving_school_app.courses c
                LEFT JOIN t_p22853855_driving_school_app.enrollments e ON c.id = e.course_id
                GROUP BY c.id, c.title, c.category, c.price, c.duration
                ORDER BY enrollment_count DESC
            """)
            results = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(row) for row in results], default=str),
                'isBase64Encoded': False
            }
        
        if stat_type == 'recent':
            limit = int(params.get('limit', 10))
            
            cursor.execute("""
                SELECT 
                    e.id,
                    e.full_name,
                    e.phone,
                    e.email,
                    c.title as course_title,
                    c.category as course_category,
                    c.price as course_price,
                    e.status,
                    e.message,
                    e.created_at,
                    e.updated_at
                FROM t_p22853855_driving_school_app.enrollments e
                LEFT JOIN t_p22853855_driving_school_app.courses c ON e.course_id = c.id
                ORDER BY e.created_at DESC
                LIMIT %s
            """, (limit,))
            results = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(row) for row in results], default=str),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неизвестный тип статистики. Доступные: overview, courses, recent'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
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
