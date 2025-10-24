'''
Business: API для получения данных из базы данных автошколы
Args: event - dict с httpMethod, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными из БД
'''

import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    params = event.get('queryStringParameters') or {}
    table = params.get('table', 'courses')
    
    if method == 'GET':
        if table == 'courses':
            cursor.execute("SELECT id, title, category, description, duration, price, features FROM courses ORDER BY id")
        elif table == 'instructors':
            cursor.execute("SELECT id, name, specialization, experience, rating, bio FROM instructors ORDER BY id")
        elif table == 'enrollments':
            cursor.execute("SELECT id, full_name, phone, email, course_id, message, status, created_at FROM enrollments ORDER BY created_at DESC")
        else:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid table'}),
                'isBase64Encoded': False
            }
        
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result, default=str),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        if table == 'enrollments':
            cursor.execute(
                "INSERT INTO enrollments (full_name, phone, email, course_id, message) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (body_data.get('full_name'), body_data.get('phone'), body_data.get('email'), 
                 body_data.get('course_id'), body_data.get('message'))
            )
            new_id = cursor.fetchone()[0]
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': new_id, 'message': 'Enrollment created'}),
                'isBase64Encoded': False
            }
    
    elif method == 'DELETE':
        body_data = json.loads(event.get('body', '{}'))
        record_id = body_data.get('id')
        
        if not record_id:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing id'}),
                'isBase64Encoded': False
            }
        
        cursor.execute(f"DELETE FROM {table} WHERE id = %s", (record_id,))
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Record deleted'}),
            'isBase64Encoded': False
        }
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
