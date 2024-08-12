document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        const errorElement = document.getElementById('error');
        errorElement.textContent = '';

        // Send data to the server
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Login successful!');
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/index.html';  // Redirect to home page
            } else {
                errorElement.textContent = data.message;
            }
        })
        .catch(error => {
            errorElement.textContent = 'An error occurred. Please try again later.';
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