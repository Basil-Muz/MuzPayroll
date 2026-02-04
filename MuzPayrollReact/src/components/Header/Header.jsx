import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthProvider";
import "./Header.css";
import { IoMdSettings } from "react-icons/io";
import { IoNotificationsSharp } from "react-icons/io5";
import { BiSolidCollection } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { ImUser } from "react-icons/im";

import ThemeToggle from "../ThemeToggle/ThemeToggle";

const BLOCKED_PATHS = ["/masters", "/home", "/settings"];
const CONTEXT_SWITCHER = ["/home"];
const INITIAL_NOTIFICATIONS = [];
const HOVER_DELAY = 200; // Delay before closing on mouse leave

const Header = ({ backendError = [] }) => {
  const [notOpen, setNotOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  // const [contextBranch, setContextBranch] = useState(null);
  // const [contextLocation, setContextLocation] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [notifications, setNotifications] = useState([]);

  const [branchList, setBranchList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [dashNotifications, setDashNotifications] = useState(
    INITIAL_NOTIFICATIONS,
  );
  // const hasHydratedRef = useRef(false);

  const location = useLocation();

  const { user, logout, updateUser } = useAuth();

  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  const { control, setValue, watch } = useForm({
    defaultValues: {
      branch: "",
      location: "",
    },
  });

  // Refs for hover timers
  const notifTimerRef = useRef(null);
  const dashTimerRef = useRef(null);
  const profileTimerRef = useRef(null);

  // Parse login data safely
  // const getLoginData = () => {
  //   try {
  //     const data = localStorage.getItem("loginData");
  //     return data ? JSON.parse(data) : {};
  //   } catch (error) {
  //     console.error("Error parsing login data:", error);
  //     return {};
  //   }
  // };

  // const loginData = getLoginData();
  const companyId = user.companyId;

  const currentPath = location.pathname;

  const shouldRenderDashboard = !BLOCKED_PATHS.includes(currentPath);
  const shouldRenderProfile = BLOCKED_PATHS.includes(currentPath);
  const shouldRenderHome = CONTEXT_SWITCHER.includes(currentPath)
  const handleApiError = (error) => {
    if (!error.response) {
      toast.error("Unable to connect to server.");
      return;
    }

    const status = error.status;
    const errorMessages = {
      400: error.errors?.[0] || "Bad request",
      401: "Session expired. Please login again.",
      403: "You do not have permission.",
      404: "Resource not found.",
      409: "Duplicate record exists.",
      500: "Server error. Please try again later.",
    };

    toast.error(errorMessages[status] || "Unexpected error occurred.");
  };

  /* ================= API ================= */
  const fetchContextData = useCallback(
    async (branchId, userCode) => {
      //User code for user base access
      if (!companyId || !branchId) return;

      try {
        const [companyRes, branchRes] = await Promise.all([
          axios.get(`http://localhost:8087/company/${companyId}`),
          axios.get(`http://localhost:8087/branch/company/${companyId}`),
        ]);

        setCompanyName(companyRes.data.company);
        setBranchList(
          branchRes.data.map((branch) => ({
            value: branch.branchMstID,
            label: branch.branch,
          })),
        );
      } catch (err) {
        handleApiError(err);
      }
    },
    [companyId],
  );

  const fetchLocationsByBranch = useCallback(
    async (branchId) => {
      try {
        setLoadingLocation(true);
        const res = await axios.get(
          `http://localhost:8087/location/locationlist/${branchId}`,
        );

        setLocationList(
          res.data.map((loc) => ({
            value: loc.mstID,
            label: loc.name,
          })),
        );
      } catch (err) {
        handleApiError(err);
        setLocationList([]);
      } finally {
        setLoadingLocation(false);
      }
    },
    [setLocationList],
  );

  // useEffect(() => {
  //   const data = getLoginData();
  //   setContextBranch(data.branchId || null);
  //   setContextLocation(data.locationId || null);
  // }, []);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(notifTimerRef.current);
      clearTimeout(dashTimerRef.current);
      clearTimeout(profileTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (branchList.length === 0) return;

    const branchOption = branchList.find(
      (b) => b.value === Number(user.branchId),
    ); //stored ID is in string
    // console.log("Brqanch steed", branchOption);
    if (branchOption) {
      setValue("branch", branchOption, {
        //set in object not number or string
        shouldDirty: false,
        shouldTouch: false,
      });
    }
    fetchLocationsByBranch(Number(user.branchId));
  }, [branchList]);

  useEffect(() => {
    if (locationList.length === 0) return;

    const locationOption = locationList.find(
      (l) => l.value === Number(user.locationId), //stored ID is in string
    );
    // console.log("location steed", locationList);
    if (locationOption) {
      setValue("location", locationOption, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [locationList, setValue]);

  useEffect(() => {
    if (!companyId || !user?.branchId) return;

    fetchContextData(user.branchId, user.userCode);
  }, [companyId, user?.branchId, user?.userCode,user?.locationId, fetchContextData]);

  //Listen to trigger on user changes
  // useEffect(() => {
  //   if (!user) return;

  //   // const data = getLoginData();
  //   // console.log("Login data", data);
  //   // setContextBranch(user.branchId);
  //   // console.log("Branch context", contextBranch);
  //   setValue("branch", user.branchId, {
  //     shouldDirty: false,
  //     shouldTouch: false,
  //   });

  //   // setContextLocation(user.locationId);
  //   // console.log("Location context", contextLocation);
  //   setValue("location", user.locationId, {
  //     shouldDirty: false,
  //     shouldTouch: false,
  //   });

  //   // console.log("User data changed", user);
  // }, [user?.branchId, setValue, user]);

  // Notification functions
  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const removeDashNotification = useCallback((id) => {
    setDashNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearAllDashNotifications = useCallback(() => {
    setDashNotifications([]);
  }, []);

  // Close all dropdowns
  const closeAllDropdowns = useCallback(() => {
    setNotOpen(false);
    setDashOpen(false);
    setProfileOpen(false);
  }, []);

  // Toggle dropdown (close others)
  const toggleDropdown = useCallback(
    (type) => {
      closeAllDropdowns();
      if (type === "notification") setNotOpen((prev) => !prev);
      else if (type === "dashboard") setDashOpen((prev) => !prev);
      else if (type === "profile") setProfileOpen((prev) => !prev);
    },
    [closeAllDropdowns],
  );

  // Notification hover handlers
  const handleNotifEnter = useCallback(() => {
    clearTimeout(notifTimerRef.current);
    setNotOpen(true);
  }, []);

  const handleNotifLeave = useCallback(() => {
    notifTimerRef.current = setTimeout(() => {
      setNotOpen(false);
    }, HOVER_DELAY);
  }, []);

  // Dashboard hover handlers
  const handleDashEnter = useCallback(() => {
    clearTimeout(dashTimerRef.current);
    setDashOpen(true);
  }, []);

  const handleDashLeave = useCallback(() => {
    dashTimerRef.current = setTimeout(() => {
      setDashOpen(false);
    }, HOVER_DELAY);
  }, []);

  // Profile hover handlers
  const handleProfileEnter = useCallback(() => {
    clearTimeout(profileTimerRef.current);
    setProfileOpen(true);
  }, []);

  const handleProfileLeave = useCallback(() => {
    profileTimerRef.current = setTimeout(() => {
      setProfileOpen(false);
    }, HOVER_DELAY);
  }, []);

  // Handle keyboard
  const handleKeyDown = (e, callback) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeAllDropdowns();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeAllDropdowns]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isNotification = e.target.closest(".notification");
      const isDashboard = e.target.closest(".dashboard");
      const isProfile = e.target.closest(".user-profile");
      const isDropdown =
        e.target.closest(".notification-dropdown") ||
        e.target.closest(".profile-dropdown");

      if (!isNotification && !isDashboard && !isProfile && !isDropdown) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeAllDropdowns]);

  return (
    <header className="header" role="banner">
      <div className="header-left">
        <div className="logo">
          <img
            src="/muziris-png.ico"
            alt="Muziris Logo"
            width="120px"
            height="46"
            loading="lazy"
          />
        </div>

        {/* Context Switcher */}
        { !shouldRenderHome && <div className="context-switcher" aria-label="Working context">
          {/* Company (Read-only) */}
          <div className="company-pill" title={companyName}>
            {companyName}
          </div>

          {/* Branch */}
          <Controller
            name="branch"
            control={control}
            rules={{ required: "Branch is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={branchList}
                placeholder="Branch"
                isSearchable
                isClearable={false}
                classNamePrefix="form-control-select"
                value={field.value}
                onChange={(option, actionMeta) => {
                  if (!option) return;
                  if (actionMeta.action !== "select-option") return;

                  // STORE OBJECT ONLY
                  field.onChange(option);

                  const newBranchId = option.value;

                  // RESET LOCATION CORRECTLY
                  setValue("location", null);
                  setLocationList([]);

                  // FETCH
                  fetchLocationsByBranch(newBranchId);

                  // UPDATE CONTEXT
                  updateUser({
                    branchId: newBranchId,
                    locationId: null,
                  });
                }}
              />
            )}
          />

          {/* Location */}
          <Controller
            name="location"
            control={control}
            rules={{ required: "Location is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={locationList}
                placeholder="Location"
                isSearchable
                isClearable={false}
                isDisabled={!watch("branch") || loadingLocation}
                classNamePrefix="form-control-select"
                value={field.value}
                onChange={(option, actionMeta) => {
                  if (!option) return;
                  if (actionMeta.action !== "select-option") return;

                  //  STORE OBJECT ONLY
                  field.onChange(option);

                  //  UPDATE CONTEXT
                  updateUser({
                    locationId: option.value,
                  });
                }}
              />
            )}
          />
        </div>}
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div
          className={`notification ${currentPath !== "/masters" ? "" : "no-dashboard"}`}
          onClick={() => toggleDropdown("notification")}
          onMouseEnter={handleNotifEnter}
          onMouseLeave={handleNotifLeave}
          role="button"
          tabIndex="0"
          aria-label="Notifications"
          aria-expanded={notOpen}
          onKeyDown={(e) =>
            handleKeyDown(e, () => toggleDropdown("notification"))
          }
        >
          <IoNotificationsSharp size={20} aria-hidden="true" />

          {notifications.length > 0 && (
            <div
              className="msgs"
              role="status"
              aria-label={`${notifications.length} unread notifications`}
            >
              {notifications.length}
            </div>
          )}

          {notOpen && (
            <div
              className="notification-dropdown"
              role="menu"
              onMouseEnter={handleNotifEnter}
              onMouseLeave={handleNotifLeave}
            >
              {notifications.length > 0 && (
                <div className="dropdown-header">
                  <button
                    onClick={clearAllNotifications}
                    className="clear-all-btn"
                    aria-label="Clear all notifications"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {notifications.length > 0 ? (
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${
                        notification.status ? "error" : "info"
                      }`}
                      role="menuitem"
                    >
                      <p className="notification-msg">{notification.msg}</p>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="remove-btn"
                        aria-label="Remove"
                      >
                        <RxCross2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-msg">No notifications</p>
              )}
            </div>
          )}
        </div>

        {/* Dashboard */}
        {shouldRenderDashboard && (
          <div
            className="dashboard"
            onClick={() => toggleDropdown("dashboard")}
            onMouseEnter={handleDashEnter}
            onMouseLeave={handleDashLeave}
            role="button"
            tabIndex="0"
            aria-label="Dashboard"
            aria-expanded={dashOpen}
            onKeyDown={(e) =>
              handleKeyDown(e, () => toggleDropdown("dashboard"))
            }
          >
            <BiSolidCollection size={20} aria-hidden="true" />

            {dashNotifications.length > 0 && (
              <div
                className="msgs"
                role="status"
                aria-label={`${dashNotifications.length} alerts`}
              >
                {dashNotifications.length}
              </div>
            )}

            {dashOpen && (
              <div
                className="notification-dropdown"
                role="menu"
                onMouseEnter={handleDashEnter}
                onMouseLeave={handleDashLeave}
              >
                {dashNotifications.length > 0 && (
                  <div className="dropdown-header">
                    <button
                      onClick={clearAllDashNotifications}
                      className="clear-all-btn"
                      aria-label="Clear all alerts"
                    >
                      Clear All
                    </button>
                  </div>
                )}

                {dashNotifications.length > 0 ? (
                  <div className="notifications-list">
                    {dashNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${
                          notification.status ? "error" : "info"
                        }`}
                        role="menuitem"
                      >
                        <p className="notification-msg">{notification.msg}</p>
                        <button
                          onClick={() =>
                            removeDashNotification(notification.id)
                          }
                          className="remove-btn"
                          aria-label="Remove"
                        >
                          <RxCross2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-msg">No alerts</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* User Profile */}
        <div
          className="user-profile"
          onClick={() => toggleDropdown("profile")}
          onMouseEnter={handleProfileEnter}
          onMouseLeave={handleProfileLeave}
          role="button"
          tabIndex="0"
          aria-label="User profile"
          aria-expanded={profileOpen}
          onKeyDown={(e) => handleKeyDown(e, () => toggleDropdown("profile"))}
        >
          <ImUser size={20} aria-hidden="true" />

          { profileOpen && (
            <div
              className="profile-dropdown"
              role="menu"
              onMouseEnter={handleProfileEnter}
              onMouseLeave={handleProfileLeave}
            >
              <div className="profile-user">
                <ImUser size={18} aria-hidden="true" />
                <div className="profile-names">
                  <strong>{user.userName || "User"}</strong>
                  <span>{user.role || "Admin"}</span>
                </div>
              </div>

              
              {shouldRenderProfile && <div><div className="profile-divider" />
                <button
                  type="button"
                  role="menuitem"
                  className="profile-link"
                  onClick={() => navigate("/changepassword")}
                >
                  Change Password
                </button>

                <div className="profile-divider" />

                <button
                  type="button"
                  role="menuitem"
                  className="profile-link logout"
                  onClick={() => handleLogOut()}
                >
                  Logout
                </button>
              </div>}
            </div>
          )}
        </div>

        {/* Settings */}
        {currentPath === "/masters/" && (
          <div
            className="settings"
            role="button"
            tabIndex="0"
            aria-label="Settings"
          >
            <IoMdSettings size={20} aria-hidden="true" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
