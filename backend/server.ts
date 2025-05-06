import express, { type Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error.middleware";
import { rootRouter } from "./routes";

dotenv.config();

const app = express();
const PORT: number = Number.parseInt(process.env.PORT || "5000", 10);
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/vercel-clone")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", rootRouter());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
