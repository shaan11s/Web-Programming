document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const dob = document.getElementById('dob').value;
        const email = document.getElementById('email').value;
        const gender = document.querySelector('input[name="gender"]:checked')?.value;

        const errorElement = document.getElementById('error');
        errorElement.textContent = '';

        // Validation
        if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(phone)) {
            errorMessages.push("Phone number must be formatted as (ddd) ddd-dddd.");
            return;
        }
        if (password.length < 8) {
            errorElement.textContent = 'Password must be at least 8 characters';
            return;
        }
        if (password !== confirmPassword) {
            errorElement.textContent = 'Passwords do not match';
            return;
        }
        if (!dob.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            errorElement.textContent = 'Date of birth must be in MM/DD/YYYY format';
            return;
        }
        if (!email.includes('@') || !email.endsWith('.com')) {
            errorElement.textContent = 'Email must contain @ and .com';
            return;
        }

        // Prepare data to send to the server
        const data = {
            phone,
            password,
            firstName,
            lastName,
            dob,
            email,
            gender
        };

        // Send data to the server
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registration successful!');
                window.location.href = '/login.html';
            } else {
                 alert(data.message);
                 errorElement.textContent = data.message;
            }
        })
        .catch(error => {
            errorElement.textContent = 'An error occurred. Please try again later.';
        });
    });
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

document.addEventListener('DOMContentLoaded', (event) => {
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
});
