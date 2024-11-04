# Node Project using PostgreSQL

## Project Overview

To install the project, follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies by running `npm install` || `yarn`.
3. Copy .env from .env.example file `copy .env.example .env`.
4. Start the server(index.ts) by running `npm run dev` || `yarn dev`.

## Step by Step Process

- PG & Sequelize(`npm i pg sequelize`): The project uses PostgreSQL (PG) as its database, managed with Sequelize, an ORM for Node.js. Created User Model and Established the DB connection with the project. Sequelize helps streamline data operations by providing an easy-to-use syntax for interacting with PostgreSQL tables and performing CRUD (Create, Read, Update, Delete) operations.

- JWT & Bcryptjs (`npm i jsonwebtoken bcryptjs`): JSON Web Tokens (JWT) are used for authentication, ensuring secure communication by encoding user credentials. Bcryptjs is used to hash passwords, protecting sensitive user data by storing encrypted versions of passwords instead of plain text.

- GenerateTokens: Created a simple method call generateTokens which takes user data and returns access token and refresh token by the help of JWT.

- Refresh Token: Refresh tokens allow users to stay logged in without repeatedly entering their credentials. When an access token expires, the refresh token can be used to issue a new one, maintaining session security and a smooth user experience.

- EJS & Nodemailer (`npm i ejs nodemailer`): EJS (Embedded JavaScript) is a templating engine used to create HTML emails, making the content dynamic and personalized. In this project 'emailTemplate.ejs' is created to view to show the token and redirect link to email. Nodemailer is used to send these emails, such as password reset links, directly from the server to users’ inboxes.

## Usage (base_url: http://localhost:5000)

To check the API, send HTTP requests to the appropriate endpoint.
For example, to get a list of all #users, send a GET request to `/api/v1/users`.

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
