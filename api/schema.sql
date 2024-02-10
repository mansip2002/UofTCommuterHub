CREATE TABLE user_profile (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT NOW(),
    verification_code VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE user_commute (
    user_id uuid,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    day_of_week VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    home_location_coords GEOGRAPHY(Point) NOT NULL,
    PRIMARY KEY (user_id, day_of_week, start_location, end_location),
    FOREIGN KEY (user_id) REFERENCES account(id)
);
