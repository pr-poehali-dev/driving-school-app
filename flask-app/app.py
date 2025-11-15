import os
from flask import Flask, render_template, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import re

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)

DATABASE_URL = "postgresql://autoprofi_user:EpmkPLCPfbrkeKQkrB1bL79VjDzQNFni@dpg-d4bomnbipnbc7390422g-a.oregon-postgres.render.com:5432/autoprofi?sslmode=require"

@app.template_filter('format_number')
def format_number(value):
    return f"{value:,}".replace(',', ' ')

def get_db():
    conn = psycopg2.connect(DATABASE_URL)
    return conn

def validate_phone(phone):
    return bool(re.match(r'^\+?[78][\d\s\-\(\)]{9,}$', phone))

def validate_email(email):
    return bool(re.match(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$', email))

@app.route('/')
def index():
    conn = get_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("SELECT * FROM courses ORDER BY id")
    courses = cursor.fetchall()
    
    cursor.execute("SELECT * FROM instructors ORDER BY id")
    instructors = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return render_template('index.html', courses=courses, instructors=instructors)

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/api/enrollments', methods=['GET', 'POST'])
def enrollments():
    conn = get_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        cursor.execute("""
            SELECT 
                e.*,
                c.title as course_title
            FROM enrollments e
            LEFT JOIN courses c ON e.course_id = c.id
            ORDER BY e.created_at DESC
        """)
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify([dict(row) for row in results])
    
    if request.method == 'POST':
        data = request.json
        
        full_name = data.get('full_name', '').strip()
        phone = data.get('phone', '').strip()
        email = data.get('email', '').strip() if data.get('email') else None
        course_id = data.get('course_id')
        message = data.get('message', '').strip() if data.get('message') else None
        
        if not full_name or not phone or not course_id:
            return jsonify({'error': 'Обязательные поля: full_name, phone, course_id'}), 400
        
        if not validate_phone(phone):
            return jsonify({'error': 'Некорректный формат телефона'}), 400
        
        if email and not validate_email(email):
            return jsonify({'error': 'Некорректный формат email'}), 400
        
        cursor.execute("""
            INSERT INTO enrollments 
            (full_name, phone, email, course_id, message, status, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, 'new', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *
        """, (full_name.title(), phone, email, course_id, message))
        
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify(dict(result)), 201

@app.route('/api/courses', methods=['GET', 'POST', 'PUT', 'DELETE'])
def courses():
    conn = get_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        cursor.execute("SELECT * FROM courses ORDER BY id")
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify([dict(row) for row in results])
    
    if request.method == 'POST':
        data = request.json
        cursor.execute("""
            INSERT INTO courses (title, category, description, duration, price, features)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (data['title'], data['category'], data['description'], 
              data['duration'], data['price'], data['features']))
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify(dict(result)), 201
    
    if request.method == 'PUT':
        data = request.json
        cursor.execute("""
            UPDATE courses
            SET title = %s, category = %s, description = %s, 
                duration = %s, price = %s, features = %s
            WHERE id = %s
            RETURNING *
        """, (data['title'], data['category'], data['description'],
              data['duration'], data['price'], data['features'], data['id']))
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify(dict(result))
    
    if request.method == 'DELETE':
        course_id = request.args.get('id')
        cursor.execute("DELETE FROM courses WHERE id = %s", (course_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Deleted'}), 200

@app.route('/api/instructors', methods=['GET', 'POST', 'PUT', 'DELETE'])
def instructors():
    conn = get_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        cursor.execute("SELECT * FROM instructors ORDER BY id")
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify([dict(row) for row in results])
    
    if request.method == 'POST':
        data = request.json
        cursor.execute("""
            INSERT INTO instructors (name, specialization, experience, rating, bio)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING *
        """, (data['name'], data['specialization'], data['experience'],
              data['rating'], data['bio']))
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify(dict(result)), 201
    
    if request.method == 'PUT':
        data = request.json
        cursor.execute("""
            UPDATE instructors
            SET name = %s, specialization = %s, experience = %s, rating = %s, bio = %s
            WHERE id = %s
            RETURNING *
        """, (data['name'], data['specialization'], data['experience'],
              data['rating'], data['bio'], data['id']))
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify(dict(result))
    
    if request.method == 'DELETE':
        instructor_id = request.args.get('id')
        cursor.execute("DELETE FROM instructors WHERE id = %s", (instructor_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Deleted'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)