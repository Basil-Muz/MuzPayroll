import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TbPasswordUser } from "react-icons/tb";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Select from "react-select";

import "../LoginPage/loginpage.css";

import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import {
  resetPassword,
  getUsersDropdown,
} from "../../services/resetpassword.service";

function ResetPasswordSimple() {
  const navigate = useNavigate();

  const [userCode, setUserCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsersDropdown();
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = () => {};
 

  // Convert to react-select format
  const userOptions = users.map((u) => ({
    value: u.userCode,
    label: `${u.userCode} - ${u.username}`,
  }));

  const clearForm = () => {
    setUserCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setError("");
    setSuccess("");

    if (!userCode || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const payload = { userCode, newPassword, confirmPassword };
      const response = await resetPassword(payload);

      setSuccess(response.data?.message || "Password reset successfully");
      clearForm();

      const loginData = JSON.parse(localStorage.getItem("loginData"));
      const solutionId = loginData?.solutionId;

      localStorage.clear();

      setTimeout(() => {
        if (solutionId === 1) {
          navigate("/payroll", { replace: true });
        } else if (solutionId === 2) {
          navigate("/payrollemp", { replace: true });
        } else {
          navigate("/payroll", { replace: true });
        }
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0] ||
          err.response?.data?.message ||
          "Failed to reset password",
      );
    }
  };

  return (
    <div className="login-container">
      <FloatingActionBar
        actions={{
          // save: { onClick: handleSubmit },
          clear: { onClick: clearForm },
          delete: { disabled: true },
          print: { disabled: true },
          search: { onClick: handleSearch, disabled: true },
          // clear: { onClick: handleClear },
          // new: { onClick: clearForm },
        }}
      />

      <form className="login-box" onSubmit={handleSubmit}>
        <div className="logo-section">
          <h2>Reset Password</h2>
        </div>

        {/* User Dropdown */}
        <div className="form-group1">
          <label>User Code</label>
          <Select
            classNamePrefix="form-control-select"
            options={userOptions}
            isSearchable={false}
            value={userOptions.find((opt) => opt.value === userCode) || null}
            onChange={(option) => setUserCode(option ? option.value : "")}
            placeholder="-- Select User --"
          />
        </div>

        {/* New Password */}
        <div className="form-group1">
          <label>New Password</label>
          <div className="input-wrapper">
            <TbPasswordUser className="input-inside-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter New Password"
            />
            <span
              className="password-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEye /> : <IoEyeOff />}
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="form-group1">
          <label>Confirm Password</label>
          <div className="input-wrapper">
            <TbPasswordUser className="input-inside-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
          </div>
        </div>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <button type="submit" className="login-btn">
          RESET
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordSimple;
