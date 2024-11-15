import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import emailVerifyRoutes from "./routes/emailVerifyRoutes";

const app = express();
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:3000",
//       "http://localhost:8081",
//       "http://localhost:8080",
//       "http://10.0.2.2:53911", // Android emulator default
//       "http://127.0.0.1:9101", // iOS simulator or other local host access
//       "http://localhost:59909",
//     ],
//     credentials: true,
//   })
// );

app.use(cors({
  origin: "*",  // For development only. Configure properly in production
  credentials: true
}));

app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/email", emailVerifyRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Express Server with TypeScript 🚀⚡✨");
});

export default app;
