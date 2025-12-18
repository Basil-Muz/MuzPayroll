import React, { useRef, useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineMenu } from "react-icons/md";
import { HiMiniSwatch } from "react-icons/hi2";
import { ImStack } from "react-icons/im";
import { IoIosArrowForward } from "react-icons/io";

import "./sidebar.css";
import {  } from "axios";
// import { href } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <HiMiniSwatch size={18} />, link:"/dashboard" },
    {
    id: "employee",
    label: "Employee",
    icon: <ImStack size={18} />,
    children: [
        { id: "employee.employee", label: "Employee" ,link:"/employee"},
        { id: "employee.employeeList", label: "Employee List",link:"/employee/employee-list" },
        { id: "employee.employeeUpload", label: "Employee Upload",link:"/employee/employee-upload" },
        { id: "employee.employeeAttrAlloc", label: "Employee Attribute Allocation",link:"/employee/employee-attribute-allocation" },
        { id: "employee.employeeBulkVerification", label: "Employee Bulk Verification", link:"/employee/employee-bulk-verification" },
    ],
    },
    { id: "attendance", label: "Attendance and Leave", icon: <ImStack size={18} />,
    children: [
    { id: "attendance.masterRoll", label: "Master Roll", link:"/attendance/master-roll" },
    { id: "attendance.VeringWeeklyAllocation", label: "Vering Weekly Allocation",link:"/attendance/vering-weekly-allocation" },
    // varing shift allocation,Leave Allocation/Deallocation,Leave enchangment,Leave year end process,
    { id: "attendance.varingShiftAllocation", label: "Varing Shift Allocation",link:"/attendance/varing-shift-allocation" },
    { id: "attendance.leaveAllocationDeallocation", label: "Leave Allocation/Deallocation",link:"/attendance/leave-allocation-deallocation" },
    { id: "attendance.leaveEnchangment", label: "Leave Enchangment",link:"/attendance/leave-enchangment" },
    { id: "attendance.leaveYearEndProcess", label: "Leave Year End Process",link:"/attendance/leave-year-end-process"  },
    ], 
    },
    { id: "advance", label: "Advance Management", icon: <ImStack size={18} />,  
    children: [
        // advance Issue,advance recovery update
        { id: "advance.advanceIssue", label: "Advance Issue" ,link:"/advance/advance-issue"},
        { id: "advance.advanceRecoveryUpdate", label: "Advance Recovery Update" ,link:"/advance/advance-recovery-update" },
        ]},
    { id: "other", label: "Other Transaction", icon: <ImStack size={18} />,  
//   Monthly allowance and deduction,Employee reminder Register, Employee final settilement,Tasklist
    children: [
        { id: "other.monthlyAllowanceDeduction", label: "Monthly Allowance and Deduction" ,link:"/other/monthly-allowance-deduction"},
        { id: "other.employeeReminderRegister", label: "Employee Reminder Register" ,link:"/other/employee-reminder-register" },
        { id: "other.employeeFinalSettlement", label: "Employee Final Settlement" ,link:"/other/employee-final-settlement" },
        { id: "other.tasklist", label: "Tasklist" },
        ]
        },
    { id: "process", label: "Process", icon: <ImStack size={18} />,  
// payroll process,Payroll process verification,bonus process,gratiuty process
    children: [
        { id: "process.payrollProcess", label: "Payroll Process", link:"/process/payroll-process"  },
        { id: "process.payrollProcessVerification", label: "Payroll Process Verification",link:"/process/payroll-process-verification"  },
        { id: "process.bonusProcess", label: "Bonus Process",link:"/process/bonus-process"  },
        { id: "process.gratiutyProcess", label: "Gratiuty Process",link:"/process/gratiuty-process"  },
        ]
},
    { id: "Statutary", label: "Statutary Complients", icon: <ImStack size={18} />,
    children: [
    // complients letter,letter,report
        { id: "Statutary.complientsLetter", label: "Complients Letter" ,link:"/statutary/complients-letter" },
        { id: "Statutary.letter", label: "Letter" ,link:"/statutary/letter"  },
        { id: "Statutary.report", label: "Report",link:"/statutary/report"  },
        ]   
    },
    { id: "system", label: "System Management", icon: <ImStack size={18} />,
    children: [
    //    masters,Settings,database backup
        { id: "system.masters", label: "Masters" ,link:"/masters"  },
        { id: "system.settings", label: "Settings" ,link:"/system/settings"  },
        { id: "system.databaseBackup", label: "Database Backup",link:"/system/database-backup"  },
        ]   
    },
];

