from sys import stderr
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
from lib.user import get_user, create_user, set_user_verified, authenticate
from lib.globals import env, commit_to_db, create_cursor
from lib.auth import encode_token
from lib.auth import decode_token
from lib.geocode import geocode_address_osm
from urllib.parse import quote
from jwt import ExpiredSignatureError, DecodeError, InvalidTokenError
from waitress import serve

app = Flask(__name__)

# On prod, just change the BASE_URL environment variable to the URL of the website (where the frontend is deployed)
# No need to change the line below
CORS(app, origins=env["BASE_URL"])

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = env["MAIL_USERNAME"]
app.config['MAIL_PASSWORD'] = env["MAIL_PASSWORD"]

mail = Mail(app)

import secrets
def generate_verification_code():
    return secrets.token_urlsafe(16)

def print_error(e, route: str = "unknown"):
    print("ERROR IN ROUTE", route + ":", e, file=stderr, flush=True)


@app.route('/', methods=['GET'])
def hello_world():
    return 'The backend is running!'

@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')

        if not full_name:
            return jsonify({'message': 'Name is required.'}), 400

        if not email:
            return jsonify({'message': 'Email is required.'}), 400

        if not password:
            return jsonify({'message': 'Password is required.'}), 400
        
        # if not email.endswith('utoronto.ca'):
        #     return jsonify({'message': 'You need a UofT (utoronto.ca) email to register.'}), 400

        if get_user(email=email):
            return jsonify({'message': 'Email already registered.'}), 400

        verification_code = generate_verification_code()
        
        # Store the user data (email and verification code)
        create_user(email, full_name, password, verification_code)

        # Send a verification email
        msg = Message(
            'Email Verification', 
            sender='uoftcommuterhub@gmail.com', 
            recipients=[email],
            body=f'Please click on this link to verify your email: {env["BASE_URL"]}/verify?email={quote(email)}&code={verification_code}'
        )

        mail.send(msg)

        return jsonify({'message': 'Registration successful! Check your email for a verification code.'})
    except Exception as e:
        print_error(e, "/register")
        return jsonify({"error": "There was an error."}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        user = get_user(email=email)

        if not email:
            return jsonify({'message': 'Email is required.'}), 400

        if not password:
            return jsonify({'message': 'Password is required.'}), 400
        
        if not user:
            return jsonify({'message': f'User for email {email} not found.'}), 404

        if not user['verified']:
            return jsonify({'message': f'User for email {email} not verified.'}), 401
        
        is_correct_password = authenticate(user, password)

        if not is_correct_password:
            return jsonify({'message': 'Unauthorized.'}), 401

        token = encode_token(email)

        return jsonify({ 'message': 'Correct password.', 'token': token })
    except Exception as e:
        print_error(e, "/login")
        return jsonify({"error": "There was an error."}), 500


@app.route('/verify', methods=['POST'])
def verify_email():
    try:
        data = request.get_json()

        email = data.get('email')
        code = data.get('code')

        user = get_user(email=email)

        if not user:
            return jsonify({'message': f'User for email {email} not found.'}), 404

        if user['verification_code'] == code:
            set_user_verified(user['id'])
            return jsonify({'message': 'Email verified successfully!'})
        else:
            return jsonify({'message': 'Invalid verification code.'}), 400
    except Exception as e:
        print_error(e, "/verify")
        return jsonify({"error": str(e)}), 500
    
# Get user profile
@app.route('/user', methods=['GET'])
def user():
    try:
        token = request.args.get('token')

        if not token:
            return jsonify({"error": "Token required"}), 400
                
        try:
            decoded = decode_token(token)
        except ExpiredSignatureError:
            return jsonify({ 'message': 'Token has expired' }), 401  # Unauthorized
        except DecodeError:
            return jsonify({ 'message': 'Token is invalid' }), 400  # Bad Request
        except InvalidTokenError:
            return jsonify({ 'message': 'Invalid token' }), 400  # Bad Request
        
        user = get_user(email=decoded['email'])

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "full_name": user['full_name'],
            "email": user['email'],
            "verified": user['verified']
        })
    except Exception as e:
        print_error(e, "/user")
        return jsonify({"error": str(e)}), 500

