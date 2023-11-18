CREATE TABLE account (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT NOW(),
    verification_code VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE user_profile (
    user_id uuid,
    name VARCHAR(255) NOT NULL,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    account_id uuid REFERENCES account(id),
    day_of_week VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    PRIMARY KEY (
        user_id,
        day_of_week,
        start_location,
        end_location
    ),
    FOREIGN KEY (user_id) REFERENCES account(id)
);