import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRGenerator({ qrData, productName }) {
  const canvasRef = useRef();

  const handleDownload = () => {
    const canvas = document.querySelector("#qr-canvas canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${productName || "product"}-qr.png`;
    a.click();
  };

  return (
    <div className="qr-container">
      <div id="qr-canvas">
        <QRCodeCanvas
          value={qrData}
          size={200}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: "",
            excavate: false,
          }}
        />
      </div>
      <p className="qr-label">Scan to verify: <strong>{productName}</strong></p>
      <button className="btn btn-secondary" onClick={handleDownload}>
        ⬇ Download QR Code
      </button>
    </div>
  );
}