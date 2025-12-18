import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./changepassword.css";

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
    <div className="change-password-container">
      <form className="change-password-box" onSubmit={handleSubmit}>
        <h3 className="change-password-heading">Change Password</h3>

        <div className="change-password-field">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>

        <div className="change-password-field">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <div className="change-password-field">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        {error && <div className="error-text">{error}</div>}
        {success && <div className="success-text">{success}</div>}

        <div className="change-password-actions">
          <button type="submit" className="change-password-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
