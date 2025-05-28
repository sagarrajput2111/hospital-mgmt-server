import express from "express";
import authRouter from "./routes/auth.route.js";
import patientRouter from "./routes/patient.route.js"
import mongoose from "mongoose";
import cors from "cors";
// Load .env only in development
if (process.env.NODE_ENV !== "production") {
  await import("dotenv").then((dotenv) => {
    dotenv.config();
  });
}

//connect to db
mongoose
  .connect("mongodb://localhost:27017/hospital-data")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());
app.use("", authRouter);
app.use("/patient",patientRouter)



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
