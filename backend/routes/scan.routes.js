// backend/routes/scan.routes.js
const express = require("express");
const router = express.Router();

const { scanBarcode, scanImage } = require("../ia/qrScanner.service");

/**
 * POST /api/scan
 * Body JSON:
 *  - { "barcode": "3274080005003" }
 *  - OU { "imageBase64": "...", "mimeType": "image/jpeg" }
 */
router.post("/scan", async (req, res) => {
  try {
    const { barcode, imageBase64, mimeType } = req.body || {};

    if (!barcode && !imageBase64) {
      return res.status(400).json({
        ok: false,
        error: "barcode ou imageBase64 requis",
      });
    }

    // Priorité au barcode si présent
    if (barcode) {
      const data = await scanBarcode(barcode);
      return res.json({ ok: true, source: "barcode", data });
    }

    const data = await scanImage(imageBase64, mimeType || "image/jpeg");
    return res.json({ ok: true, source: "image", data });
  } catch (err) {
    console.error("SCAN ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: err.message || "Erreur serveur",
    });
  }
});

module.exports = router;
