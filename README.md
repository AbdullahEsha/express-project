# Node.js Project using PostgreSQL

## Project Overview

This project is a Node.js-based backend API that integrates with PostgreSQL, uses Sequelize ORM for database operations, handles authentication via JSON Web Tokens (JWT), and sends email notifications using Nodemailer. The project supports user authentication, password hashing, token-based authentication, and email-based actions (e.g., password reset).

### Installation Steps

1.  **Clone the Repository:** Clone the repository to your local machine by running:
    
    bash
    
    Copy code
    
    `git clone <repository-url>`
    
2.  **Install Dependencies:** Navigate to the project directory and install the required dependencies using either npm or yarn:
    
    bash
    
    Copy code
    
    `npm install`
    
    Or, if you're using Yarn:
    
    bash
    
    Copy code
    
    `yarn`
    
3.  **Configure Environment Variables:** Copy the `.env.example` file to `.env` and configure your environment variables (e.g., database credentials, JWT secret keys):
    
    bash
    
    Copy code
    
    `cp .env.example .env`
    
4.  **Start the Server:** Start the development server by running the following command:
    
    bash
    
    Copy code
    
    `npm run dev`
    
    Or, with Yarn:
    
    bash
    
    Copy code
    
    `yarn dev`
    
    The server will start at `http://localhost:5000`.
    

* * *

## Step-by-Step Process

### 1\. Install PostgreSQL & Sequelize

*   **PG & Sequelize (`npm i pg sequelize`)**:  
    PostgreSQL is used as the database, and Sequelize is used to manage the database operations. Sequelize is an Object-Relational Mapping (ORM) library that provides an easy-to-use interface to interact with PostgreSQL, allowing you to perform CRUD (Create, Read, Update, Delete) operations on the database tables.
    
    The following steps were followed for Sequelize setup:
    
    *   **Created the User Model**: This model defines the structure of the `User` table in the database, including fields like email, password, name, etc.
    *   **Established DB Connection**: A connection to the PostgreSQL database was established using Sequelize.
    
    **Example:**
    
    js
    
    Copy code
    
    `const { Sequelize, DataTypes } = require('sequelize'); const sequelize = new Sequelize(process.env.DB_URI);  const User = sequelize.define('User', {   email: {     type: DataTypes.STRING,     allowNull: false,     unique: true   },   password: {     type: DataTypes.STRING,     allowNull: false   } });`
    

### 2\. JWT & Bcryptjs for Authentication

*   **JWT & Bcryptjs (`npm i jsonwebtoken bcryptjs`)**:  
    JSON Web Tokens (JWT) are used to authenticate users and ensure secure communication between the server and the client. Bcryptjs is used to hash user passwords, ensuring that sensitive data is encrypted and not stored in plaintext.
    
    *   **JWT**: Generates access and refresh tokens after successful user login. The access token allows the user to make authenticated requests, while the refresh token can be used to obtain a new access token when it expires.
        
    *   **Bcryptjs**: Used for password hashing and verification. It ensures that passwords are securely stored in the database as hashed values.
        
    
    **Example:**
    
    js
    
    Copy code
    
    `const bcrypt = require('bcryptjs'); const jwt = require('jsonwebtoken');  // Hash password const hashedPassword = bcrypt.hashSync(user.password, 8);  // Generate JWT token const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });`
    

### 3\. Generate Tokens

A helper function `generateTokens` was created to generate both access and refresh tokens:

**Function:**

js

Copy code

`const jwt = require('jsonwebtoken');  function generateTokens(user) {   const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });   const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });    return { accessToken, refreshToken }; }`

### 4\. Refresh Tokens

Refresh tokens are used to allow users to remain logged in without repeatedly entering their credentials. The access token expires after a certain period (e.g., 1 hour), but the refresh token can be used to generate a new access token.

**Example:**

js

Copy code

