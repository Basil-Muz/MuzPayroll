import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { IoMdSettings } from "react-icons/io";
import {useLocation} from "react-router-dom";
import { IoNotificationsSharp } from "react-icons/io5"; // Example from Ionicons
import { BiSolidCollection } from "react-icons/bi";
// import { FaUserTie } from "react-icons/fa6";
import { ImUser } from "react-icons/im";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
  
//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };
const [notOpen, setNotOpen] = useState(false);
const location = useLocation();
const [profileOpen, setProfileOpen] = useState(true);
// notification-dropdown array
// type MessageState = {
//   msg: string;
//   status: boolean;
// };
// const [error, setError] = useState<{msg: string,
//   status: boolean}>({
//   msg: "",
//   status: false,
// });
// setError({ msg: "Something went wrong", status: true });
// setError(prev => ({ ...prev, msg: "New message" }));
const [notifications, setNotifications] = useState([
  // { id: 1, msg: "New user registered", status: true },
  // { id: 2, msg: "Server overloaded", status: false },
  // { id: 3, msg: "New order received", status: true },
]);

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

const currentPath = location.pathname;
const [dashOpen, setDashOpen] = useState(false);
    return (
    <header className="header">
        <div className="logo">Cloud Stack Solutions</div>
        <div className="header-right">
            <div className={`notification ${currentPath !== "/masters" ? "" : "no-dashboard"}`} onMouseEnter={() => setNotOpen(!notOpen)} onMouseLeave={() => setNotOpen(!notOpen)}>
                <IoNotificationsSharp size={19} color="#161414e6"/>
                <div className="msgs">{notifications.length}</div>
                {notOpen && (
      <div className="notification-dropdown">
        <p style={{color:'black'}}>No new notifications</p>
      </div>
              )}
            </div>
        <div>
            {currentPath!=="/masters/"&& currentPath!=="/home/" &&
            <div className="dashboard" onMouseEnter={() => setDashOpen(!dashOpen)} onMouseLeave={() => setDashOpen(!dashOpen)}>
                <BiSolidCollection size={19} color="#161414e6"/>
                <div className="msgs">0</div>
                {dashOpen && (
                    <div className="notification-dropdown">
                        <p>No new notifications1111</p>
                    </div>
                )} 
            </div>}
        </div>
            <div className="location-date">
            <span className="location">Kochi_Kakkanad</span>
            <span className="date">12/09/2025</span>
            </div>
        <div className="user-profile" onMouseEnter={() => setProfileOpen(!profileOpen)} onMouseLeave={() => setProfileOpen(!profileOpen)}>
            <ImUser size={21} style={{ color: '#1092e9'}}/>
            {profileOpen && (
                    <div className="profile-dropdown">
                        <p>Change Password</p>
                        <p>Logout</p>
                    </div>
                )} 
        </div>
       {currentPath==="/masters/" && <div className="settings">
            <IoMdSettings size={19} color="#161414e6"/>
        </div>}
        {/* <ThemeToggle /> */}
        </div>
        
    </header>
  );
};

export default Header;