import sys
import os
import json
import pytest
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
from test import euclidean_distance, time_difference
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
    assert response.status_code == 400

def test_search(client):
    response = client.get('/search')
    assert response.status_code == 400

# database layer tests 
    
# test retreival of user information
def test_user_db(client):
    data = {'email': 'ku.patel@mail.utoronto.com', 'password': 'test'}
    login_response = client.post('/login', json=data)
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imt1LnBhdGVsQG1haWwudXRvcm9udG8uY2EiLCJleHAiOjE3MDc5NTQwNjF9.cSaCILyPJRwYFeMGbHMfefVNR8jFr_cTKC9ULtXWLKQ'
    response = client.get('/user?token=' + token)
    assert response.status_code == 200

    # Extract JSON data from the response
    user_data = json.loads(response.data)

    # Assert that the response contains the expected keys
    assert 'email' in user_data
    assert 'full_name' in user_data
    assert 'verified' in user_data

    assert user_data['email'] == 'ku.patel@mail.utoronto.ca'
    assert user_data['full_name'] == 'Krishna Patel'
    assert user_data['verified'] == True

# test retreival of user commutes 
def test_user_commutes_db(client):
    # Test getting user commutes with valid token
    data = {'email': 'ku.patel@mail.utoronto.com', 'password': 'test'}
    login_response = client.post('/login', json=data)
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imt1LnBhdGVsQG1haWwudXRvcm9udG8uY2EiLCJleHAiOjE3MDc5NTQwNjF9.cSaCILyPJRwYFeMGbHMfefVNR8jFr_cTKC9ULtXWLKQ'
    response = client.get('/user_commutes?token=' + token)
    assert response.status_code == 200

    # Extract JSON data from the response
    user_commutes = json.loads(response.data)

    # Assert that the response contains the expected keys
    assert 'user_id' in user_commutes[0]
    assert 'start_location' in user_commutes[0]
    assert 'end_location' in user_commutes[0]
    assert 'day_of_week' in user_commutes[0]
    assert 'start_time' in user_commutes[0]
    assert 'home_location_coords' in user_commutes[0]

    # Assert specific values or patterns
    assert user_commutes[0]['start_location'] == '89 Chestnut Street '
    assert user_commutes[0]['day_of_week'] in ['Monday', 'Wednesday']
    assert user_commutes[0]['end_location'] == '40 St George Street '

# test retreival of search data 
def test_searching_db(client):
    # Test getting user commutes with valid token
    data = {'email': 'ku.patel@mail.utoronto.com', 'password': 'test'}
    login_response = client.post('/login', json=data)
    data = {'startLocation': '774, Manning Avenue, Seaton Village, University—Rosedale, Old Toronto, Toronto, Golden Horseshoe, Ontario, M6G 2R4, Canada',
            'endLocation': '40 St George St',
            'dayOfWeek': 'Monday',
            'startTime': '09:00',
            'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imt1LnBhdGVsQG1haWwudXRvcm9udG8uY2EiLCJleHAiOjE3MDc5NTQwNjF9.cSaCILyPJRwYFeMGbHMfefVNR8jFr_cTKC9ULtXWLKQ'}
    
    url = (
        '/search?startLocation=774, Manning Avenue'
        '&endLocation=40 St George St'
        '&dayOfWeek=Monday'
        '&startTime=09:00'
        '&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imt1LnBhdGVsQG1haWwudXRvcm9udG8uY2EiLCJleHAiOjE3MDc5NTQwNjF9.cSaCILyPJRwYFeMGbHMfefVNR8jFr_cTKC9ULtXWLKQ'
    )
    response = client.get(url)
    assert response.status_code == 200

    # Extract JSON data from the response
    results = json.loads(response.data)

    # Assert that the response contains the expected keys
    assert 'email' in results[0]
    assert 'start_location' in results[0]
    assert 'end_location' in results[0]
    assert 'day_of_week' in results[0]
    assert 'start_time' in results[0]
    assert 'full_name' in results[0]

    # Assert specific values or patterns
    assert results[0]['end_location'] == '40 St George St'
    assert results[0]['day_of_week'] in ['Monday']
    assert results[0]['start_location'] == '31 Pendrith St'

