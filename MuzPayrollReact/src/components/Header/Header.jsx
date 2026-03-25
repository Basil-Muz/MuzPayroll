import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import "./Header.css";
import { IoMdSettings } from "react-icons/io";
import { IoNotificationsSharp } from "react-icons/io5";
import { BiSolidCollection } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { IoTimeOutline } from "react-icons/io5";
import { BsBell, BsExclamationTriangle, BsInbox } from "react-icons/bs";
import { MdError, MdWarning, MdInfo, MdCheckCircle } from "react-icons/md";

// Context / hooks
import { useAuth } from "../../context/AuthProvider";

// Utils
import { handleApiError } from "../../utils/errorToastResolver";

//component
import { ContextSwitcher } from "./ContextSwitcher";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const BLOCKED_PATHS = ["/masters/540", "/home", "/settings/750"];
const CONTEXT_SWITCHER = ["/home"];
const HOVER_DELAY = 200; // Delay before closing on mouse leave

// Update your initial notifications to include type
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    msg: "New payroll batch ready for processing",
    type: "info",
    time: "10 min ago",
    title: "Payroll Ready",
  },
  {
    id: 2,
    msg: "Tax calculation error detected",
    type: "error",
    time: "25 min ago",
    title: "Error Detected",
  },
  {
    id: 3,
    msg: "Employee timesheets pending approval",
    type: "warning",
    time: "1 hour ago",
    title: "Pending Approval",
  },
  {
    id: 4,
    msg: "Monthly payroll completed successfully",
    type: "success",
    time: "2 hours ago",
    title: "Completed",
  },
];

