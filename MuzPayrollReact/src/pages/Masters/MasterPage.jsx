// import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { MdOutlineCancel } from "react-icons/md";
import React from "react";
import { IoMdSettings } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { HiMiniSwatch } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineMenu } from "react-icons/md";
import { ImStack } from "react-icons/im";
// import { useState } from "react";
import "./Master.css";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTopButton";
import Sidebar from "../../components/SideBar/Sidebar";
export default function HomePage() {
  // const [open, setOpen] = useState(false);    //sidebar state
  // const [backendError, setBackendError] = useState([]);
  const sitemapData = [
    {
      title: "System Management/Masters",
      subtitle: "Masters",
      rows: [
        [
          {
            title: "Status Update",
            subtitle: "Status Update",
            link: "/status-update",
          },
        ],
      ],
    },
    {
      title: "System Management/Masters/Organisation",
      subtitle: "Organisation",
      rows: [
        [
          { title: "Company", subtitle: "Company", link: "/companyform" },
          { title: "Branch", subtitle: "Branch", link: "/branchform" },
          { title: "Location", subtitle: "Location", link: "/locationform" },
        ],
        [
          {
            title: "Company List",
            subtitle: "Company List",
            link: "/organisation/company-list",
          },
          {
            title: "Branch List",
            subtitle: "Branch List",
            link: "/organisation/branch-list",
          },
          {
            title: "Location List",
            subtitle: "Location List",
            link: "/organisation/location-list",
          },
        ],
        [
          {
            title: "License Agreement",
            subtitle: "License Agreement",
            link: "/organisation/license-agreement",
          },
        ],
      ],
    },
    {
      title: "System Management/Masters/Payroll",
      subtitle: "Payroll",
      rows: [
        [
          {
            title: "Designation",
            subtitle: "Designation",
            link: "/designation",
          },
          { title: "Department", subtitle: "Department", link: "/department" },
          { title: "Job Grade", subtitle: "Job Grade", link: "/job-grade" },
          {
            title: "Govt. Job Grade",
            subtitle: "Govt. Job Grade",
            link: "/govt-job-grade",
          },
          {
            title: "Employee Type",
            subtitle: "Employee Type",
            link: "/employee-type",
          },
          {
            title: "Attendance and Leave",
            subtitle: "Attendance and Leave",
            link: "/attendance-and-leave",
          },
          {
            title: "Salary Head",
            subtitle: "Salary Head",
            link: "/salary-head",
          },
          {
            title: "Advance Type",
            subtitle: "Advance Type",
            link: "/advance-type",
          },
          {
            title: "Reports and Letters",
            subtitle: "Reports and Letters",
            link: "/reports-and-letters",
          },
          { title: "DA Centre", subtitle: "DA Centre", link: "/da-centre" },
          {
            title: "Reminder Item",
            subtitle: "Reminder Item",
            link: "/reminder-item",
          },
          {
            title: "Employee Attribute",
            subtitle: "Employee Attribute",
            link: "/employee-attribute",
          },
          {
            title: "Employee Attribute Value",
            subtitle: "Employee Attribute Value",
            link: "/employee-attribute-value",
          },
          { title: "Work Type", subtitle: "Work Type", link: "/work-type" },
        ],
      ],
    },
    {
      title: "System Management/Masters/User Rights",
      subtitle: "User Rights",
      rows: [
        [
          { title: "User", subtitle: "User", link: "/user-management/user" },
          {
            title: "Reset Password",
            subtitle: "Reset Password",
            link: "/user-management/reset-password",
          },
        ],
      ],
    },
  ];
  // cancle operation and return to home
  const handleCancel = () => {
    window.location.href = "/home";
  };
  return (
    <>
      <Header backendError={[]} />
      <div className="master-app-shell">
        {/* LEFT SIDEBAR */}
        <Sidebar
          initialOpen={true}
          onNavigate={(id) => console.log("nav to", id)}
          toggleMenu={true}
        />

        {/* MAIN AREA */}
        <div className="master-main-area">
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
              <h1 className="page-title" style={{ fontWeight: 500 }}>
                Masters
              </h1>
              <div className="main-cancel">
                <MdOutlineCancel size={20} onClick={handleCancel} />
              </div>
            </div>

            <div className="sitemap-card">
              {sitemapData.map((section) => (
                <section key={section.title} className="sitemap-section">
                  <div className="section-header">
                    <div>
                      <div className="first">
                        <ImStack size={20} />
                        <div className="section-title">{section.title}</div>
                      </div>

                      <div className="section-subtitle">{section.subtitle}</div>
                    </div>
                  </div>

                  {section.rows.map((row, idx) => (
                    <div className="tile-row" key={idx}>
                      {row.map((tile) => (
                        <a
                          href={tile.link}
                          className="tile-card"
                          key={tile.title}
                        >
                          <IoMdSettings size={21} color="#a51daa" />
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
  );
}
