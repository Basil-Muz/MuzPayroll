import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./changepassword.css";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-fill user code from Login page
  const initialUserCode = location.state?.userCode || "";

  const [userCode, setUserCode] = useState(initialUserCode);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Auto-append "@muziris"
  const handleUserCodeChange = (e) => {
    let value = e.target.value.trim();

    if (!value.endsWith("@muziris")) {
      value = value.replace("@muziris", "");
      value = value + "@muziris";
    }

    setUserCode(value);
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!userCode || !newPass || !confirmPass) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (newPass !== confirmPass) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_code: userCode,
          new_password: newPass,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setErrorMsg(data.message || "Failed to update password.");
        return;
      }

      setSuccessMsg("Password updated successfully! Redirecting to Login...");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      setErrorMsg("Server error. Try again later.");
    }
  };

  return (
    <div className="cp-container">
      <div className="cp-box">
        <h2>Change Password</h2>

        <label>User Code</label>
        <input
          type="text"
          value={userCode}
          onChange={handleUserCodeChange}
        />

        <label>New Password</label>
        <input
          type="password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />

        {errorMsg && <p className="cp-error">{errorMsg}</p>}
        {successMsg && <p className="cp-success">{successMsg}</p>}

        <button className="cp-btn" onClick={handleSubmit}>
          Update Password
        </button>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
