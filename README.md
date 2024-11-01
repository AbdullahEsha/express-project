# vue-project

Vue Task Project
This repository contains a full-stack application using Vue.js with TypeScript for the frontend and Express with TypeScript for the backend. It includes basic features like authentication, localization (i18n), and session management.

Directory Structure

vue-task-project/
├── backend/ # Express backend with TypeScript
└── frontend/ # Vue.js frontend with TypeScript
Prerequisites
Ensure you have the following installed on your local machine:

Node.js (>= v14)
npm (usually installed with Node.js)
Git
Getting Started
Clone the Repository

git clone https://github.com/your-username/vue-task-project.git
cd vue-task-project
Install Concurrently in the Root

concurrently will help run both the frontend and backend servers together.

npm install concurrently
Backend Setup
Navigate to the Backend Directory

cd backend
Install Backend Dependencies

npm install express pg bcryptjs jsonwebtoken dotenv cors
npm install typescript ts-node @types/node @types/express @types/cors --save-dev
Configure TypeScript

Create a tsconfig.json file in the backend directory. Customize it as needed for your project setup.
Set Up Environment Variables

Create a .env file in the backend directory with the following variables:

    PG_USER=your_username
    PG_HOST=localhost
    PG_DATABASE=my_app_db
    PG_PASSWORD=your_password
    PG_PORT=5432
    JWT_SECRET=your_jwt_secret

Replace your_postgresql_database_url and your_jwt_secret with your actual credentials.
Add Development Command

In backend/package.json, add:
json
Copy code
"scripts": {
"dev": "ts-node src/app.ts"
}
Frontend Setup
Navigate to the Frontend Directory

cd ../frontend
Initialize the Vue Project

If starting fresh:

npm init vue@latest
Select options: TypeScript, Router, Pinia, ESLint, and Prettier as required.
Install Frontend Dependencies

npm install
npm install axios vue-i18n@next
Configure Axios for HTTP Requests

In frontend/src/services, create axiosInstance.ts for Axios configuration.
Set Up Vue i18n (Localization)

Add translation files in src/locales/en.json and src/locales/es.json (for example) to support multiple languages.
Running the Project
Add Start Script in Root package.json

In vue-task-project/package.json, add the following script:

"scripts": {
"start": "concurrently \"npm --prefix backend run dev\" \"npm --prefix frontend run dev\""
}
Run the Project

In the root directory (vue-task-project):

npm start
This will start both the backend server (at http://localhost:3001) and the frontend development server (at http://localhost:5173).

Testing and Development
Access the Frontend

Open your browser and go to http://localhost:5173.
Access the Backend

The backend API should be available at http://localhost:3001.

Directory Structure
vue-task-project/
├── backend/ # Express backend with TypeScript
└── frontend/ # Vue.js frontend with TypeScript

Backend Setup with Express and TypeScript
1.Navigate to the Backend Directory and Initialize Project
cd vue-task-project
mkdir backend
cd backend
npm init -y

2. Install Dependencies
   npm install express pg bcryptjs jsonwebtoken dotenv cors
   npm install typescript ts-node @types/node @types/express @types/cors --save-dev

3. Configure TypeScript
   Create tsconfig.json in the backend directory

4. Enviroment variables setup
   PG_USER=your_username
   PG_HOST=localhost
   PG_DATABASE=my_app_db
   PG_PASSWORD=your_password
   PG_PORT=5432
   JWT_SECRET=your_jwt_secret

5. Create User Table in PostgreSQL
   Run this SQL command to create a users table:
   CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   username VARCHAR(50) UNIQUE NOT NULL,
   password VARCHAR(255) NOT NULL
   );

6. Backend File Structure
   Inside the backend folder, create the following files and folders:
   backend/
   ├── .env
   ├── tsconfig.json
   └── src/
   ├── app.ts
   ├── config/
   │ └── db.ts
   ├── controllers/
   │ └── authController.ts
   ├── middleware/
   │ └── authMiddleware.ts
   └── routes/
   └── authRoutes.ts

