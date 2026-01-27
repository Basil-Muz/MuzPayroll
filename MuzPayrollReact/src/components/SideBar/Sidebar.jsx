import React, { useRef, useState, useEffect, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineMenu } from "react-icons/md";
import { HiMiniSwatch } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import { VscActivateBreakpoints } from "react-icons/vsc";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { FaScaleBalanced } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import "./sidebar.css";
import useIsMobile from "../../hook/useIsMobile";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
// import useIsTab from "../../hook/useIsTab";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <HiMiniSwatch size={18} />,
    link: "/dashboard",
  },

  /*  Employee */
  {
    id: "employee",
    label: "Employee",
    icon: <FaUserTie size={18} />,
    children: [
      { id: "employee.profile", label: "Employee", link: "/employee" },
      { id: "employee.list", label: "Employee List", link: "/employee-list" },
      { id: "employee.upload", label: "Employee Upload", link: "/employee-upload" },
      { id: "employee.attributes", label: "Employee Attributes", link: "/employee-attribute-allocation" },
      { id: "employee.bulkVerify", label: "Bulk Verification", link: "/employee-bulk-verification" },
    ],
  },

  /* TIME & PAYROLL */
  {
    id: "timePayroll",
    label: "Time & Payroll",
    icon: <FaRegCalendarAlt size={18} />,
    children: [
      { id: "attendance.masterRoll", label: "Master Roll", link: "/master-roll" },
      { id: "attendance.weekly", label: "Weekly Allocation", link: "/weekly-allocation" },
      { id: "attendance.shift", label: "Shift Allocation", link: "/shift-allocation" },
      { id: "attendance.leave", label: "Leave Allocation", link: "/leave-allocation-deallocation" },
      { id: "attendance.exchange", label: "Leave Exchange", link: "/leave-encashment" },
      { id: "attendance.yearEnd", label: "Leave Year End", link: "/leave-year-end-process" },

      { id: "process.payroll", label: "Payroll Process", link: "/payroll-process" },
      { id: "process.verify", label: "Payroll Verification", link: "/payroll-process-verification" },
    ],
  },

  /* FINANCE */
  {
    id: "finance",
    label: "Finance",
    icon: <FaRegMoneyBillAlt size={18} />,
    children: [
      { id: "advance.issue", label: "Advance Issue", link: "/advance-issue" },
      { id: "advance.recovery", label: "Advance Recovery", link: "/advance-recovery-update" },
      { id: "process.bonus", label: "Bonus Process", link: "/bonus-process" },
      { id: "process.gratuity", label: "Gratuity Process", link: "/gratiuty-process" },
      { id: "other.allowance", label: "Allowances & Deductions", link: "/monthly-allowance-deduction" },
    ],
  },

  /* Administration */
  {
    id: "administration",
    label: "Administration",
    icon: <FaGears size={18} />,
    children: [
      { label: "Masters", link: "/masters" },
      { label: "Settings", link: "/settings" },
      { label: "Database Backup", link: "/database-backup" },
      { label: "Employee Reminders", link: "/employee-reminder-register" },
    ],
  },

  /* COMPLIANCE */
  {
    id: "compliance",
    label: "Compliance",
    icon: <FaScaleBalanced size={18} />,
    children: [
      { label: "Compliance Letters", link: "/complients-letter" },
      { label: "Statutory Reports", link: "/report-and-letter" },
      { label: "Final Settlement", link: "/employee-final-settlement" },
    ],
  },

];

