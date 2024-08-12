document.addEventListener('DOMContentLoaded', (event) => {
    displaySelectedFlights();
    displayPassengerForm();
    displaySelectedHotels();
    displayHotelGuestForm();
});

function displaySelectedFlights() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const selectedFlightsDiv = document.getElementById("selectedFlights");
    selectedFlightsDiv.innerHTML = "";

    if (cart.length === 0) {
        selectedFlightsDiv.innerHTML = "No flights selected.";
        return;
    }

    cart.forEach((flight, index) => {
        selectedFlightsDiv.innerHTML += `
            <div class="flight">
                <p>Flight ID: ${flight.flightId}</p>
                <p>Origin: ${flight.origin}</p>
                <p>Destination: ${flight.destination}</p>
                <p>Departure Date: ${flight.departureDate}</p>
                <p>Arrival Date: ${flight.arrivalDate}</p>
                <p>Departure Time: ${flight.departureTime}</p>
                <p>Arrival Time: ${flight.arrivalTime}</p>
                <p>Price per Adult: $${flight.price} X ${flight.adults}</p>
                <p>Price per Child: $${flight.price * 0.7} X ${flight.children}</p>
                <p>Price per Infant: $${flight.price * 0.1} X ${flight.infants}</p>
                <button onclick="removeFlight(${index})">Remove</button>
            </div>
        `;
    });

    calculateTotalPrice(cart);
}

function displayPassengerForm() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return;

    const passengerDetailsDiv = document.getElementById("passengerDetails");
    passengerDetailsDiv.innerHTML = "";

    cart.forEach((flight, flightIndex) => {
        const totalPassengers = flight.adults + flight.children + flight.infants;

        passengerDetailsDiv.innerHTML += `<h2>Flight Number: ${flight.flightId}</h2>`;

        for (let i = 0; i < totalPassengers; i++) {
            passengerDetailsDiv.innerHTML += `
                <div class="passenger">
                    <h3>Passenger ${i + 1}</h3>
                    <label for="firstName${flightIndex}_${i}">First Name:</label>
                    <input type="text" id="firstName${flightIndex}_${i}" name="firstName${flightIndex}_${i}" required>
                    <br>
                    <label for="lastName${flightIndex}_${i}">Last Name:</label>
                    <input type="text" id="lastName${flightIndex}_${i}" name="lastName${flightIndex}_${i}" required>
                    <br>
                    <label for="dob${flightIndex}_${i}">Date of Birth:</label>
                    <input type="date" id="dob${flightIndex}_${i}" name="dob${flightIndex}_${i}" required>
                    <br>
                    <label for="ssn${flightIndex}_${i}">SSN:</label>
                    <input type="text" id="ssn${flightIndex}_${i}" name="ssn${flightIndex}_${i}" required>
                    <br>
                </div>
            `;
        }
    });
}

function calculateTotalPrice(cart) {
    let totalPrice = 0;

    cart.forEach(flight => {
        const adultPrice = flight.price;
        const childPrice = adultPrice * 0.7;
        const infantPrice = adultPrice * 0.1;

        const adults = flight.adults;
        const children = flight.children || 0;
        const infants = flight.infants || 0;

        totalPrice += (adults * adultPrice) + (children * childPrice) + (infants * infantPrice);
    });

    document.getElementById("selectedFlights").innerHTML += `<h3>Total Price: $${totalPrice.toFixed(2)}</h3>`;
}

