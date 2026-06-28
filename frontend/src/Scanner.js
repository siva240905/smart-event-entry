import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import API from "./api";

function Scanner() {
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);
  const [scanResult, setScanResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          alert("No camera devices found");
          return;
        }

        await html5QrCode.start(
          devices[0].id,
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            try {
              if (isRunningRef.current) {
                await html5QrCode.stop();
                isRunningRef.current = false;
              }

              setLoading(true);
              setScanResult("Verifying QR Pass...");

              const res = await API.post("/api/participants/verify", { 
                qrId: decodedText 
              });

              setScanResult(res.data.message);
              alert(res.data.message);

              // Restart scanner after verification if camera is still active
              if (cameraActive) {
                startScanner();
              }
            } catch (err) {
              console.error(err);
              const errMsg = err.response?.data?.message || "Verification error";
              setScanResult(errMsg);
              alert(errMsg);
              if (cameraActive) {
                startScanner();
              }
            } finally {
              setLoading(false);
            }
          }
        );

        isRunningRef.current = true;
      } catch (error) {
        console.error("Scanner start error:", error);
      }
    };

    if (cameraActive) {
      startScanner();
    }

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        scannerRef.current.stop()
          .then(() => {
            isRunningRef.current = false;
          })
          .catch(() => {});
      }
    };
  }, [cameraActive]);

  const toggleCamera = () => {
    if (cameraActive) {
      setCameraActive(false);
      setScanResult("Camera turned off");
    } else {
      setCameraActive(true);
      setScanResult("Initializing camera...");
    }
  };

  return (
    <>
      <style>{`
        .scanner-container {
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: white;
        }

        .scanner-card {
          background: rgba(18, 18, 18, 0.75) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
          border-radius: 16px;
          padding: 30px;
          width: 100%;
          max-width: 500px;
          text-align: center;
        }

        #reader {
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.1) !important;
          background: black;
          min-height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-box {
          margin-top: 25px;
          padding: 12px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-toggle-camera {
          font-weight: 700;
          border-radius: 8px !important;
          padding: 12px !important;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          border: none !important;
          text-transform: uppercase;
        }

        .btn-toggle-camera:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <div className="scanner-container">
        <div className="card scanner-card shadow-lg">
          <h2 className="mb-4" style={{ fontWeight: "800", color: "#ffffff", letterSpacing: "0.5px" }}>
            Admin QR Scanner
          </h2>
          
          <div id="reader" style={{ width: "100%", maxSquare: "320px", margin: "auto" }}>
            {!cameraActive && (
              <div className="text-muted">Camera is turned off</div>
            )}
          </div>

          <button
            className="btn btn-danger btn-toggle-camera w-100 mt-4"
            style={{
              background: cameraActive 
                ? "linear-gradient(135deg, #27272a, #18181b)" 
                : "linear-gradient(135deg, #ffffff, #d4d4d8)",
              color: cameraActive ? "white" : "black",
              border: cameraActive ? "1px solid rgba(255,255,255,0.15) !important" : "none"
            }}
            onClick={toggleCamera}
          >
            {cameraActive ? "Turn Camera Off" : "Turn Camera On"}
          </button>
          
          {(scanResult || loading) && (
            <div className="status-box">
              {loading ? (
                <span>Verifying pass...</span>
              ) : (
                <span>Result: {scanResult}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Scanner;
