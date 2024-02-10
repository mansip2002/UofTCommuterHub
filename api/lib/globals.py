import psycopg
from dotenv import load_dotenv, dotenv_values

load_dotenv()

env = dotenv_values()

def create_db_instance():
    db = psycopg.connect(
        dbname=env["DB_NAME"], 
        host=env["DB_HOST"],
        user=env["DB_USER"],
        password=env["DB_PASSWORD"]
    )

    return db

db = create_db_instance()

def create_cursor():
    global db

    if (db.closed):
        db = create_db_instance()
        return db.cursor()
    
    return db.cursor()

def commit_to_db():
    db.commit()