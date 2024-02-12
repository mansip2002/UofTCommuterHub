import sys
import os
import json
import pytest
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

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
CORS(app)

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_backend(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'The backend is running!' in response.data


def test_already_register_user(client):
    response = client.post('/register', json={'email': 'test@example.com', 'password': 'password', 'full_name': 'Test User'})
    assert response.status_code == 400
    assert b'Email already registered' in response.data

def test_password_missing(client):
    response = client.post('/register', json={'email': 'notvalid.com', 'password': '', 'full_name': 'Test User'})
    assert response.status_code == 400
    assert b'Password is required.' in response.data


def test_user_commutes(client):
    response = client.get('/user_commutes')
    assert response.status_code == 200

def test_search(client):
    response = client.get('/search')
    assert response.status_code == 200

def test_function():
    print("Testing pytest")
    assert True
