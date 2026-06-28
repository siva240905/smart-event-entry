import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ setIsAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin");
    if (setIsAdmin) {
      setIsAdmin(false);
    }
    navigate("/");
  };

  return (
    <>
      <style>{`
        .navbar {
          background: linear-gradient(to right, #0e0e10, #18181b);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 15px 20px;
          position: relative;
          z-index: 1000;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          color: white;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .nav-links {
          display: flex;
          gap: 15px;
        }

        .nav-links a {
          text-decoration: none;
          color: #e4e4e7;
          padding: 8px 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;
        }

        .nav-links a:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border-color: rgba(255, 255, 255, 0.25);
        }

        .logout {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15) !important;
        }

        .logout:hover {
          background: rgba(220, 53, 69, 0.15) !important;
          border-color: rgba(220, 53, 69, 0.4) !important;
          color: #ff8888 !important;
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 5px;
        }

        .hamburger span {
          width: 25px;
          height: 3px;
          background: white;
          transition: 0.3s;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .hamburger {
            display: flex;
          }

          .nav-links {
            position: absolute;
            top: 70px;
            left: 0;
            width: 100%;
            flex-direction: column;
            background: #111;
            overflow: hidden;
            max-height: 0;
            transition: max-height 0.4s ease;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .nav-links.open {
            max-height: 300px;
            padding: 10px 0;
          }

          .nav-links a {
            width: 100%;
            text-align: center;
            border: none;
            padding: 12px 0;
            border-bottom: 1px solid #222;
          }

          .nav-links a:hover {
            background: rgba(255, 255, 255, 0.05);
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">Smart Event Entry</div>

          {/* Hamburger */}
          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Links */}
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/scanner">Scanner</Link>
            <Link to="/participants">Participants</Link>
            <Link to="/create-event">Create Event</Link>
            <Link to="/" className="logout" onClick={handleLogout}>Logout</Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
