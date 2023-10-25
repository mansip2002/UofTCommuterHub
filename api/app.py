from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS

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

# in memory for now 
users = {}

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required.'}), 400
    
    if not email.endswith('utoronto.ca'):
        return jsonify({'message': 'You need a UofT (utoronto.ca) email to register.'}), 400

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

if __name__ == '__main__':
    app.run(debug=True)
