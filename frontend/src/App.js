import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Navbar from "./Navbar";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Scanner from "./Scanner";
import ParticipantList from "./ParticipantList";
import CreateEvent from "./CreateEvent";
import Login from "./Login";

/* ================= MAIN APP CONTENT ================= */

function AppContent() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check login on refresh
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    setIsAdmin(!!token);
  }, []);

  // Hide Navbar on public pages
  const publicRoutes = ["/", "/login"];
  const hideNavbar = publicRoutes.includes(location.pathname);

  return (
    <>
      {/* ⭐ STAR BACKGROUND */}
      <div className="stars">
        {[...Array(120)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 2 + "s"
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      {!hideNavbar && isAdmin && <Navbar setIsAdmin={setIsAdmin} />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={isAdmin ? <Dashboard /> : <Login setIsAdmin={setIsAdmin} />}
        />

        <Route
          path="/scanner"
          element={isAdmin ? <Scanner /> : <Login setIsAdmin={setIsAdmin} />}
        />

        <Route
          path="/participants"
          element={
            isAdmin ? (
              <ParticipantList />
            ) : (
              <Login setIsAdmin={setIsAdmin} />
            )
          }
        />

        <Route
          path="/create-event"
          element={
            isAdmin ? (
              <CreateEvent />
            ) : (
              <Login setIsAdmin={setIsAdmin} />
            )
          }
        />
      </Routes>
    </>
  );
}

/* ================= WRAPPER WITH ROUTER ================= */

function App() {
  return (
    <Router>
      <style>{`
        body {
          margin: 0;
          background: #000;
          font-family: 'Segoe UI', sans-serif;
          overflow-x: hidden;
        }

        .stars {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: -1;
          overflow: hidden;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.55);
          border-radius: 50%;
          animation: twinkle 2s infinite ease-in-out;
        }

        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0.2; transform: scale(1); }
        }
      `}</style>

      <AppContent />
    </Router>
  );
}

export default App;
