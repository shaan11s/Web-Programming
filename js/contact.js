document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const user = getUserFromLocalStorage();

    if (user) {
        autofillForm(user);
        makeFieldsReadOnly();
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        validateForm();
    });

    function autofillForm(user) {
        const fields = form.querySelectorAll('[data-auto-fill="true"]');
        fields.forEach(field => {
            const fieldName = field.getAttribute('name');
            if (fieldName in user) {
                if (field.type === 'radio') {
                    if (field.value === user[fieldName]) {
                        field.checked = true;
                    }
                } else {
                    field.value = user[fieldName];
                }
            }
        });
    }

    function makeFieldsReadOnly() {
        const fields = form.querySelectorAll('[data-auto-fill="true"]');
        fields.forEach(field => {
            if (field.type === 'radio') {
                //field.disabled = true;
            } else {
                field.readOnly = true;
            }
        });
    }

    function validateForm() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const gender = document.querySelector('input[name="gender"]:checked');
        const comment = document.getElementById('comment').value;
        let errorMessages = [];

        if (!/^[A-Za-z]+$/.test(firstName)) {
            errorMessages.push("First name should be alphabetic only.");
        }

        if (!/^[A-Za-z]+$/.test(lastName)) {
            errorMessages.push("Last name should be alphabetic only.");
        }

        if (firstName.charAt(0) !== firstName.charAt(0).toUpperCase()) {
            errorMessages.push("The first letter of the first name should be capital.");
        }

        if (lastName.charAt(0) !== lastName.charAt(0).toUpperCase()) {
            errorMessages.push("The first letter of the last name should be capital.");
        }

        if (firstName.toLowerCase() === lastName.toLowerCase()) {
            errorMessages.push("The first name and the last name cannot be the same.");
        }

        if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(phone)) {
            errorMessages.push("Phone number must be formatted as (ddd) ddd-dddd.");
        }

        if (!/@/.test(email) || !/\./.test(email)) {
            errorMessages.push("Email address must contain @ and .");
        }

        if (!gender) {
            errorMessages.push("Gender must be selected.");
        }

        if (comment.length < 10) {
            errorMessages.push("The comment must be at least 10 characters.");
        }

        displayErrors(errorMessages);

        if (errorMessages.length === 0) {
            alert("Form submitted successfully!");
            submitForm();  
        }
    }

    function displayErrors(errors) {
        const errorDiv = document.getElementById('errorMessages');
        errorDiv.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
    }

    function submitForm() {
        const formData = new FormData(form);
        let xml = '<formData>';
        formData.forEach((value, key) => {
            xml += `<${key}>${value}</${key}>`;
        });
        
        const temp = Math.floor(Math.random() * 10000000);

        xml += `<number>${temp}</number>`;
        xml += '</formData>';
    
        sendToServer(xml);
    }

    function sendToServer(xml) {
        console.log('Sending XML to server:', xml);
    
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/save-xml', true);
        xhr.setRequestHeader('Content-Type', 'application/xml');
    
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    alert('Data saved successfully');
                } else {
                    console.error('Error response from server:', xhr.status, xhr.statusText);
                    alert('Error saving data');
                }
            }
        };
        xhr.onerror = function () {
            console.error('Request failed');
            alert('Error connecting to server');
        };
    
        xhr.send(xml);
    }

    function getUserFromLocalStorage() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    function displayDateTime() {
        const now = new Date();
        document.getElementById('datetime').innerText = now.toLocaleString();
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
