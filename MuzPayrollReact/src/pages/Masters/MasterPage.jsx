// import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { MdOutlineCancel } from "react-icons/md";
import React, { useEffect, useState } from "react";
// import { useState } from "react";
import "./Master.css";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTopButton";
import Sidebar from "../../components/SideBar/Sidebar";
import { useParams } from "react-router-dom";
import { fetchMainMenu } from "../../services/menu.service";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { buildSitemapFromSubMenuResponse } from "../../utils/menuUtils";
import { handleApiError } from "../../utils/errorToastResolver";
import { useLoader } from "../../context/LoaderContext";
import { ensureMinDuration } from "../../utils/loaderDelay";
import MasterSitemap from "../../components/SiteMapSection/GenericSitemap";
export default function HomePage() {
  // const [open, setOpen] = useState(false);    //sidebar state
  // const [backendError, setBackendError] = useState([]);
  // console.log("Menu")
  const { rowNumber } = useParams();
  const navigate = useNavigate();
  const { showRailLoader, hideLoader } = useLoader();
  // console.log("Row Number",rowNumber);
  const [masterData, setMasterData] = useState([]);
  // const sitemapData = [
  //   {
  //     title: "System Management/Masters",
  //     subtitle: "Masters",
  //     rows: [
  //       [
  //         {
  //           title: "Status Update",
  //           subtitle: "Status Update",
  //           link: "/statusupdate",
  //         },
  //       ],
  //     ],
  //   },
  //   {
  //     title: "System Management/Masters/Organisation",
  //     subtitle: "Organisation",
  //     rows: [
  //       [
  //         { title: "Company", subtitle: "Company", link: "/companyform" },
  //         { title: "Branch", subtitle: "Branch", link: "/branchform" },
  //         { title: "Location", subtitle: "Location", link: "/locationform" },
  //       ],
  //       [
  //         {
  //           title: "Company List",
  //           subtitle: "Company List",
  //           link: "/companylist",
  //         },
  //         {
  //           title: "Branch List",
  //           subtitle: "Branch List",
  //           link: "/branchlist",
  //         },
  //         {
  //           title: "Location List",
  //           subtitle: "Location List",
  //           link: "/locationlist",
  //         },
  //       ],
  //       [
  //         {
  //           title: "License Agreement",
  //           subtitle: "License Agreement",
  //           link: "/license-agreement",
  //         },
  //       ],
  //     ],
  //   },
  //   {
  //     title: "System Management/Masters/Payroll",
  //     subtitle: "Payroll",
  //     rows: [
  //       [
  //         {
  //           title: "Designation",
  //           subtitle: "Designation",
  //           link: "/designation",
  //         },
  //         { title: "Department", subtitle: "Department", link: "/department" },
  //         { title: "Job Grade", subtitle: "Job Grade", link: "/job-grade" },
  //         {
  //           title: "Govt. Job Grade",
  //           subtitle: "Govt. Job Grade",
  //           link: "/govt-job-grade",
  //         },
  //         {
  //           title: "Employee Type",
  //           subtitle: "Employee Type",
  //           link: "/employee-type",
  //         },
  //         {
  //           title: "Attendance and Leave",
  //           subtitle: "Attendance and Leave",
  //           link: "/attendance-and-leave",
  //         },
  //         {
  //           title: "Salary Head",
  //           subtitle: "Salary Head",
  //           link: "/salary-head",
  //         },
  //         {
  //           title: "Advance Type",
  //           subtitle: "Advance Type",
  //           link: "/advance-type",
  //         },
  //         {
  //           title: "Reports and Letters",
  //           subtitle: "Reports and Letters",
  //           link: "/reports-and-letters",
  //         },
  //         { title: "DA Centre", subtitle: "DA Centre", link: "/da-centre" },
  //         {
  //           title: "Reminder Item",
  //           subtitle: "Reminder Item",
  //           link: "/reminder-item",
  //         },
  //         {
  //           title: "Employee Attribute",
  //           subtitle: "Employee Attribute",
  //           link: "/employee-attribute",
  //         },
  //         {
  //           title: "Employee Attribute Value",
  //           subtitle: "Employee Attribute Value",
  //           link: "/employee-attribute-value",
  //         },
  //         { title: "Work Type", subtitle: "Work Type", link: "/work-type" },
  //       ],
  //     ],
  //   },
  //   {
  //     title: "System Management/Masters/User Rights",
  //     subtitle: "User Rights",
  //     rows: [
  //       [
  //         { title: "User", subtitle: "User", link: "/user" },
  //         {
  //           title: "Reset Password",
  //           subtitle: "Reset Password",
  //           link: "/reset-password",
  //         },
  //       ],
  //     ],
  //   },
  // ];
  const { user } = useAuth();

  const FetchSubmenus = async () => {
    const startTime = Date.now();
    showRailLoader("Loading menus…");

    try {
      const response = await fetchMainMenu(
        "SUB_MENU",
        "LIST",
        user.userMstId,
        user.solutionId,
        user.defaultEntityHierarchyId,
        1,
        rowNumber,
      );
      console.log("Sub menus", response);
      const sitemapData = buildSitemapFromSubMenuResponse(
        response.data,
        "System Management",
      );
      setMasterData(sitemapData);
      console.log("Generated sitemap", sitemapData);
    } catch (error) {
      handleApiError(error);
    } finally {
      await ensureMinDuration(startTime, 600);
      hideLoader();
    }
  };

  useEffect(() => {
    if (!user || !rowNumber) return;
    FetchSubmenus();
  }, [user, rowNumber]);

  // cancle operation and return to home
  const handleCancel = () => {
    // window.location.href = "/home";
    navigate("/home");
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
              <MasterSitemap data={masterData} pageType="masters"/>
            </div>
          </main>
        </div>
      </div>
      <ScrollToTopButton />
      <Footer />
    </>
  );
}
