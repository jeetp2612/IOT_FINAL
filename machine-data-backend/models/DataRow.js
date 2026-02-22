const mongoose = require("mongoose");

const DataRowSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, "filename is required"],
    trim: true,
  },
  rowData: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, "rowData is required"],
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DataRow", DataRowSchema);
