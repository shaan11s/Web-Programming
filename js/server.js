const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const bodyParserXml = require('body-parser-xml');
const path = require('path');
const { Builder } = require('xml2js');
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

bodyParserXml(bodyParser);

app.use(bodyParser.json());

app.use(bodyParser.xml({
    limit: '1MB',   // Reject payload larger than 1MB
    xmlParseOptions: {
        normalize: true,     // Trim whitespace inside text nodes
        normalizeTags: true, // Convert tags to lowercase
        explicitArray: false // Only put nodes in array if >1
    }
}));

// Serve static files from the respective directory
app.use(express.static(path.join(__dirname, '..', 'html')));
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));
app.use('/data', express.static(path.join(__dirname, '..', 'data')));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//MySQL connection
var mysql2 = require('mysql2'); 
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'demo'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

app.post('/save-xml', (req, res) => {
    console.log('Received a request');
    
    const xmlData = req.body;
    console.log('Received XML Data:', xmlData);

    if (!xmlData) {
        console.error('No XML data received');
        return res.status(400).send('Bad Request: No XML data received');
    }

    const builder = new Builder();
    const xml = builder.buildObject(xmlData);

    const filePath = path.join(__dirname, '..', 'data', 'contact.xml');

    fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directory:', err);
            return res.status(500).send('Server error');
        }

        fs.writeFile(filePath, xml, { flag: 'a' }, (err) => {
            if (err) {
                console.error('Error saving XML:', err);
                return res.status(500).send('Server error');
            } else {
                res.send('XML data saved successfully');
                console.log('XML data saved successfully');
            }
        });
    });
});

app.post('/register', (req, res) => {
    const newUser = req.body;
    const filePath = path.join(__dirname, '..', 'data', 'users.json');

    fs.readFile(filePath, (err, data) => {
        let users = [];
        if (!err) {
            try {
                users = JSON.parse(data);
            } catch (err) {
                console.error('Error parsing existing JSON:', err);
            }
        }

        // Check if the phone number already exists
        const userExists = users.some(user => user.phone === newUser.phone);
        if (userExists) {
            res.send({ success: false, message: 'User already exists' });
            return;
        }

        users.push(newUser);

        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error saving JSON:', err);
                res.status(500).send({ success: false, message: 'Server error' });
            } else {
                res.send({ success: true });
                console.log('User data saved successfully');
            }
        });
    });

    // Save user to MySQL
    // const sql = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    // db.query(sql, [newUser.first_name, newUser.last_name, newUser.email, newUser.password], (err, result) => {
    //     if (err) {
    //         console.error('Error registering user:', err);
    //     } else {
    //         console.log('User data saved to MySQL successfully');
    //     }
    // });
});

app.post('/login', (req, res) => {
    const { phone, password } = req.body;
    const filePath = path.join(__dirname, '..', 'data', 'users.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Server error' });
            return;
        }

        let users = [];
        try {
            users = JSON.parse(data);
        } catch (err) {
            res.status(500).send({ success: false, message: 'Server error' });
            return;
        }

        const user = users.find(user => user.phone === phone && user.password === password);
        if (user) {
            res.send({ success: true, user });
        } else {
            res.send({ success: false, message: 'Invalid phone number or password' });
        }
    });

    // Authenticate user with MySQL
    // const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    // db.query(sql, [phone, password], (err, results) => {
    //     if (err) {
    //         console.error('Error authenticating user with MySQL:', err);
    //     } else if (results.length > 0) {
    //         console.log('User authenticated with MySQL successfully');
    //     } else {
    //         console.log('Invalid email or password for MySQL');
    //     }
    // });
});

app.post('/save-flight-bookings', (req, res) => {
    const bookings = req.body;

    bookings.forEach(booking => {
        const flightSql = 'SELECT * FROM flights WHERE flight_id = ?';

        db.query(flightSql, [booking.flightId], (err, results) => {
            if (err) {
                console.error('Error checking flight:', err);
                res.status(500).send('Server error');
                return;
            }

            if (results.length === 0) {
                // Flight doesn't exist, insert it first
                const insertFlightSql = 'INSERT INTO flights (flight_id, origin, destination, departure_date, arrival_date, departure_time, arrival_time, booking_number_flight, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

                db.query(insertFlightSql, [booking.flightId, booking.origin, booking.destination, booking.departureDate, booking.arrivalDate, booking.departureTime, booking.arrivalTime, booking.bookingNumber, booking.price], (err, result) => {
                    if (err) {
                        console.error('Error inserting flight:', err);
                        res.status(500).send('Server error');
                        return;
                    }
                    console.log('Flight inserted successfully');
                    insertPassengerDetails(booking, res);
                });
            } else {
                // Flight exists, proceed to insert booking
                insertPassengerDetails(booking, res);
            }
        });
    });
});

