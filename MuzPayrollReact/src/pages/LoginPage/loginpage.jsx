import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";
import muzLogo from "../../assets/muzlogo_transparent.png";

function LoginPage() {
  const navigate = useNavigate();

  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");

  const [userCodeError, setUserCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Handle typing: Allow only letters + numbers
  const handleUserCodeChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace("@muziris", "");

    if (/^[A-Za-z0-9]*$/.test(cleaned)) {
      setUserCode(value);
      setUserCodeError("");
    } else {
      setUserCodeError("User code must contain letters or numbers only.");
    }
  };

  // On blur add "@muziris"
  const handleUserCodeBlur = () => {
    let value = userCode.trim().replace("@muziris", "");
    if (value) setUserCode(value + "@muziris");
  };
  const handleSubmit = (e) => {
    e.preventDefault();   // ⭐ KEY FIX
    handleLogin();
  };

  const handleLogin = async () => {
    setUserCodeError("");
    setPasswordError("");

    let isValid = true;

    if (!userCode.trim()) {
      setUserCodeError("User code is required.");
      isValid = false;
    }
    if (!password.trim()) {
      setPasswordError("Password is required.");
      isValid = false;
    }
    if (!isValid) return;

    try {
      const response = await fetch("http://localhost:8087/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userCode: userCode, password }),
        
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE FROM BACKEND:", data);


      if (!data.success) {
        setPasswordError(data.message || "Invalid login.");
        return;
      }
     const cleanUserCode = userCode.replace("@muziris", "");
      // STORE ALL DROPDOWN LISTS + DEFAULT VALUES
      const loginData = {
        userCode: cleanUserCode,
        userName: data.userName, 
        companyId: data.companyId,
        branchId: data.branchId,
        locationId: data.locationId,
      
      };

      localStorage.setItem("loginData", JSON.stringify(loginData));
      navigate("/home");
    } catch (error) {
      setPasswordError("Server error.");
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
<form className="form-group" onSubmit={handleSubmit}>
          <div className="form-group">

          {/* User Code */}
          <label>User Code</label>
          <input
            type="text"
            value={userCode}
            onChange={handleUserCodeChange}
            onBlur={handleUserCodeBlur}
            autoFocus
          />
          {userCodeError && <p className="error-msg">{userCodeError}</p>}

          {/* Password */}
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
          />
          {passwordError && <p className="error-msg">{passwordError}</p>}

          {/* Login Button */}
          <button className="login-btn" onClick={handleLogin}>
            LOGIN
          </button>

          {/* Forgot Password */}
          <p
            className="forgot-link"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
          
        </div>
          </form>
      </div>
    </div>
    
  );
}

export default LoginPage;
