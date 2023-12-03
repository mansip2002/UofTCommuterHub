from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
import psycopg
from dotenv import load_dotenv, dotenv_values

load_dotenv()

env = dotenv_values()

app = Flask(__name__)
CORS(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'uoftcommuterhub@gmail.com'
app.config['MAIL_PASSWORD'] = 'opwx fjsf bxto oqpq'

mail = Mail(app)

db = psycopg.connect(
    dbname=env["DB_NAME"], 
    host=env["DB_HOST"],
    user=env["DB_USER"],
    password=env["DB_PASSWORD"]
)

import secrets
def generate_verification_code():
    return secrets.token_urlsafe(16)

# in memory for now 
users = {}

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required.'}), 400
    
    
    if email in users:
        return jsonify({'message': 'Email already registered.'}), 400

    verification_code = generate_verification_code()
    
    # Store the user data (email and verification code)
    users[email] = {'verification_code': verification_code, 'verified': False}
   
    # Send a verification email
    msg = Message('Email Verification', sender='uoftcommuterhub@gmail.com', recipients=[email])
    msg.body = f'Your verification code is: {verification_code}'
    mail.send(msg)

    return jsonify({'message': 'Registration successful! Check your email for a verification code.'})

@app.route('/verify', methods=['POST'])
def verify_email():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if email in users and users[email]['verification_code'] == code:
        users[email]['verified'] = True
        return jsonify({'message': 'Email verified successfully!'})
    else:
        return jsonify({'message': 'Invalid verification code.'}), 400

@app.route('/accounts', methods=['GET'])
def test():
    cur = db.cursor()
    cur.execute("SELECT * FROM account;")

    users = []
    rows = cur.fetchall()

    for row in rows:
        users.append({
            "id": row[0],
            "first_name": row[1],
            "last_name": row[2],
            "email": row[3],
            "password_hash": row[4]
        })

    return jsonify(users)

@app.route('/api/search', methods=['GET'])
def search():
    cur = db.cursor()
    search_term = request.args.get('search', '')

    
    if search_term and ':' in search_term:
        # Handle search case when a time is entered
        query = """
                SELECT name, start_location, end_location, day_of_week, start_time, email FROM user_profile JOIN account ON account.id = user_profile.user_id
                WHERE 
                    user_profile.name ILIKE %s OR
                    start_location ILIKE %s OR
                    end_location ILIKE %s OR
                    day_of_week ILIKE %s OR
                    start_time = %s
                """
        cur.execute(query, (f"%{search_term}%", f"%{search_term}%", f"%{search_term}%", f"%{search_term}%", f"%{search_term}%"))
    else:
        query = """
            SELECT name, start_location, end_location, day_of_week, start_time, email FROM user_profile JOIN account ON account.id = user_profile.user_id
            WHERE 
                user_profile.name ILIKE %s OR
                start_location ILIKE %s OR
                end_location ILIKE %s OR
                day_of_week ILIKE %s 
        """
        cur.execute(query, (f"%{search_term}%", f"%{search_term}%", f"%{search_term}%", f"%{search_term}%"))

    results = cur.fetchall()
    formatted_results = [
        {
            "name": row[0],
            "start_location": row[1],
            "end_location": row[2],
            "day_of_week": row[3],
            "start_time": str(row[4]),
            "email": row[5],     
        }
        for row in results
    ]

    response = jsonify(formatted_results)
    return response


if __name__ == '__main__':
    app.run(debug=True)