function bookFlight() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return;

    const passengerDetails = [];

    cart.forEach((flight, flightIndex) => {
        const totalPassengers = flight.adults + flight.children + flight.infants;
        flight.bookingNumber = 'BOOK' + Math.floor(Math.random() * 1000000); // Generate a booking number
        flight.passengerDetails = []; // Initialize the passenger details array

        for (let i = 0; i < totalPassengers; i++) {
            const firstName = document.getElementById(`firstName${flightIndex}_${i}`).value;
            const lastName = document.getElementById(`lastName${flightIndex}_${i}`).value;
            const dob = document.getElementById(`dob${flightIndex}_${i}`).value;
            const ssn = document.getElementById(`ssn${flightIndex}_${i}`).value;
            const ticketNumber = 'TICKET' + Math.floor(Math.random() * 1000000); // Generate a ticket number

            const passenger = { firstName, lastName, dob, ssn, ticketNumber };
            flight.passengerDetails.push(passenger); // Add passenger details to the flight
            passengerDetails.push(passenger); // Collect all passenger details
        }
    });

    // Send the booking information to the server
    fetch('/save-flight-bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart) // Send the cart data including flights and passengers
    })
    .then(response => response.json())  // Assuming the server responds with JSON data
    .then(data => {
        if (data.success) {
            alert('Flights booked successfully!');
            displayBookingConfirmation(cart, passengerDetails); // Display confirmation
            updateSeats(cart); // Update seat availability
            localStorage.removeItem("cart"); // Clear the cart after booking
            displaySelectedFlights();
            displayPassengerForm();
        } else {
            alert('Error booking flights: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error booking flights:', error);
        alert('Error booking flights.');
    });
}


function displayBookingConfirmation(cart, passengerDetails) {
    const bookingConfirmationDiv = document.getElementById("bookingConfirmation");
    bookingConfirmationDiv.innerHTML = `<h2>Booking Confirmation</h2>`;
    
    cart.forEach(flight => {
        bookingConfirmationDiv.innerHTML += `
            <div class="flight">
                <p>Booking Number: ${flight.bookingNumber}</p>
                <p>Flight ID: ${flight.flightId}</p>
                <p>Origin: ${flight.origin}</p>
                <p>Destination: ${flight.destination}</p>
                <p>Departure Date: ${flight.departureDate}</p>
                <p>Arrival Date: ${flight.arrivalDate}</p>
                <p>Departure Time: ${flight.departureTime}</p>
                <p>Arrival Time: ${flight.arrivalTime}</p>
            </div>
        `;
    });

    bookingConfirmationDiv.innerHTML += `<h3>Passengers</h3>`;
    passengerDetails.forEach((passenger, index) => {
        bookingConfirmationDiv.innerHTML += `
            <div class="passenger">
                <p>Passenger ${index + 1}</p>
                <p>First Name: ${passenger.firstName}</p>
                <p>Last Name: ${passenger.lastName}</p>
                <p>Date of Birth: ${passenger.dob}</p>
                <p>SSN: ${passenger.ssn}</p>
                <p>Ticket Number: ${passenger.ticketNumber}</p>
            </div>
        `;
    });

    // Clear the cart
    localStorage.removeItem("cart");
}

function updateSeats(cart) {
    fetch('data/flights.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");

            cart.forEach(flight => {
                const flightElement = Array.from(xmlDoc.getElementsByTagName("flight")).find(f => f.getElementsByTagName("flight-id")[0].textContent === flight.flightId);

                if (flightElement) {
                    const availableSeatsElement = flightElement.getElementsByTagName("available-seats")[0];
                    if (availableSeatsElement) {
                        const availableSeats = parseInt(availableSeatsElement.textContent, 10);
                        const bookedSeats = flight.adults + flight.children + flight.infants;
                        availableSeatsElement.textContent = availableSeats - bookedSeats;
                    } else {
                        console.error(`No available-seats element found for flight ID: ${flight.flightId}`);
                    }
                } else {
                    console.error(`No flight element found for flight ID: ${flight.flightId}`);
                }
            });

            const serializer = new XMLSerializer();
            const updatedXML = serializer.serializeToString(xmlDoc);

            // Send the updated XML data to the server
            fetch('/save-flights-xml', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/xml'
                },
                body: updatedXML
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log('Response from server:', data); // Log the response from server
                alert('Booking confirmed and seats updated!');
            })
            .catch(error => console.error('Error updating XML:', error));
        })
        .catch(error => console.error('Error fetching XML:', error));
}

