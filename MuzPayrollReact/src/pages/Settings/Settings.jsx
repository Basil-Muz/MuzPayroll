// import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { HiMiniSwatch } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineMenu } from "react-icons/md";
import { ImStack } from "react-icons/im";
import "./Settings.css";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTopButton";
import Sidebar from "../../components/SideBar/Sidebar";
export default function Setting() {
    // const [open, setOpen] = useState(false);    //sidebar state
    const [backendError, setBackendError] = useState([]);

const sitemapData = [
  {
    title: "System Management/Settings",
    subtitle: "Settings",
    rows: [],
  },
  {
    title: "System Management/Settings/Payroll",
    subtitle: "Payroll",
    rows: [
      [
        { title: "Payroll Group", subtitle: "Payroll Group", link: "/payrollgroup" },
        { title: "Minimum Wages Group", subtitle: "Minimum Wages Group", link: "/minimum-wages-group" },
        { title: "DA Base Point And Rate Settings", subtitle: "DA Base Point And Rate Settings", link: "/da-base-point-rate" },
      ],
      [
        { title: "DA Index Settings", subtitle: "DA Index Settings", link: "/da-index-settings" },
        { title: "Attendance and Leave Group", subtitle: "Attendance and Leave Group", link: "/attendance-leave-group" },
        { title: "Holiday and Off day Group", subtitle: "Holiday and Off day Group", link: "/holiday-offday-group" },
      ],
      [
        { title: "Shift Group", subtitle: "Shift Group", link: "/shiftgroup" },
        { title: "Salary Head Group", subtitle: "Salary Head Group", link: "/salary-head-group" },
        { title: "Profession Tax Group", subtitle: "Profession Tax Group", link: "/profession-tax-group" },
      ],
      [
        { title: "Payroll Settings", subtitle: "Payroll Settings", link: "/payroll-settings" },
        { title: "Report Definition", subtitle: "Report Definition", link: "/report-definition" },
        { title: "Act Abstract", subtitle: "Act Abstract", link: "/act-abstract" },
      ],
      [
        { title: "Manpower Entry", subtitle: "Manpower Entry", link: "/manpower-entry" },
        { title: "Offday Settings", subtitle: "Offday Settings", link: "/offday-settings" },
        { title: "Shift Allocation Order", subtitle: "Shift Allocation Order", link: "/shift-allocation-order" },
      ],
    ],
  },
  {
    title: "System Management/Settings/User Rights",
    subtitle: "User Rights",
    rows: [
      [
        { title: "User Group", subtitle: "User Group", link: "/usergroup" },
        { title: "Location Group", subtitle: "Location Group", link: "/locationgroup" },
        { title: "Location Group Rights", subtitle: "Location Group Rights", link: "/location-group-rights" },
      ],
      [
        { title: "User Group Rights", subtitle: "User Group Rights", link: "/user-group-rights" },
        { title: "User Settings", subtitle: "User Settings", link: "/user-settings" },
        { title: "Location And Group Rights Mapping", subtitle: "Location And Group Rights Mapping", link: "/location-group-rights-mapping" },
      ],
      [
        { title: "Authorization User Attachment", subtitle: "Authorization User Attachment", link: "/authorization-user-attachment" },
        { title: "Employee and User Linking", subtitle: "Employee and User Linking", link: "/employee-user-linking" },
        { title: "Company Allocation", subtitle: "Company Allocation", link: "/company-allocation" },
      ],
    ],
  },
];

// cancle operation and return to home
const handleCancel = () => {
  window.location.href = "/home";
}
  return <>
 <Header backendError={backendError} />
   <div className="settigs-app-shell">
      {/* LEFT SIDEBAR */}
     <Sidebar initialOpen={true} onNavigate={(id) => console.log("nav to", id)} toggleMenu={true}/>

      {/* MAIN AREA */}
      <div className="settigs-main-area">
        {/* TOP BAR */}
        {/* <header className="top-bar">
          <div className="top-left" />
          <div className="top-right">
            <div className="top-icon square" />
            <div className="top-icon lines" />
            <div className="top-icon red" />
          </div>
        </header> */}

        {/* CONTENT */}
        <main className="content">
          <div className="main-header">
          <h1 className="page-title">Settings</h1>
          <div className="main-cancel">
            <MdOutlineCancel size={20} onClick={handleCancel}/>
            </div>
          </div>
          

          <div className="sitemap-card">
            {sitemapData.map((section) => (
              <section key={section.title} className="sitemap-section">
                <div className="section-header">
                  
                  
                  <div>
                    <div className="first"><ImStack size={20}/>
                    <div className="section-title">{section.title}</div></div>
                    
                    <div className="section-subtitle">{section.subtitle}</div>
                  </div>
                </div>

                {section.rows.map((row, idx) => (
                  <div className="tile-row" key={idx}>
                    {row.map((tile) => (
                      <a href={tile.link} className="tile-card" key={tile.title}>
                        <IoMdSettings  size={21} color="#a51daa"/>
                        {/* <div className="tile-icon"></div> */}
                        <div className="tile-text">
                          <div className="tile-title">{tile.title}</div>
                          <div className="tile-subtitle">{tile.subtitle}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                ))}
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
    <ScrollToTopButton />
    <Footer />
    </>

};

