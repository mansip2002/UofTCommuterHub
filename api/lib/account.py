from lib.globals import create_db_instance
from typing import List, TypedDict
from lib.hash import generate_random_salt, hash_password

class Account(TypedDict):
    id: str
    email: str
    password_hash: str
    created_date: str
    verification_code: str
    verified: bool
    salt: str

def serialize_account(account: List) -> Account:
    return {
        'id': str(account[0]),
        'email': account[1],
        'password_hash': account[2],
        'created_date': str(account[3]),
        'verification_code': account[4],
        'verified': account[5],
        'salt': account[6]
    }

def get_account(id: str | None = None, email: str | None = None) -> Account:
    db = create_db_instance()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM account WHERE id=%s OR email=%s", (id,email))

    account = cursor.fetchone()

    cursor.close()

    if not account:
        return None
    
    return serialize_account(account)
    

def create_account(email: str, password: str, verification_code: str) -> Account:
    db = create_db_instance()
    cursor = db.cursor()

    salt = generate_random_salt()
    password_hash = hash_password(password, salt)

    cursor.execute(
        """--sql
            INSERT INTO account (email, password_hash, salt, verification_code) 
            VALUES (%s, %s, %s, %s) 
            RETURNING *
        """, 
        (email, password_hash, salt, verification_code)
    )

    account = cursor.fetchone()

    db.commit()
    cursor.close()

    return serialize_account(account)

def set_account_verified(id: str) -> Account:
    db = create_db_instance()
    cursor = db.cursor()

    cursor.execute(
        """--sql
            UPDATE account 
            SET verified = true
            WHERE id = %s
            RETURNING *
        """, 
        (id,)
    )

    account = cursor.fetchone()

    db.commit()
    cursor.close()

    return serialize_account(account)

def authenticate(account: Account, password: str):
    print(password)
    password_hash = hash_password(password, account['salt'])

    return password_hash == account['password_hash']