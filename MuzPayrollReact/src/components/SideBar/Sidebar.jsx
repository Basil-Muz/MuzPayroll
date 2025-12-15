import React, { useRef, useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineMenu } from "react-icons/md";
import { HiMiniSwatch } from "react-icons/hi2";
import { ImStack } from "react-icons/im";
import { IoIosArrowForward } from "react-icons/io";

import "./sidebar.css";
import {  } from "axios";

const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <HiMiniSwatch size={18} />, badge: 0 },
    {
    id: "employee",
    label: "Employee",
    icon: <ImStack size={18} />,
    children: [
        { id: "employee.employee", label: "Employee" },
        { id: "employee.employeeList", label: "Employee List" },
        { id: "employee.employeeUpload", label: "Employee Upload" },
        { id: "employee.employeeAttrAlloc", label: "Employee Attribute Allocation" },
        { id: "employee.employeeBulkVerification", label: "Employee Bulk Verification" },
    ],
    },
    { id: "attendance", label: "Attendance and Leave", icon: <ImStack size={18} />,
    children: [
    { id: "attendance.masterRoll", label: "Master Roll" },
    { id: "attendance.VeringWeeklyAllocation", label: "Vering Weekly Allocation" },
    // varing shift allocation,Leave Allocation/Deallocation,Leave enchangment,Leave year end process,
    { id: "attendance.varingShiftAllocation", label: "Varing Shift Allocation" },
    { id: "attendance.leaveAllocationDeallocation", label: "Leave Allocation/Deallocation" },
    { id: "attendance.leaveEnchangment", label: "Leave Enchangment" },
    { id: "attendance.leaveYearEndProcess", label: "Leave Year End Process" },
    ], 
    },
    { id: "advance", label: "Advance Management", icon: <ImStack size={18} />,  
    children: [
        // advance Issue,advance recovery update
        { id: "advance.advanceIssue", label: "Advance Issue" },
        { id: "advance.advanceRecoveryUpdate", label: "Advance Recovery Update" },
        ]},
    { id: "other", label: "Other Transaction", icon: <ImStack size={18} />,  
//   Monthly allowance and deduction,Employee reminder Register, Employee final settilement,Tasklist
    children: [
        { id: "other.monthlyAllowanceDeduction", label: "Monthly Allowance and Deduction" },
        { id: "other.employeeReminderRegister", label: "Employee Reminder Register" },
        { id: "other.employeeFinalSettlement", label: "Employee Final Settlement" },
        { id: "other.tasklist", label: "Tasklist" },
        ]
        },
    { id: "process", label: "Process", icon: <ImStack size={18} />,  
// payroll process,Payroll process verification,bonus process,gratiuty process
    children: [
        { id: "process.payrollProcess", label: "Payroll Process" },
        { id: "process.payrollProcessVerification", label: "Payroll Process Verification" },
        { id: "process.bonusProcess", label: "Bonus Process" },
        { id: "process.gratiutyProcess", label: "Gratiuty Process" },
        ]
},
    { id: "Statutary", label: "Statutary Complients", icon: <ImStack size={18} />,
    children: [
    // complients letter,letter,report
        { id: "Statutary.complientsLetter", label: "Complients Letter" },
        { id: "Statutary.letter", label: "Letter" },
        { id: "Statutary.report", label: "Report" },
        ]   
    },
    { id: "system", label: "System Management", icon: <ImStack size={18} />,
    children: [
    //    masters,Settings,database backup
        { id: "system.masters", label: "Masters" },
        { id: "system.settings", label: "Settings" },
        { id: "system.databaseBackup", label: "Database Backup" },
        ]   
    },
];

export default function Sidebar({ initialOpen = true, onNavigate = () => {},toggleMenu}) {
  const [open, setOpen] = useState(initialOpen);
  const [active, setActive] = useState("payroll");

  // submenu state
  const [openSubmenu, setOpenSubmenu] = useState(null); // id of menu item with submenu
  const [submenuStyle, setSubmenuStyle] = useState({ top: 0, left: "calc(100% + 8px)" });
  const sidebarRef = useRef(null);
  const closeTimer = useRef(null);

  const handleNav = (item) => {
    setActive(item.id);
    onNavigate(item.id);
  };

  const handleSubNav = (child) => {
    // you can customize navigation for subitems (route, open page, etc)
    setActive(child.id);
    onNavigate(child.id);
    // close submenu if desired
    setOpenSubmenu(null);
  };

  // open submenu next to the hovered item; compute top relative to sidebar
  const openSubmenuFor = (e, item) => {
    if (!sidebarRef.current) return;
    // clear any pending close timer
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    const itemRect = e.currentTarget.getBoundingClientRect();
    const topLocal = itemRect.top - sidebarRect.top; // position relative to sidebar top

    setSubmenuStyle({
      top: Math.max(8, topLocal) + "px", // small top padding, prevent negative
      left: `calc(${sidebarRect.width}px + 12px)`, // left relative calculation (fine fallback)
    });
    setOpenSubmenu(item.id);
  };

  const scheduleCloseSubmenu = () => {
    // add small delay to make hover movement smoother
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpenSubmenu(null);
      closeTimer.current = null;
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar ${open ? "expanded" : "collapsed"}`}
      aria-expanded={open}
    >
        <button
          className={`collapse-btn ${open ? "cross" : "menu"}`}
          onClick={() => setOpen((v) => !v)}
          aria-pressed={!open}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          <div className={`icon-transition ${open ? "rotated" : "rotated-back"}`}>
            {open ? (
              <RxCross2 size={20} className="toggle-icon" />
            ) : (
              <MdOutlineMenu size={20} className="toggle-icon" />
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
            <div className="user-avatar">R</div>
            {open && (
              <div className="user-meta">
                <div className="user-name">Rahul Admin</div>
                <div className="user-role">Payroll Manager</div>
              </div>
            )}
            <button className="user-action" aria-label="User actions">
              <IoIosArrowForward size={14} />
            </button>
          </div>
        </div>
      </div>
{toggleMenu &&
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
                onClick={() => handleNav(item)}
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
                  className="submenu"
                  style={{
                    position: "absolute",
                    left: open ? `calc(280px + 10px)` : `calc(87px + 10px)`, // adjust when collapsed
                    top: submenuStyle.top,
                    minWidth: 300,
                    borderRadius: 8,
                    zIndex: 120,
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
                        onClick={() => handleSubNav(child)}
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
                        <span style={{ flex: 1 ,color:'black'}}>{child.label}</span>
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
