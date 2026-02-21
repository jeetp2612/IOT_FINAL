require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/data", require("./routes/dataRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  app._router.stack
    .filter(r => r.route)
    .forEach(r => {
      console.log(Object.keys(r.route.methods), r.route.path);
    });
});
