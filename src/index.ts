import app from "./app";
import dotenv from "dotenv";
import { sequelize, connectDB } from "./config/database";

dotenv.config();

// Port configuration
const port = Number(process.env.PORT) || 5000;

// Start the server only after a successful database connection
const startServer = async () => {
  try {
    await sequelize.sync({ force: false }); // Change to `true` to drop and recreate tables (useful for development)
    console.log("Database synchronized successfully");
    await connectDB();
    // Start the server after successful sync
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Failed to synchronize database:", error);
  }
};

startServer();
