import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginPage/loginpage.css";
import { RiAdminFill } from "react-icons/ri";

function ForgotPassword() {
  const navigate = useNavigate();

  const [userCode, setUserCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");


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

  // STEP 1️⃣ : SEND OTP
  const sendOtp = async () => {
    setMessage("");
    setError("");

    const finalUserCode = normalizeUserCode(); // ✅ STORE IT
    if (!finalUserCode) return;

    console.log("Sending userCode:", finalUserCode);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8087/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userCode: finalUserCode,
        }),
      });

      // const data = await response.json();
      console.log("Sending userCode:", finalUserCode);
      //  error case
      if (!response.ok) {
        const text = await response.text(); // 👈 VERY IMPORTANT
        console.error("Backend error raw:", text);

        try {
          const json = JSON.parse(text);
          setError(json.errors?.[0] || "Request failed");
        } catch {
          setError(text || "Request failed");
        }
        return;
      }

      // ✅ SUCCESS
      const data = await response.json();
      setMessage("OTP sent to registered email");
      setStep(2)
    } catch (e) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setError("OTP is required");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:8087/forgot-password/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userCode: userCode.trim(),
            otp: otp.trim(),
          }),
        }
      );

      const data = await res.json();
      console.log("Sending userCode:", userCode.trim());

      // ✅ HANDLE INVALID OTP HERE
      if (!res.ok || data.success === false) {
        setError(data.errors?.[0] || "Invalid OTP");
        return;
      }

      // ✅ SUCCESS → GO NEXT
      navigate("/changepassword", {
        state: { userCode: userCode.trim(), forgotFlow: true },
      });

    } catch (e) {
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
            e.preventDefault(); // 
            if (step === 1) {
              sendOtp();
            } else if (step === 2) {
              verifyOtp();
            }
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
        <p className="forgot-link" onClick={() => navigate("/")}>
          Back to Login
        </p>
      </div>
    </div>
  );
}
export default ForgotPassword;
