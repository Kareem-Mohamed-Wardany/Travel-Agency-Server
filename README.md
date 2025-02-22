# Travel Agency Server

This is the backend server for the Travel Agency platform, responsible for handling business logic, database interactions, and API endpoints. Built with **Node.js**, **Express.js**, and **MongoDB**, it provides a secure and efficient backend for managing trips, reservations, and users.

## Features

### Customer Features

- 🌍 View and fetch trip details via API.
- 🎫 Book trips and manage reservations.
- ❌ Cancel trip reservations.
- 📄 View all personal reservations.

### Admin Features

- ➕ Add new trips with details and images.
- ✏️ Edit or delete existing trips.
- 📅 View all reservations for each trip.
- 🔒 Secure authentication and authorization for admins.

## 🛠 Tech Stack

- **Node.js** – Runtime environment.
- **Express.js** – Web framework for handling API requests.
- **MongoDB** – NoSQL database for storing trips, users, and reservations.
- **Mongoose** – ODM for interacting with MongoDB.
- **JWT** – Secure authentication and authorization.

## 🚀 Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Kareem-Mohamed-Wardany/Travel-Agency-Server.git
   ```

2. **Navigate to the project folder:**

   ```sh
   cd Travel-Agency-Server
   ```

3. **Install dependencies:**

   ```sh
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env` file and configure the required credentials:

   ```env
    PORT = 5000
    DB_CONNECTION = DB_Connection_String
    JWT_SECRET = your_jwt_secret
    JWT_LIFETIME = 1h
    CLOUD_NAME = Cloudinary Cloud Name
    API_KEY = Cloudinary_API_KEY
    API_SECRET = Cloudinary_API_SECRET
   ```

5. **Run the server:**

   ```sh
   npm start
   ```

6. **API Endpoints:**
   The server runs on `http://localhost:5000`, providing RESTful API endpoints:

   ### **Auth Routes**

   - `/api/v1/auth` → Handles authentication (login, signup, etc.).

   ### **Admin Routes** (Protected)

   - `/api/v1/admin/trips` → Admins manage trips (Add, Edit, Delete).

   ### **User Routes**

   - `/api/v1/user/trips` → Fetch available trips.
   - `/api/v1/user/reservations` → manage reservations.

## 🌍 Deployment

- Deployable on **Heroku**, **VPS**, or **Render**.
- Ensure all environment variables are configured in the hosting platform.

## 🤝 Contributions

Feel free to contribute by submitting pull requests or reporting issues.

## 📜 License

This project is licensed under the **MIT License**.
