from jwt import encode, decode, ExpiredSignatureError, DecodeError, InvalidTokenError
import datetime
from lib.globals import env
from flask import request, jsonify

def encode_token(email: str):
  token = encode({
      'email': email,
      # Token expires in 2 hours
      'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
  }, env["JWT_SECRET"], algorithm="HS256")
  
  return token

def decode_token(token: str):
  data = decode(token, env["JWT_SECRET"], algorithms=["HS256"])

  return data

def protected(f):
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({ 'message': 'A valid token is missing' })

        try:
            decode_token(token)
        except ExpiredSignatureError:
            return jsonify({ 'message': 'Token has expired' }), 401  # Unauthorized
        except DecodeError:
            return jsonify({ 'message': 'Token is invalid' }), 400  # Bad Request
        except InvalidTokenError:
            return jsonify({ 'message': 'Invalid token' }), 400  # Bad Request

        return f(*args, **kwargs)
    
    decorator.__name__ = f.__name__

    return decorator