import React, { useEffect, useState } from "react";
import API from "./api";

function Dashboard() {
  const [eventStats, setEventStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total: 0,
    checkedIn: 0,
    percentage: 0
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/participants");
      prepareStats(res.data);
    } catch (err) {
      console.error(err);
      alert("Error loading dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const prepareStats = (data) => {
    let total = data.length;
    let checkedIn = data.filter((p) => p.checkedIn).length;
    let percentage = total > 0 ? ((checkedIn / total) * 100).toFixed(1) : 0;

    const stats = {};

    data.forEach((p) => {
      const eventName = p.eventId?.name || "Unknown Event";

      if (!stats[eventName]) {
        stats[eventName] = {
          total: 0,
          checkedIn: 0
        };
      }

      stats[eventName].total += 1;
      if (p.checkedIn) stats[eventName].checkedIn += 1;
    });

    setEventStats(stats);
    setSummary({ total, checkedIn, percentage });
  };

  return (
    <>
      <style>{`
        body {
          background: #000;
        }

        .dashboard {
          padding: 40px;
          color: white;
          min-height: 100vh;
        }

        .title {
          font-size: 34px;
          color: #ffffff;
          margin-bottom: 30px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        /* TOP SUMMARY CARDS */
        .summary-container {
          display: flex;
          gap: 20px;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }

        .summary-card {
          flex: 1;
          min-width: 250px;
          background: rgba(17, 17, 17, 0.7);
          backdrop-filter: blur(8px);
          padding: 25px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
          transition: all 0.3s ease;
        }

        .summary-card:hover {
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.08);
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .summary-number {
          font-size: 36px;
          font-weight: bold;
          margin-top: 10px;
        }

        .green { color: #10b981; }
        .blue { color: #3b82f6; }
        .silver { color: #e4e4e7; }

        /* EVENT LIST */
        .event-card {
          background: rgba(17, 17, 17, 0.6);
          backdrop-filter: blur(6px);
          padding: 25px;
          border-radius: 10px;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: 0.3s ease;
        }

        .event-card:hover {
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
        }

        .event-name {
          font-size: 20px;
          color: #ffffff;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
          padding-bottom: 4px;
          color: #a1a1aa;
        }

        .stat-row span:last-child {
          color: white;
        }

        .stat-row:last-child {
          border-bottom: none;
        }
      `}</style>

      <div className="dashboard">
        <h2 className="title">Event Dashboard</h2>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-light" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading dashboard...</span>
            </div>
            <p className="mt-3 text-muted">Loading statistics...</p>
          </div>
        ) : (
          <>
            {/* 🔝 TOP SUMMARY */}
            <div className="summary-container">
              <div className="summary-card">
                <div>Total Registered</div>
                <div className="summary-number blue">{summary.total}</div>
              </div>

              <div className="summary-card">
                <div>Total Check-ins</div>
                <div className="summary-number green">{summary.checkedIn}</div>
              </div>

              <div className="summary-card">
                <div>Attendance %</div>
                <div className="summary-number silver">{summary.percentage}%</div>
              </div>
            </div>

            {/* 🔽 EVENT WISE LIST */}
            <h3 style={{ marginBottom: "20px", fontWeight: "700" }}>Event-wise Attendance</h3>

            {Object.keys(eventStats).length === 0 ? (
              <p className="text-muted">No participant registration data found.</p>
            ) : (
              Object.entries(eventStats).map(([event, data]) => (
                <div className="event-card" key={event}>
                  <div className="event-name">{event}</div>

                  <div className="stat-row">
                    <span>Total Registered:</span>
                    <span>{data.total}</span>
                  </div>

                  <div className="stat-row">
                    <span>Checked In:</span>
                    <span className="green">{data.checkedIn}</span>
                  </div>

                  <div className="stat-row">
                    <span>Not Checked In:</span>
                    <span style={{ color: "#ef4444" }}>{data.total - data.checkedIn}</span>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
