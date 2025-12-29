import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgotpassword.css";

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
    <div className="forgot-container">
      <div className="forgot-box">
        <h2>Forgot Password</h2>

        <label>User Code</label>
        <input
          type="text"
          placeholder="Enter your user code"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
        />

        {error && <p className="error-msg">{error}</p>}
        {message && <p className="success-msg">{message}</p>}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "SENDING..." : "SEND PASSWORD"}
        </button>

        <p className="back-link" onClick={() => navigate("/")}>
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
