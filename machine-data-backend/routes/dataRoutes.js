const express = require("express");
const DataRow = require("../models/DataRow");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { filename, rowData } = req.body;

    if (!filename || typeof filename !== "string") {
      return res.status(400).json({
        success: false,
        message: "filename is required and must be a string",
      });
    }

    if (
      rowData === null ||
      rowData === undefined ||
      typeof rowData !== "object" ||
      Array.isArray(rowData)
    ) {
      return res.status(400).json({
        success: false,
        message: "rowData is required and must be an object",
      });
    }

    const savedRow = await DataRow.create({
      filename: filename.trim(),
      rowData,
    });

    return res.status(201).json({
      success: true,
      message: "Row data stored successfully",
      data: savedRow,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
