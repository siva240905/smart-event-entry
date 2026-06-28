import React, { useState, useEffect } from "react";
import API from "./api";

function CreateEvent() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    venue: ""
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const res = await API.get("/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.date || !form.venue) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await API.post("/api/events", form);
      setSuccessMsg("Event Created Successfully!");
      setForm({ name: "", date: "", venue: "" });
      fetchEvents();
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.error || "Error creating event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id, eventName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the event "${eventName}"? WARNING: This will permanently delete ALL participants registered for this event!`
      )
    ) {
      return;
    }

    try {
      await API.delete(`/api/events/${id}`);
      setSuccessMsg(`Event "${eventName}" deleted successfully.`);
      fetchEvents();
    } catch (error) {
      console.error(error);
      setErrorMsg("Error deleting event. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        .create-event-container {
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
        }

        .event-reg-card, .event-list-card {
          background: rgba(18, 18, 18, 0.75) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
          border-radius: 16px;
          color: white;
          width: 100%;
          max-width: 600px;
        }

        .event-input {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border-radius: 8px !important;
          padding: 12px !important;
          transition: all 0.3s ease;
        }

        .event-input:focus {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.15) !important;
          outline: none;
        }

        .btn-create {
          background: linear-gradient(135deg, #ffffff, #d4d4d8) !important;
          border: none !important;
          color: #000000 !important;
          border-radius: 8px !important;
          padding: 12px !important;
          font-weight: 700;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .btn-create:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffffff, #ffffff) !important;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.4) !important;
          transform: translateY(-2px);
        }

        .btn-create:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-delete-event {
          background: rgba(220, 53, 69, 0.15);
          border: 1px solid rgba(220, 53, 69, 0.4);
          color: #ff8888;
          border-radius: 6px;
          padding: 5px 10px;
          font-size: 13px;
          font-weight: bold;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-delete-event:hover {
          background: #dc3545;
          color: white;
          box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
        }

        .error-alert {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid #dc3545;
          color: #ff8888;
          border-radius: 8px;
          padding: 10px;
          font-size: 14px;
          margin-bottom: 20px;
          width: 100%;
          max-width: 600px;
        }

        .success-alert {
          background: rgba(0, 255, 128, 0.1);
          border: 1px solid #00ff80;
          color: #88ffc8;
          border-radius: 8px;
          padding: 10px;
          font-size: 14px;
          margin-bottom: 20px;
          width: 100%;
          max-width: 600px;
        }

        .event-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .event-item:last-child {
          border-bottom: none;
        }
      `}</style>

      <div className="create-event-container">
        {errorMsg && <div className="error-alert">{errorMsg}</div>}
        {successMsg && <div className="success-alert">{successMsg}</div>}

        <div className="card p-4 event-reg-card shadow-lg mb-5">
          <h2 className="mb-4 text-center" style={{ fontWeight: "800", color: "#ffffff", letterSpacing: "0.5px" }}>
            Create New Event
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-light small">Event Name</label>
              <input
                className="form-control event-input"
                name="name"
                placeholder="e.g. Code Hackathon"
                value={form.name}
                disabled={loading}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-light small">Event Date</label>
              <input
                className="form-control event-input"
                type="date"
                name="date"
                value={form.date}
                disabled={loading}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-light small">Venue</label>
              <input
                className="form-control event-input"
                name="venue"
                placeholder="e.g. Seminar Hall A"
                value={form.venue}
                disabled={loading}
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-create w-100" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style={{ color: "black" }}></span>
                  Creating Event...
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </form>
        </div>

        {/* Manage Events Panel */}
        <div className="card p-4 event-list-card shadow-lg">
          <h3 className="mb-3 text-center" style={{ fontWeight: "700", color: "#ffffff" }}>
            Manage Events
          </h3>

          {eventsLoading ? (
            <div className="text-center p-3">
              <div className="spinner-border text-light spinner-border-sm" role="status"></div>
              <span className="ms-2 small text-muted">Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <p className="text-muted text-center py-3">No events created yet.</p>
          ) : (
            <div className="event-list">
              {events.map((e) => (
                <div className="event-item" key={e._id}>
                  <div>
                    <h5 style={{ margin: "0 0 4px 0", color: "white", fontSize: "16px", fontWeight: "600" }}>{e.name}</h5>
                    <p style={{ margin: 0, fontSize: "13px", color: "#a1a1aa" }}>
                      {e.date} | {e.venue}
                    </p>
                  </div>
                  <button
                    className="btn-delete-event"
                    onClick={() => handleDeleteEvent(e._id, e.name)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CreateEvent;
