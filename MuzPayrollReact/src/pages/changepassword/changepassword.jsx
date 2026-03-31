import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../LoginPage/loginpage.css";
import { TbPasswordUser } from "react-icons/tb";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useAuth } from "../../context/AuthProvider";
import {
  changePassword,
  changePasswordForgot,
} from "../../services/changepassword.service";

import { useLoader } from "../../context/LoaderContext";
import { ensureMinDuration } from "../../utils/loaderDelay";
import { handleApiError } from "../../utils/errorToastResolver";
import { toast } from "react-hot-toast";

function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const solutionId = user?.solutionId;

  //Detect forgot-password flow
  const isForgotFlow = location.state?.forgotFlow === true;
  const userCodeFromForgot = location.state?.userCode;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showRailLoader, hideLoader } = useLoader();

  // Password rules
  const validatePasswordRules = (password) => {
    if (password.length < 2)
      return "Password must be at least 2 characters long";
    if (password.includes(" ")) return "Password must not contain spaces";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
    if (!isForgotFlow && currentPassword === newPassword) {
      setError("New password cannot be same as current password");
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
    const startTime = Date.now();

    showRailLoader("Changing password...");

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

      await ensureMinDuration(startTime, 700);
      hideLoader();

      toast.success(response.data?.message || "Password changed successfully", {
        position: "top-right",
        autoClose: 2000,
      });

      showRailLoader("Redirecting to login...");

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
        hideLoader();
      }, 2000);
    } catch (err) {
      hideLoader();
      handleApiError(err);
      setError(
        err.response?.data?.errors?.[0] ||
          err.response?.data?.message ||
          "Failed to change password",
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
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                autoFocus
              />
              <span
                className="password-eye"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <IoEye /> : <IoEyeOff />}
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
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              autoFocus={isForgotFlow}
            />
            <span
              className="password-eye"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <IoEye /> : <IoEyeOff />}
            </span>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="form-group1">
          <label>Confirm Password</label>
          <div className="input-wrapper">
            <TbPasswordUser className="input-inside-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
            <span
              className="password-eye"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <IoEye /> : <IoEyeOff />}
            </span>
          </div>
        </div>

        {error && <p className="error-msg">{error}</p>}
       

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "SUBMITTING..." : "SUBMIT"}
        </button>
        <p
          className="forgot-link"
          onClick={() => {
            const redirectPath = solutionId === 1 ? "/payroll" : "/payrollemp";

            logout(); // clears auth + storage
            navigate(redirectPath, { replace: true });
          }}
        >
          Back to Login
        </p>
      </form>
    </div>
  );
}

export default ChangePassword;
