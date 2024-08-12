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

if (isAdmin()) {
    addMyAccountTab();
    document.getElementById('admin-section').style.display = 'block';
}

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

function addMyAccountTab() {
    const nav = document.querySelector('nav');
    const myAccountLink = document.createElement('a');
    myAccountLink.href = 'my-account.html';
    myAccountLink.textContent = 'My Account';
    const loginLink = nav.querySelector('a[href="login.html"]');
    nav.insertBefore(myAccountLink, loginLink);
}


function isAdmin() {
    const user = getUserFromLocalStorage();
    return user && user.phone === '(222) 222-2222';
}
