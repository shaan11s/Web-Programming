// cruise.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cruiseForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        validateForm();
    });

    function validateForm() {
        const destination = document.getElementById('destination').value;
        const departingStart = document.getElementById('departingStart').value;
        const departingEnd = document.getElementById('departingEnd').value;
        const minDuration = parseInt(document.getElementById('minDuration').value, 10);
        const maxDuration = parseInt(document.getElementById('maxDuration').value, 10);
        const numAdults = parseInt(document.getElementById('numAdults').value, 10);
        const numChildren = parseInt(document.getElementById('numChildren').value, 10);
        const numInfants = parseInt(document.getElementById('numInfants').value, 10) || 0;

        let errorMessages = [];
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '';

        if (!['Alaska', 'Bahamas', 'Europe', 'Mexico'].includes(destination)) {
            errorMessages.push("The destination should be Alaska, Bahamas, Europe, or Mexico.");
        }

        const departingStartDate = new Date(departingStart);
        const departingEndDate = new Date(departingEnd);
        const startDate = new Date('2024-09-01');
        const endDate = new Date('2024-12-01');
        flag = 0;

        if (!(departingStartDate >= startDate && departingStartDate <= endDate)) {
            errorMessages.push("Departing date must be between Sep 1, 2024, and Dec 1, 2024.");
            flag = 1
        }

        if (!(departingEndDate >= startDate && departingEndDate <= endDate)) {
            if(flag == 0){
                errorMessages.push("Departing date must be between Sep 1, 2024, and Dec 1, 2024.");
            }
            
        }

        if (departingStartDate > departingEndDate) {
            errorMessages.push("Departing start date cannot be after the departing end date.");
        }

        if (isNaN(minDuration) || minDuration < 3) {
            errorMessages.push("Minimum duration must 3 days.");
        }

        if (isNaN(maxDuration) || maxDuration > 10) {
            errorMessages.push("Maximum duration must be 10 days.");
        }

        if (minDuration > maxDuration) {
            errorMessages.push("Minimum duration cannot be greater than maximum duration.");
        }

        if (numAdults > 2 || numChildren > 2) {
            errorMessages.push("Number of guesses cannot be more than 2 for each room, except infants.");
        }

        displayErrors(errorMessages);

        if (errorMessages.length === 0) {
            displayResult(destination, departingStart, departingEnd, minDuration, maxDuration, numAdults, numChildren, numInfants);
        }
    }

    function displayErrors(errors) {
        const errorDiv = document.getElementById('errorMessages');
        errorDiv.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
    }

    function displayResult(destination, departingStart, departingEnd, minDuration, maxDuration, numAdults, numChildren, numInfants) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <h3>Cruise Details</h3>
            <p><strong>Destination:</strong> ${destination}</p>
            <p><strong>Departing Between:</strong> ${departingStart} and ${departingEnd}</p>
            <p><strong>Duration:</strong> ${minDuration} - ${maxDuration} days</p>
            <p><strong>Number of Adults:</strong> ${numAdults}</p>
            <p><strong>Number of Children:</strong> ${numChildren}</p>
            <p><strong>Number of Infants:</strong> ${numInfants}</p>
        `;
    }
});

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