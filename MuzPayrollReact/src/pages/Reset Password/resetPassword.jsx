import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbPasswordUser } from "react-icons/tb";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";

import "../LoginPage/loginpage.css";

import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import {
  resetPassword,
  getUsersDropdown,
} from "../../services/resetpassword.service";

function ResetPasswordSimple() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

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

  const userOptions = users.map((u) => ({
    value: u.userCode,
    label: `${u.userCode} - ${u.username}`,
  }));

  const clearForm = () => {
    reset();
    setServerError("");
    setSuccess("");
  };

  const onSubmit = async (data) => {
    setServerError("");
    setSuccess("");

    try {
      const response = await resetPassword(data);

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
      setServerError(
        err.response?.data?.errors?.[0] ||
          err.response?.data?.message ||
          "Failed to reset password",
      );
    }
  };
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      height: "40px",
      borderRadius: "9999px", // match your input (pill shape)
      paddingLeft: "10px", // 🔥 important
      backgroundColor: "#1a001a",
      borderColor: state.isFocused ? "#d946ef" : "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#d946ef",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      display: "flex",
      alignItems: "center",
      padding: "0 8px",
    }),

    input: (base) => ({
      ...base,
      margin: "0px",
      padding: "0px",
      opacity: 0,
    }),

    placeholder: (base) => ({
      ...base,
      margin: "0px",
      padding: "0px",

      color: "#9ca3af",
    }),

    singleValue: (base) => ({
      ...base,
      margin: "0px",
      color: "#fff",
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: "40px",
    }),

    dropdownIndicator: (base) => ({
      ...base,
      padding: "8px",
    }),
  };

  return (
    <div className="login-container">
      <FloatingActionBar
        actions={{
          save: { onClick: handleSubmit(onSubmit) },
          clear: { onClick: clearForm },
          delete: { disabled: true },
          print: { disabled: true },
          new: { onClick: clearForm },
        }}
      />

      <form className="login-box" onSubmit={handleSubmit(onSubmit)}>
        <div className="logo-section">
          <h2>Reset Password</h2>
        </div>

        {/* User Dropdown */}
        <div className="form-group1">
          <label>User Code</label>
          <div className="pass-user-code">
            <Controller
              name="userCode"
              control={control}
              rules={{ required: "User is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  styles={customSelectStyles}
                  classNamePrefix="form-control-select"
                  options={userOptions}
                  isSearchable={true}
                  placeholder="Select User"
                  onChange={(option) =>
                    field.onChange(option ? option.value : "")
                  }
                  value={
                    userOptions.find((opt) => opt.value === field.value) || null
                  }
                />
              )}
            />
          </div>

          {errors.userCode && (
            <p className="error-msg">{errors.userCode.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="form-group1">
          <label>New Password</label>
          <div className="input-wrapper">
            <TbPasswordUser className="input-inside-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              {...register("newPassword", {
                required: "New password is required",
              })}
            />

            <span
              className="password-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEye /> : <IoEyeOff />}
            </span>
          </div>

          {errors.newPassword && (
            <p className="error-msg">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group1">
          <label>Confirm Password</label>
          <div className="input-wrapper">
            <TbPasswordUser className="input-inside-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
            />
          </div>

          {errors.confirmPassword && (
            <p className="error-msg">{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && <p className="error-msg">{serverError}</p>}
        {success && <p className="success-msg">{success}</p>}

        <button type="submit" className="login-btn">
          RESET
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordSimple;