function insertPassengerDetails(booking, res) {
    booking.passengerDetails.forEach(passenger => {
        const guestSql = 'INSERT INTO passengers (booking_number_flight, first_name, last_name, dob, ssn, ticket_number) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(guestSql, [booking.bookingNumber, passenger.firstName, passenger.lastName, passenger.dob, passenger.ssn, passenger.ticketNumber], (err, result) => {
            if (err) {
                console.error('Error saving passenger to MySQL:', err);
                res.status(500).send('Server error');
                return;
            }
        });
    });

    console.log('Flight bookings and passengers saved to MySQL successfully');
    res.send('Bookings and passengers saved successfully');
}

app.post('/save-flights-xml', (req, res) => {
    console.log('Received a request');
    
    const xmlData = req.body;
    console.log('Received XML Data:', xmlData);

    if (!xmlData) {
        console.error('No XML data received');
        return res.status(400).send('Bad Request: No XML data received');
    }

    const builder = new Builder();
    const xml = builder.buildObject(xmlData);

    const filePath = path.join(__dirname, '..', 'data', 'flights.xml');

    fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directory:', err);
            return res.status(500).send('Server error');
        }

        fs.writeFile(filePath, xml, (err) => {
            if (err) {
                console.error('Error saving XML:', err);
                return res.status(500).send('Server error');
            } else {
                res.send('XML data saved successfully');
                console.log('XML data saved successfully');
            }
        });
    });
});

app.post('/save-hotel-bookings', async (req, res) => {
    const bookings = req.body;

    try {
        for (const booking of bookings) {
            // Generate a custom booking number for the hotel
            const bookingNumber = 'HOTEL-' + Math.floor(Math.random() * 1000000);

            // Insert into the hotels table with the custom booking number
            const [hotelResult] = await db.promise().query(
                'INSERT INTO hotels (hotel_name, city, price_per_night, check_in_date, check_out_date, adults, children, infants, booking_number_hotel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [booking.hotelName, booking.city, booking.pricePerNight, booking.checkInDate, booking.checkOutDate, booking.adults, booking.children, booking.infants, bookingNumber]
            );

            const hotelId = hotelResult.insertId;

            // Insert each guest into the passengers table, associating them with the hotel booking
            for (const guest of booking.guestDetails) {
                await db.promise().query(
                    'INSERT INTO passengers (first_name, last_name, dob, ssn, booking_number_hotel) VALUES (?, ?, ?, ?, ?)',
                    [guest.firstName, guest.lastName, guest.dob, guest.ssn, bookingNumber]
                );
            }
        }

        console.log('Hotel bookings and passengers saved to MySQL successfully');
        res.send('Bookings and guests saved successfully');
    } catch (error) {
        console.error('Error saving booking or passengers to MySQL:', error);
        res.status(500).send('Server error');
    }
});



