
# Travel Deals Web Application

## Overview

The Travel Deals Web Application is a comprehensive platform that allows users to search for and book travel-related services, including flights, hotel stays, car rentals, and cruises. Users can register, log in, and manage their accounts, with data stored in a MySQL database and managed via an Express.js server.

## File Structure

### HTML Files
- **`index.html`**: The main landing page for the Travel Deals application. It provides an overview of the available services and allows users to navigate to other sections of the site.
- **`cars.html`**: Interface for booking car rentals. Users can select a city, car type, and rental dates to search for available cars.
- **`cart.html`**: Displays the selected flights and hotels, allowing users to finalize their bookings.
- **`contact-us.html`**: Provides a form for users to contact support. The form includes fields for name, phone, email, gender, and a comment section.
- **`cruises.html`**: Interface for booking cruise deals. Users can select a destination, departure dates, and the number of travelers.
- **`flights.html`**: Interface for booking flights. Users can search for flights based on origin, destination, departure date, and return date (for round trips).
- **`register.html`**: Registration page where users can create a new account by providing their phone number, password, and personal information.
- **`login.html`**: Login page for users to access their accounts by entering their phone number and password.
- **`my-account.html`**: Account management page where users can run SQL queries to view their bookings and other details.

### CSS Files
- **`mystyle.css`**: The main stylesheet for the application, providing a consistent look and feel across all pages. It includes styles for headers, navigation, content areas, and forms.

### JavaScript Files
- **`script.js`**: The main JavaScript file that handles global functions, such as displaying the current date and time, and user greetings.
- **`cart.js`**: Manages the cart functionality, allowing users to view and clear selected flights and hotels.
- **`contact.js`**: Handles form submission and validation for the contact form, including the autofill feature based on stored user data.
- **`cruise.js`**: Manages cruise booking form submission and validation.
- **`flights.js`**: Handles the search and filtering of flights based on user input, as well as the addition of selected flights to the cart.
- **`register.js`**: Validates and processes the registration form, ensuring that all required fields are completed correctly.
- **`logout.js`**: Handles the logout process by clearing user data from local storage and redirecting to the login page.
- **`my-account.js`**: Manages the account page, allowing users to run SQL queries and view their bookings.
- **`cars.js`**: Manages car rental form submission and validation.

### JSON and XML Files
- **`bookedhotels.json`**: Contains a list of booked hotels, including details such as hotel name, city, price per night, check-in, and check-out dates.
- **`contact.xml`**: Stores submitted contact form data, including user names, phone numbers, emails, genders, comments, and a unique number for each submission.
- **`flights.xml`**: Contains a list of available flights, including flight IDs, origins, destinations, departure and arrival dates and times, available seats, and prices.
- **`guesses.json`**: Stores information about users’ guesses, including first and last names, date of birth, social security number, and the associated booking number.
- **`guests.json`**: Contains guest details, such as first and last names, date of birth, social security number, category (e.g., Adult), and booking numbers.
- **`users.json`**: Stores user data, including phone numbers, passwords, first and last names, dates of birth, emails, and gender.

### SQL Files
- **`mysql.sql`**: SQL script file used for setting up the MySQL database, including table creation and initial data insertion for users, flights, hotels, and other entities.

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone [web-programming]
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the MySQL database**:
   - Import the `mysql.sql` script into your MySQL database to create the necessary tables and insert initial data.

4. **Run the application**:
   ```bash
   node server.js
   ```

5. **Access the application**:
   - Open your web browser and navigate to `http://localhost:3000`.

## Usage

- **Home**: Explore different travel deals and navigate to specific sections like Stays, Flights, Cars, and Cruises.
- **Stays**: Search and book hotel stays in various cities.
- **Flights**: Find and book flights based on your preferred dates and destinations.
- **Cars**: Rent a car for your travel needs by specifying the city and car type.
- **Cruises**: Book a cruise by selecting a destination, departure date, and the number of travelers.
- **Contact Us**: Submit inquiries or feedback via the contact form.
- **Cart**: View and manage your selected flights and hotel bookings before confirming them.
- **Register/Login**: Create a new account or log in to manage your bookings and account details.
- **My Account**: Run SQL queries to view your bookings and other personal data.
