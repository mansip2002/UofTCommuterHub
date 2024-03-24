from lib.globals import create_cursor, commit_to_db
from typing import List, TypedDict
from lib.hash import generate_random_salt, hash_password

class User(TypedDict):
    id: str
    full_name: str
    email: str
    password_hash: str
    created_date: str
    verification_code: str
    verified: bool
    salt: str

def serialize_user(account: List) -> User:
    return {
        'id': str(account[0]),
        'full_name': account[1],
        'email': account[2],
        'password_hash': account[3],
        'created_date': str(account[4]),
        'verification_code': account[5],
        'verified': account[6],
        'salt': account[7]
    }

def get_user(id: str | None = None, email: str | None = None) -> User:
    cursor = create_cursor()
    cursor.execute("SELECT * FROM user_profile WHERE id=%s OR email=%s", (id, email))
    user = cursor.fetchone()
    cursor.close()

    if not user:
        return None
    
    return serialize_user(user)
    

def create_user(email: str, full_name: str, password: str, verification_code: str) -> User:
    cursor = create_cursor()

    salt = generate_random_salt()
    password_hash = hash_password(password, salt)

    cursor.execute(
        """--sql
            INSERT INTO user_profile (email, full_name, password_hash, salt, verification_code) 
            VALUES (%s, %s, %s, %s, %s) 
            RETURNING *
        """, 
        (email, full_name, password_hash, salt, verification_code)
    )

    account = cursor.fetchone()

    commit_to_db()    
    cursor.close()

    return serialize_user(account)

def set_user_verified(id: str) -> User:
    cursor = create_cursor()

    cursor.execute(
        """--sql
            UPDATE user_profile 
            SET verified = true
            WHERE id = %s
            RETURNING *
        """, 
        (id,)
    )

    account = cursor.fetchone()

    commit_to_db()
    cursor.close()

    return serialize_user(account)

def authenticate(account: User, password: str):
    password_hash = hash_password(password, account['salt'])

    return password_hash == account['password_hash']

def update_user_verification_code(id: str, verification_code: str) -> User:
    cursor = create_cursor()

    cursor.execute(
        """--sql
            UPDATE user_profile 
            SET verification_code = %s
            WHERE id = %s
            RETURNING *
        """, 
        (verification_code, id)
    )

    account = cursor.fetchone()

    commit_to_db()
    cursor.close()

    return serialize_user(account)

def update_user_password(email: str, new_password: str) -> None:
    cursor = create_cursor()

    salt = generate_random_salt()
    password_hash = hash_password(new_password, salt)

    cursor.execute(
        """--sql
            UPDATE user_profile 
            SET password_hash = %s, salt = %s
            WHERE email = %s
        """, 
        (password_hash, salt, email)
    )

    commit_to_db()
    cursor.close()