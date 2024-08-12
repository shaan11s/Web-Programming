$(document).ready(function () {
    $('#carForm').submit(function (event) {
        event.preventDefault();
        validateAndDisplay();
    });

    function validateAndDisplay() {
        const city = $('#city').val();
        const carType = $('#carType').val();
        const checkin = new Date($('#checkin').val());
        const checkout = new Date($('#checkout').val());

        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');
        const carTypes = ['economy', 'suv', 'compact', 'midsize'];

        let errors = [];

        if (checkin < minDate || checkin > maxDate || checkout < minDate || checkout > maxDate) {
            errors.push("Dates must be between Sep 1, 2024, and Dec 1, 2024.");
        }

        if (!carTypes.includes(carType.toLowerCase())) {
            errors.push("Car type must be Economy, SUV, Compact, or Midsize.");
        }

        if (errors.length > 0) {
            $('#output').html(`<div id="error">${errors.join("<br>")}</div>`);
            return;
        }

        const result = `
            <h3>Booking Details</h3>
            <p>City: ${city}</p>
            <p>Type of Car: ${carType}</p>
            <p>Check-in Date: ${checkin.toDateString()}</p>
            <p>Check-out Date: ${checkout.toDateString()}</p>
        `;

        $('#output').html(result);
    }
});

function displayDateTime() {
    const now = new Date();
    document.getElementById('datetime').innerText = now.toLocaleString();
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