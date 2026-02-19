const mongoose = require("mongoose");

const DataFileSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  data: Object,
  fileSize: Number,
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("DataFile", DataFileSchema);
