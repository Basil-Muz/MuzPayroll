import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { useForm } from "react-hook-form";

import "./Header.css";
import { IoMdSettings } from "react-icons/io";
import { IoNotificationsSharp } from "react-icons/io5";
import { BiSolidCollection } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { ImUser } from "react-icons/im";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

// Constants for better maintainability
const BLOCKED_PATHS = ["/masters", "/home", "/settings"];
const HOVER_DELAY = 300; // Increased from 200ms for better UX
const INITIAL_NOTIFICATIONS = [];

const Header = ({ backendError = [] }) => {
  const [notOpen, setNotOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [dashNotifications, setDashNotifications] = useState(
    INITIAL_NOTIFICATIONS
  );
  const { control, setValue, watch } = useForm();
  const location = useLocation();
  const notifTimer = useRef(null);
  const dashTimer = useRef(null);
  const profileTimer = useRef(null);

  // Parse login data safely
  const getLoginData = () => {
    try {
      const data = localStorage.getItem("loginData");
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error parsing login data:", error);
      return {};
    }
  };
  const loginData = getLoginData();
  console.log("Company name", loginData.companyId);
  const companyId = loginData.companyId;
  const locationName = loginData.locationName || "";
  const currentPath = location.pathname;
  const date = new Date().toLocaleDateString();

  // Determine visibility
  const shouldRenderDashboard = !BLOCKED_PATHS.includes(currentPath);
  const shouldRenderProfile = BLOCKED_PATHS.includes(currentPath);

  /* ================= API ================= */
  const fetchContextData = useCallback(
    async (branchId, locationId, userCode) => {
      console.log("fetchContextData called", companyId);

      if (!companyId || !branchId) {
        // console.log(" Missing companyId / branchId");
        return;
      }

      const [companyres, branchRes] = await Promise.all([
        //  Both APIs works in parallel
        axios.get(`http://localhost:8087/company/${companyId}`),
        axios.get(`http://localhost:8087/branch/company/${companyId}`),
      ]); //  both APIs call start at same time and waite until both finish
      // console.log("API URL:", res.url);

      setBranchList(
        branchRes.data.map((branch) => ({
          value: branch.branchMstID,
          label: branch.branch,
        }))
      );

      // const response = await res.json();
      console.log("Header API raw response:", companyres.data);
      setCompanyName(companyres.data.company);
      if (branchRes.statusCode === 400) {
        const errorMsg = branchRes.errors?.[0] || "Invalid context";
        toast.error(errorMsg);

        const stored = JSON.parse(localStorage.getItem("loginData") || "{}");

        // CASE: Branch exists but NO location
        if (
          errorMsg.toLowerCase().includes("location") ||
          errorMsg.toLowerCase().includes("no location")
        ) {
          //  clear ONLY location
          setLocationList([]);
          // setLocationId("");
          // setValue("locationId", "");

          localStorage.setItem(
            "loginData",
            JSON.stringify({
              ...stored,
              locationId: "",
              locationName: "",
            })
          );

          return;
        }

        //  CASE: Company / Branch invalid → clear both
        setBranchList([]);
        setLocationList([]);

        // setBranchId("");
        // setLocationId("");

        // setValue("branchId", "");
        // setValue("locationId", "");

        localStorage.setItem(
          "loginData",
          JSON.stringify({
            ...stored,
            branchId: "",
            branchName: "",
            locationId: "",
            locationName: "",
          })
        );

        return;
      }

      const data = branchRes.data;

      /* ================= BRANCH ( FIX HERE) ================= */
      const branchListFromApi =
        data || data.branches || data.branchMstList || [];

      if (branchListFromApi.length === 0) {
        console.error(" No branches from backend");
        setBranchList([]);
        setLocationList([]);
        toast.error("No branches found");
        return;
      }
      setBranchList(
        branchListFromApi.map((branch) => ({
          value: branch.branchMstID,
          name: branch.branch,
        }))
      );

      if (data.company && data.company.company) {
        // setCompanyName(data.company.company);
      }
      // const locData=
      // /* ================= LOCATION ( FIX HERE) ================= */
      // const locationListFromApi =
      //   data1.locationList || data.locations || data.locationMstList || [];

      // if (locationListFromApi.length === 0) {
      //   console.error(" No locations from backend");
      //   setLocationList([]);
      //   toast.error("No locations registered for this branch");
      //   return;
      // }

      // setLocationList(locationListFromApi);

      // const selectedLocation =
      //   locationListFromApi.find(
      //     (l) => String(l.locationMstID) === String(locationId)
      //   ) || locationListFromApi[0];

      // console.log(" selectedLocation:", selectedLocation);

      // setLocationId(String(selectedLocation.locationMstID));
      // setValue("locationId", String(selectedLocation.locationMstID));

      // const stored = JSON.parse(localStorage.getItem("loginData") || {});
      // localStorage.setItem(
      //   "loginData",
      //   JSON.stringify({
      //     ...stored,
      //     userCode: stored.userCode || userCode,
      //     locationId: selectedLocation.locationMstID,
      //     locationName: selectedLocation.location,
      //   })
      // );
    },
    []
  );

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(notifTimer.current);
      clearTimeout(dashTimer.current);
      clearTimeout(profileTimer.current);
    };
  }, []);
  useEffect(() => {
    if (companyId) {
      fetchContextData(
        loginData.branchId,
        loginData.locationId,
        loginData.userCode
      );
    }
  }, [
    companyId,
    loginData.branchId,
    loginData.locationId,
    loginData.userCode,
    fetchContextData,
  ]);

  // Update notifications from backend errors
  //  useEffect(() => {
  //   if (!Array.isArray(backendError)) return;

  //   setNotifications(prev => {
  //     // prevent unnecessary updates
  //     if (JSON.stringify(prev) === JSON.stringify(backendError)) {
  //       return prev;
  //     }
  //     return backendError;
  //   });

  //   if (backendError.length > 0) {
  //     setNotOpen(prev => {
  //       if (prev) return prev; // already open
  //       return true;
  //     });

  //     const autoCloseTimer = setTimeout(() => {
  //       setNotOpen(false);
  //     }, 5000);

  //     return () => clearTimeout(autoCloseTimer);
  //   }
  // }, [backendError,notifications]);

  // Notification removal functions
  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const removeDashNotification = useCallback((id) => {
    setDashNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Clear all dashboard notifications
  const clearAllDashNotifications = useCallback(() => {
    setDashNotifications([]);
  }, []);

  // Hover handlers with better UX
  const handleNotifEnter = useCallback(() => {
    clearTimeout(notifTimer.current);
    setDashOpen(false);
    setNotOpen(true);
  }, []);

  const handleNotifLeave = useCallback(() => {
    notifTimer.current = setTimeout(() => {
      setNotOpen(false);
    }, HOVER_DELAY);
  }, []);

  const handleDashEnter = useCallback(() => {
    clearTimeout(dashTimer.current);
    setNotOpen(false);
    setDashOpen(true);
  }, []);

  const handleDashLeave = useCallback(() => {
    dashTimer.current = setTimeout(() => {
      setDashOpen(false);
    }, HOVER_DELAY);
  }, []);

  const handleProfileEnter = useCallback(() => {
    clearTimeout(profileTimer.current);
    setProfileOpen(true);
  }, []);

  const handleProfileLeave = useCallback(() => {
    profileTimer.current = setTimeout(() => {
      setProfileOpen(false);
    }, HOVER_DELAY);
  }, []);

  // Handle escape key to close dropdowns
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setNotOpen(false);
        setDashOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isNotification = event.target.closest(".notification");
      const isDashboard = event.target.closest(".dashboard");
      const isProfile = event.target.closest(".user-profile");

      if (!isNotification && notOpen) {
        setNotOpen(false);
      }
      if (!isDashboard && dashOpen) {
        setDashOpen(false);
      }
      if (!isProfile && profileOpen) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notOpen, dashOpen, profileOpen]);

  return (
    <header className="header" role="banner">
      <div className="header-left">
        <div className="logo">
          <img
            src="/muziris-png.ico"
            alt="Muziris Logo"
            width="106"
            height="55"
            loading="lazy"
          />
        </div>

        {/* Context Switcher */}
        <div className="context-switcher" aria-label="Working context">
          {/* Company (Read-only) */}
          <span className="company-name" title={companyName}>
            {companyName}
          </span>

          {/* Branch */}
          <Controller
            name="branch"
            control={control}
            rules={{ required: "Branch is required" }}
            render={({ field }) => (
              <Select
                options={branchList}
                placeholder="Select Branch"
                isSearchable
                // isDisabled={isReadOnly}
                classNamePrefix="form-control-select"
                // className={`${errors.branch ? "error" : ""}`}
                value={
                  branchList.find((option) => option.value === field.value) ||
                  null
                }
                onChange={(option) => {
                  field.onChange(option.value);

                  // Payroll-safe reset
                  // setValue("location", "");
                  setLocationList([]);

                  // If you fetch locations by branch
                  // fetchLocationsByBranch(option.value);
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
                options={locationList}
                placeholder="Select Location"
                isSearchable
                // isDisabled={isReadOnly || !watch("branch")}
                classNamePrefix="form-control-select"
                // className={`${errors.location ? "error" : ""}`}
                value={
                  locationList.find((option) => option.value === field.value) ||
                  null
                }
                onChange={(option) => {
                  field.onChange(option.value);
                }}
              />
            )}
          />
        </div>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div
          className={`notification ${currentPath !== "/masters" ? "" : "no-dashboard"}`}
          onMouseEnter={handleNotifEnter}
          onMouseLeave={handleNotifLeave}
          onClick={() => setNotOpen(!notOpen)}
          role="button"
          tabIndex="0"
          aria-label="Notifications"
          aria-expanded={notOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setNotOpen(!notOpen);
            }
          }}
        >
          <IoNotificationsSharp size={19} aria-hidden="true" />

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
            <div className="notification-dropdown" role="menu">
              <div className="dropdown-header">
                {/* <span>Notifications</span> */}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="clear-all-btn"
                    aria-label="Clear all notifications"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {notifications.length > 0 ? (
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.status ? "error" : "info"}`}
                      role="menuitem"
                    >
                      <p className="notification-msg">{notification.msg}</p>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="remove-btn"
                        aria-label={`Remove notification: ${notification.msg}`}
                      >
                        <RxCross2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-msg" role="alert">
                  No notifications
                </p>
              )}
            </div>
          )}
        </div>

        {/* Dashboard */}
        {shouldRenderDashboard && (
          <div
            className="dashboard"
            onMouseEnter={handleDashEnter}
            onMouseLeave={handleDashLeave}
            onClick={() => setDashOpen(!dashOpen)}
            role="button"
            tabIndex="0"
            aria-label="Dashboard notifications"
            aria-expanded={dashOpen}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setDashOpen(!dashOpen);
              }
            }}
          >
            <BiSolidCollection size={19} aria-hidden="true" />

            {dashNotifications.length > 0 && (
              <div
                className="msgs"
                role="status"
                aria-label={`${dashNotifications.length} dashboard notifications`}
              >
                {dashNotifications.length}
              </div>
            )}

            {dashOpen && (
              <div className="notification-dropdown" role="menu">
                <div className="dropdown-header">
                  {/* <span>Dashboard</span> */}
                  {dashNotifications.length > 0 && (
                    <button
                      onClick={clearAllDashNotifications}
                      className="clear-all-btn"
                      aria-label="Clear all dashboard notifications"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {dashNotifications.length > 0 ? (
                  <div className="notifications-list">
                    {dashNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${notification.status ? "error" : "info"}`}
                        role="menuitem"
                      >
                        <p className="notification-msg">{notification.msg}</p>
                        <button
                          onClick={() =>
                            removeDashNotification(notification.id)
                          }
                          className="remove-btn"
                          aria-label={`Remove dashboard notification: ${notification.msg}`}
                        >
                          <RxCross2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-msg" role="alert">
                    No dashboard notifications
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Location & Date */}
        <div className="location-date">
          <span
            className="location"
            title={locationName}
            aria-label={`Current location: ${locationName}`}
          >
            {locationName}
          </span>
          <span
            className="date"
            title={date}
            aria-label={`Current date: ${date}`}
          >
            {date}
          </span>
        </div>

        {/* User Profile */}
        <div
          className="user-profile"
          onMouseEnter={handleProfileEnter}
          onMouseLeave={handleProfileLeave}
          onClick={() => setProfileOpen(!profileOpen)}
          role="button"
          tabIndex="0"
          aria-label="User profile"
          aria-expanded={profileOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setProfileOpen(!profileOpen);
            }
          }}
        >
          <ImUser size={21} style={{ color: "#d218d8ff" }} aria-hidden="true" />

          {shouldRenderProfile && profileOpen && (
            <div className="profile-dropdown" role="menu">
              <a 
                href="/changepassword" 
                role="menuitem"
                className="profile-link"
              >
                Change Password
              </a>
              <a href="/logout" role="menuitem" className="profile-link logout">
                Logout
              </a>
            </div>
          )}
        </div>

        {/* Optional Settings */}
        {currentPath === "/masters/" && (
          <div className="settings">
            <IoMdSettings
              size={19}
              color="#161414e6"
              aria-label="Settings"
              role="button"
              tabIndex="0"
            />
          </div>
        )}

        {/* <ThemeToggle /> */}
      </div>
    </header>
  );
};

export default Header;
