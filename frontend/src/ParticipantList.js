import React, { useEffect, useState } from "react";
import API from "./api";

function Participants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch participants
  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/participants");
      setParticipants(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching participants list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  // Delete participant
  const handleDeleteParticipant = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete participant "${name}"?`)) {
      return;
    }

    try {
      await API.delete(`/api/participants/${id}`);
      fetchParticipants();
    } catch (error) {
      console.error("Error deleting participant:", error);
      alert("Error deleting participant. Please try again.");
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["Name", "Email", "College", "Event", "Status"];

    const rows = participants.map((p) => [
      p.name,
      p.email,
      p.college,
      p.eventId?.name || "N/A",
      p.checkedIn ? "Checked In" : "Not Checked In"
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "participants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* ===== INLINE CSS ===== */}
      <style>{`
        .participants-container {
          padding: 40px;
          min-height: 100vh;
          background: #000;
          color: white;
        }

        .participants-title {
          font-size: 32px;
          color: #ffffff;
          margin-bottom: 20px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .participants-actions {
          margin-bottom: 20px;
        }

        .btn-admin {
          padding: 8px 18px;
          margin-right: 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: transparent;
          color: #e4e4e7;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 6px;
          font-weight: bold;
        }

        .btn-admin:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
        }

        .btn-admin:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .participants-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(17, 17, 17, 0.7);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .participants-table thead {
          background: rgba(255, 255, 255, 0.03);
        }

        .participants-table th {
          padding: 16px;
          text-align: left;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          border-bottom: 2px solid rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .participants-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 14px;
          color: #d4d4d8;
        }

        .participants-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
          transition: 0.2s ease;
        }

        .status-checked {
          color: #10b981;
          font-weight: bold;
        }

        .status-notchecked {
          color: #ef4444;
          font-weight: bold;
        }

        .btn-delete-participant {
          background: rgba(220, 53, 69, 0.15);
          border: 1px solid rgba(220, 53, 69, 0.4);
          color: #ff8888;
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 13px;
          font-weight: bold;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-delete-participant:hover {
          background: #dc3545;
          color: white;
          box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
        }

        @media (max-width: 768px) {
          .participants-container {
            padding: 20px;
          }

          .participants-title {
            font-size: 24px;
          }

          .participants-table th,
          .participants-table td {
            font-size: 12px;
            padding: 10px;
          }
        }
      `}</style>

      {/* ===== UI ===== */}
      <div className="participants-container">
        <h2 className="participants-title">Participant List</h2>

        <div className="participants-actions">
          <button 
            className="btn-admin" 
            onClick={fetchParticipants}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button 
            className="btn-admin" 
            onClick={exportCSV}
            disabled={loading || participants.length === 0}
          >
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-light" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading participants...</span>
            </div>
            <p className="mt-3 text-muted">Fetching participants list...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="participants-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>College</th>
                  <th>Event</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No participants registered yet.
                    </td>
                  </tr>
                ) : (
                  participants.map((p) => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: "600", color: "white" }}>{p.name}</td>
                      <td>{p.email}</td>
                      <td>{p.college}</td>
                      <td>{p.eventId?.name || "N/A"}</td>
                      <td>
                        {p.checkedIn ? (
                          <span className="status-checked">Checked In</span>
                        ) : (
                          <span className="status-notchecked">Not Checked In</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn-delete-participant"
                          onClick={() => handleDeleteParticipant(p._id, p.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Participants;
