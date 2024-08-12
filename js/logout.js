function logoutUser() {
    // Remove user data from local storage
    localStorage.removeItem('user');
    
    // Optionally, redirect to login page or home page
    window.location.href = '/login.html';  // Redirect to login page
}

function checkUserLoggedIn() {
    const user = localStorage.getItem('user');
    const logoutButton = document.getElementById('logoutButton');
    if (user) {
        // If user is logged in, show the logout button
        logoutButton.style.display = 'block';
    } else {
        // If user is not logged in, hide the logout button
        logoutButton.style.display = 'none';
    }
}

// Add event listener to logout button
document.addEventListener('DOMContentLoaded', (event) => {
    checkUserLoggedIn();
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }
});