# test accuracy of top 1 search result
def test_top1_accuracy(client):
    # Test getting user commutes with valid token
    data = {'email': 'ku.patel@mail.utoronto.com', 'password': 'test'}
    login_response = client.post('/login', json=data)

    url = (
        '/search?startLocation=31 Pendrith St'
        '&endLocation=40 St George St'
        '&dayOfWeek=Monday'
        '&startTime=11:26:48'
        '&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imt1LnBhdGVsQG1haWwudXRvcm9udG8uY2EiLCJleHAiOjE3MDc5NTQwNjF9.cSaCILyPJRwYFeMGbHMfefVNR8jFr_cTKC9ULtXWLKQ'
    )
    response = client.get(url)
    assert response.status_code == 200

    # Extract JSON data from the response
    results = json.loads(response.data)

    # Assert that the response contains the expected keys
    assert 'email' in results[0]
    assert 'start_location' in results[0]
    assert 'end_location' in results[0]
    assert 'day_of_week' in results[0]
    assert 'start_time' in results[0]
    assert 'full_name' in results[0]

    # Assert specific values or patterns
    assert results[0]['end_location'] == '40 St George St'
    assert results[0]['day_of_week'] in ['Monday']
    assert results[0]['start_location'] == '31 Pendrith St'

# test accuracy of top 5 search results
def test_top5_accuracy(client):
    # Test getting user commutes with valid token
    data = {'email': 'ku.patel@mail.utoronto.com', 'password': 'test'}
    login_response = client.post('/login', json=data)

    search_address = 'Woodsworth College Residence'
    search_time = '20:00:00'


    url = (
        '/search?startLocation=Woodsworth College Residence'
        '&endLocation=40 St George St'
        '&dayOfWeek=Monday'
        '&startTime=20:00:00'
        '&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imt1LnBhdGVsQG1haWwudXRvcm9udG8uY2EiLCJleHAiOjE3MDc5NTQwNjF9.cSaCILyPJRwYFeMGbHMfefVNR8jFr_cTKC9ULtXWLKQ'
    )
    response = client.get(url)
    assert response.status_code == 200

    # Extract JSON data from the response
    results = json.loads(response.data)

    # Assert that the response contains the expected keys
    assert 'email' in results[0]
    assert 'start_location' in results[0]
    assert 'end_location' in results[0]
    assert 'day_of_week' in results[0]
    assert 'start_time' in results[0]
    assert 'full_name' in results[0]


    assert results[0]['day_of_week'] in ['Monday']
    assert results[0]['start_location'] == '321 Bloor St West'


    distance1 = euclidean_distance(search_address, results[0]['start_location'])
    distance2 = euclidean_distance(search_address, results[1]['start_location'])
    distance3 = euclidean_distance(search_address, results[2]['start_location'])
    distance4 = euclidean_distance(search_address, results[3]['start_location'])
    distance5 = euclidean_distance(search_address, results[4]['start_location'])


    time1 = abs(time_difference(results[0]['start_time'], search_time))
    time2 = abs(time_difference(results[1]['start_time'], search_time))
    time3 = abs(time_difference(results[2]['start_time'], search_time))
    time4 = abs(time_difference(results[3]['start_time'], search_time))
    time5 = abs(time_difference(results[4]['start_time'], search_time))

    avg1 = (distance1 + time1)/2
    avg2 = (distance2 + time2)/2
    avg3 = (distance3 + time3)/2
    avg4 = (distance4 + time4)/2
    avg5 = (distance5 + time5)/2

    assert distance1 < distance2 or time1 < time2
    assert distance2 < distance3 or time2 < time3
    assert distance3 < distance4 or time3 < time4
    assert distance4 < distance5 or time4 < time5

    assert avg1 < avg2
    assert avg2 < avg3
    assert avg3 < avg4
    assert avg4 < avg5

    assert response.status_code == 200

def test_function():
    print("Testing pytest")
    assert True