const Header = memo(({ backendError = [] }) => {
  const [notOpen, setNotOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false); // Added missing state

  const [companyList, setCompanyList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [dashNotifications, setDashNotifications] = useState(
    INITIAL_NOTIFICATIONS,
  );

  const location = useLocation();
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const { setValue } = useForm({
    defaultValues: {
      company: null,
      branch: null,
      location: null,
    },
  });

  // Refs for hover timers
  const notifTimerRef = useRef(null);
  const dashTimerRef = useRef(null);
  const profileTimerRef = useRef(null);

  const companyId = user?.companyId;
  const currentPath = location.pathname;

  const shouldRenderDashboard = useMemo(
    () => !BLOCKED_PATHS.includes(currentPath),
    [currentPath],
  );
  const shouldRenderProfile = useMemo(
    () => BLOCKED_PATHS.includes(currentPath),
    [currentPath],
  );
  const shouldRenderHome = useMemo(
    () => !CONTEXT_SWITCHER.includes(currentPath),
    [currentPath],
  );

  const toggleContext = useCallback(() => {
    setIsContextOpen(true);
  }, []);

  const fetchContextData = useCallback(async () => {
    if (!companyId) return;
    const entityId = 4;
    const userId = 3;
    try {
      const [companyRes, branchRes] = await Promise.all([
        axios.get("http://localhost:8087/entity/fetchCompany", {
          params: {
            userId: userId,
          },
        }),
        axios.get("http://localhost:8087/entity/fetchBranch", {
          params: {
            userId: userId,
            companyId: entityId,
          },
        }),
      ]);

      const companyData = Array.isArray(companyRes.data)
        ? companyRes.data
        : [companyRes.data];

      setCompanyList(
        companyData.map((company) => ({
          value: company.entityHierarchyId,
          label: company.entityName,
        })),
      );

      setBranchList(
        branchRes.data.map((branch) => ({
          value: branch.entityHierarchyId,
          label: branch.entityName,
        })),
      );
    } catch (err) {
      handleApiError(err, { entity: "company" });
    }
  }, [companyId]);

  // Helper functions (unchanged, but kept concise)
  const getNotificationIcon = (type) => {
    switch (type) {
      case "error":
        return <MdError size={18} />;
      case "warning":
        return <MdWarning size={18} />;
      case "success":
        return <MdCheckCircle size={18} />;
      case "info":
      default:
        return <MdInfo size={18} />;
    }
  };

  const getNotificationTitle = (type) => {
    switch (type) {
      case "error":
        return "Error";
      case "warning":
        return "Warning";
      case "success":
        return "Success";
      case "info":
        return "Information";
      default:
        return "Notification";
    }
  };

  const fetchLocationsByBranch = useCallback(async (branchId) => {
    try {
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
    }
  }, []);

  // Combined useEffect for form value setting
  useEffect(() => {
    if (!user) return;

    if (companyList.length > 0) {
      const companyOption = companyList.find(
        (c) => c.value === Number(user.userEntityHierarchyId),
      );
      if (companyOption) {
        setValue("company", companyOption, {
          shouldDirty: false,
          shouldTouch: false,
        });
      }
    }

    if (branchList.length > 0) {
      const branchOption = branchList.find(
        (b) => b.value === Number(user.branchId),
      );
      if (branchOption) {
        setValue("branch", branchOption, {
          shouldDirty: false,
          shouldTouch: false,
        });
      }
      fetchLocationsByBranch(Number(user.branchId));
    }

    if (locationList.length > 0) {
      const locationOption = locationList.find(
        (l) => l.value === Number(user.locationId),
      );
      if (locationOption) {
        setValue("location", locationOption, {
          shouldDirty: false,
          shouldTouch: false,
        });
      }
    }
  }, [
    companyList,
    branchList,
    locationList,
    user,
    setValue,
    fetchLocationsByBranch,
  ]);

  useEffect(() => {
    if (!companyId || !user?.branchId) return;
    fetchContextData();
  }, [companyId, user?.branchId, fetchContextData]);

  // Memoized contextInitialData
  const contextInitialData = useMemo(
    () => ({
      company: user?.userEntityHierarchyId
        ? {
            value: user.userEntityHierarchyId,
            label: user.companyName,
          }
        : null,
      branch: user?.branchId
        ? {
            value: user.branchId,
            label: user.branchName,
          }
        : null,
      location: user?.locationId
        ? {
            value: user.locationId,
            label: user.locationName,
          }
        : null,
    }),
    [user],
  );

  // Notification functions (optimized with useCallback)
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

  const handleLogOut = () => {
    const currentSolution = user?.solutionId;

    logout();

    if (currentSolution === 1) {
      navigate("/payroll", { replace: true });
    } else if (currentSolution === 2) {
      navigate("/payrollemp", { replace: true });
    }
  };

  // Replace the existing JSX return statement with this enhanced version
  return (
    <>
      <header className="header" role="banner">
        <div className="header-left">
          <div className={`logo ${shouldRenderHome ? "logo-border" : ""}`}>
            <img
              src="/muziris-png.ico"
              alt="Muziris Logo"
              width="120px"
              height="46"
              loading="lazy"
            />
          </div>
          {/* Enhanced Context Summary */}
          {/* Desktop: Full context summary */}
          {shouldRenderHome && (
            <>
              <div
                className="context-summary desktop-only"
                role="button"
                tabIndex={0}
                onClick={toggleContext}
                onKeyDown={(e) => handleKeyDown(e, toggleContext)}
                aria-label="Change company context"
              >
                <div className="context-summary-content">
                  <span className="context-company">
                    {user?.companyName || "Company"}
                  </span>
                  <span className="context-separator">|</span>
                  <span className="context-branch">
                    {user?.branchName || "Branch"}
                  </span>
                  <span className="context-separator">|</span>
                  <span className="context-location">
                    {user?.locationName || "Location"}
                  </span>
                </div>
                <div className="context-edit-icon">
                  <HiOutlineSwitchHorizontal size={12} aria-hidden="true" />
                </div>
              </div>

              {/* Mobile: Context switcher button */}
              <button
                className="context-switcher-button mobile-only"
                onClick={toggleContext}
                aria-label="Switch context"
              >
                <HiOutlineSwitchHorizontal size={20} />
              </button>
            </>
          )}
        </div>

        <div className="header-right">
          {/* Enhanced Notifications */}
          <div className="dropdown-container">
            <button
              className={`header-action ${currentPath !== "/masters" ? "" : "no-dashboard"}`}
              onClick={() => toggleDropdown("notification")}
              onMouseEnter={handleNotifEnter}
              onMouseLeave={handleNotifLeave}
              aria-label="Notifications"
              aria-expanded={notOpen}
            >
              <IoNotificationsSharp
                size={20}
                className="header-icons"
                aria-hidden="true"
              />
              {notifications.length > 0 && (
                <div className="notification-badge" role="status">
                  {notifications.length}
                </div>
              )}
            </button>

            {notOpen && (
              <div
                className="notification-dropdown"
                role="menu"
                onMouseEnter={handleNotifEnter}
                onMouseLeave={handleNotifLeave}
              >
                <div className="dropdown-header">
                  <h4>Notifications</h4>
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

                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${notification.type || "info"}`}
                        role="menuitem"
                      >
                        <div className="notification-icon">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="notification-content">
                          <div className="notification-header">
                            <span className="notification-title">
                              {notification.title ||
                                getNotificationTitle(notification.type)}
                            </span>
                          </div>
                          <p className="notification-message">
                            {notification.msg}
                          </p>
                          <div className="notification-time">
                            <IoTimeOutline size={12} />
                            {notification.time || "Just now"}
                          </div>
                        </div>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="enhanced-remove-btn"
                          aria-label="Remove notification"
                        >
                          <RxCross2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">
                      <BsBell size={48} />
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Dashboard */}
          {shouldRenderDashboard && (
            <div className="dropdown-container">
              <button
                className="header-action"
                onClick={() => toggleDropdown("dashboard")}
                onMouseEnter={handleDashEnter}
                onMouseLeave={handleDashLeave}
                aria-label="Dashboard alerts"
                aria-expanded={dashOpen}
              >
                <BiSolidCollection
                  size={20}
                  className="header-icons"
                  aria-hidden="true"
                />
                {dashNotifications.length > 0 && (
                  <div className="notification-badge alert" role="status">
                    {dashNotifications.length}
                  </div>
                )}
              </button>

              {dashOpen && (
                <div
                  className="notification-dropdown"
                  role="menu"
                  onMouseEnter={handleDashEnter}
                  onMouseLeave={handleDashLeave}
                >
                  <div className="dropdown-header">
                    <h4>Alerts</h4>
                    {dashNotifications.length > 0 && (
                      <button
                        onClick={clearAllDashNotifications}
                        className="clear-all-btn"
                        aria-label="Clear all alerts"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="notifications-list">
                    {dashNotifications.length > 0 ? (
                      dashNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`notification-item ${notification.type || "warning"}`}
                          role="menuitem"
                        >
                          <div className="notification-icon">
                            {notification.type === "error" ? (
                              <MdError size={18} />
                            ) : notification.type === "warning" ? (
                              <MdWarning size={18} />
                            ) : (
                              <BsExclamationTriangle size={18} />
                            )}
                          </div>
                          <div className="notification-content">
                            <div className="notification-header">
                              <span className="notification-title">
                                {notification.type === "error"
                                  ? "Error"
                                  : notification.type === "warning"
                                    ? "Warning"
                                    : "Alert"}
                              </span>
                            </div>
                            <p className="notification-message">
                              {notification.msg}
                            </p>
                            <div className="notification-time">
                              <IoTimeOutline size={12} />
                              {notification.time || "Just now"}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              removeDashNotification(notification.id)
                            }
                            className="enhanced-remove-btn"
                            aria-label="Remove alert"
                          >
                            <RxCross2 size={14} aria-hidden="true" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">
                        <BsInbox size={48} />
                        <p>No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enhanced User Profile */}
          <div className="dropdown-container">
            <button
              className="header-action user-profile"
              onClick={() => toggleDropdown("profile")}
              onMouseEnter={handleProfileEnter}
              onMouseLeave={handleProfileLeave}
              aria-label="User profile"
              aria-expanded={profileOpen}
            >
              <div className="user-avatar">
                {user?.userName?.charAt(0) || "U"}
              </div>
            </button>

            {profileOpen && (
              <div
                className="profile-dropdown"
                role="menu"
                onMouseEnter={handleProfileEnter}
                onMouseLeave={handleProfileLeave}
              >
                <div className="profile-header">
                  <div className="profile-avatar">
                    {user?.userName?.charAt(0) || "U"}
                  </div>
                  <div className="profile-info">
                    <div>
                      <h4>{user?.userName || "User"}</h4>
                      <p>{user?.role || "Admin"}</p>
                    </div>
                    <div>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>

                <div className="profile-menu">
                  {shouldRenderProfile && (
                    <>
                      <button
                        type="button"
                        className="enhanced-profile-menu-item"
                        onClick={() => navigate("/changepassword")}
                        role="menuitem"
                      >
                        <IoMdSettings size={16} aria-hidden="true" />
                        Change Password
                      </button>

                      <div className="menu-divider" />
                    </>
                  )}

                  <button
                    type="button"
                    className="enhanced-profile-menu-item logout"
                    onClick={handleLogOut}
                    role="menuitem"
                  >
                    <RxCross2 size={16} aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Settings */}
          {currentPath === "/masters/" && (
            <button
              className="header-action settings-btn"
              aria-label="Settings"
            >
              <IoMdSettings size={20} aria-hidden="true" />
            </button>
          )}
        </div>
      </header>

      {/* Enhanced Context Switcher */}
      <ContextSwitcher
        isOpen={isContextOpen}
        initialData={contextInitialData}
        onClose={() => setIsContextOpen(false)}
        onApply={(data) => {
          updateUser({
            companyId: data.company.value,
            branchId: data.branch.value,
            locationId: data.location?.value || null,
          });
        }}
      />
    </>
  );
});
export default Header;