`// Endpoint to refresh token app.post('/refresh-token', (req, res) => {   const { refreshToken } = req.body;   if (!refreshToken) return res.status(403).send("Refresh token is required");    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {     if (err) return res.status(403).send("Invalid refresh token");          const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });     res.json({ accessToken: newAccessToken });   }); });`

### 5\. Email Notifications (Nodemailer & EJS)

*   **EJS & Nodemailer (`npm i ejs nodemailer`)**:
    
    *   **EJS**: A templating engine used to create dynamic email templates. In this project, EJS is used to create an HTML email template for password reset links.
    *   **Nodemailer**: A library used for sending emails directly from the server. It is configured to send password reset links and other notifications to users via email.
    
    **Example:**
    
    js
    
    Copy code

```javascript
const nodemailer = require('nodemailer'); const ejs = require('ejs');  const transporter = nodemailer.createTransport({   service: 'gmail',   auth: {     user: process.env.EMAIL_USER,     pass: process.env.EMAIL_PASS   } });  // Send email with token async function sendResetEmail(userEmail, token) {   const emailTemplate = await ejs.renderFile(path.join(__dirname, 'emailTemplate.ejs'), { token });      const mailOptions = {     from: process.env.EMAIL_USER,     to: userEmail,     subject: 'Password Reset Request',     html: emailTemplate   };    transporter.sendMail(mailOptions, (error, info) => {     if (error) return console.log(error);     console.log('Email sent: ' + info.response);   }); }
```
    

### 6\. Endpoints and Usage

#### Base URL:

The API is hosted on `http://localhost:5000`.

#### Common API Endpoints:

*   **POST /api/v1/login**  
    Authenticates a user and returns an access token and refresh token.
    
*   **POST /api/v1/register**  
    Registers a new user and hashes their password.
    
*   **GET /api/v1/users**  
    Retrieves the list of all users.
    
*   **POST /api/v1/refresh-token**  
    Refreshes the access token using the refresh token.
    
*   **POST /api/v1/password-reset**  
    Sends a password reset email with a reset token.
    

* * *

## Example Requests

### 1\. User Registration

bash

Copy code

`POST http://localhost:5000/api/v1/register Content-Type: application/json  {  "name": "name", "email": "user@example.com",   "password": "userpassword123" }`

### 2\. Login

bash

Copy code

`POST http://localhost:5000/api/v1/login Content-Type: application/json  {   "email": "user@example.com",   "password": "userpassword123" }`

### 3\. Get All Users

bash

Copy code

`GET http://localhost:5000/api/v1/users Authorization: Bearer <Access-Token>`

### 4\. Password Reset

bash

Copy code

`POST http://localhost:5000/api/v1/password-reset Content-Type: application/json  {   "email": "user@example.com" }`

* * *

## Troubleshooting

*   **Error 403 (Forbidden)**: Ensure the correct JWT token is passed in the `Authorization` header for authenticated routes.
    
*   **Error: 'Missing JWT Secret'**: Make sure the `JWT_SECRET` environment variable is set in the `.env` file.
    
*   **Error Sending Emails**: Ensure that you have configured the email service provider credentials correctly in the `.env` file (e.g., Gmail user and pass for Nodemailer).

## API Endpoints

The following API endpoints are available:

| Endpoint                              | Method | Description                                          |
| ------------------------------------- | ------ | ---------------------------------------------------- |
| `/api/v1/auth/register`               | POST   | To register as a user                                |
| `/api/v1/auth/login`                  | POST   | To login based on role                               |
| `/api/v1/users`                       | Get    | To check authentication token passed through header. |
| `/api/v1/email/reset-password`        | POST   | Create link and send it through email.               |
| `/api/v1/email/reset-password/:token` | POST   | Verify token and update password provided in body.   |
| `/api/v1/auth/social-login`           | POST   | Register and login without password                  |
| `/api/v1/auth/refresh-token`          | POST   | To refresh the access token                          |

## Post man <a href="https://api.postman.com/collections/20303604-9d68db5e-d64a-48b2-ab96-4cf146c9016c?access_key=">Go to link</a>
