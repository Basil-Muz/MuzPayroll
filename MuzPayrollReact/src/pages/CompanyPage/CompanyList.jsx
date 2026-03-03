/* ================= REACT ================= */
import React, { useEffect, useState } from "react";

/* ================= THIRD PARTY ================= */
import { useNavigate } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

/* ================= CONTEXT / HOOKS ================= */
import { useAuth } from "../../context/AuthProvider";
import { useLoader } from "../../context/LoaderContext";

/* ================= SERVICES ================= */
import {
  fetchAllCompanies,
  fetchActiveCompanies,
  fetchInactiveCompanies,
} from "../../services/companylist.service";

/* ================= UTILS ================= */
import { ensureMinDuration } from "../../utils/loaderDelay";

/* ================= COMPONENTS ================= */
import Header from "../../components/Header/Header";
import { ListCard } from "../../components/List Card/ListCard";
import Search from "../../components/search/Search";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";

const CompanyList = () => {
  const [listView, setListView] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [groupByStatus, setGroupByStatus] = useState(false);

  const [allCompanies, setAllCompanies] = useState([]);
  const [activeCompanies, setActiveCompanies] = useState([]);
  const [inactiveCompanies, setInactiveCompanies] = useState([]);

  // const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // const token = user.token;
  const navigate = useNavigate();
  const { showRailLoader, hideLoader } = useLoader(); //Import functions from context

  /* ================= NAVIGATION ================= */
  const handleCardClick = (mstID) => {
    navigate(`/company/${mstID}`);
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (!user?.token) {
      navigate("/");
    }
    loadAllCompanies();
  }, []);

  const loadAllCompanies = async () => {
    const startTime = Date.now();
    // show loader
    showRailLoader("Retrieving available companies…");
    setGroupByStatus(false);

    try {
      const res = await fetchAllCompanies();
      setTimeout(() => {
        setAllCompanies(res);
        setActiveCompanies([]);
        setInactiveCompanies([]);
      }, 800);
    } catch (err) {
      console.error(err);
    } finally {
      await ensureMinDuration(startTime, 1200);
      // hide loader ONLY at the end
      hideLoader();
    }
  };

  /* ================= GROUPING ================= */
  const handleGroupSubmit = async (checked) => {
    setGroupByStatus(checked);
    setShowSearch(false);

    if (!checked) {
      loadAllCompanies();
      return;
    }

    const startTime = Date.now();
    // show loader
    showRailLoader("Retrieving available companies…");
    try {
      const [activeRes, inactiveRes] = await Promise.all([
        fetchActiveCompanies(),
        fetchInactiveCompanies(),
      ]);

      setTimeout(() => {
        setActiveCompanies(activeRes);
        setInactiveCompanies(inactiveRes);
      }, 800);
    } catch (err) {
      console.error(err);
    } finally {
      await ensureMinDuration(startTime, 1200);
      // hide loader ONLY at the end
      hideLoader();
    }
  };
  const handleClear = () => {
    loadAllCompanies();
  };

  /* ================= UI ================= */
  return (
    <>
      <Header />

      <div className="designation-page">
        {/* HEADER */}
        <div className="header-section">
          <h2 className="page-title">Company List</h2>

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
                placeholder="Search company..."
              />
            </div>
          </div>
        </div>

        {/* GROUPING */}
        <div className={`slide-container ${showSearch ? "show" : "hide"}`}>
          <Search onSubmit={handleGroupSubmit} initialChecked={groupByStatus} />
        </div>

        {!groupByStatus &&
          (allCompanies ? (
            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {allCompanies.map((item) => (
                <ListCard
                  key={item.mstID}
                  item={item}
                  status={item.inactiveDate ? "inactive" : "active"}
                  handleDataToForm={handleCardClick}
                />
              ))}
            </div>
          ) : (
            <div className="no-data-found">No company available yet</div>
          ))}

        {groupByStatus && (
          <>
            <h3 className="group-title active">Active</h3>
            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {activeCompanies.map((item) => (
                <ListCard
                  key={item.mstID}
                  item={item}
                  status="active"
                  handleDataToForm={handleCardClick}
                />
              ))}
            </div>

            <h3 className="group-title inactive">Inactive</h3>

            {inactiveCompanies.length !== 0 ? (
              <div className={`card-grid ${listView ? "list" : "tile"}`}>
                {inactiveCompanies.map((item) => (
                  <ListCard
                    key={item.mstID}
                    item={item}
                    status="inactive"
                    handleDataToForm={handleCardClick}
                  />
                ))}
              </div>
            ) : (
              <div className="no-data-found">No company available yet</div>
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

export default CompanyList;