export default function Sidebar({ forceOpen }) {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const closeTimer = useRef(null);
  // const submenuRef = useRef(null);

  const isMobile = useIsMobile();
  // const isTab = useIsTab();
  const [sidebarOpen, setSidebarOpen] = useState(false);//side bar expand or collapsed
  const [openSubmenu, setOpenSubmenu] = useState(null);
  // const [closingSubmenu, setClosingSubmenu] = useState(null);
  const [submenuStyle, setSubmenuStyle] = useState({
    top: 0,
    left: 0,
    position: "absolute"
  });

  const stored = JSON.parse(localStorage.getItem("loginData"));

  const sidebarEnabled = stored.sidebarOpen || forceOpen; //opens navigation
  const [active, setActive] = useState(localStorage.getItem("activeMenu") || "");


  const getSidebarClass = () => {
    if (isMobile) {
      return sidebarOpen ? "mobile-open" : "mobile-closed";
    } else {
      return sidebarOpen ? "expanded" : "collapsed";
    }
  };

  const sidebarClass = getSidebarClass();

  //  LIVE loginData (for username, location, etc.)
  const [loginData, setLoginData] = useState(() =>
    JSON.parse(localStorage.getItem("loginData") || "{}")
  );

  useEffect(() => {
    const syncLoginData = () => {
      setLoginData(JSON.parse(localStorage.getItem("loginData") || "{}"));
    };

    window.addEventListener("loginDataChanged", syncLoginData);

    return () => {
      window.removeEventListener("loginDataChanged", syncLoginData);
    };
  }, []);
  const userName = loginData.userName || "User";

  /*  Sync sidebar enable */
// useEffect(() => {
//   if (!isMobile) {
//     const stored = localStorage.getItem("loginData");
//     if (stored) {
//       const data = JSON.parse(stored);
//       if (typeof data.sidebarOpen === "boolean") {
//         // setSidebarOpen(data.sidebarOpen);
//         setSidebarEnabled(data.sidebarOpen);
//       }
//     }
//   }
// }, [isMobile]);


  // Auto-close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".submenu") &&
        !event.target.closest(".collapse-btn1")
      ) {
        setSidebarOpen(false);
        setOpenSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  /* Menu handlers */
  const handleNav = (item) => {
    setActive(item.id);
    localStorage.setItem("activeMenu", item.id);
    if (item.link) navigate(item.link);

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSubNav = (child) => {
    setActive(child.id);
    localStorage.setItem("activeMenu", child.id);
    navigate(child.link);
    setOpenSubmenu(null);

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Calculate submenu position with viewport boundary check
  const calculateSubmenuPosition = useCallback(
    (itemRect, sidebarRect, submenuHeight = 320) => {
      const viewportHeight = window.innerHeight;

      // Center submenu vertically near clicked item
      let top =
        itemRect.top -
        submenuHeight / 2 +
        itemRect.height / 2;

      top = Math.max(20, Math.min(top, viewportHeight - submenuHeight));

      let left;

      if (isMobile) {
        left = sidebarRect.left + 12; //  near sidebar
      } else if (!sidebarOpen) {
        left = sidebarRect.width + 8;
      } else {
        left = sidebarRect.width + 12;
      }

      return {
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        minWidth: "280px",
        maxHeight: "70vh",
        overflowY: "auto",
        zIndex: 1000,
      };
    },
    [isMobile, sidebarOpen]
  );


  const openSubmenuFor = useCallback((e, item) => {
    if (!sidebarRef.current) return;

    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    const itemRect = e.currentTarget.getBoundingClientRect();

    // Calculate submenu position with boundary checking
    const position = calculateSubmenuPosition(itemRect, sidebarRect);

    setSubmenuStyle(position);
    setOpenSubmenu(item.id);
  }, [calculateSubmenuPosition]);

  const scheduleCloseSubmenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenSubmenu(null), 200);
  };

const toggleSidebar = () => {
  setSidebarOpen(prev => {
    // if (!isMobile) {
    //   const stored = JSON.parse(localStorage.getItem("loginData") || "{}");
    //   localStorage.setItem(
    //     "loginData",
    //     JSON.stringify({ ...stored, sidebarOpen: !prev })
    //   );
    // }
    return !prev;
  });
  // setSidebarEnabled(prev => {
  //   if (!isMobile) {
  //     const stored = JSON.parse(localStorage.getItem("loginData") || "{}");
  //     localStorage.setItem(
  //       "loginData",
  //       JSON.stringify({ ...stored, sidebarOpen: !prev })
  //     );
  //   }
  //   return !prev;
  // });
  setOpenSubmenu(null);
};


  // Close submenu when sidebar collapses
  // useEffect(() => {
  //   if (!sidebarOpen) {
  //     setOpenSubmenu(null);
  //   }
  // }, [sidebarOpen]);

  // Initialize sidebar state
  // useEffect(() => {
  //   if (!isMobile) {
  //     const stored = localStorage.getItem("loginData");
  //     if (stored) {
  //       const data = JSON.parse(stored);
  //       if (typeof data.sidebarOpen === 'boolean') {
  //         setSidebarOpen(data.sidebarOpen);
  //         // setSidebarEnabled(data.sidebarOpen);
  //       }
  //     }
  //   }
  // }, [isMobile, sidebarOpen]);

  // Handle window resize to reposition submenu
  useEffect(() => {
    const handleResize = () => {
      if (openSubmenu && sidebarRef.current) {
        const activeItem = document.querySelector(`[data-item-id="${openSubmenu}"]`);
        if (activeItem) {
          const sidebarRect = sidebarRef.current.getBoundingClientRect();
          const itemRect = activeItem.getBoundingClientRect();
          const position = calculateSubmenuPosition(itemRect, sidebarRect);
          setSubmenuStyle(position);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [openSubmenu, calculateSubmenuPosition]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`sidebar ${sidebarClass}`}
      >
        {/* Desktop Collapse Button */}
        {!isMobile && (
          <div className="buttons" style={{ justifyContent: sidebarOpen ? "flex-end" : "center" }}>
            {/* <button
              className="collapse-btn"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <div className={`sidebar-icon-transition ${!sidebarOpen ? "rotated" : ""}`}>
                {sidebarOpen ? (
                  <RxCross2 size={20} className="toggle-icon" />
                ) : (
                  <IoMdArrowDropright size={20} className="toggle-icon" />
                )}
              </div>
            </button> */}
          </div>
        )}

        {/* Brand/User Area */}
        <div
          className="sidebar-top"
          style={{
            justifyContent: isMobile || sidebarOpen ? "space-between" : "center",
          }}
        >
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

              {(isMobile || sidebarOpen) && (
                <div className="user-meta show">
                  <div className="user-name">{userName}</div>
                  <div className="user-role">Admin</div>
                </div>
              )}
{/* 
              {(isMobile || sidebarOpen) && (
                <button className="user-action" aria-label="User actions">
                  <IoIosArrowForward size={14} />
                </button>
              )} */}
            </div>
          </div>
          <button
            className="collapse-btn"

            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <div className={`sidebar-icon-transition ${!sidebarOpen ? "rotated" : ""}`}
              onClick={toggleSidebar}
            >
              {sidebarOpen ? (
                <IoMdArrowDropleft size={20} className="toggle-icon" />
              ) : (
                <IoMdArrowDropright size={20} className="toggle-icon" />
              )}
            </div>
          </button>
        </div>

        {/* Navigation */}
        {sidebarEnabled && (
          <nav
            className="sidebar-nav"
            aria-label="Main navigation"
            onMouseLeave={() => {
              if (!isMobile) scheduleCloseSubmenu();
            }}
          >

            {menuItems.map((item) => {
              const hasChildren = !!item.children && item.children.length > 0;
              return (
                <div
                  key={item.id}
                  className="nav-item-wrapper"
                  data-item-id={item.id}
                  onMouseEnter={(e) => {
                    if (!isMobile && hasChildren) {
                      openSubmenuFor(e, item);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile && hasChildren) {
                      scheduleCloseSubmenu();
                    }
                  }}
                >

                  <button
                    className={`nav-item ${active === item.id ? "active" : ""}`}
                    onClick={(e) => {
                      if (item.link) {
                        handleNav(item);
                        return;
                      }

                      if (hasChildren) {
                        if (isMobile) {
                          setOpenSubmenu(prev =>
                            prev === item.id ? null : item.id
                          );
                        } else {
                          if (openSubmenu === item.id) {
                            setOpenSubmenu(null);
                          } else {
                            openSubmenuFor(e, item);
                          }
                        }
                      }
                    }}


                    title={!sidebarOpen && !isMobile ? item.label : undefined}
                    aria-current={active === item.id ? "page" : undefined}
                    aria-expanded={openSubmenu === item.id}
                  >
                    <div className="nav-icon">{item.icon}</div>

                    {(isMobile || sidebarOpen) && (
                      <div className="nav-label">
                        <span className="label-text">{item.label}</span>
                      </div>
                    )}

                    {hasChildren && (isMobile || sidebarOpen) && (
                      <div className="nav-chevron" aria-hidden="true">
                        <IoIosArrowForward size={14}
                          style={{
                            transform: openSubmenu === item.id ? 'rotate(90deg)' : 'none',
                            transition: 'transform 0.2s ease'
                          }}
                        />
                      </div>
                    )}

                    {!sidebarOpen && !isMobile && (
                      <span className="tooltip">{item.label}</span>
                    )}
                  </button>

                  {/* Submenu */}
                  {hasChildren && openSubmenu === item.id && (
                    <div
                      className={`submenu floating 
                        }`}
                      style={submenuStyle}   // USE SAME STYLE EVERYWHERE
                      onClick={(e) => e.stopPropagation()} // prevent sidebar close
                    >

                      <div
                        style={{
                          background: "#c71ebeff",
                          borderRadius: "8px 8px 0 0",
                          color: "#fff",
                          padding: "12px 16px",
                          fontWeight: 600,
                          fontSize: "15px",
                        }}
                      >
                        {item.label}
                      </div>

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
                              padding: "10px 12px",
                              borderRadius: 6,
                              border: "none",
                              background: "transparent",
                              textAlign: "left",
                              cursor: "pointer",
                              transition: "background 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(199, 30, 190, 0.06)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <span
                              style={{
                                width: 20,
                                height: 20,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#c71ebeff",
                              }}
                            >
                              <VscActivateBreakpoints size={16} />
                            </span>
                            <span style={{ flex: 1, color: "#111827", fontSize: "14px" }}>
                              {child.label}
                            </span>
                            <span style={{ color: "#9ca3af", fontSize: 12 }}>&gt;</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        {/* Mobile backdrop */}
        {isMobile && sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </aside>

      {/* Mobile toggle button */}
      {isMobile && (
        <button
          className="collapse-btn1"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <RxCross2 size={20} className="toggle-icon" style={{ color: "#c71ebeff" }} />
          ) : (
            <MdOutlineMenu size={20} className="toggle-icon" style={{ color: "#c71ebeff" }} />
          )}
        </button>
      )}
    </>
  );
}