import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";
import muzLogo from "../../assets/muzlogo.jpg";

function LoginPage() {
  const navigate = useNavigate();

  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-append @muziris
  const handleUserCodeChange = (e) => {
    let value = e.target.value.trim();

    // endsWith is correct (not endwith)
    if (!value.endsWith("@muziris")) {
      value = value.replace("@muziris", "");
      value = value + "@muziris";
    }

    setUserCode(value);
  };

  const handleLogin = async () => {
    setErrorMsg("");

    if (!userCode.trim() || !password.trim()) {
      setErrorMsg(
        "invalid (user code) or (password) or you might have exceeded continuous 3 attempts."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_code: userCode, password: password }),
      });

      const data = await response.json();

      // Login failed
      if (!data.success) {
        if (data.user_attempt >= 3) {
          setErrorMsg(
            "invalid (user code) or (password) or you might have exceeded continuous 3 attempts."
          );

          // Redirect to change password
          setTimeout(() => {
            navigate("/change-password", {
              state: { userCode: userCode },
            });
          }, 1500);
        } else {
          setErrorMsg(
            "invalid (user code) or (password) or you might have exceeded continuous 3 attempts."
          );
        }
        return;
      }

      // Login success — go to home
      navigate("/home");
    } catch (error) {
      setErrorMsg("Server error. Please try again later.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-section">
          <img src={muzLogo} alt="Logo" className="login-logo" />
          <h2>Login</h2>
        </div>

        <div className="form-group">
          <label>User Code</label>
          <input type="text" value={userCode} onChange={handleUserCodeChange} autoFocus/>

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <button className="login-btn" onClick={handleLogin}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
