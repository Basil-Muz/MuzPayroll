import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginPage/loginpage.css";
import { RiAdminFill } from "react-icons/ri";
import { sendOtp, verifyOtp } from "../../services/forgotpassword.service";
import { useAuth } from "../../context/AuthProvider";


function ForgotPassword() {
  const navigate = useNavigate();

  const [userCode, setUserCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const { solutionId } = useAuth();


  // Normalize user code (append @muziris if missing)
  const normalizeUserCode = () => {
    const value = userCode.trim();
    if (!value) {
      setError("User code is required");
      return null;
    }

    const username = value.replace("@muziris", "");
    const isValid = /^[a-zA-Z0-9]+$/.test(username);

    if (!isValid) {
      setError("User code must contain only letters and numbers");
      return null;
    }

    const finalUserCode = value.endsWith("@muziris")
      ? value
      : username + "@muziris";

    setUserCode(finalUserCode); // UI update
    setError("");

    return finalUserCode; //  THIS IS THE KEY
  };

  const handleSendOtp = async () => {
    setMessage("");
    setError("");

    const finalUserCode = normalizeUserCode();
    if (!finalUserCode) return;

    setLoading(true);

    try {
      await sendOtp(finalUserCode);
      setMessage("OTP sent to registered email");
      setStep(2);
    } catch (err) {
      setError(
        err?.response?.data?.errors?.[0] ||
        err.message ||
        "Request failed"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("OTP is required");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await verifyOtp(userCode.trim(), otp.trim());

      if (data.success === false) {
        setError(data.errors?.[0] || "Invalid OTP");
        return;
      }

      navigate("/changepassword", {
        state: { userCode: userCode.trim(), forgotFlow: true },
      });

    } catch (err) {
      setError(
        err?.response?.data?.errors?.[0] ||
        err.message ||
        "Server error"
      );
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
            e.preventDefault();
            step === 1 ? handleSendOtp() : handleVerifyOtp();
          }}
        >

          {/* STEP 1 : USER CODE */}
          {step === 1 && (
            <>
              <div className="form-group1">
                <label>User Code</label>
                <div className="input-wrapper">
                  <RiAdminFill className="input-inside-icon" />
                  <input
                    type="text"
                    placeholder="e.g. abc (not abc@muziris)"
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    onBlur={normalizeUserCode}
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>
              {error && <p className="error-msg">{error}</p>}
              {message && <p className="success-msg">{message}</p>}

              <button
                type="submit"
                className="login-btn"
                // onClick={sendOtp}
                disabled={loading}
              >
                {loading ? "SENDING OTP..." : "SEND OTP"}
              </button>
            </>
          )}


          {/* STEP 2 : OTP */}
          {step === 2 && (
            <>
              <div className="form-group1">
                <label>Enter OTP</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>
              {error && <p className="error-msg">{error}</p>}
              {message && <p className="success-msg">{message}</p>}

              <button
                type="submit"
                className="login-btn"
                // onClick={verifyOtp}
                disabled={loading}
              >
                {loading ? "VERIFYING..." : "VERIFY OTP"}
              </button>
            </>
          )}
        </form>
        <p className="forgot-link" onClick={() => navigate(solutionId === 1 ? "/payroll" : "/payrollemp")}>
          Back to Login
        </p>
      </div>
    </div>
  );
}
export default ForgotPassword;
