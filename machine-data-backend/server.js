require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  "https://iot-final-six.vercel.app"
].filter(Boolean);

// CORS configuration
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/data", require("./routes/dataRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