app.post('/save-flight-bookings', (req, res) => {
    const bookings = req.body;

    bookings.forEach(booking => {
        // 1. Update or insert into the FLIGHTS table
        const checkFlightSql = 'SELECT * FROM flights WHERE flight_id = ?';
        db.query(checkFlightSql, [booking.flightId], (err, results) => {
            if (err) {
                console.error('Error checking flight:', err);
                res.status(500).send('Server error');
                return;
            }

            if (results.length === 0) {
                // Flight doesn't exist, insert it first
                const insertFlightSql = `
                    INSERT INTO flights (flight_id, origin, destination, departure_date, arrival_date, departure_time, arrival_time, booking_number_flight, price)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                db.query(insertFlightSql, [
                    booking.flightId,
                    booking.origin,
                    booking.destination,
                    booking.departureDate,
                    booking.arrivalDate,
                    booking.departureTime,
                    booking.arrivalTime,
                    booking.bookingNumber,
                    booking.price
                ], (err, result) => {
                    if (err) {
                        console.error('Error inserting flight:', err);
                        res.status(500).send('Server error');
                        return;
                    }
                    console.log('Flight inserted successfully');
                    insertPassengerDetails(booking, res);
                });
            } else {
                // Flight exists, update the booking number
                const updateFlightSql = `
                    UPDATE flights
                    SET booking_number_flight = ?
                    WHERE flight_id = ?
                `;
                db.query(updateFlightSql, [booking.bookingNumber, booking.flightId], (err, result) => {
                    if (err) {
                        console.error('Error updating flight:', err);
                        res.status(500).send('Server error');
                        return;
                    }
                    console.log('Flight updated successfully');
                    insertPassengerDetails(booking, res);
                });
            }
        });
    });
});

function insertPassengerDetails(booking, res) {
    booking.passengerDetails.forEach(passenger => {
        const insertPassengerSql = `
            INSERT INTO passengers (booking_number_flight, first_name, last_name, dob, ssn, ticket_number)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(insertPassengerSql, [
            booking.bookingNumber,
            passenger.firstName,
            passenger.lastName,
            passenger.dob,
            passenger.ssn,
            passenger.ticketNumber
        ], (err, result) => {
            if (err) {
                console.error('Error saving passenger to MySQL:', err);
                res.status(500).send('Server error');
                return;
            }
        });
    });

    console.log('Passengers saved to MySQL successfully');
    res.send('Bookings and passengers saved successfully');
}


app.post('/save-hotels', (req, res) => {
    console.log('Received a request');
    const newHotelData = req.body;
    console.log('Received JSON Data:');
    console.log(JSON.stringify(newHotelData, null, 2));

    const filePath = path.join(__dirname, '..', 'data', 'hotels.json');

    fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directory:', err);
            res.status(500).send('Server error');
            return;
        }

        fs.readFile(filePath, (err, data) => {
            let existingData = [];
            if (!err) {
                try {
                    existingData = JSON.parse(data);
                    if (!Array.isArray(existingData)) {
                        existingData = [];
                    }
                } catch (err) {
                    console.error('Error parsing existing JSON:', err);
                }
            }

            const updatedData = existingData.concat(newHotelData);

            fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), (err) => {
                if (err) {
                    console.error('Error saving JSON:', err);
                    res.status(500).send('Server error');
                } else {
                    res.send('JSON data saved successfully');
                    console.log('JSON data saved successfully');
                }
            });
        });
    });
});

// function addToCart(hotelId, checkInDate, checkOutDate, adults, children, infants) {
//     const hotel = hotels.find(h => h['hotel-id'] === hotelId);
//     if (!hotel) return;

//     // Ensure that all necessary hotel details are included
//     const hotelToAdd = {
//         hotelId: hotel['hotel-id'], 
//         hotelName: hotel['hotel-name'], 
//         city: hotel.city, 
//         pricePerNight: hotel['price-per-night'],
//         checkInDate, 
//         checkOutDate, 
//         adults, 
//         children, 
//         infants
//     };

//     const cart = JSON.parse(localStorage.getItem('cart2')) || [];
//     cart.push(hotelToAdd);
//     localStorage.setItem('cart2', JSON.stringify(cart));

//     console.log(`Hotel with ID ${hotelId} added to cart with check-in: ${checkInDate} and check-out: ${checkOutDate}, adults: ${adults}, children: ${children}, infants: ${infants}`);
//     alert(`Hotel ${hotel['hotel-name']} added to cart with check-in: ${checkInDate}, check-out: ${checkOutDate}, adults: ${adults}, children: ${children}, infants: ${infants}`);
// }


// function insertGuestDetails(booking, res) {
//     booking.guestDetails.forEach(guest => {
//         const guestSql = 'INSERT INTO passengers (booking_number_hotel, first_name, last_name, dob, ssn) VALUES (?, ?, ?, ?, ?)';
//         db.query(guestSql, [booking.bookingNumber, guest.firstName, guest.lastName, guest.dob, guest.ssn], (err, result) => {
//             if (err) {
//                 console.error('Error saving guest to MySQL:', err);
//                 res.status(500).send('Server error');
//                 return;
//             }
//         });
//     });

//     console.log('Hotel bookings and guests saved to MySQL successfully');
//     res.send('Bookings and guests saved successfully');
// }

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/get-flight-bookings', (req, res) => {
    const user = getUserFromLocalStorage();
    if (!user) {
        return res.status(401).send('Unauthorized');
    }

    const sql = 'SELECT * FROM flights WHERE booking_number_flight = ?';
    db.query(sql, [user.bookingNumber], (err, results) => {
        if (err) {
            console.error('Error fetching bookings from MySQL:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

app.post('/run-query', async (req, res) => {
    const { query } = req.body;

    try {
        const [results] = await db.promise().query(query);
        res.json({ results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});