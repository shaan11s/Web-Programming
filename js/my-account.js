document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired");

    displayDateTime();
    setInterval(displayDateTime, 1000);
    displayUserGreeting();

    const user = getUserFromLocalStorage();
    console.log("User retrieved from localStorage:", user);

    if (user) {
        showAccountButton();  // Show the "My Account" button when logged in
    } else {
        console.log("No user found");
    }

    const fontSizeSelect = document.getElementById('fontSize');
    const bgColorInput = document.getElementById('bgColor');
    const mainContent = document.querySelector('main');

    fontSizeSelect.addEventListener('change', (event) => {
        console.log("Font size changed to:", event.target.value);
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
        console.log("Background color changed to:", event.target.value);
        document.body.style.backgroundColor = event.target.value;
    });

    // Set up the SQL query form
    const queryForm = document.getElementById('queryForm');
    if (queryForm) {
        console.log("Query form found, setting up event listener");
        queryForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const query = document.getElementById('queryInput').value;
            console.log("Query input value:", query);

            if (!query) {
                console.error("Query input is empty");
                document.getElementById('results').innerHTML = `<p style="color: red;">Please enter a query.</p>`;
                return;
            }

            const allowedQueries = [
                /^SELECT \* FROM flights WHERE booking_id = \?.*;$/,
                /^SELECT \* FROM hotels WHERE booking_id = \?.*;$/,
                /^SELECT \* FROM passengers WHERE flight_booking_id = \?.*;$/,
                /^SELECT \* FROM flights WHERE booking_date BETWEEN '2024-09-01' AND '2024-09-30';$/,
                /^SELECT \* FROM hotels WHERE booking_date BETWEEN '2024-09-01' AND '2024-09-30';$/,
                /^SELECT \* FROM flights WHERE ssn = \?.*;$/
            ];

            if (!isAdmin()) {
                const isAllowed = allowedQueries.some((regex) => regex.test(query));
                if (!isAllowed) {
                    console.error("Query not allowed for regular users");
                    document.getElementById('results').innerHTML = `<p style="color: red;">You are not authorized to run this query.</p>`;
                    return;
                }
            }

            fetch('/run-query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            })
            .then(response => {
                console.log("Response received from /run-query:", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Data received from /run-query:", data);
                if (data.error) {
                    throw new Error(data.error);
                }
                displayResults(data.results, 'results');
            })
            .catch(error => {
                console.error('Error running SQL query:', error);
                document.getElementById('results').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            });
        });
    } else {
        console.error("Query form not found on the page");
    }
});

function isAdmin() {
    const user = getUserFromLocalStorage();
    const isAdmin = user && user.phone === '(222) 222-2222';
    console.log("isAdmin check:", isAdmin);
    return isAdmin;
}

function getUserFromLocalStorage() {
    const user = localStorage.getItem('user');
    console.log("User retrieved from localStorage:", user);
    return user ? JSON.parse(user) : null;
}

function displayDateTime() {
    const now = new Date();
    console.log("Current date and time:", now.toLocaleString());
    const datetimeElement = document.getElementById('datetime');
    if (datetimeElement) {
        datetimeElement.innerText = now.toLocaleString();
    } else {
        console.error("datetime element not found");
    }
}

function displayUserGreeting() {
    const user = getUserFromLocalStorage();
    if (user) {
        const greetingElement = document.getElementById('user-greeting');
        if (greetingElement) {
            greetingElement.textContent = `Welcome, ${user.firstName} ${user.lastName}`;
        } else {
            console.error("user-greeting element not found");
        }
    } else {
        console.log("No user found to display greeting");
    }
}

function showAccountButton() {
    const accountButton = document.getElementById('accountButton');
    if (accountButton) {
        accountButton.textContent = 'My Account';
        accountButton.style.display = 'inline-block';
        accountButton.addEventListener('click', () => {
            window.location.href = 'my-account.html';
        });
    } else {
        console.error("Account button not found");
    }
}

function displayResults(data, elementId) {
    const resultsElement = document.getElementById(elementId);
    if (resultsElement) {
        console.log("Displaying results:", data);
        resultsElement.innerHTML = generateTableHTML(data);
    } else {
        console.error(`Element with ID ${elementId} not found`);
    }
}

function generateTableHTML(data) {
    if (!data || data.length === 0) {
        return '<p>No results found.</p>';
    }

    let table = '<table><tr>';
    for (let key in data[0]) {
        table += `<th>${key}</th>`;
    }
    table += '</tr>';

    data.forEach(row => {
        table += '<tr>';
        for (let key in row) {
            table += `<td>${row[key]}</td>`;
        }
        table += '</tr>';
    });

    table += '</table>';
    return table;
}
