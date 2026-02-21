 require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

app.use(cors({
  origin: [
    "http://localhost:3000",
    process.env.FRONTEND_URL || "iot-final-six.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/data", require("./routes/dataRoutes"));

const PORT = process.env.PORT || 5000;

console.log("Available routes:");
app._router.stack
  .filter(r => r.route)
  .forEach(r => {
    console.log(Object.keys(r.route.methods), r.route.path);
  });

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