function displaySelectedHotels() {
    const hotelsCart = JSON.parse(localStorage.getItem("cart2")) || [];
    const selectedHotelsDiv = document.getElementById("selectedHotels");
    selectedHotelsDiv.innerHTML = "";

    if (hotelsCart.length === 0) {
        selectedHotelsDiv.innerHTML = "No hotels selected.";
        return;
    }

    hotelsCart.forEach((hotel, index) => {
        const checkInDate = new Date(hotel.checkInDate);
        const checkOutDate = new Date(hotel.checkOutDate);
        const stayDuration = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24); // Duration in days
        const adultCost = stayDuration * hotel.pricePerNight * hotel.adults;
        const childCost = stayDuration * hotel.pricePerNight * 0.7 * hotel.children;
        const infantCost = 0; // Infants stay for free
        const totalPrice = adultCost + childCost + infantCost;

        selectedHotelsDiv.innerHTML += `
            <div class="hotel">
                <p>Hotel Name: ${hotel.hotelName}</p>
                <p>City: ${hotel.city}</p>
                <p>Check-in Date: ${hotel.checkInDate}</p>
                <p>Check-out Date: ${hotel.checkOutDate}</p>
                <p>Price per Night: $${hotel.pricePerNight}</p>
                <p>Adults: ${hotel.adults}, Children: ${hotel.children}, Infants: ${hotel.infants}</p>
                <p>Total Price for Stay: $${totalPrice.toFixed(2)}</p>
                <button onclick="removeHotel(${index})">Remove</button>
            </div>
        `;
    });
}


function displayHotelGuestForm() {
    const hotelsCart = JSON.parse(localStorage.getItem("cart2")) || [];
    if (hotelsCart.length === 0) return;

    const hotelGuestDetailsDiv = document.getElementById("hotelGuestDetails");
    hotelGuestDetailsDiv.innerHTML = "";

    hotelsCart.forEach((hotel, hotelIndex) => {
        const totalGuests = hotel.adults + hotel.children + hotel.infants;

        hotelGuestDetailsDiv.innerHTML += `<h2>Hotel: ${hotel['hotel-name']}</h2>`;

        for (let i = 0; i < totalGuests; i++) {
            hotelGuestDetailsDiv.innerHTML += `
                <div class="guest">
                    <h3>Guest ${i + 1}</h3>
                    <label for="hotelFirstName${hotelIndex}_${i}">First Name:</label>
                    <input type="text" id="hotelFirstName${hotelIndex}_${i}" name="hotelFirstName${hotelIndex}_${i}" required>
                    <br>
                    <label for="hotelLastName${hotelIndex}_${i}">Last Name:</label>
                    <input type="text" id="hotelLastName${hotelIndex}_${i}" name="hotelLastName${hotelIndex}_${i}" required>
                    <br>
                    <label for="hotelDob${hotelIndex}_${i}">Date of Birth:</label>
                    <input type="date" id="hotelDob${hotelIndex}_${i}" name="hotelDob${hotelIndex}_${i}" required>
                    <br>
                    <label for="hotelSsn${hotelIndex}_${i}">SSN:</label>
                    <input type="text" id="hotelSsn${hotelIndex}_${i}" name="hotelSsn${hotelIndex}_${i}" required>
                    <br>
                </div>
            `;
        }
    });
}

function clearFlights() {
    localStorage.removeItem("cart");
    displaySelectedFlights();
    displayPassengerForm();
    alert("Flights have been cleared!");
}

function removeFlight(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);  // Remove the flight at the specified index
    localStorage.setItem("cart", JSON.stringify(cart));
    displaySelectedFlights();
    displayPassengerForm();
    alert("Flight has been removed from cart!");
}

function clearHotels() {
    localStorage.removeItem("cart2");
    displaySelectedHotels();
    alert("Hotels have been cleared!");
}

function removeHotel(index) {
    let hotelsCart = JSON.parse(localStorage.getItem("cart2")) || [];
    hotelsCart.splice(index, 1);  // Remove the hotel at the specified index
    localStorage.setItem("cart2", JSON.stringify(hotelsCart));
    displaySelectedHotels();
    alert("Hotel has been removed from cart!");
}

