import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";
import muzLogo from "../../assets/muzlogo_transparent.png";
import { useAuth } from "../../context/AuthProvider.jsx";
import { RiAdminFill } from "react-icons/ri";
import { TbPasswordUser } from "react-icons/tb";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { normalizeUserCode } from "../../utils/userCodeUtils.js";
import { loginUser } from "../../services/login.service.js";
import { useLocation } from "react-router-dom";


function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");

  const [userCodeError, setUserCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [commonError, setCommonError] = useState("");

  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [accountLocked, setAccountLocked] = useState(false);

  const [displayUserCode, setDisplayUserCode] = useState("");

  const solutionId = location.pathname.includes("emp") ? 2 : 1;

  const handleLogin = async () => {
    setAttemptsLeft(null);
    setAccountLocked(false);
    setCommonError("");

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

    const { value, cleaned } = normalizeUserCode(userCode);

    try {
      const data = await loginUser({
        userCode: value,
        password,

      });
      console.log("LOGIN RESPONSE FROM BACKEND:", data);

      if (!data.success) {
        const errorMsg = Array.isArray(data.errors)
          ? data.errors[0]
          : data.errors;

        setCommonError(errorMsg);

        // Account locked
        if (errorMsg.includes("Maximum login attempts")) {
          setAccountLocked(true);
          setAttemptsLeft(0);
        }

        // Attempts left
        if (errorMsg.includes("Attempts left")) {
          const match = errorMsg.match(/\d+/);
          if (match) {
            setAttemptsLeft(Number(match[0]));
          }
        }

        return;
      }


      // STORE ALL DROPDOWN LISTS + DEFAULT VALUES
      const payload = data.data;
      const loginData = {
        userCode: cleaned,
        userName: payload.userName,
        userMstId: payload.userMstId,

        userEntityHierarchyId: payload.userEntityHierarchyId,
        companyName: payload.companyName, 
        defaultEntityHierarchyId: payload.defaultEntityHierarchyId,
        locationName: payload.locationName,   
        branchEntityHierarchyId: payload.branchEntityHierarchyId,
        branchName: payload.branchName,

        token: payload.token,
        sidebarOpen: false,
        solutionId: solutionId,
      };

      login(loginData);
      navigate("/home");
    } catch (error) {
      setCommonError("Server error.");
      console.error("Login error:", error);
    }

  };

  // Handle typing: Allow only letters + numbers
  const handleUserCodeChange = (e) => {
    const input = e.target.value;
    const usercode = normalizeUserCode(input);

    if (/^[A-Za-z0-9]*$/.test(usercode.cleaned)) {
      setUserCode(usercode.cleaned);          // internal clean value
      setDisplayUserCode(usercode.cleaned);
      setUserCodeError("");
    } else {
      setUserCodeError("User code must contain letters or numbers only.");
    }
  };

  // On blur add "@muziris"
  const handleUserCodeBlur = () => {
    const { value } = normalizeUserCode(userCode);
    setDisplayUserCode(value);
  };

  const handleUserCodeFocus = () => {
    setDisplayUserCode(userCode);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
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
                value={displayUserCode}
                onChange={handleUserCodeChange}
                onBlur={handleUserCodeBlur}
                onFocus={handleUserCodeFocus}
                placeholder="e.g. abc, not abc@muziris"
                className={userCodeError ? "input-error" : ""}
                autoFocus
                autoComplete="username"
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
                autoComplete="current-password"
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

            {/* Attempt warning
            {attemptsLeft !== null && !accountLocked && (
              <p className="warning-msg">
                Attempts left: {attemptsLeft}
              </p>
            )} */}

            {/* Account locked */}
            {/* {accountLocked && (
              <p className="error-msg">
               Please contact admin or reset password.
              </p>
            )} */}

            {/* Login Button */}
            <button type="submit" className="login-btn" disabled={accountLocked}>
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
