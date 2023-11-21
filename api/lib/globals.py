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