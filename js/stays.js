let hotels = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/hotels.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data); // Debugging log
            if (data && data.hotels) {
                hotels = data.hotels;
                console.log('Hotels data:', hotels); // Debugging log
            } else {
                console.error('Invalid data structure:', data);
            }
        })
        .catch(error => console.error('Error fetching hotels:', error));
});

function validateAndDisplay() {
    const city = document.getElementById('city').value;
    const checkin = new Date(document.getElementById('checkin').value);
    const checkout = new Date(document.getElementById('checkout').value);
    const adults = parseInt(document.getElementById('adults').value);
    const children = parseInt(document.getElementById('children').value);
    const infants = parseInt(document.getElementById('infants').value);

    const cities = ["Dallas", "Houston", "Austin", "San Antonio", "Los Angeles", "San Francisco", "San Diego"];
    const minDate = new Date('2024-09-01');
    const maxDate = new Date('2024-12-01');

    let errors = [];

    if (!cities.includes(city)) {
        errors.push("City must be in Texas or California.");
    }

    if (!(checkin >= minDate && checkin <= maxDate && checkout >= minDate && checkout <= maxDate)) {
        errors.push("Dates must be between Sep 1, 2024, and Dec 1, 2024.");
    }

    if (adults > 2 || children > 2) {
        errors.push("Number of adults or children cannot exceed 2 per room.");
    }

    if (errors.length > 0) {
        document.getElementById('output').innerHTML = errors.join("<br>");
        return;
    }

    const totalGuests = adults + children + infants;
    const roomsNeeded = Math.ceil(totalGuests / 2);

    const result = `
        <h3>Booking Details</h3>
        <p>City: ${city}</p>
        <p>Check-in Date: ${checkin.toDateString()}</p>
        <p>Check-out Date: ${checkout.toDateString()}</p>
        <p>Adults: ${adults}</p>
        <p>Children: ${children}</p>
        <p>Infants: ${infants}</p>
        <p>Total Guests: ${totalGuests}</p>
        <p>Number of Rooms Needed: ${roomsNeeded}</p>
    `;

    document.getElementById('output').innerHTML = result;

    // Display available hotels in the city
    displayHotels(city, checkin, checkout);
}

function displayHotels(city, checkin, checkout) {
    console.log('Hotels:', hotels); // Debugging log
    const hotelsInCity = hotels.filter(hotel => hotel.city.toLowerCase() === city.toLowerCase());

    console.log('Hotels in city:', hotelsInCity); // Debugging log

    if (hotelsInCity.length > 0) {
        let hotelsOutput = '<h3>Available Hotels</h3>';
        hotelsInCity.forEach(hotel => {
            hotelsOutput += `
                <div>
                    <p>Name: ${hotel['hotel-name']}</p>
                    <p>City: ${hotel.city}</p>
                    <p>Price per night: $${hotel['price-per-night']}</p>
                    <button onclick="addToCart(${hotel['hotel-id']}, '${checkin.toISOString().split('T')[0]}', '${checkout.toISOString().split('T')[0]}', ${document.getElementById('adults').value}, ${document.getElementById('children').value}, ${document.getElementById('infants').value})">Add to Cart</button>
                </div>
                <hr>
            `;
        });
        document.getElementById('hotelsOutput').innerHTML = hotelsOutput;
    } else {
        document.getElementById('hotelsOutput').innerHTML = "<p>No hotels available in this city.</p>";
    }
}

function addToCart(hotelId, checkInDate, checkOutDate, adults, children, infants) {
    const hotel = hotels.find(h => h['hotel-id'] === hotelId);

    if (!hotel) {
        console.error(`Hotel with ID ${hotelId} not found.`);
        return;
    }

    // Ensure all necessary hotel details are included
    const hotelToAdd = {
        hotelName: hotel['hotel-name'], 
        city: hotel.city, 
        pricePerNight: hotel['price-per-night'],
        checkInDate, 
        checkOutDate, 
        adults, 
        children, 
        infants
    };

    const cart = JSON.parse(localStorage.getItem('cart2')) || [];
    cart.push(hotelToAdd);
    localStorage.setItem('cart2', JSON.stringify(cart));

    console.log(`Hotel with ID ${hotelId} added to cart with check-in: ${checkInDate} and check-out: ${checkOutDate}, adults: ${adults}, children: ${children}, infants: ${infants}`);
    alert(`Hotel ${hotel['hotel-name']} added to cart with check-in: ${checkInDate}, check-out: ${checkOutDate}, adults: ${adults}, children: ${children}, infants: ${infants}`);
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
