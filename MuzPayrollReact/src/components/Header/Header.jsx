import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { IoMdSettings } from "react-icons/io";
import {useLocation} from "react-router-dom";
import { IoNotificationsSharp } from "react-icons/io5"; // Example from Ionicons
import { BiSolidCollection } from "react-icons/bi";
// import { FaUserTie } from "react-icons/fa6";
import { ImUser } from "react-icons/im";
const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
  
//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };
const [notOpen, setNotOpen] = useState(false);
const location = useLocation();
const currentPath = location.pathname;
const [dashOpen, setDashOpen] = useState(false);
    return (
    <header className="header">
        <div className="logo">Cloud Stack Solutions</div>
        <div className="header-right">
            <div className={`notification ${currentPath !== "/masters" ? "" : "no-dashboard"}`} onMouseEnter={() => setNotOpen(!notOpen)} onMouseLeave={() => setNotOpen(!notOpen)}>
                <IoNotificationsSharp size={19} color="#161414e6"/>
                <div className="msgs">0</div>
                {notOpen && (
      <div className="notification-dropdown">
        <p>No new notifications</p>
      </div>
              )}
            </div>
        <div>
            {currentPath!=="/masters"&& currentPath!=="/home" &&
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
        <div className="user-profile">
            <ImUser size={21} style={{ color: '#1092e9'}}/>
            
        </div>
       {currentPath==="/masters" && <div className="settings">
            <IoMdSettings size={19} color="#161414e6"/>
        </div>}
        
        </div>
        
    </header>
  );
};

export default Header;