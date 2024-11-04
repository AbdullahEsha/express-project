// sequelize config for the database connection

import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.PG_DATABASE as string,
  dialect: "postgres" as "postgres",
  username: process.env.PG_USER as string,
  password: process.env.PG_PASSWORD as string,
  host: process.env.PG_HOST as string,
  port: parseInt(process.env.PG_PORT || "5432"),
  logging: false,
});

// connectDB function to test the database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
