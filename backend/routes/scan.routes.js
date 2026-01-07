// backend/routes/scan.routes.js
const express = require("express");
const router = express.Router();

const { scanBarcode, scanImage, AppError } = require("../ia/qrScanner.service");

/**
 * POST /api/scan
 * Body:
 *  - { "barcode": "..." }
 *  - OU { "imageBase64": "...", "mimeType": "image/jpeg" }
 */
router.post("/scan", async (req, res) => {
  const started = Date.now();

  try {
    const { barcode, imageBase64, mimeType } = req.body || {};

    if (!barcode && !imageBase64) {
      return res.status(400).json({
        ok: false,
        error: { code: "MISSING_INPUT", message: "barcode ou imageBase64 requis" },
        meta: { ms: Date.now() - started },
      });
    }

    if (barcode) {
      const data = await scanBarcode(barcode);
      return res.json({ ok: true, source: "barcode", data, meta: { ms: Date.now() - started } });
    }

    const data = await scanImage(imageBase64, mimeType || "image/jpeg");
    return res.json({ ok: true, source: "image", data, meta: { ms: Date.now() - started } });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.status).json({
        ok: false,
        error: { code: err.code, message: err.message, details: err.details || undefined },
        meta: { ms: Date.now() - started },
      });
    }

    console.error("SCAN ROUTE ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: { code: "SERVER_ERROR", message: "Erreur serveur" },
      meta: { ms: Date.now() - started },
    });
  }
});

module.exports = router;
