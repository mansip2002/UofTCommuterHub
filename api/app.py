from flask import Flask, request, jsonify, session
from flask_mail import Mail, Message
from flask_cors import CORS
from lib.account import get_account, create_account, set_account_verified, authenticate
from lib.globals import create_db_instance
from lib.globals import env
from lib.auth import encode_token
from lib.auth import decode_token
from lib.geocode import geocode_address_osm
from urllib.parse import quote

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": env["BASE_URL"]}})

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = env["MAIL_USERNAME"]
app.config['MAIL_PASSWORD'] = env["MAIL_PASSWORD"]

mail = Mail(app)

import secrets
def generate_verification_code():
    return secrets.token_urlsafe(16)

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email:
        return jsonify({'message': 'Email is required.'}), 400

    if not password:
        return jsonify({'message': 'Password is required.'}), 400
    
    # if not email.endswith('utoronto.ca'):
    #     return jsonify({'message': 'You need a UofT (utoronto.ca) email to register.'}), 400

    if get_account(email=email):
        return jsonify({'message': 'Email already registered.'}), 400

    verification_code = generate_verification_code()
    
    # Store the user data (email and verification code)
    create_account(email, password, verification_code)

    # Send a verification email
    msg = Message(
        'Email Verification', 
        sender='uoftcommuterhub@gmail.com', 
        recipients=[email],
        body=f'Please click on this link to verify your email: {env["BASE_URL"]}/verify?email={quote(email)}&code={verification_code}'
    )

    print(f'{env["BASE_URL"]}/verify?email={quote(email)}&code={verification_code}')

    mail.send(msg)

    return jsonify({'message': 'Registration successful! Check your email for a verification code.'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    account = get_account(email=email)

    if not email:
        return jsonify({'message': 'Email is required.'}), 400

    if not password:
        return jsonify({'message': 'Password is required.'}), 400
    
    if not account:
        return jsonify({'message': f'Account for email {email} not found.'}), 404

    if not account['verified']:
        return jsonify({'message': f'Account for email {email} not verified.'}), 401
    
    is_correct_password = authenticate(account, password)

    if not is_correct_password:
        return jsonify({'message': 'Unauthorized.'}), 401

    token = encode_token(email)

    return jsonify({ 'message': 'Correct password.', 'token': token })


@app.route('/verify', methods=['POST'])
def verify_email():
    data = request.get_json()

    email = data.get('email')
    code = data.get('code')

    account = get_account(email=email)

    if not account:
        return jsonify({'message': f'Account for email {email} not found.'}), 404

    if account['verification_code'] == code:
        set_account_verified(account['id'])
        return jsonify({'message': 'Email verified successfully!'})
    else:
        return jsonify({'message': 'Invalid verification code.'}), 400
    
db = create_db_instance()

@app.route('/user_profile', methods=['POST'])
def submit_user_profile():
    data = request.get_json()

    
    cur = db.cursor()

    email = data["email"]
    token = data["token"]

    decoded = decode_token(token)

    cur.execute("SELECT id FROM account WHERE email = %s", (decoded['email'],))
    result = cur.fetchone()

    if not result:
       return jsonify({"error": "User %s not found" % email}), 404

    user_id = result[0]

    for commuting_time in data["commutingTimes"]:
        start_location = data["startLocation"]
        end_location = data["endLocation"]
        start_time = commuting_time["start"]
        end_time = commuting_time.get("end", None)  # Use get to handle potential missing "end" key
        start_location_coords = geocode_address_osm(start_location)
        end_location_coords = geocode_address_osm(end_location)

        # Insert entry with start time
        cur.execute(
            "INSERT INTO user_profile (user_id, name, start_location, start_location_coord, end_location, day_of_week, start_time) VALUES (%s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s, %s, %s)",
            (user_id, data["name"], start_location, start_location_coords[1], start_location_coords[0], end_location, commuting_time["day"], start_time)
        )


        # Check if end time is provided and not an empty string
        if end_time is not None and end_time != "":
            # Insert entry with end time (locations reversed)
            cur.execute(
                "INSERT INTO user_profile (user_id, name, start_location, start_location_coord, end_location, day_of_week, start_time) VALUES (%s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s, %s, %s)",
                (user_id, data["name"], end_location, end_location_coords[1], end_location_coords[0], start_location, commuting_time["day"], end_time)
            )

    db.commit()
    return jsonify({"message": "Profile updated successfully"})

app.secret_key = "ThisIsNotASecret:p"

@app.route('/api/search', methods=['GET'])
def search():
    start_location = request.args.get('startLocation')
    end_location = request.args.get('endLocation')
    day_of_week = request.args.get('dayOfWeek')
    start_time = request.args.get('startTime')

    if not (start_location and end_location and day_of_week and start_time):
        return jsonify({'error': 'Please provide all required parameters'}), 400

    try:
        # Convert start location to geography type
        start_location_coords = geocode_address_osm(start_location)
        print(start_location_coords)
        cur = db.cursor()

        query = """
            SELECT name, start_location, end_location, day_of_week, start_time, email 
            FROM user_profile 
            JOIN account ON account.id = user_profile.user_id
            WHERE LOWER(day_of_week) = LOWER(%s)
            ORDER BY 
                ST_Distance(user_profile.start_location_coord, ST_SetSRID(ST_MakePoint(%s, %s), 4326)),
                ABS(EXTRACT(EPOCH FROM user_profile.start_time::TIME - %s::TIME))
            LIMIT 10
        """

        cur.execute(query, (day_of_week, start_location_coords[1], start_location_coords[0], start_time))
        results = cur.fetchall()

        print("Number of rows returned:", len(results))
        print("Results:", results)
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

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
if __name__ == '__main__':
    app.run(debug=True)
