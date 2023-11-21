from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
from lib.account import get_account, create_account, set_account_verified, authenticate
from lib.globals import env
from lib.auth import encode_token
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
    
    if not email.endswith('utoronto.ca'):
        return jsonify({'message': 'You need a UofT (utoronto.ca) email to register.'}), 400

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

if __name__ == '__main__':
    app.run(debug=True)
