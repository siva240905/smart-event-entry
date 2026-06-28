import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";

function Login({ setIsAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Please enter both username and password");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await API.post("/api/auth/login", {
        username,
        password
      });

      localStorage.setItem("admin_token", res.data.token);
      setIsAdmin(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg(
        error.response?.data?.message || "Invalid credentials or server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-card {
          background: rgba(18, 18, 18, 0.8) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
          border-radius: 16px;
          color: white;
        }

        .login-input {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border-radius: 8px !important;
          transition: all 0.3s ease;
        }

        .login-input:focus {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.15) !important;
          outline: none;
        }

        .btn-login {
          background: linear-gradient(135deg, #ffffff, #d4d4d8) !important;
          border: none !important;
          color: #000000 !important;
          border-radius: 8px !important;
          padding: 12px !important;
          font-weight: 700;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }

        .btn-login:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffffff, #ffffff) !important;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.4) !important;
          transform: translateY(-2px);
        }

        .btn-login:disabled {
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
      `}</style>

      <div className="container mt-5" style={{ maxWidth: "450px" }}>
        <div className="card p-4 text-center login-card mt-5">
          <h2 className="mb-4" style={{ fontWeight: "700", color: "#ffffff" }}>Admin Login</h2>
          
          {errorMsg && <div className="error-alert">{errorMsg}</div>}

          <form onSubmit={handleLogin}>
            <input
              className="form-control mb-3 login-input"
              placeholder="Username"
              value={username}
              disabled={loading}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              className="form-control mb-4 login-input"
              placeholder="Password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button 
              type="submit" 
              className="btn btn-primary btn-login w-100" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style={{ color: "black" }}></span>
                  Authenticating...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
