CREATE TABLE account (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password_hash VARCHAR(255)
)
