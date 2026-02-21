require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://iot-final-six.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/data", require("./routes/dataRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
