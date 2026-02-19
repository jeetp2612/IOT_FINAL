const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/machineData");
    console.log("MongoDB Connected Locally");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
}

mongoose.connection.on("connected", () => console.log("Mongoose connected"));
mongoose.connection.on("error", err => console.log("Mongoose error:", err));
mongoose.connection.on("disconnected", () => console.log("Mongoose disconnected"));

module.exports = connectDB;
