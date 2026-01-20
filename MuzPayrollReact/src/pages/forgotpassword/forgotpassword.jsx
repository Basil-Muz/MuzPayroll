import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginPage/loginpage.css"
import { RiAdminFill } from "react-icons/ri";

function ForgotPassword() {
  const navigate = useNavigate();

  const [userCode, setUserCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizeUserCode = () => {
    const value = userCode.trim();
    if (!value) return false;

    const username = value.replace("@muziris", "");

    const isValid = /^[a-zA-Z0-9]+$/.test(username);
    if (!isValid) {
      setError("User code must contain only letters and numbers");
      return false;
    }

    setError("");

    if (!value.endsWith("@muziris")) {
      setUserCode(username + "@muziris");
    }

    return true;
  };


  const handleBlur = () => {
    normalizeUserCode();
  };


  const handleSubmit = async () => {
    setMessage("");
    setError("");

    const isValid = normalizeUserCode();
    if (!isValid) return;

    if (!userCode.trim()) {
      setError("User code is required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8087/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userCode: userCode.trim() }),
      });

      const data = await response.json();
      console.log("API RESPONSE:", data);

      if (!response.ok || data.success === false) {
        setError(
          (data.errors && data.errors[0]) ||
          data.message ||
          "Failed to send password"
        );
        return;
      }

      setMessage("Password sent to registered email");
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
        <form
          onSubmit={(e) => {
            e.preventDefault(); // 🔥 IMPORTANT
            handleSubmit();
          }}
        >

          <div className="form-group1">
            <label>User Code</label>
            <div className="input-wrapper">
              <RiAdminFill className="input-inside-icon" />
              <input
                type="text"
                placeholder="e.g.abc, not abc@muziris"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                className={error ? "input-error" : ""}
              />
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {message && <p className="success-msg">{message}</p>}

          <button
            type="submit"
            className="login-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "SENDING..." : "SEND PASSWORD"}
          </button>
        </form>

        <p className="forgot-link" onClick={() => navigate("/")}>
          Back to Login
        </p>
      </div>
    </div>
  );

}

export default ForgotPassword;