@app.route('/user_commute', methods=['POST'])
def user_commute():
    try:
        data = request.get_json()
        token = data["token"]
        cursor = create_cursor()
        decoded = decode_token(token)

        user = get_user(email=decoded['email'])

        if not user:
            return jsonify({"error": "User %s not found"}), 404

        user_id = user['id']

        start_location = data["startLocation"]
        end_location = data["endLocation"]
        start_time = data["startTime"]
        end_time = data["endTime"]
        day_of_week = data["dayOfWeek"]

        # We always compare by home location
        # We care if their homes are closeby, whether they're going to school or returning from school
        # Of course, we check to make sure either one of their start or end locations are equal (both leaving or going to school) while matching
        home_location = start_location if end_location == "40 St George St" else end_location
        home_location_coords = geocode_address_osm(home_location)

        # Insert entry with start time
        cursor.execute(
            "INSERT INTO user_commute (user_id, start_location, home_location_coords, end_location, day_of_week, start_time) VALUES (%s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s, %s, %s)",
            (user_id, start_location, home_location_coords[1], home_location_coords[0], end_location, day_of_week, start_time)
        )


        # Check if end time is provided and not an empty string
        if end_time is not None and end_time != "":
            # Insert entry with end time (locations reversed)
            cursor.execute(
                "INSERT INTO user_commute (user_id, start_location, home_location_coords, end_location, day_of_week, start_time) VALUES (%s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s, %s, %s)",
                (user_id, end_location, home_location_coords[1], home_location_coords[0], start_location, day_of_week, end_time)
            )

        commit_to_db()
        cursor.close()

        return jsonify({"message": "Profile updated successfully"})
    except Exception as e:
        print_error(e, "/user_commute")
        return jsonify({"error": "There was an error."}), 500

app.secret_key = "ThisIsNotASecret:p"

# Get all of a user's commutes
@app.route('/user_commutes', methods=['GET'])
def user_commutes():
    try:
        token = request.args.get('token')

        if not token:
            return jsonify({"error": "Token required"}), 400

        decoded = decode_token(token)
        user = get_user(email=decoded['email'])

        if not user:
            return jsonify({"error": "User not found"}), 404

        cursor = create_cursor()

        cursor.execute("SELECT * FROM user_commute WHERE user_id = %s", (user['id'],))
        results = cursor.fetchall()

        cursor.close()

        formatted_results = [
            {
                "user_id": row[0],
                "start_location": row[1],
                "end_location": row[2],
                "day_of_week": row[3],
                "start_time": str(row[4]),
                "home_location_coords": row[5],
            }
            for row in results
        ]

        return jsonify(formatted_results)
    except Exception as e:
        print_error(e, "/user_commutes")
        return jsonify({"error": "There was an error."}), 500


@app.route('/search', methods=['GET'])
def search():
    start_location = request.args.get('startLocation')
    end_location = request.args.get('endLocation')
    day_of_week = request.args.get('dayOfWeek')
    start_time = request.args.get('startTime')
    token = request.args.get('token')

    user = None

    if token:
        decoded = decode_token(token)
        user = get_user(email=decoded['email'])

    if not (start_location and end_location and day_of_week and start_time):
        return jsonify({'error': 'Please provide all required parameters'}), 400

    try:
        def is_campus_address(addr: str):
            addr = addr.lower()
            if "st george st" in addr and "40" in addr:
                return True
            return False

        # Convert home location to geography type
        home_location = start_location if is_campus_address(end_location) else end_location
        home_location = home_location.split("—")[0]
        home_location_coords = geocode_address_osm(home_location)
        cur = create_cursor()

        print_error(home_location);
        print_error(home_location_coords);

        query = """--sql
            SELECT full_name, start_location, end_location, day_of_week, start_time, email 
            FROM user_commute 
            JOIN user_profile ON user_profile.id = user_commute.user_id
            WHERE 
                LOWER(day_of_week) = LOWER(%s) AND 
                (LOWER(start_location) = LOWER(%s) OR LOWER(end_location) = LOWER(%s)) AND
                email <> %s
            ORDER BY 
                ST_Distance(user_commute.home_location_coords, ST_SetSRID(ST_MakePoint(%s, %s), 4326)),
                ABS(EXTRACT(EPOCH FROM user_commute.start_time::TIME - %s::TIME))
            LIMIT 10
        """

        cur.execute(query, (day_of_week, start_location, end_location, user['email'] if user else '', home_location_coords[1], home_location_coords[0], start_time))
        results = cur.fetchall()

        formatted_results = [
            {
                "full_name": row[0],
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
        print_error(e, "/search")
        return jsonify({'error': "There was an error."}), 500


if (env.get("ENVIRONMENT") == "development"):    
    app.run(host='0.0.0.0', port=int(env.get('PORT', 5000)), debug=True)
else:
    serve(app, host='0.0.0.0', port=env.get('PORT', 5000))