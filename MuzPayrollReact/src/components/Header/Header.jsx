import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
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
  const [notifications, setNotifications] = useState([]);
  const [dashNotifications, setDashNotifications] = useState(INITIAL_NOTIFICATIONS);
  
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
  const locationName = loginData.locationName || "Kochi_Kakkanad";
  const currentPath = location.pathname;
  const date = new Date().toLocaleDateString();

  // Determine visibility
  const shouldRenderDashboard = !BLOCKED_PATHS.includes(currentPath);
  const shouldRenderProfile = BLOCKED_PATHS.includes(currentPath);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(notifTimer.current);
      clearTimeout(dashTimer.current);
      clearTimeout(profileTimer.current);
    };
  }, []);

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
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const removeDashNotification = useCallback((id) => {
    setDashNotifications(prev => prev.filter(notification => notification.id !== id));
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
      if (event.key === 'Escape') {
        setNotOpen(false);
        setDashOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isNotification = event.target.closest('.notification');
      const isDashboard = event.target.closest('.dashboard');
      const isProfile = event.target.closest('.user-profile');
      
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notOpen, dashOpen, profileOpen]);

  return (
    <header className="header" role="banner">
      <div className="logo">
        <img 
          src="/muziris-png.ico" 
          alt="Muziris Logo" 
          width="106" 
          height="55"
          loading="lazy"
        />
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
            if (e.key === 'Enter' || e.key === ' ') {
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
                      className={`notification-item ${notification.status ? 'error' : 'info'}`}
                      role="menuitem"
                    >
                      <p className="notification-msg">
                        {notification.msg}
                      </p>
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
                <p className="no-msg" role="alert">No notifications</p>
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
              if (e.key === 'Enter' || e.key === ' ') {
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
                        className={`notification-item ${notification.status ? 'error' : 'info'}`}
                        role="menuitem"
                      >
                        <p className="notification-msg">
                          {notification.msg}
                        </p>
                        <button
                          onClick={() => removeDashNotification(notification.id)}
                          className="remove-btn"
                          aria-label={`Remove dashboard notification: ${notification.msg}`}
                        >
                          <RxCross2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-msg" role="alert">No dashboard notifications</p>
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
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setProfileOpen(!profileOpen);
            }
          }}
        >
          <ImUser 
            size={21} 
            style={{ color: '#d218d8ff' }} 
            aria-hidden="true"
          />
          
          {shouldRenderProfile && profileOpen && (
            <div className="profile-dropdown" role="menu">
              <a 
                href="/changePassword" 
                role="menuitem"
                className="profile-link"
              >
                Change Password
              </a>
              <a 
                href="/logout" 
                role="menuitem"
                className="profile-link logout"
              >
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