const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { generateToken } = require("../utils/tokenUtils");

const DB_PATH = path.join(__dirname, "../data/products.json");

function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// POST /api/products/register
// Manufacturer registers a new product
router.post("/register", (req, res) => {
  const { name, brand, category, batchNumber, manufacturingDate, description } =
    req.body;

  // Basic validation
  if (!name || !brand || !category || !batchNumber) {
    return res.status(400).json({
      success: false,
      message: "Name, brand, category and batch number are required.",
    });
  }

  const products = readDB();

  // Generate unique product ID
  const productId = `PROD-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 6)
    .toUpperCase()}`;

  // Generate secure HMAC token for QR
  const token = generateToken(productId);

  const newProduct = {
    productId,
    token,
    name,
    brand,
    category,
    batchNumber,
    manufacturingDate: manufacturingDate || null,
    description: description || "",
    registeredAt: new Date().toISOString(),
    scanCount: 0,
    scanLogs: [],
    status: "active",
  };

  products.push(newProduct);
  writeDB(products);

  return res.status(201).json({
    success: true,
    message: "Product registered successfully.",
    productId,
    token,
    // QR should encode this full URL
    qrData: `${process.env.CLIENT_URL || "http://localhost:5173"}/verify?token=${token}`,
  });
});

// GET /api/products
// Get all registered products for dashboard
router.get("/", (req, res) => {
  const products = readDB();
  // Strip tokens from list view for security
  const safeList = products.map(({ token, ...rest }) => rest);
  return res.json({ success: true, products: safeList });
});

module.exports = router;