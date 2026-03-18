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

  const { rowNumber } = useParams();
  const navigate = useNavigate();
  const { showRailLoader, hideLoader } = useLoader();

  const [masterData, setMasterData] = useState([]);
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
      // console.log("Sub menus", response);
      const sitemapData = buildSitemapFromSubMenuResponse(
        response.data,
        "System Management",
      );
      setMasterData(sitemapData);
      // console.log("Generated sitemap", sitemapData);
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
