import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

import Header from "../../components/Header/Header";
import Search from "../../components/search/Search";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import Loading from "../../components/Loading/Loading";

import "./BranchList.css";

const BranchList = () => {
  /* ================= STATE ================= */
  const [listView, setListView] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [groupByStatus, setGroupByStatus] = useState(false);

  const [activeCompanies, setActiveCompanies] = useState([]);
  const [inactiveCompanies, setInactiveCompanies] = useState([]);

  const [loading, setLoading] = useState(false);
  const [headerError] = useState([]);

  const navigate = useNavigate();

  /* ================= API ================= */
  const fetchActiveCompanies = () =>
    axios.get("http://localhost:8087/branch/branchlist");

  const fetchInactiveCompanies = () =>
    axios.get("http://localhost:8087/branch/inactivebranchlist");

  /* ================= NAVIGATION ================= */
  const handleCardClick = (mstID) => {
    navigate(`/branch/${mstID}`);
  };

  /* ================= LOADERS ================= */
  useEffect(() => {
    loadActiveOnly();
  }, []);

  const loadActiveOnly = async () => {
    setLoading(true);
    try {
      const res = await fetchActiveCompanies();
      setTimeout(() => {
        setActiveCompanies(res.data);
        setInactiveCompanies([]);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleGroupSubmit = async (checked) => {
    setGroupByStatus(checked);
    setShowSearch(false);

    if (!checked) {
      loadActiveOnly();
      return;
    }

    setLoading(true);
    try {
      const [activeRes, inactiveRes] = await Promise.all([
        fetchActiveCompanies(),
        fetchInactiveCompanies(),
      ]);

      setTimeout(() => {
        setActiveCompanies(activeRes.data);
        setInactiveCompanies(inactiveRes.data);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setGroupByStatus(false);
    setShowSearch(false);
    loadActiveOnly();
  };

  /* ================= RENDER CARD ================= */
  const renderCompanyCard = (item, status) => (
    <div
      key={item.code}
      className={`advance-card ${status}`}
      onClick={() => handleCardClick(item.mstID)}
      style={{ cursor: "pointer" }}
    >
      <div className="card-header">
        <span className="code">{item.code}</span>

        {status === "active" ? (
          <div className="status-item active">
            <TiTick />
            <span className="date">{item.activeDate}</span>
          </div>
        ) : (
          <div className="status-item date">
            <div className="status-item active">
              <TiTick />
              <span className="date">{item.activeDate}</span>
            </div>
            <div className="status-item inactive">
              <RxCross2 />
              <span className="date">{item.inactiveDate}</span>
            </div>
          </div>
        )}
      </div>

      <div className="card-title">{item.name}</div>
      <div className="card-shortname">{item.shortName}</div>
    </div>
  );

  /* ================= UI ================= */
  return (
    <>
      <Header backendError={headerError} />

      <div className="designation-page">
        {/* HEADER */}
        <div className="header-section">
          <h2 className="page-title">Branch List</h2>

          <div className="header-actions">
            <div className="view-toggle">
              <button
                className={`icon-btn ${!listView ? "active" : ""}`}
                onClick={() => setListView(false)}
              >
                <BsGrid3X3GapFill />
              </button>

              <button
                className={`icon-btn ${listView ? "active" : ""}`}
                onClick={() => setListView(true)}
              >
                <FaListUl />
              </button>

              <button
                className={`icon-btn ${showSearch ? "active" : ""}`}
                onClick={() => setShowSearch(!showSearch)}
              >
                <FaRegObjectGroup />
              </button>
            </div>

            <div className="search-box">
              <IoIosSearch />
              <input
                type="text"
                placeholder="Search company..."
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* GROUPING */}
        <div className={`slide-container ${showSearch ? "show" : "hide"}`}>
          <Search onSubmit={handleGroupSubmit} initialChecked={groupByStatus} />
        </div>

        {/* CONTENT */}
        {loading && <Loading />}

        {!loading && (
          <>
            {groupByStatus && <h3 className="group-title">Active</h3>}
            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {activeCompanies.map((item) => renderCompanyCard(item, "active"))}
            </div>

            {groupByStatus && (
              <>
                <h3 className="group-title inactive">Inactive</h3>
                <div className={`card-grid ${listView ? "list" : "tile"}`}>
                  {inactiveCompanies.map((item) =>
                    renderCompanyCard(item, "inactive"),
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* FLOATING ACTION BAR */}
        <FloatingActionBar
          actions={{
            save: { disabled: true },
            search: { disabled: true },
            clear: { disabled: false, onClick: handleClear },
            delete: { disabled: true },
          }}
        />

        <BackToTop />
      </div>
    </>
  );
};

export default BranchList;
