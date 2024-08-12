document.addEventListener('DOMContentLoaded', (event) => {
    loadFlights();
});

function loadFlights() {
    fetch('data/flights.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const flights = xmlDoc.getElementsByTagName("flight");
            let availableFlights = [];

            for (let i = 0; i < flights.length; i++) {
                const flight = flights[i];
                const flightId = flight.getElementsByTagName("flight-id")[0].textContent;
                const flightOrigin = flight.getElementsByTagName("origin")[0].textContent;
                const flightDestination = flight.getElementsByTagName("destination")[0].textContent;
                const flightDepartureDate = new Date(flight.getElementsByTagName("departure-date")[0].textContent);
                const flightArrivalDate = new Date(flight.getElementsByTagName("arrival-date")[0].textContent);
                const departureTime = flight.getElementsByTagName("departure-time")[0].textContent;
                const arrivalTime = flight.getElementsByTagName("arrival-time")[0].textContent;
                const flightSeats = parseInt(flight.getElementsByTagName("available-seats")[0].textContent, 10);
                const price = parseFloat(flight.getElementsByTagName("price")[0].textContent);

                availableFlights.push({
                    flightId,
                    flightOrigin,
                    flightDestination,
                    flightDepartureDate,
                    flightArrivalDate,
                    departureTime,
                    arrivalTime,
                    flightSeats,
                    price
                });
            }

            document.getElementById('flightForm').addEventListener('submit', function(event) {
                event.preventDefault();
                filterFlights(availableFlights);
            });
        })
        .catch(error => console.log('Error loading XML:', error));
}

function toggleTripType() {
    const tripType = document.getElementById('tripType').value;
    const returnDateContainer = document.getElementById('returnDateContainer');
    if (tripType === 'round-trip') {
        returnDateContainer.style.display = 'block';
    } else {
        returnDateContainer.style.display = 'none';
    }
}

function togglePassengerForm() {
    const passengerForm = document.getElementById('passengerForm');
    if (passengerForm.style.display === 'none') {
        passengerForm.style.display = 'block';
    } else {
        passengerForm.style.display = 'none';
    }
}

function filterFlights(availableFlights) {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departureDate = new Date(document.getElementById('departureDate').value);
    const returnDate = document.getElementById('returnDate').value ? new Date(document.getElementById('returnDate').value) : null;
    const adults = parseInt(document.getElementById('adults').value, 10);
    const children = parseInt(document.getElementById('children').value, 10);
    const infants = parseInt(document.getElementById('infants').value, 10);
    const totalPassengers = adults + children + infants;
    const tripType = document.getElementById('tripType').value;

    const cities = ["Austin", "Dallas", "Houston", "San Antonio", "Los Angeles", "San Francisco", "San Diego"];
    const validDates = departureDate >= new Date('2024-09-01') && departureDate <= new Date('2024-12-01');
    const validOrigin = cities.includes(origin);
    const validDestination = cities.includes(destination);
    const validPassengers = adults <= 4 && children <= 4 && infants <= 4;

    if (!validDates) {
        alert('Departure date must be between Sep 1, 2024 and Dec 1, 2024.');
        return;
    }
    if (!validOrigin || !validDestination) {
        alert('Origin and destination must be a city in Texas or California.');
        return;
    }
    if (!validPassengers) {
        alert('Number of passengers for each category cannot be more than 4.');
        return;
    }
    if (returnDate && returnDate <= departureDate) {
        alert('Return date must be after the departure date.');
        return;
    }

    let filteredFlights = availableFlights.filter(flight => {
        return flight.flightOrigin === origin &&
               flight.flightDestination === destination &&
               flight.flightSeats >= totalPassengers &&
               Math.abs((flight.flightDepartureDate - departureDate) / (1000 * 60 * 60 * 24)) <= 3; //convert to days
    });

    if (tripType === 'round-trip' && returnDate) {
        let returnFlights = availableFlights.filter(flight => {
            return flight.flightOrigin === destination &&
                   flight.flightDestination === origin &&
                   flight.flightSeats >= totalPassengers &&
                   Math.abs((flight.flightDepartureDate - returnDate) / (1000 * 60 * 60 * 24)) <= 3; //convert to days
        });

        displaySearchResults(filteredFlights, returnFlights, totalPassengers);
    } else {
        displaySearchResults(filteredFlights, [], totalPassengers);
    }
}