Frontend Setup with Vue.js and TypeScript

1. Navigate to the Frontend Directory and Initialize Vue
   cd ../
   mkdir frontend
   cd frontend
   npm init vue@latest

   # Select TypeScript, Router, Pinia, ESLint, Prettier options as required.

   cd vue-frontend
   npm install
   npm run format
   npm run dev

2. Install Axios for HTTP Requests
   npm install axios

3. Setting Up Vue I18n
   Install the Vue I18n package:
   npm install vue-i18n@next

4. Create a folder for your translations:
   src/locales/en.json
   src/locales/es.json

5. Set Up Axios Configuration
   frontend/src/services/axiosInstance.ts

6. Create Authentication Service
   frontend/src/services/authService.ts

7. Set Up Vue Router with Navigation Guards

8. Test the Project by Running Both Frontend and Backend
   Go to the root directory of vue-task-project and set up concurrently to manage both frontend and backend servers simultaneously:
   npm install concurrently

9. In the root package.json, add this script to run both servers:
   "scripts": {
   "start": "concurrently \"npm --prefix backend run dev\" \"npm --prefix frontend run dev\""
   }

10. Add Dev Commands in backend
    In backend/package.json:
    "scripts": {
    "dev": "ts-node src/app.ts"
    }

11. Run the Project
    From the vue-task-project root directory:
    npm start

### Node.js Project with Express, PostgreSQL, and Vue Frontend

1.  Project Setup
    Directory Structure:
    Created a backend directory for the Express server using TypeScript.
    Configured a PostgreSQL database connection.

    Dependencies Installed:
    Backend: express, pg, bcryptjs, jsonwebtoken, dotenv, cors, nodemailer, ejs.
    TypeScript and other dev tools: typescript, ts-node, and @types for Node.js, Express, and other modules.

    Environment Configuration:
    Created a .env file to store environment variables:
    plaintext
    Copy code

        ```
        PORT=4000

        NODE_ENV=development

        PG_USER=postgres
        PG_HOST=localhost
        PG_DATABASE=postgres
        PG_PASSWORD=****
        PG_PORT=5432

        JWT_SECRET=secret
        JWT_REFRESH_SECRET=secret
        JWT_EXPIRES_IN=15m
        JWT_REFRESH_EXPIRES_IN=7d

        EMAIL_USER=your-email@example.com
        EMAIL_PASS=your-email-password
        CLIENT_URL=http://localhost:3000
        ```

2.  Refresh Token Implementation
    JWT Authentication:

    Used JWTs for access and refresh tokens.
    Created generateTokens() to generate both access and refresh tokens for user sessions.
    Token Storage and Validation:

    Stored the refresh token in the database for secure access control.
    Set up middleware (authMiddleware.ts) to verify access tokens and protect routes.
    Refresh Token Endpoint:

    Implemented an endpoint to issue a new access token when the refresh token is valid and not expired.
    Cleared the refresh token on logout, effectively invalidating the session.

3.  Password Reset Feature with Nodemailer and EJS
    Nodemailer Setup: (npm install nodemailer ejs)

    Configured Nodemailer to send emails for password reset requests.
    Used a resetPassword function to generate a reset link and send it to the user.
    EJS Email Template:

    Created an emailTemplate.ejs in the template folder to customize the password reset email content.
    Password Reset Flow:

    - Checked if the user exists in the database.
    - Generated an access token for the password reset link.
    - Sent the reset password link via Nodemailer using the EJS template.

4.  File Structure Summary
    plaintext
    Copy code
    backend/
    ├── .env
    ├── tsconfig.json
    └── src/
    ├── app.ts
    ├── config/
    │ └── db.ts # Database configuration
    ├── controllers/
    │ ├── authController.ts # Authentication & Reset Password Logic
    ├── middleware/
    │ └── authMiddleware.ts # Access token validation middleware
    ├── routes/
    │ └── authRoutes.ts # Routes for login, registration, refresh token, etc.
    └── template/
    └── emailTemplate.ejs # Email template for password reset
