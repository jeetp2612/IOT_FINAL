const express = require("express");
const DataRow = require("../models/DataRow");

const router = express.Router();
const SINGLE_FILENAME = "machine-data-log.txt";

function resolveRowData(body) {
  if (body && typeof body === "object" && !Array.isArray(body)) {
    if (Object.prototype.hasOwnProperty.call(body, "rowData")) {
      return body.rowData;
    }

    return body;
  }

  return body;
}

router.get("/", async (req, res, next) => {
  try {
    const storedFile = await DataRow.findOne({ filename: SINGLE_FILENAME });
    const rows = storedFile?.rows || [];

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
    const resolvedRowData = resolveRowData(req.body);

    const storedFile =
      (await DataRow.findOne({ filename: SINGLE_FILENAME })) ||
      (await DataRow.create({ filename: SINGLE_FILENAME, rows: [] }));

    storedFile.rows.push({
      rowData: resolvedRowData,
    });
    await storedFile.save();

    const savedRow = storedFile.rows[storedFile.rows.length - 1];

    return res.status(201).json({
      success: true,
      message: "Row data appended successfully",
      data: savedRow,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/download", async (req, res, next) => {
  try {
    const storedFile = await DataRow.findOne({ filename: SINGLE_FILENAME });

    if (!storedFile || storedFile.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No stored data found",
      });
    }

    const textData = storedFile.rows
      .map((row, index) => {
        const uploadDate = row.uploadDate
          ? new Date(row.uploadDate).toISOString()
          : new Date().toISOString();

        return `Time: ${uploadDate}\nData:\n${JSON.stringify(
          row.rowData,
          null,
          2
        )}\n`;
      })
      .join("\n");

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${SINGLE_FILENAME}"`);

    return res.status(200).send(textData);
  } catch (error) {
    return next(error);
  }
});

router.get("/stats/summary", async (req, res, next) => {
  try {
    const storedFile = await DataRow.findOne({ filename: SINGLE_FILENAME });
    const totalRows = storedFile?.rows?.length || 0;
    const latestRow = totalRows > 0 ? storedFile.rows[totalRows - 1] : null;

    return res.status(200).json({
      success: true,
      totalFiles: totalRows > 0 ? 1 : 0,
      totalRows,
      lastUploadDate: latestRow ? latestRow.uploadDate : null,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
