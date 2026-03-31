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
import { useLoader } from "../../context/LoaderContext";
import { ensureMinDuration } from "../../utils/loaderDelay";
// import { handleApiError } from "../../utils/errorToastResolver";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { getFloatingActions } from "../../utils/setActionButtons";
import { useSidebarPermissions } from "../../hooks/useSidebarPermissions";
import { useAuth } from "../../context/AuthProvider";
import { handleApiError } from "../../utils/errorToastResolver";


function ResetPasswordSimple() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [serverError, setServerError] = useState("");
  // const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();

  const [backendPermissions, setBackendPermissions] = useState();

  const [searchParams] = useSearchParams();
  const optionid = searchParams.get("opid");

  const { setSidebar } = useSidebarPermissions();
  const { showRailLoader, hideLoader } = useLoader();

  const newPassword = watch("newPassword");

  useEffect(() => {
    setSidebar(
      "OPTION_RIGHTS",
      "",
      user.userMstId,
      user.solutionId,
      optionid,
      user.userEntityHierarchyId,
      setBackendPermissions,
    );
  }, [optionid]);
  const fetchUsers = async () => {
    const startTime = Date.now();
    showRailLoader("Fetching Users details…");
    try {
      const res = await getUsersDropdown();
      setUsers(res.data || []);
    } catch (err) {
      handleApiError(err, { entity: "Users" });
      console.error("Failed to fetch users", err);
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }
  };
  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const userOptions = users.map((u) => ({
    value: u.userCode,
    label: `${u.userCode} - ${u.username}`,
  }));

  const clearForm = () => {
    reset();
  };
  const handleRefresh = () => {
    fetchUsers();
    toast.success("Form refreshed");
  };

  const onSubmit = async (data) => {
    const startTime = Date.now();

    showRailLoader("Resetting password...");

    try {
      const response = await resetPassword(data);

      await ensureMinDuration(startTime, 700);
      hideLoader();

      toast.success(response.data?.message || "Password reset successfully");
      clearForm();

      const loginData = JSON.parse(localStorage.getItem("loginData"));
      const solutionId = loginData?.solutionId;

      showRailLoader("Redirecting to login...");

      setTimeout(() => {
        localStorage.clear();
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
      const message =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        "Something went wrong";

      toast.error(message);
    }
  };
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      height: "40px",
      borderRadius: "9999px", // match your input (pill shape)
      paddingLeft: "10px", //important
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
        actions={getFloatingActions(
          backendPermissions,
          {
            // handleSave,
            handleClear: clearForm,
            handleRefresh,
            // handleSearch,
            // handleNew: handleClear,
            // handleDelete,
            // handlePrint,
          },
          {
            // because disabled: canSave
            canSearch: true, // true → disabled
            canClear: false, // false → enabled
            canRefresh: false, // false → enabled
          },
          ["clear", "search", "refresh","delete","print"],
        )}
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
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter New Password"
              {...register("newPassword", {
                required: "New password is required",

                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },

                maxLength: {
                  value: 20,
                  message: "Maximum 20 characters allowed",
                },

                validate: {
                  noSpaces: (value) =>
                    !value.includes(" ") || "Password must not contain spaces",

                  hasUpperCase: (value) =>
                    /[A-Z]/.test(value) ||
                    "At least one uppercase letter required",

                  hasLowerCase: (value) =>
                    /[a-z]/.test(value) ||
                    "At least one lowercase letter required",

                  hasNumber: (value) =>
                    /[0-9]/.test(value) || "At least one number required",

                  // optional (if needed)
                  hasSpecialChar: (value) =>
                    /[!@#$%^&*]/.test(value) ||
                    "At least one special character required",
                },
              })}
            />

            <span
              className="password-eye"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <IoEye /> : <IoEyeOff />}
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
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
            />

            <span
              className="password-eye"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <IoEye /> : <IoEyeOff />}
            </span>
          </div>

          {errors.confirmPassword && (
            <p className="error-msg">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" className="login-btn">
          RESET
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordSimple;