function bookHotel() {
    const hotelsCart = JSON.parse(localStorage.getItem("cart2")) || [];
    if (hotelsCart.length === 0) {
        alert("No hotels selected.");
        return;
    }

    hotelsCart.forEach((hotel, hotelIndex) => {
        const totalGuests = hotel.adults + hotel.children + hotel.infants;
        hotel.bookingNumber = 'BOOK' + Math.floor(Math.random() * 1000000);
        hotel.guestDetails = [];

        for (let i = 0; i < totalGuests; i++) {
            const firstName = document.getElementById(`hotelFirstName${hotelIndex}_${i}`).value;
            const lastName = document.getElementById(`hotelLastName${hotelIndex}_${i}`).value;
            const dob = document.getElementById(`hotelDob${hotelIndex}_${i}`).value;
            const ssn = document.getElementById(`hotelSsn${hotelIndex}_${i}`).value;
            const category = i < hotel.adults ? 'Adult' : (i < hotel.adults + hotel.children ? 'Child' : 'Infant');

            const guest = { firstName, lastName, dob, ssn, category };
            hotel.guestDetails.push(guest);
        }
    });

    fetch('/save-hotel-bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hotelsCart)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        alert('Hotels booked successfully!');
        displayHotelBookingConfirmation(hotelsCart);
        localStorage.removeItem("cart2");
        displaySelectedHotels();
        displayHotelGuestForm();
    })
    .catch(error => {
        console.error('Error booking hotels:', error);
        alert('Error booking hotels.');
    });
}

function displayHotelBookingConfirmation(hotelsCart) {
    const bookingConfirmationDiv = document.getElementById("bookingConfirmation");
    bookingConfirmationDiv.innerHTML = `<h2>Hotel Booking Confirmation</h2>`;

    hotelsCart.forEach(hotel => {
        const checkInDate = new Date(hotel.checkInDate);
        const checkOutDate = new Date(hotel.checkOutDate);
        const stayDuration = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24); // Duration in days
        const numberOfRooms = Math.ceil((hotel.adults + hotel.children + hotel.infants) / 2); // Assuming each room can accommodate 2 guests
        const roomCost = stayDuration * hotel['pricePerNight'];
        const totalPrice = roomCost * numberOfRooms;

        bookingConfirmationDiv.innerHTML += `
            <div class="hotel">
                <p>Hotel Booking ID: ${hotel.bookingNumber}</p>
                <p>Hotel Name: ${hotel['hotelName']}</p>
                <p>City: ${hotel.city}</p>
                <p>Price per Night: $${hotel['pricePerNight']}</p>
                <p>Number of Rooms: ${numberOfRooms}</p>
                <p>Check-in Date: ${hotel.checkInDate}</p>
                <p>Check-out Date: ${hotel.checkOutDate}</p>
                <p>Total Price for Stay: $${totalPrice.toFixed(2)}</p>
                <h3>Guests</h3>
        `;

        hotel.guestDetails.forEach((guest, index) => {
            bookingConfirmationDiv.innerHTML += `
                <div class="guest">
                    <p>Guest ${index + 1}</p>
                    <p>First Name: ${guest.firstName}</p>
                    <p>Last Name: ${guest.lastName}</p>
                    <p>Date of Birth: ${guest.dob}</p>
                    <p>SSN: ${guest.ssn}</p>
                    <p>Category: ${guest.category}</p>
                </div>
            `;
        });

        bookingConfirmationDiv.innerHTML += `</div>`;
    });
}

function displayDateTime() {
    const now = new Date();
    document.getElementById('datetime').innerText = now.toLocaleString();
}

function getUserFromLocalStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function displayUserGreeting() {
    const user = getUserFromLocalStorage();
    if (user) {
        const greetingElement = document.getElementById('user-greeting');
        greetingElement.textContent = `Welcome, ${user.firstName} ${user.lastName}`;
    }
}

displayDateTime();
setInterval(displayDateTime, 1000);
displayUserGreeting();

const fontSizeSelect = document.getElementById('fontSize');
const bgColorInput = document.getElementById('bgColor');
const mainContent = document.querySelector('main');

fontSizeSelect.addEventListener('change', (event) => {
    const size = event.target.value;
    switch (size) {
        case 'small':
            mainContent.style.fontSize = '12px';
            break;
        case 'medium':
            mainContent.style.fontSize = '16px';
            break;
        case 'large':
            mainContent.style.fontSize = '20px';
            break;
    }
});

bgColorInput.addEventListener('input', (event) => {
    document.body.style.backgroundColor = event.target.value;
});
