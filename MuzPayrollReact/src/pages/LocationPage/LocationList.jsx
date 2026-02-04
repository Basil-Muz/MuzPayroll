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
import Loading from "../../components/Loaders/Loading";
import { useLoader } from "../../context/LoaderContext";
import { ensureMinDuration } from "../../utils/loaderDelay";
const LocationList = () => {
  /* ================= STATE ================= */
  const [listView, setListView] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [groupByStatus, setGroupByStatus] = useState(false);

  const [allLocation, setAllLocation] = useState([]);
  const [activeLocation, setActiveLocation] = useState([]);
  const [inactiveLocation, setInactiveLocation] = useState([]);

  const [loading, setLoading] = useState(false);
  const { showRailLoader, hideLoader } = useLoader();

  const [headerError] = useState([]);

  const navigate = useNavigate();

  const UserData = localStorage.getItem("loginData");
  const userObj = JSON.parse(UserData);

  //Convert the JSON string to objects
  const branchId = userObj.branchId;
  const token = userObj.token;

  /* ================= API ================= */

  const fetchAllLocation = () =>
    axios.get(`http://localhost:8087/location/locationlist/${branchId}`);

  const fetchActiveLocation = () =>
    axios.get(`http://localhost:8087/location/activelocationlist/${branchId}`);

  const fetchInactiveLocation = () =>
    axios.get(
      `http://localhost:8087/location/inactivelocationlist/${branchId}`,
    );

  /* ================= NAVIGATION ================= */
  const handleCardClick = (mstID) => {
    navigate(`/location/${mstID}`);
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (!userObj?.token) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    loadAllLocation();
  }, []);

  const loadAllLocation = async () => {
    const startTime = Date.now();
    showRailLoader("Retrieving available location…");
    setGroupByStatus(false);

    try {
      const res = await fetchAllLocation();
      setTimeout(() => {
        setAllLocation(res.data);
        setActiveLocation([]);
        setInactiveLocation([]);
      }, 800);
    } catch (err) {
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }
  };

  /* ================= GROUPING ================= */
  const handleGroupSubmit = async (checked) => {
    setGroupByStatus(checked);
    setShowSearch(false);

    if (!checked) {
      loadAllLocation();
      return;
    }

    const startTime = Date.now();
    showRailLoader("Retrieving available location…");
    try {
      const [activeRes, inactiveRes] = await Promise.all([
        fetchActiveLocation(),
        fetchInactiveLocation(),
      ]);

      setTimeout(() => {
        setActiveLocation(activeRes.data);
        setInactiveLocation(inactiveRes.data);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error(err);
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }
  };

  const handleClear = () => {
    loadAllLocation();
  };
  /* ================= CARD ================= */
  const renderCard = (item, status) => (
    <div
      key={item.code}
      className={`advance-card ${status}`}
      onClick={() => handleCardClick(item.mstID)}
    >
      {/* HEADER */}
      <div className="card-header">
        <span className="code">{item.code}</span>

        {status === "inactive" ? (
          <div className="status-stack">
            <div className="status-item active">
              <TiTick />
              <span>{item.activeDate}</span>
            </div>
            <div className="status-item inactive">
              <RxCross2 />
              <span>{item.inactiveDate}</span>
            </div>
          </div>
        ) : (
          <div className="status-item active">
            <TiTick />
            <span>{item.activeDate}</span>
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="card-title">{item.name}</div>
      <div className="card-shortname">{item.shortName}</div>
    </div>
  );
  /* ================= UI ================= */
  return (
    <>
      <Header />

      <div className="designation-page">
        {/* HEADER */}
        <div className="header-section">
          <h2 className="page-title">Location List</h2>

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
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
                placeholder="Search branch..."
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
            {!groupByStatus && (
              <div className={`card-grid ${listView ? "list" : "tile"}`}>
                {allLocation.map((item) =>
                  renderCard(item, item.inactiveDate ? "inactive" : "active"),
                )}
              </div>
            )}

            {groupByStatus && (
              <>
                <h3 className="group-title">Active</h3>
                <div className={`card-grid ${listView ? "list" : "tile"}`}>
                  {activeLocation.map((item) => renderCard(item, "active"))}
                </div>

                <h3 className="group-title inactive">Inactive</h3>
                <div className={`card-grid ${listView ? "list" : "tile"}`}>
                  {inactiveLocation.map((item) => renderCard(item, "inactive"))}
                </div>
              </>
            )}
          </>
        )}

        <FloatingActionBar
          actions={{
            clear: { onClick: handleClear },
            save: { disabled: true },
            delete: { disabled: true },
            search: { disabled: true },
          }}
        />

        <BackToTop />
      </div>
    </>
  );
};

export default LocationList;
