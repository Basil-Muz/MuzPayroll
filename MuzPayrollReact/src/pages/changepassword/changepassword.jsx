import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../LoginPage/loginpage.css";
import { TbPasswordUser } from "react-icons/tb";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useAuth } from "../../context/AuthProvider";
import { changePassword, changePasswordForgot } from "../../services/changepassword.service";

function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { solutionId } = useAuth();

  //Detect forgot-password flow
  const isForgotFlow = location.state?.forgotFlow === true;
  const userCodeFromForgot = location.state?.userCode;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Password rules
  const validatePasswordRules = (password) => {
    if (password.length < 2)
      return "Password must be at least 2 characters long";
    if (password.includes(" "))
      return "Password must not contain spaces";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Required validation
    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    // Password rules
    const ruleError = validatePasswordRules(newPassword);
    if (ruleError) {
      setError(ruleError);
      return;
    }

    // Match check
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Normal flow needs current password
    if (!isForgotFlow && !currentPassword) {
      setError("Current password is required");
      return;
    }

    setLoading(true);

    if (isForgotFlow && !userCodeFromForgot) {
      setError("Session expired. Please retry forgot password.");
      setLoading(false);
      return;
    }

    try {
      let payload = {};
      let response;

      if (isForgotFlow) {
        payload = {
          userCode: userCodeFromForgot,
          newPassword,
          confirmPassword,
        };

        response = await changePasswordForgot(payload);
      } else {
        const loginData = JSON.parse(localStorage.getItem("loginData"));
        if (!loginData?.userCode) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        payload = {
          userCode: loginData.userCode,
          currentPassword,
          newPassword,
          confirmPassword,
        };

        response = await changePassword(payload);
      }

      setSuccess(response.data?.message || "Password changed successfully");

      // const solutionId = user?.solutionId;
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
        "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="logo-section">
          <h2>Change Password</h2>
        </div>

        {/*CURRENT PASSWORD (only normal flow) */}
        {!isForgotFlow && (
          <div className="form-group1">
            <label>Current Password</label>
            <div className="input-wrapper">
              <TbPasswordUser className="input-inside-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoFocus
              />
              <span
                className="password-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEye /> : <IoEyeOff />}
              </span>
            </div>
          </div>
        )}

        {/* NEW PASSWORD */}
        <div className="form-group1">
          <label>New Password</label>
          <div className="input-wrapper">
            <TbPasswordUser className="input-inside-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoFocus={isForgotFlow}
            />
            <span
              className="password-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEye /> : <IoEyeOff />}
            </span>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="form-group1">
          <label>Confirm Password</label>
          <div className="input-wrapper">
            <TbPasswordUser className="input-inside-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="password-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEye /> : <IoEyeOff />}
            </span>
          </div>
        </div>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "SUBMITTING..." : "SUBMIT"}
        </button>

        <p className="forgot-link" onClick={() => navigate(solutionId === 1 ? "/payroll" : "/payrollemp")}>
          Back to Login
        </p>
      </form>
    </div>
  );
}

export default ChangePassword;
