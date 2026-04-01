import React, { useState } from "react";
import axios from "axios";
import QRGenerator from "../components/QRGenerator";

const API = "http://localhost:5000/api";

const initialForm = {
  name: "",
  brand: "",
  category: "",
  batchNumber: "",
  manufacturingDate: "",
  description: "",
};

export default function ManufacturerPage() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post(`${API}/products/register`, form);
      setResult(res.data);
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">🏭 Register Product</h1>
      <p className="page-subtitle">
        Fill in product details to generate a secure QR code.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Premium Olive Oil" required />
            </div>
            <div className="form-group">
              <label>Brand *</label>
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. OliveGold" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                <option>Food & Beverage</option>
                <option>Pharmaceuticals</option>
                <option>Electronics</option>
                <option>Luxury Goods</option>
                <option>Cosmetics</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Batch Number *</label>
              <input name="batchNumber" value={form.batchNumber} onChange={handleChange} placeholder="e.g. BATCH-2024-001" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Manufacturing Date</label>
              <input type="date" name="manufacturingDate" value={form.manufacturingDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input name="description" value={form.description} onChange={handleChange} placeholder="Short product description" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Registering..." : "Register & Generate QR"}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {result && (
        <div className="card result-card">
          <div className="alert alert-success">✅ {result.message}</div>
          <p><strong>Product ID:</strong> {result.productId}</p>
          <QRGenerator qrData={result.qrData} productName={form.name || "Product"} />
        </div>
      )}
    </div>
  );
}