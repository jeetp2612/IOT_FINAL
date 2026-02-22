const express = require("express");
const DataRow = require("../models/DataRow");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const rows = await DataRow.find().sort({ uploadDate: -1 });

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { filename, rowData } = req.body;

    if (!Object.prototype.hasOwnProperty.call(req.body, "rowData")) {
      return res.status(400).json({
        success: false,
        message: "rowData is required",
      });
    }

    const safeFilename =
      typeof filename === "string" && filename.trim().length > 0
        ? filename.trim()
        : `data-row-${Date.now()}`;

    const savedRow = await DataRow.create({
      filename: safeFilename,
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

router.get("/download/:id", async (req, res, next) => {
  try {
    const row = await DataRow.findById(req.params.id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Data row not found",
      });
    }

    const textData = JSON.stringify(
      {
        filename: row.filename,
        uploadDate: row.uploadDate,
        rowData: row.rowData,
      },
      null,
      2
    );

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${row.filename || "data-row"}-${row._id}.txt"`
    );

    return res.status(200).send(textData);
  } catch (error) {
    return next(error);
  }
});

router.get("/stats/summary", async (req, res, next) => {
  try {
    const totalRows = await DataRow.countDocuments();
    const latestRow = await DataRow.findOne().sort({ uploadDate: -1 });

    return res.status(200).json({
      success: true,
      totalFiles: totalRows,
      totalRows,
      lastUploadDate: latestRow ? latestRow.uploadDate : null,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