export default function Sidebar({ forceOpen }) {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const closeTimer = useRef(null);

  const [open, setOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [submenuStyle, setSubmenuStyle] = useState({ top: 0 });
  const [sidebarEnabled, setSidebarEnabled] = useState(false);
  const [active, setActive] = useState(localStorage.getItem("activeMenu") || "");

  const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
  const userName = loginData.userName || "";

  /* 🔁 Sync sidebar enable */
  useEffect(() => {
  if (typeof forceOpen === "boolean") {
    setSidebarEnabled(forceOpen);
    return;
  }

  const stored = localStorage.getItem("loginData");
  if (stored) {
    const data = JSON.parse(stored);
    setSidebarEnabled(data.sidebarOpen === true);
  }
}, [forceOpen]);
  /* 🔹 Menu handlers */
  const handleNav = (item) => {
    setActive(item.id);
    localStorage.setItem("activeMenu", item.id);
    if (item.link) navigate(item.link);
  };

  const handleSubNav = (child) => {
    setActive(child.id);
    localStorage.setItem("activeMenu", child.id);
    navigate(child.link);
    setOpenSubmenu(null);
  };

  const openSubmenuFor = (e, item) => {
    if (!sidebarRef.current) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);

    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    const itemRect = e.currentTarget.getBoundingClientRect();

    setSubmenuStyle({ top: itemRect.top - sidebarRect.top });
    setOpenSubmenu(item.id);
  };

  const scheduleCloseSubmenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenSubmenu(null), 200);
  };
  
  return (
    <aside
      ref={sidebarRef}
      className={`sidebar ${open ? "collapsed" : "expanded"}`}
      aria-expanded={open}
    >
        <button
          className={`collapse-btn ${open ? "menu" : "cross"}`}
          onClick={() => setOpen((v) => !v)}
          aria-pressed={open}
          aria-label={open ?  "Collapse sidebar": "Expand sidebar" }
        >
          <div className={`icon-transition ${open ? "rotated" : "rotated-back"}`}>
            {open ? (
              <MdOutlineMenu size={20} className="toggle-icon" />
            ) : (
                <RxCross2 size={20} className="toggle-icon" />
            )}
          </div>
        </button>
      <div className="sidebar-top">
        
        <div
          className="brand"
          role="link"
          tabIndex={0}
          onClick={() => handleNav({ id: "dashboard" })}
        >
          <div className="user">
            <div className="user-avatar">
               {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            {!open && (
              <div className="user-meta">
                <div className="user-name">{userName}</div>
               
              </div>
            )}
            <button className="user-action" aria-label="User actions">
              <IoIosArrowForward size={14} />
            </button>
          </div>
        </div>
      </div>
{sidebarEnabled &&
      (<nav
        className="sidebar-nav"
        aria-label="Main navigation"
        onMouseLeave={() => scheduleCloseSubmenu()}
      >
        {menuItems.map((item) => {
          const hasChildren = !!item.children && item.children.length > 0;
          return (
            <div
              key={item.id}
              className={`nav-item-wrapper`}
              onMouseEnter={(e) => {
                if (hasChildren) openSubmenuFor(e, item);
              }}
              onMouseLeave={() => {
                // schedule submenu close
                if (hasChildren) scheduleCloseSubmenu();
              }}
            >
              <button
                className={`nav-item ${active === item.id ? "active" : ""}`}
             onClick={() => {
              if (item.link) {
                navigate(item.link);}
                handleNav(item);
              }}
                title={!open ? item.label : undefined} /* tooltip when collapsed */
                aria-current={active === item.id ? "page" : undefined}
              
              >
                <div className="nav-icon">{item.icon}</div>

                <div className="nav-label">
                  <span className="label-text">{item.label}</span>
                  {/* {item.badge > 0 && <span className="nav-badge">{item.badge}</span>} */}
                </div>

                {/* chevron only visible in expanded mode */}
                <div className="nav-chevron" aria-hidden="true">
                  <IoIosArrowForward size={14} />
                </div>

                {/* tooltip (visible only when collapsed) */}
                <span className="tooltip">{item.label}</span>
              </button>

              {/* floating submenu (render when openSubmenu == item.id) */}
              {hasChildren && openSubmenu === item.id && (
                <div
                  className= "submenu enter"
                  style={{
                    position: "absolute",
                    left: open ? `calc(87px + 10px)` : `calc(280px + 10px)`, // adjust when collapsed
                    top: submenuStyle.top,
                    minWidth: 300,
                    borderRadius: 8,
                    zIndex: 10,
                    transition: "left 0.2s ease",
                  }}
                  onMouseEnter={() => {
                    // keep open while hovering submenu
                    if (closeTimer.current) {
                      clearTimeout(closeTimer.current);
                      closeTimer.current = null;
                    }
                  }}
                  onMouseLeave={() => scheduleCloseSubmenu()}
                >
                  {/* header blue strip */}
                  <div
                    style={{
                      background: "#c71ebeff",
                      borderRadius: "8px 8px 0 0",
                      color: "#fff",
                      padding: "10px 12px",
                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </div>

                  {/* white panel with links */}
                  <div style={{ background: "#fff", color: "#111", padding: 8 }}>
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => navigate(child.link)}
                        className="submenu-item"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            width: "100%",
                            padding: "8px 10px",
                            borderRadius: 6,
                            border: "none",
                            background: "transparent",
                            textAlign: "left",
                            cursor: "pointer",
                        }}
                        >
                        <span
                            style={{
                                width: 18,
                                height: 18,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#9d16a9",
                            }}
                            >
                            ✱
                        </span>
                          <span style={{ flex: 1, color: "black" }}>{child.label}</span>
                        <span style={{ color: "#b594b8", fontSize: 12 }}>&gt;</span>
                        </button>
                    ))}
                    </div>
                </div>
                )}
            </div>
            );
        })}
        </nav>)}

    
    </aside>
  );
}
