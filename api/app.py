from flask import Flask, request, jsonify, session
from flask_mail import Mail, Message
from flask_cors import CORS
from lib.account import get_account, create_account, set_account_verified, authenticate

app = Flask(__name__)
CORS(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'uoftcommuterhub@gmail.com'
app.config['MAIL_PASSWORD'] = 'opwx fjsf bxto oqpq'

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
    
    if not email.endswith('utoronto.ca'):
        return jsonify({'message': 'You need a UofT (utoronto.ca) email to register.'}), 400

    if get_account(email=email):
        return jsonify({'message': 'Email already registered.'}), 400

    verification_code = generate_verification_code()
    
    # Store the user data (email and verification code)
    create_account(email, password, verification_code)

    # Send a verification email
    msg = Message('Email Verification', sender='uoftcommuterhub@gmail.com', recipients=[email])
    msg.body = f'Your verification code is: {verification_code}'
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
    
    is_correct_password = authenticate(account, password)

    if not is_correct_password:
        return jsonify({'message': 'Unauthorized.'}), 401

    return jsonify({'message': 'Correct password.'})


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
    
@app.route('/user_profile', methods=['POST'])
def submit_user_profile():
    data = request.get_json()

    cur = db.cursor()

    # email = session.get("email")
    email = "50000"

    # Retrieve user_id from the account table based on the email
    cur.execute("SELECT id FROM account WHERE email = %s", (email,))
    result = cur.fetchone()

    if not result:
        return jsonify({"error": "User not found"}), 404

    user_id = result[0]

    for commuting_time in data["commutingTimes"]:
        start_location = data["startLocation"]
        end_location = data["endLocation"]
        start_time = commuting_time["start"]
        end_time = commuting_time.get("end", None)  # Use get to handle potential missing "end" key

        # Insert entry with start time
        cur.execute(
            "INSERT INTO user_profile (user_id, name, start_location, end_location, day_of_week, start_time) VALUES (%s, %s, %s, %s, %s, %s)",
            (user_id, data["name"], start_location, end_location, commuting_time["day"], start_time)
        )

        # Check if end time is provided and not an empty string
        if end_time is not None and end_time != "":
            # Insert entry with end time (locations reversed)
            cur.execute(
                "INSERT INTO user_profile (user_id, name, start_location, end_location, day_of_week, start_time) VALUES (%s, %s, %s, %s, %s, %s)",
                (user_id, data["name"], end_location, start_location, commuting_time["day"], end_time)
            )

    db.commit()
    return jsonify({"message": "Data submitted successfully"})


if __name__ == '__main__':
    app.run(debug=True)
