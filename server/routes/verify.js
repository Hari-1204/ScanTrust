const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { verifyTokenSignature } = require("../utils/tokenUtils");

const DB_PATH = path.join(__dirname, "../data/products.json");

function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// GET /api/verify?token=<token>
router.get("/", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      result: "INVALID",
      message: "No token provided.",
    });
  }

  const products = readDB();

  // Find product by token
  const productIndex = products.findIndex((p) => p.token === token);

  if (productIndex === -1) {
    // Token doesnt exist in DB at all → definitely fake
    return res.status(200).json({
      success: true,
      result: "FAKE",
      message: "This product could not be verified. It may be counterfeit.",
    });
  }

  const product = products[productIndex];

  // Verify HMAC signature hasnt been tampered with
  const signatureValid = verifyTokenSignature(token, product.productId);

  if (!signatureValid) {
    return res.status(200).json({
      success: true,
      result: "FAKE",
      message: "Token signature is invalid. This product may be counterfeit.",
    });
  }

  // Log this scan
  const scanEntry = {
    scanId: `SCAN-${Date.now()}`,
    scannedAt: new Date().toISOString(),
    userAgent: req.headers["user-agent"] || "Unknown",
    ip: req.ip || "Unknown",
  };

  products[productIndex].scanCount += 1;
  products[productIndex].scanLogs.push(scanEntry);
  writeDB(products);

  const scanCount = products[productIndex].scanCount;

  // If scanned more than once, flag as suspicious
  // First scan = GENUINE, subsequent = FLAGGED
  if (scanCount === 1) {
    return res.status(200).json({
      success: true,
      result: "GENUINE",
      message: "✅ Product is genuine and verified.",
      product: {
        name: product.name,
        brand: product.brand,
        category: product.category,
        batchNumber: product.batchNumber,
        manufacturingDate: product.manufacturingDate,
        description: product.description,
        registeredAt: product.registeredAt,
        scanCount,
      },
    });
  } else {
    return res.status(200).json({
      success: true,
      result: "FLAGGED",
      message: `⚠️ This QR code has been scanned ${scanCount} times. It may have been duplicated.`,
      product: {
        name: product.name,
        brand: product.brand,
        category: product.category,
        batchNumber: product.batchNumber,
        manufacturingDate: product.manufacturingDate,
        description: product.description,
        registeredAt: product.registeredAt,
        scanCount,
      },
    });
  }
});

module.exports = router;