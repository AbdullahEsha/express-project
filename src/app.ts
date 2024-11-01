import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { authenticateToken } from "./middleware/auth";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Allow your frontend origin
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Express Server with TypeScript 🚀⚡✨");
});

export default app;
