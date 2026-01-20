import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../LoginPage/loginpage.css";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 🔹 Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      const loginData = JSON.parse(localStorage.getItem("loginData"));

      if (!loginData || !loginData.userCode) {
        setError("User not logged in. Please login again.");
        return;
      }

      const payload = {
        userCode: loginData.userCode,
        currentPassword,
        newPassword
      };

      const response = await axios.post(
        "http://localhost:8087/change-password",
        payload
      );

      setSuccess(response.data.message || "Password changed successfully");

      // 🔐 Force logout after password change
      localStorage.clear();

      // 🔁 Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to change password"
      );
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="logo-section">
          <h2>Change Password</h2>
        </div>

        {/* Current Password */}
        <div className="form-group1">
          <label>Current Password</label>
          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={error ? "input-error" : ""}
            />
          </div>
        </div>

        {/* New Password */}
        <div className="form-group1">
          <label>New Password</label>
          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={error ? "input-error" : ""}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="form-group1">
          <label>Confirm Password</label>
          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={error ? "input-error" : ""}
            />
          </div>
        </div>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <button type="submit" className="login-btn">
          Submit
        </button>

        <p className="forgot-link" onClick={() => navigate("/")}>
          Back to Login
        </p>
      </form>
    </div>
  );

}

export default ChangePassword;
