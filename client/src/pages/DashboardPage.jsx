import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/dashboard/stats`).then((res) => {
      setStats(res.data.stats);
      setRecentScans(res.data.recentScans);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page center"><div className="spinner"></div></div>;

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: "📦", cls: "" },
    { label: "Total Scans", value: stats.totalScans, icon: "🔍", cls: "" },
    { label: "Genuine (1 scan)", value: stats.genuineProducts, icon: "✅", cls: "stat-genuine" },
    { label: "Flagged (2+ scans)", value: stats.flaggedProducts, icon: "⚠️", cls: "stat-flagged" },
    { label: "Unscanned", value: stats.unscannedProducts, icon: "📭", cls: "" },
  ];

  return (
    <div className="page">
      <h1 className="page-title">📊 Dashboard</h1>
      <p className="page-subtitle">Overview of product registrations and scan activity.</p>

      <div className="stat-grid">
        {statCards.map((s) => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Recent Scans</h2>
        {recentScans.length === 0 ? (
          <p className="empty-text">No scans yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="scan-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Scan ID</th>
                  <th>Scanned At</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((s) => (
                  <tr key={s.scanId}>
                    <td className="td-product">{s.productName}</td>
                    <td className="td-brand">{s.brand}</td>
                    <td><span className="mono">{s.scanId}</span></td>
                    <td>{new Date(s.scannedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}