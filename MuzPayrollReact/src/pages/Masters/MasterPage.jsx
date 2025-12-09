import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { IoMdSettings } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { HiMiniSwatch } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineMenu } from "react-icons/md";
import { ImStack } from "react-icons/im";
import "./Master.css";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTopButton";
export default function HomePage() {
    const [open, setOpen] = useState(false);    //sidebar state

    const sitemapData = [
  {
    title: "System Management/Masters",
    subtitle: "Masters",
    rows: [
      [
        { title: "Status Update", subtitle: "Status Update" },
      ],
    ],
  },
  {
    title: "System Management/Masters/Organisation",
    subtitle: "Organisation",
    rows: [
      [
        { title: "Company", subtitle: "Company" },
        { title: "Branch", subtitle: "Branch" },
        { title: "Location", subtitle: "Location" },
      ],
      [
        { title: "Company List", subtitle: "Company List" },
        { title: "Branch List", subtitle: "Branch List" },
        { title: "Location List", subtitle: "Location List" },
      ],
      [
        { title: "License Agreement", subtitle: "License Agreement" },
      ],
    ],
  },
  {
    title: "System Management/Masters/Payroll",
    subtitle: "Payroll",
    rows: [
      [
        { title: "Designation", subtitle: "Designation" },
        { title: "Department", subtitle: "Department" },
        { title: "Job Grade", subtitle: "Job Grade" },
        {title:"Govt. Job Grade", subtitle:"Govt. Job Grade" },
        {title:"Employee Type", subtitle:"Employee Type" },
        {title:"Attendance and Leave", subtitle:"Attendance and Leave" },
        {title:"Salary Head", subtitle:"Salary Head" },
        {title:"Advance Type", subtitle:"Advance Type" },
        {title:"Reports and Letters", subtitle:"Reports and Letters" },
        {title:"DA Centre", subtitle:"DA Centre" },
        {title:"Reminder Item", subtitle:"Reminder Item" },
        {title:"Employee Attribute", subtitle:"Employee Attribute" },
        {title:"Employee Attribute Value", subtitle:"Employee Attribute Value"},
        {title:"Work Type", subtitle:"Work Type"},

      ],
       ],
  },
      {
    title: "System Management/Masters/User Rights",
    subtitle: "User Rights",
    rows: [
      [
        { title: "User", subtitle: "User" },
        { title: "Reset Password", subtitle: "Reset Password" },
      ],
    ],
  },
   
];

  return <>
  <Header />
   <div className="app-shell">
      {/* LEFT SIDEBAR */}
      <aside className="side-nav">
        
        <div className="side-header">
            <div className="section-name">
           <div 
  className="icon-transition"
   onClick={() => setOpen(!open)}
  style={{
    transform: open ? "rotate(90deg)" : "rotate(0deg)",
  }}
>
  {open ? (
    <RxCross2 size={21} className="icon"/>
  ) : (
    <MdOutlineMenu size={21} className="icon"/>
  )}
</div>

            </div>
          <div className="avatar-circle">A</div>
          <div className="avatar-name">ADMIN</div>
        </div>
        <div className="side-dashboard">
            <HiMiniSwatch size={20} color="black"/>
        </div>
        <div className="side-menu">
          {/* fake icons using simple blocks – replace with react-icons if you like */}
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="side-icon-row">
              <ImStack  size={20} color="black"/> 
              <IoIosArrowForward size={13} color="#279fb8"/>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="main-area">
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
          <h1 className="page-title">Sitemap</h1>

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
                      <div className="tile-card" key={tile.title}><IoMdSettings  size={21} color="#1daa4a"/>
                        {/* <div className="tile-icon"></div> */}
                        <div className="tile-text">
                          <div className="tile-title">{tile.title}</div>
                          <div className="tile-subtitle">{tile.subtitle}</div>
                        </div>
                      </div>
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

