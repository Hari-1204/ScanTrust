const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const productRoutes = require("./routes/products");
const verifyRoutes = require("./routes/verify");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure data directory and products.json exist
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "products.json");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "[]");

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ScanTrust server running", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`ScanTrust server running on http://localhost:${PORT}`);
});