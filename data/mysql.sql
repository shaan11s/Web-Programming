CREATE TABLE flights (
    flight_id INT PRIMARY KEY,
    origin VARCHAR(100),
    destination VARCHAR(100),
    departure_date DATE,
    arrival_date DATE,
    departure_time TIME,
    arrival_time TIME,
    booking_number_flight VARCHAR(255),
    price DECIMAL(10, 2)
);

CREATE TABLE hotels (
    hotel_name VARCHAR(100),
    city VARCHAR(100),
    price_per_night DECIMAL(10, 2),
    check_in_date DATE,
    check_out_date DATE,
    adults INT,
    children INT,
    infants INT,
    booking_number_hotel VARCHAR(255) 
);

CREATE TABLE passengers (
    passenger_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_number_flight VARCHAR(255),
    booking_number_hotel VARCHAR(255),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    dob DATE,
    ssn VARCHAR(20),
    ticket_number VARCHAR(50)
);


