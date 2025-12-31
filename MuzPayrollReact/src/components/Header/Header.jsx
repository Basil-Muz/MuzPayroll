import { useState,useRef,useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { IoMdSettings } from "react-icons/io";
import {useLocation} from "react-router-dom";
import { IoNotificationsSharp } from "react-icons/io5"; // Example from Ionicons
import { BiSolidCollection } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
// import { FaUserTie } from "react-icons/fa6";
import { ImUser } from "react-icons/im";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
const Header = ({backendError}) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
  
//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

const [notOpen, setNotOpen] = useState(false);
const location = useLocation();
const [dashOpen, setDashOpen] = useState(false);
const [profileOpen, setProfileOpen] = useState(false);
const notifTimer = useRef(null);
const dashTimer = useRef(null);
const profileTimer = useRef(null);

const date=new Date().toLocaleDateString();

const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
const locationName = loginData.locationName || "Kochi_Kakkanad";

const [notifications, setNotifications] = useState([]);

const [dashNotifications, setDashNotifications] = useState([
//   { id: 1, msg: "New user registered", status: true },
//   { id: 2, msg: "Server overloaded", status: false },
  // { id: 3, msg: "New order received", status: true },
]);

//path check for dashboard rendering
const currentPath = location.pathname;
const blockedPaths = ["/masters", "/home", "/settings"];
const shouldRender = !blockedPaths.includes(currentPath);
//path check for profile-dropdown rendering

const blockedProfilePaths = ["/masters", "/home", "/settings"];
const shouldProfileRender = blockedProfilePaths.includes(currentPath);

useEffect(() => {
  setNotifications(backendError || []);
}, [backendError]);
  useEffect(() => {
    if (backendError.length > 0) {
      setNotOpen(true);
    }
  }, [backendError.length]);
// Notification removal functions
const removeNotification = (id) => {
  setNotifications(prev =>
    prev.filter(notification => notification.id !== id)
  );
};
const removeDashNotification = (id) => {
  setDashNotifications(prev =>
    prev.filter(notification => notification.id !== id)
  );
};


const handleNotifEnter = () => {
  clearTimeout(notifTimer.current);
  setDashOpen(false); // Close dashboard dropdown if open
  setNotOpen(true);
};

const handleNotifLeave = () => {
  notifTimer.current = setTimeout(() => {
    setNotOpen(false);
  }, 200); // delay before hiding
};

const handleDashEnter = () => {
    clearTimeout(dashTimer.current);
    setNotOpen(false); // Close notification dropdown if open
    setDashOpen(true);
};

const handleDashLeave = () => {
    dashTimer.current = setTimeout(() => {
    setDashOpen(false);
  }, 200); // delay before hiding
};

const handlerprofileEnter = () => {
    clearTimeout(profileTimer.current);
    setProfileOpen(true);
};

const handlerprofileLeave = () => {
    profileTimer.current = setTimeout(() => {

    setProfileOpen(false);
  }, 200); // delay before hiding
    //
};

// Notification addition/removal example:

// setNotifications(prev => [
//   ...prev,
//   {
//     id: Date.now(),   // unique id
//     msg: "Something happened",
//     status: false,    // or true
//   }
// ]);
// const removeNotification = (id) => {
//   setNotifications(prev => prev.filter(n => n.id !== id));
// };
// setNotifications([]);



    return (
    <header className="header">
        <div className="logo"><img src="/muziris-png.ico" alt="" width="106px" height="55px "/></div>
        <div className="header-right">
            <div className={`notification ${currentPath !== "/masters" ? "" : "no-dashboard"}`} 
            onMouseEnter={handleNotifEnter}
            onMouseLeave={handleNotifLeave}>
                <IoNotificationsSharp size={19} />

                {(notifications.length!=0)&&<div className="msgs">{notifications.length}</div>}
                {notOpen && (
      <div className="notification-dropdown">
            {notifications.length > 0 ? (
        notifications.map((notification) => (
            <p className="error-msg" key={notification.id} style={{color:'black'}}>{notification.msg} <RxCross2 size={20} color="red" onClick={() => removeNotification(notification.id)}/></p>
            ))
        ) : (
        <p className="no-msg">no notifications</p>
        )}
      </div>
              )}
            </div>
        <div>
            {shouldRender &&
            <div className="dashboard" onMouseEnter={handleDashEnter}
    onMouseLeave={handleDashLeave}>
                <BiSolidCollection size={19} />
                {dashNotifications.length!=0 &&
                <div className="msgs">{dashNotifications.length}</div>
                }
                {dashOpen && (
                    <div className="notification-dropdown">
                        {dashNotifications.length > 0 ? (
                        dashNotifications.map((notification) => (
                            <p className="error-msg" key={notification.id} style={{color:'black'}}>
                              {notification.msg} 
                              <RxCross2 size={20} color="red" 
                              onClick={() => removeDashNotification(notification.id)}/></p>
                        ))
                    ) : (   
                        <p className="no-msg">no notifications</p>
                    )}
                    </div>
                )} 
            </div>}
        </div>
            <div className="location-date">
            <span className="location">{locationName}</span>
            <span className="date">{date}</span>
            </div>
        <div 
            className="user-profile" 
            onMouseEnter={handlerprofileEnter} 
            onMouseLeave={handlerprofileLeave}
            >
            <ImUser size={21} style={{ color: '#d218d8ff'}}/>

            {shouldProfileRender && profileOpen && (

                    <div className="profile-dropdown">
                        <a href="/changePassword">Change Password</a>
                        <a href="/logout">Logout</a>
                    </div>
                )} 
        </div>
       {/* {currentPath=="/masters/" && 
       <div className="settings">
            <IoMdSettings size={19} color="#161414e6"/>
        </div>} */}

        {/* <ThemeToggle /> */}
        </div>
        
    </header>
  );
};

export default Header;