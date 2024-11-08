# Node Project using PostgreSQL

This document outlines the steps taken to set up a new Node JS project with authentication (using JWT), PostgreSQL as the database, and RESTful API for Authentication.

## Prerequisites:

Before starting the project, ensure you have the following tools installed on your Windows machine:

- **Git**
- **Node.js**
- **PG Admin**

## Step by Step Process

- Create a directory/folder

```bash
mkdir node-project
cd node-project
```

- Run cmd to innitialize `package.json`

```bash
npm init
```

- Install TypeScript as a development dependency

```bash
npm install --save-dev typescript
```

- To configure TypeScript

```bash
npx tsc --init
```

- Now install Express in the myapp directory and save it in the dependencies list of your package.json file:

```bash
npm install express
npm install --save-dev @types/express @types/node
```

- Install nodemon package, that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected

```bash
npm i nodemon
```

- create .env file and add environment variabls

```bash
    PORT=5000
    NODE_ENV=development

    PG_USER=postgres
    PG_HOST=localhost
    PG_DATABASE=node_db
    PG_PASSWORD=password                    # Your password
    PG_PORT=5432

    JWT_SECRET=secret                       # You can use different secret for access token
    JWT_REFRESH_SECRET=secret               # You can use different secret for refresh token
    JWT_EXPIRES_IN=15m
    JWT_REFRESH_EXPIRES_IN=7d

    CLIENT_URL=http://localhost:3000

    MAIL_MAILER=smtp
    MAIL_HOST=smtp-relay.brevo.com
    MAIL_PORT=587
    MAIL_USERNAME=6c8781002@smtp-brevo.com
    MAIL_PASSWORD=password                 # Your password
    MAIL_FROM_NAME=testname                # Your name
    MAIL_FROM_ADDRESS=example@mail.com     # Your email address
```

- Modify your package.json file to include TypeScript compilation scripts

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon --exec ts-node src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc -p ."
  },
```

- PG & Sequelize: The project uses PostgreSQL (PG) as its database, managed with Sequelize, an ORM for Node.js. Created User Model and Established the DB connection with the project. Sequelize helps streamline data operations by providing an easy-to-use syntax for interacting with PostgreSQL tables and performing CRUD (Create, Read, Update, Delete) operations.

```bash
npm i pg sequelize
```

- JWT & Bcryptjs: JSON Web Tokens (JWT) are used for authentication, ensuring secure communication by encoding user credentials. Bcryptjs is used to hash passwords, protecting sensitive user data by storing encrypted versions of passwords instead of plain text.

```bash
npm i jsonwebtoken bcryptjs
```

- EJS & Nodemailer: EJS (Embedded JavaScript) is a templating engine used to create HTML emails, making the content dynamic and personalized. In this project 'emailTemplate.ejs' is created to view to show the token and redirect link to email. Nodemailer is used to send these emails, such as password reset links, directly from the server to users’ inboxes.

```bash
npm i ejs nodemailer
```

- Additionally for using typescript few package might need to install for types like:

```bash
npm i @types/pg @types/bcryptjs @types/cors @types/ejs @types/jsonwebtoken @types/nodemailer
```

- Refresh Token[1]: Refresh tokens allow users to stay logged in without repeatedly entering their credentials. When an access token expires, the refresh token can be used to issue a new one, maintaining session security and a smooth user experience.

- GenerateTokens[2]: Created a simple method call generateTokens which takes user data and returns access token and refresh token by the help of JWT.

- Folder structure for for my node project is

```bash
NODE-PROJECT
├── node_modules
├── src
│ ├── config
│ │ └── database.ts                #database configaration
│ ├── controllers
│ │ ├── authController.ts          #methords @register_user @login_user @social_login @refresh_token[1]
│ │ ├── emailVerifyController.ts   #methords @resetPassword @resetPasswordUpdate
│ │ └── userController.ts          #methord @getUsers
│ ├── helper
│ │ └── generateTokens.ts          #check [2]
│ ├── middleware
│ │ └── auth.ts                    #methords @authenticateToken
│ ├── models
│ │ └── User.ts                    #user table blueprint
│ ├── routes
│ │ ├── authRoutes.ts              #routes of authController.ts
│ │ ├── emailVerifyRoutes.ts       #routes of ...
│ │ └── userRoutes.ts              #routes of ...
│ ├── templates
│ │ └── emailTemplate.ejs          #template to show when it is send to email
│ └── types
│ └── userType.ts
├── .env
├── .env.example
├── .gitignore
├── app.ts                         #all setup like routes, cors before start the server
├── index.ts                       #start the server in a specific port[5000]
├── package-lock.json
├── package.json
└── README.md
```

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
| `/api/v1/auth/refresh-token`          | POST   | To refresh the access token                          |

## Post man <a href="https://api.postman.com/collections/20303604-9d68db5e-d64a-48b2-ab96-4cf146c9016c?access_key=PMAT-01JBVDXP4HDVE3N1X2971FW9Q9">Go to link</a>
