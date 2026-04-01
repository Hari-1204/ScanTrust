import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import QRScanner from "../components/QRScanner";

const API = "http://localhost:5000/api";

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const [verifyResult, setVerifyResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(true);

  // Auto-verify if token is in URL (from QR scan via phone)
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyToken(token);
      setShowScanner(false);
    }
  }, []);

  const verifyToken = async (rawInput) => {
    setLoading(true);
    setError("");
    setVerifyResult(null);

    // Extract token from full URL or use raw token
    let token = rawInput;
    try {
      const url = new URL(rawInput);
      token = url.searchParams.get("token") || rawInput;
    } catch {}

    try {
      const res = await axios.get(`${API}/verify`, { params: { token } });
      setVerifyResult(res.data);
      setShowScanner(false);
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setVerifyResult(null);
    setError("");
    setShowScanner(true);
  };

  const resultStyles = {
    GENUINE: { className: "result-genuine", icon: "✅", label: "GENUINE" },
    FLAGGED: { className: "result-flagged", icon: "⚠️", label: "FLAGGED" },
    FAKE:    { className: "result-fake",    icon: "❌", label: "FAKE / COUNTERFEIT" },
  };

  return (
    <div className="page">
      <h1 className="page-title">🔍 Verify Product</h1>
      <p className="page-subtitle">Scan or upload a product QR code to verify authenticity.</p>

      {showScanner && !loading && (
        <div className="card">
          <QRScanner onScanSuccess={verifyToken} />
        </div>
      )}

      {loading && (
        <div className="card center">
          <div className="spinner"></div>
          <p>Verifying product...</p>
        </div>
      )}

      {error && (
        <div className="card">
          <div className="alert alert-danger">{error}</div>
          <button className="btn btn-primary" onClick={handleReset}>Try Again</button>
        </div>
      )}

      {verifyResult && (() => {
        const style = resultStyles[verifyResult.result] || resultStyles.FAKE;
        return (
          <div className={`card result-card ${style.className}`}>
            <div className="result-header">
              <span className="result-icon">{style.icon}</span>
              <span className="result-label">{style.label}</span>
            </div>
            <p className="result-message">{verifyResult.message}</p>

            {verifyResult.product && (
              <div className="product-details">
                <h3>Product Details</h3>
                <table className="detail-table">
                  <tbody>
                    {[
                      ["Name", verifyResult.product.name],
                      ["Brand", verifyResult.product.brand],
                      ["Category", verifyResult.product.category],
                      ["Batch Number", verifyResult.product.batchNumber],
                      ["Manufacturing Date", verifyResult.product.manufacturingDate || "N/A"],
                      ["Description", verifyResult.product.description || "N/A"],
                      ["Times Scanned", verifyResult.product.scanCount],
                      ["Registered On", new Date(verifyResult.product.registeredAt).toLocaleDateString()],
                    ].map(([key, val]) => (
                      <tr key={key}>
                        <td className="detail-key">{key}</td>
                        <td className="detail-val">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button className="btn btn-secondary" onClick={handleReset}>
              Scan Another
            </button>
          </div>
        );
      })()}
    </div>
  );
}