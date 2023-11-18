import bcrypt

def generate_random_salt() -> str:
    salt = bcrypt.gensalt()
    return salt.decode()

def hash_password(password: str, salt: str) -> str:
    # Convert password to bytes
    password_bytes = password.encode('utf-8')
    salt_bytes = salt.encode('utf-8')

    hashed_password = bcrypt.hashpw(password_bytes, salt_bytes)
    return hashed_password.decode()
