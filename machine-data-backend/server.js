require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Advanced CORS configuration (Production Safe)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (
        origin.includes("localhost") ||
        origin.includes("vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/data", require("./routes/dataRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});