import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";
import muzLogo from "../../assets/muzlogo_transparent.png";
import { useAuth } from "../../context/AuthProvider.jsx";
import { RiAdminFill } from "react-icons/ri";
import { TbPasswordUser } from "react-icons/tb";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");

  const [userCodeError, setUserCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [commonError, setCommonError] = useState("");


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
    e.preventDefault();   // KEY FIX
    handleLogin();
  };

  const handleLogin = async () => {
    setUserCodeError("");
    setPasswordError("");

    let isValid = true;

    if (!userCode.trim()) {
      setUserCodeError("User code is required");
      isValid = false;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
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
        setCommonError(data.errors || "Invalid credentials.");
        return;
      }
      const cleanUserCode = userCode.replace("@muziris", "");
      // STORE ALL DROPDOWN LISTS + DEFAULT VALUES
      const payload = data.data; //  IMPORTANT

      const loginData = {
        userCode: cleanUserCode,
        userName: payload.userName,
        companyId: payload.companyId,
        branchId: payload.branchId,
        locationId: payload.locationId,
      };

      login(loginData);
      navigate("/home");

    } catch (error) {
      setCommonError("Server error.");
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
        <form className="form-group1" onSubmit={handleSubmit}>
          <div className="form-group1">


            {/* User Code */}
            <label>User Code</label>
            <div className="input-wrapper">
              <RiAdminFill className="input-inside-icon" />


              <input
                type="text"
                value={userCode}
                onChange={handleUserCodeChange}
                onBlur={handleUserCodeBlur}
                placeholder="e.g.abc, not abc@muziris"
                className={userCodeError ? "input-error" : ""}
                autoFocus

              />
            </div>

            {userCodeError && <p className="error-msg">{userCodeError}</p>}


            {/* Password */}
            <label>Password</label>

            <div className="input-wrapper">
              <TbPasswordUser className="input-inside-icon" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                className={passwordError ? "input-error" : ""}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
              />

              {/* EYE ICON */}
              <span
                className="password-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEye /> : <IoEyeOff />}
              </span>

            </div>
            {passwordError && <p className="error-msg">{passwordError}</p>}

            {/* Common Error */}
            {commonError && <p className="common-error-msg">{commonError}</p>}

            {/* Login Button */}
            <button  type="submit" className="login-btn" >
              Submit
            </button>

            {/* Forgot Password */}
            <p
              className="forgot-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password
            </p>

          </div>
        </form>
      </div>
    </div>

  );
}

export default LoginPage;
