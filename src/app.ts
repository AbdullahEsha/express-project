import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import emailVerifyRoutes from "./routes/emailVerifyRoutes";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/email", emailVerifyRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Express Server with TypeScript 🚀⚡✨");
});

export default app;
