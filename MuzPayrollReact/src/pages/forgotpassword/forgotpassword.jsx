import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginPage/loginpage.css"

function ForgotPassword() {
  const navigate = useNavigate();

  const [userCode, setUserCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (!userCode.trim()) {
      setError("User code is required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8087/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userCode: userCode.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to send password");
        return;
      }

      setMessage("Password has been sent to your registered email.");
      setUserCode("");
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="login-container">
    <div className="login-box">
      <div className="logo-section">
        <h2>Forgot Password</h2>
      </div>

      <div className="form-group1">
        <label>User Code</label>

        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Enter your user code"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className={error ? "input-error" : ""}
          />
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}
      {message && <p className="success-msg">{message}</p>}

      <button
        className="login-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "SENDING..." : "SEND PASSWORD"}
      </button>

      <p className="forgot-link" onClick={() => navigate("/")}>
        Back to Login
      </p>
    </div>
  </div>
);

}

export default ForgotPassword;
