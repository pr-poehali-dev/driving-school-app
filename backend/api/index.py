'''
Business: API для управления данными автошколы (CRUD операции)  
Args: event - dict с httpMethod, queryStringParameters, body
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными из БД
'''

import json
import os
import psycopg2
from typing import Dict, Any

def escape_sql_string(value: str) -> str:
    if value is None:
        return 'NULL'
    return "'" + str(value).replace("'", "''") + "'"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Auth',
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
            cursor.execute("SELECT id, title, category, description, duration, price, features FROM t_p22853855_driving_school_app.courses ORDER BY id")
        elif table == 'instructors':
            cursor.execute("SELECT id, name, specialization, experience, rating, bio FROM t_p22853855_driving_school_app.instructors ORDER BY id")
        elif table == 'enrollments':
            cursor.execute("SELECT id, full_name, phone, email, course_id, message, status, created_at FROM t_p22853855_driving_school_app.enrollments ORDER BY created_at DESC")
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
        
        if table == 'courses':
            features_str = "ARRAY[" + ", ".join([escape_sql_string(f) for f in body_data.get('features', [])]) + "]"
            query = f"""
                INSERT INTO t_p22853855_driving_school_app.courses 
                (title, category, description, duration, price, features) 
                VALUES ({escape_sql_string(body_data.get('title'))}, 
                        {escape_sql_string(body_data.get('category'))}, 
                        {escape_sql_string(body_data.get('description'))}, 
                        {escape_sql_string(body_data.get('duration'))}, 
                        {body_data.get('price', 0)}, 
                        {features_str}) 
                RETURNING id
            """
            cursor.execute(query)
        elif table == 'instructors':
            query = f"""
                INSERT INTO t_p22853855_driving_school_app.instructors 
                (name, specialization, experience, rating, bio) 
                VALUES ({escape_sql_string(body_data.get('name'))}, 
                        {escape_sql_string(body_data.get('specialization'))}, 
                        {body_data.get('experience', 0)}, 
                        {body_data.get('rating', 0.0)}, 
                        {escape_sql_string(body_data.get('bio'))}) 
                RETURNING id
            """
            cursor.execute(query)
        elif table == 'enrollments':
            query = f"""
                INSERT INTO t_p22853855_driving_school_app.enrollments 
                (full_name, phone, email, course_id, message) 
                VALUES ({escape_sql_string(body_data.get('full_name'))}, 
                        {escape_sql_string(body_data.get('phone'))}, 
                        {escape_sql_string(body_data.get('email'))}, 
                        {body_data.get('course_id') if body_data.get('course_id') else 'NULL'}, 
                        {escape_sql_string(body_data.get('message'))}) 
                RETURNING id
            """
            cursor.execute(query)
        else:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid table'}),
                'isBase64Encoded': False
            }
        
        new_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'id': new_id, 'message': 'Record created'}),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
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
        
        if table == 'courses':
            features_str = "ARRAY[" + ", ".join([escape_sql_string(f) for f in body_data.get('features', [])]) + "]"
            query = f"""
                UPDATE t_p22853855_driving_school_app.courses 
                SET title = {escape_sql_string(body_data.get('title'))}, 
                    category = {escape_sql_string(body_data.get('category'))}, 
                    description = {escape_sql_string(body_data.get('description'))}, 
                    duration = {escape_sql_string(body_data.get('duration'))}, 
                    price = {body_data.get('price', 0)}, 
                    features = {features_str} 
                WHERE id = {record_id}
            """
            cursor.execute(query)
        elif table == 'instructors':
            query = f"""
                UPDATE t_p22853855_driving_school_app.instructors 
                SET name = {escape_sql_string(body_data.get('name'))}, 
                    specialization = {escape_sql_string(body_data.get('specialization'))}, 
                    experience = {body_data.get('experience', 0)}, 
                    rating = {body_data.get('rating', 0.0)}, 
                    bio = {escape_sql_string(body_data.get('bio'))} 
                WHERE id = {record_id}
            """
            cursor.execute(query)
        elif table == 'enrollments':
            query = f"""
                UPDATE t_p22853855_driving_school_app.enrollments 
                SET full_name = {escape_sql_string(body_data.get('full_name'))}, 
                    phone = {escape_sql_string(body_data.get('phone'))}, 
                    email = {escape_sql_string(body_data.get('email'))}, 
                    course_id = {body_data.get('course_id') if body_data.get('course_id') else 'NULL'}, 
                    message = {escape_sql_string(body_data.get('message'))}, 
                    status = {escape_sql_string(body_data.get('status'))} 
                WHERE id = {record_id}
            """
            cursor.execute(query)
        else:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid table'}),
                'isBase64Encoded': False
            }
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Record updated'}),
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
        
        cursor.execute(f"DELETE FROM t_p22853855_driving_school_app.{table} WHERE id = {record_id}")
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