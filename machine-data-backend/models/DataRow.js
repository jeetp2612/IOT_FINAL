const mongoose = require("mongoose");

const DataEntrySchema = new mongoose.Schema(
  {
    rowData: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "rowData is required"],
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const DataRowSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    default: "machine-data-log.txt",
    trim: true,
  },
  rows: {
    type: [DataEntrySchema],
    default: [],
  },
});

module.exports = mongoose.model("DataRow", DataRowSchema);
