const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/products.json");

function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

// GET /api/dashboard/stats
router.get("/stats", (req, res) => {
  const products = readDB();

  const totalProducts = products.length;
  const totalScans = products.reduce((acc, p) => acc + p.scanCount, 0);
  const flaggedProducts = products.filter((p) => p.scanCount > 1).length;
  const genuineProducts = products.filter((p) => p.scanCount === 1).length;
  const unscannedProducts = products.filter((p) => p.scanCount === 0).length;

  // Recent scans across all products
  const recentScans = products
    .flatMap((p) =>
      p.scanLogs.map((log) => ({
        ...log,
        productName: p.name,
        productId: p.productId,
        brand: p.brand,
      }))
    )
    .sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt))
    .slice(0, 20);

  return res.json({
    success: true,
    stats: {
      totalProducts,
      totalScans,
      flaggedProducts,
      genuineProducts,
      unscannedProducts,
    },
    recentScans,
  });
});

module.exports = router;