function displaySearchResults(flights, returnFlights, totalPassengers) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (flights.length === 0) {
        resultsDiv.innerHTML = "No available flights found within the requested date range.";
        return;
    }

    flights.forEach(flight => {
        const comboDiv = document.createElement("div");
        comboDiv.className = "flight-combo";

        const flightDiv = document.createElement("div");
        flightDiv.className = "flight";
        flightDiv.setAttribute('data-flight-id', flight.flightId);
        flightDiv.innerHTML = `
            <p>Flight ID: ${flight.flightId}</p>
            <p>Origin: ${flight.flightOrigin}</p>
            <p>Destination: ${flight.flightDestination}</p>
            <p>Departure Date: ${flight.flightDepartureDate.toISOString().split('T')[0]}</p>
            <p class="departureTime">${flight.departureTime}</p>
            <p class="arrivalTime">${flight.arrivalTime}</p>
            <p class="arrivalDate">${flight.flightArrivalDate.toISOString().split('T')[0]}</p>
            <p>Available Seats: ${flight.flightSeats}</p>
            <p>Price per Adult: $${flight.price}</p>
            <button onclick="addToCart('${flight.flightId}', ${totalPassengers}, ${flight.price}, false)">Add Departing Flight to Cart</button>
        `;

        comboDiv.appendChild(flightDiv);

        if (returnFlights.length > 0) {
            returnFlights.forEach(returnFlight => {
                const returnFlightDiv = document.createElement("div");
                returnFlightDiv.className = "return-flight";
                returnFlightDiv.setAttribute('data-flight-id', returnFlight.flightId);
                returnFlightDiv.innerHTML = `
                    <p>Return Flight ID: ${returnFlight.flightId}</p>
                    <p>Return Origin: ${returnFlight.flightOrigin}</p>
                    <p>Return Destination: ${returnFlight.flightDestination}</p>
                    <p>Return Departure Date: ${returnFlight.flightDepartureDate.toISOString().split('T')[0]}</p>
                    <p class="departureTime">Return Departure Time: ${returnFlight.departureTime}</p>
                    <p class="arrivalTime">Return Arrival Time: ${returnFlight.arrivalTime}</p>
                    <p class="arrivalDate">Return Arrival Date: ${returnFlight.flightArrivalDate.toISOString().split('T')[0]}</p>
                    <p>Return Available Seats: ${returnFlight.flightSeats}</p>
                    <p>Return Price per Adult: $${returnFlight.price}</p>
                    <button onclick="addToCart('${flight.flightId}', ${totalPassengers}, ${flight.price}, true, '${returnFlight.flightId}', ${returnFlight.price})">Add Return Flight to Cart</button>
                `;
                comboDiv.appendChild(returnFlightDiv);
            });
        }

        resultsDiv.appendChild(comboDiv);
    });
}


function addToCart(flightId, totalPassengers, price, isRoundTrip, returnFlightId = null, returnPrice = 0) {
    const adults = parseInt(document.getElementById('adults').value, 10);
    const children = parseInt(document.getElementById('children').value, 10);
    const infants = parseInt(document.getElementById('infants').value, 10);

    const cart = JSON.parse(localStorage.getItem("cart")) || [];


    // Add return flight if it's a round-trip
    if (isRoundTrip && returnFlightId) {
        const returnFlightDetails = {
            flightId: returnFlightId,
            totalPassengers: totalPassengers,
            price: returnPrice,
            isRoundTrip: isRoundTrip,
            origin: document.getElementById('destination').value,
            destination: document.getElementById('origin').value,
            departureDate: document.getElementById('returnDate').value,
            arrivalDate: document.querySelector(`[data-flight-id="${returnFlightId}"] .arrivalDate`).textContent,
            departureTime: document.querySelector(`[data-flight-id="${returnFlightId}"] .departureTime`).textContent,
            arrivalTime: document.querySelector(`[data-flight-id="${returnFlightId}"] .arrivalTime`).textContent,
            adults: adults,
            children: children,
            infants: infants
        };
        cart.push(returnFlightDetails);
    }
    else{
            // Add departing flight
    const departureFlightDetails = {
        flightId: flightId,
        totalPassengers: totalPassengers,
        price: price,
        isRoundTrip: isRoundTrip,
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        departureDate: document.getElementById('departureDate').value,
        arrivalDate: document.querySelector(`[data-flight-id="${flightId}"] .arrivalDate`).textContent,
        departureTime: document.querySelector(`[data-flight-id="${flightId}"] .departureTime`).textContent,
        arrivalTime: document.querySelector(`[data-flight-id="${flightId}"] .arrivalTime`).textContent,
        adults: adults,
        children: children,
        infants: infants
    };
    cart.push(departureFlightDetails);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Flight added to cart!");
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