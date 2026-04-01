import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {

  const navigate = useNavigate();



  const features = [
    {
      icon: "🔐",
      title: "HMAC-Signed Tokens",
      desc: "Every QR code is cryptographically signed. Forged tokens are rejected instantly at verification.",
    },
    {
      icon: "📡",
      title: "Scan Tracking",
      desc: "Every scan is logged with a timestamp. Duplicate scans trigger a counterfeit flag automatically.",
    },
    {
      icon: "⚡",
      title: "Instant Verification",
      desc: "Consumers get a real-time genuine, flagged, or fake result in under a second.",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      desc: "Monitor scan activity, flagged products, and registration stats from a live dashboard.",
    },
    {
      icon: "📷",
      title: "Camera & Upload",
      desc: "Verify products by scanning live with a camera or uploading a QR image directly.",
    },
    {
      icon: "🧩",
      title: "Modular & Extensible",
      desc: "Built to plug into MongoDB, blockchain, or mobile apps as your needs grow.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Manufacturer registers product",
      desc: "Fill in product name, brand, batch number and category. The system generates a unique cryptographic token.",
    },
    {
      num: "02",
      title: "QR code is generated",
      desc: "The HMAC-signed token is encoded into a QR code. Download and print it — attach to the physical product.",
    },
    {
      num: "03",
      title: "Consumer scans to verify",
      desc: "Using any phone camera or the web app, the consumer scans the QR. The server verifies the signature and scan count.",
    },
    {
      num: "04",
      title: "Instant result delivered",
      desc: "Genuine on first scan. Flagged if scanned multiple times. Fake if the token doesn't exist or is tampered.",
    },
  ];

  return (
  <div className="landing">
    

    {/* HERO */}
    <section className="hero">

      {/* Glowing wordmark sitting IN the gradient */}
      <div className="hero-wordmark-wrap">
        <span className="hero-wordmark">ScanTrust</span>
        <div className="hero-wordmark-glow" />
      </div>

      <div className="hero-badge">QR-Based Anti-Counterfeit System</div>
      <h1 className="hero-title">
        Trust Every Product.<br />
        <span className="hero-accent">Verify in Seconds.</span>
      </h1>
      <p className="hero-subtitle">
        ScanTrust uses cryptographically signed QR codes and real-time scan
        tracking to protect manufacturers and consumers from counterfeit products.
      </p>
      <div className="hero-actions">
        <button className="btn-landing-primary" onClick={() => navigate("/")}>
          Register a Product
        </button>
        <button className="btn-landing-secondary" onClick={() => navigate("/verify")}>
          Verify a Product
        </button>
      </div>

      <div className="hero-stats">
        {[
          { val: "HMAC", label: "Token Security" },
          { val: "<1s", label: "Verify Speed" },
          { val: "100%", label: "Client-Server" },
          { val: "Live", label: "Scan Tracking" },
        ].map((s) => (
          <div key={s.label} className="hero-stat">
            <span className="hero-stat-val">{s.val}</span>
            <span className="hero-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* FEATURES */}
    <section className="section">
      <div className="section-label">Features</div>
      <h2 className="section-title">Built for real anti-counterfeiting</h2>
      <div className="features-grid">
        {features.map((f) => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* HOW IT WORKS */}
    <section className="section">
      <div className="section-label">How It Works</div>
      <h2 className="section-title">From registration to verification</h2>
      <div className="steps-grid">
        {steps.map((s, i) => (
          <div key={s.num} className="step-card">
            <div className="step-num">{s.num}</div>
            <h3 className="step-title">{s.title}</h3>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA BANNER */}
    <section className="cta-banner">
      <div className="cta-glow" />
      <h2 className="cta-title">Ready to protect your products?</h2>
      <p className="cta-sub">Register your first product and generate a secure QR in under a minute.</p>
      <button className="btn-landing-primary" onClick={() => navigate("/manufacturer")}>
        Get Started
      </button>
    </section>

    <footer className="landing-footer">
      <span className="footer-brand">🔐 ScanTrust</span>
      <span className="footer-copy">QR-Based Fake Product Detection System</span>
    </footer>
  </div>
);
}