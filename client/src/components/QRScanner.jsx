import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScanSuccess }) {
  const [mode, setMode] = useState("camera"); // "camera" | "upload"
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    setError("");
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      setScanning(true);

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScanSuccess(decodedText);
          stopCamera();
        },
        () => {}
      );
    } catch (err) {
      setError("Camera access denied or not available.");
      setScanning(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
    }
    setScanning(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");

    try {
      const scanner = new Html5Qrcode("qr-reader-file");
      const result = await scanner.scanFile(file, true);
      onScanSuccess(result);
    } catch {
      setError("Could not decode QR code from image. Please try again.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  return (
    <div className="scanner-wrapper">
      <div className="scan-mode-toggle">
        <button
          className={`btn ${mode === "camera" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => { setMode("camera"); stopCamera(); setError(""); }}
        >
          📷 Camera
        </button>
        <button
          className={`btn ${mode === "upload" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => { setMode("upload"); stopCamera(); setError(""); }}
        >
          🖼 Upload Image
        </button>
      </div>

      {mode === "camera" && (
        <div className="camera-section">
          <div id="qr-reader" style={{ width: "100%" }}></div>
          {!scanning ? (
            <button className="btn btn-primary" onClick={startCamera}>
              Start Camera
            </button>
          ) : (
            <button className="btn btn-danger" onClick={stopCamera}>
              Stop Camera
            </button>
          )}
        </div>
      )}

      {mode === "upload" && (
        <div className="upload-section">
          <div id="qr-reader-file" style={{ display: "none" }}></div>
          <label className="upload-label">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <div
              className="upload-box"
              onClick={() => fileInputRef.current.click()}
            >
              📂 Click to upload QR image
            </div>
          </label>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}