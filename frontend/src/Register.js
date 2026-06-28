import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import API from "./api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    eventId: ""
  });

  const [qrId, setQrId] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    API.get("/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error loading events:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.college || !form.eventId) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await API.post("/api/participants/register", form);
      setQrId(res.data.qrId);
      setSuccessMsg("Registration successful! Your pass is generated below.");
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.error || "Error registering. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (qrId) {
      QRCode.toCanvas(
        document.getElementById("qrCanvas"),
        qrId,
        { 
          width: 180,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#ffffff"
          }
        },
        (err) => {
          if (err) console.error("QR Code Error:", err);
        }
      );
    }
  }, [qrId]);

  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      const input = document.getElementById("teamPass");
      const canvas = await html2canvas(input, {
        scale: 2, 
        useCORS: true
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "pt", "a4");
      pdf.addImage(imgData, "PNG", 21, 97, 800, 400);
      pdf.save(`Pass_${form.name.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to download PDF Pass. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .register-container {
          min-height: 100vh;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .reg-card {
          background: rgba(18, 18, 18, 0.75) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
          border-radius: 16px;
          color: white;
          width: 100%;
          max-width: 600px;
        }

        .reg-input, .reg-select {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border-radius: 8px !important;
          padding: 12px !important;
          transition: all 0.3s ease;
        }

        .reg-input:focus, .reg-select:focus {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.15) !important;
          outline: none;
        }

        .reg-select option {
          background: #111;
          color: white;
        }

        .btn-register {
          background: linear-gradient(135deg, #ffffff, #d4d4d8) !important;
          border: none !important;
          color: #000000 !important;
          border-radius: 8px !important;
          padding: 12px !important;
          font-weight: 700;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }

        .btn-register:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffffff, #ffffff) !important;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.4) !important;
          transform: translateY(-2px);
        }

        .btn-register:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-alert {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid #dc3545;
          color: #ff8888;
          border-radius: 8px;
          padding: 10px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .success-alert {
          background: rgba(0, 255, 128, 0.1);
          border: 1px solid #00ff80;
          color: #88ffc8;
          border-radius: 8px;
          padding: 10px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        /* Pass Style */
        .pass-canvas-container {
          background: #0d0d0e;
          padding: 25px;
          border-radius: 12px;
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          width: 100%;
          max-width: 600px;
          margin: 30px auto 10px auto;
        }
      `}</style>

      <div className="register-container">
        <div className="card p-4 reg-card shadow-lg">
          <h2 className="text-center mb-4" style={{ fontWeight: "800", color: "#ffffff", letterSpacing: "0.5px" }}>
            Event Registration
          </h2>

          {errorMsg && <div className="error-alert">{errorMsg}</div>}
          {successMsg && <div className="success-alert">{successMsg}</div>}

          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-3 reg-input"
              name="name"
              placeholder="Full Name"
              value={form.name}
              disabled={loading}
              onChange={handleChange}
            />

            <input
              className="form-control mb-3 reg-input"
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              disabled={loading}
              onChange={handleChange}
            />

            <input
              className="form-control mb-3 reg-input"
              name="college"
              placeholder="College / Institution"
              value={form.college}
              disabled={loading}
              onChange={handleChange}
            />

            <select
              className="form-control mb-4 reg-select"
              name="eventId"
              value={form.eventId}
              disabled={loading}
              onChange={handleChange}
            >
              <option value="">Select Event</option>
              {events.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>

            <button 
              type="submit" 
              className="btn btn-danger btn-register w-100" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style={{ color: "black" }}></span>
                  Processing Registration...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {qrId && (
            <div className="text-center mt-4">
              {/* HTML Pass Container for Download */}
              <div id="teamPass" className="pass-canvas-container text-white">
                {/* Header */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #1f1f23, #111113)",
                    color: "white",
                    padding: "15px",
                    borderRadius: "8px",
                    fontSize: "22px",
                    fontWeight: "800",
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    border: "1px solid rgba(255, 255, 255, 0.08)"
                  }}
                >
                  BLITZMAC Symposium 2026
                </div>

                {/* Details */}
                <div style={{ display: "flex", marginTop: "25px", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ textAlign: "left", fontSize: "16px", flex: "1", paddingRight: "15px" }}>
                    <p style={{ margin: "0 0 10px 0" }}>
                      <strong style={{ color: "#a1a1aa" }}>Name:</strong> {form.name}
                    </p>
                    <p style={{ margin: "0 0 10px 0" }}>
                      <strong style={{ color: "#a1a1aa" }}>Email:</strong> {form.email}
                    </p>
                    <p style={{ margin: "0 0 10px 0" }}>
                      <strong style={{ color: "#a1a1aa" }}>College:</strong> {form.college}
                    </p>
                    <p style={{ margin: "0 0 10px 0" }}>
                      <strong style={{ color: "#a1a1aa" }}>Event:</strong> {
                        events.find((e) => e._id === form.eventId)?.name || "Selected Event"
                      }
                    </p>
                  </div>

                  {/* QR Canvas */}
                  <div style={{ background: "white", padding: "8px", borderRadius: "8px" }}>
                    <canvas id="qrCanvas"></canvas>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "#71717a", letterSpacing: "1px" }}>
                  --- SCAN QR CODE FOR FAST CHECK-IN AT VENUE ENTRY ---
                </div>
              </div>

              <button
                className="btn btn-success mt-4 w-100"
                style={{
                  padding: "12px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #27272a, #18181b)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white"
                }}
                onClick={downloadPDF}
                disabled={pdfLoading}
              >
                {pdfLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style={{ color: "white" }}></span>
                    Generating Pass PDF...
                  </>
                ) : (
                  "Download Pass PDF"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Register;
