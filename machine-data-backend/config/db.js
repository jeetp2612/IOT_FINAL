const mongoose = require("mongoose");

async function connectDB() {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/machineData";

    await mongoose.connect(mongoURI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
