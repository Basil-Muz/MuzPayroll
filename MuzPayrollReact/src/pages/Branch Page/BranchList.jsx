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
  fetchAllBranch,
  fetchActiveBranch,
  fetchInactiveBranch,
} from "../../services/branchlist.service";

/* ================= UTILS ================= */
import { ensureMinDuration } from "../../utils/loaderDelay";
import { handleApiError } from "../../utils/errorToastResolver";

/* ================= COMPONENTS ================= */
import Header from "../../components/Header/Header";
import Search from "../../components/search/Search";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import { ListCard } from "../../components/List Card/ListCard";

const BranchList = () => {
  /* ================= STATE ================= */
  const [listView, setListView] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [groupByStatus, setGroupByStatus] = useState(false);

  const [allBranch, setAllBranch] = useState([]);
  const [activeBranch, setActiveBranch] = useState([]);
  const [inactiveBranch, setInactiveBranch] = useState([]);

  // const [loading, setLoading] = useState(false);
  const { showRailLoader, hideLoader } = useLoader();

  const navigate = useNavigate();

  const { user } = useAuth();

  // const token = user.token;

  /* ================= NAVIGATION ================= */
  const handleCardClick = (mstID) => {
    navigate(`/branch/${mstID}`);
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    if (!user?.token) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    loadAllBranch();
  }, []);

  const loadAllBranch = async () => {
    const startTime = Date.now();
    showRailLoader("Retrieving available branch…");
    setGroupByStatus(false);

    try {
      const res = await fetchAllBranch(user.userEntityHierarchyId);
      setTimeout(() => {
        setAllBranch(res);
        setActiveBranch([]);
        setInactiveBranch([]);
        // setLoading(false);
      }, 1000);
    } catch (err) {
      handleApiError(err);
      // setLoading(false);
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
      loadAllBranch();
      return;
    }

    const startTime = Date.now();
    showRailLoader("Retrieving available branch…");
    try {
      const [activeRes, inactiveRes] = await Promise.all([
        fetchActiveBranch(user.userEntityHierarchyId),
        fetchInactiveBranch(user.userEntityHierarchyId),
      ]);

      setTimeout(() => {
        setActiveBranch(activeRes);
        setInactiveBranch(inactiveRes);
        // setLoading(false);
      }, 800);
    } catch (err) {
      handleApiError(err);
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }
  };

  const handleClear = () => {
    loadAllBranch();
  };

  /* ================= UI ================= */
  return (
    <>
      <Header />

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

        {
          <>
            {!groupByStatus && (
              <div className={`card-grid ${listView ? "list" : "tile"}`}>
                {allBranch.map((item) => (
                  <ListCard
                    item={item}
                    status={item.inactiveDate ? "inactive" : "active"}
                    handleDataToForm={handleCardClick}
                  />
                ))}
              </div>
            )}

            {groupByStatus && (
              <>
                <h3 className="group-title active">Active</h3>
                <div className={`card-grid ${listView ? "list" : "tile"}`}>
                  {activeBranch.map(
                    (item) => (
                      <ListCard
                        item={item}
                        status="active"
                        handleDataToForm={handleCardClick}
                      />
                    ),
                    // renderCard(item, "active")
                  )}
                </div>

                <h3 className="group-title inactive">Inactive</h3>
                <div className={`card-grid ${listView ? "list" : "tile"}`}>
                  {inactiveBranch.map(
                    (item) => (
                      <ListCard
                        item={item}
                        status="inactive"
                        handleDataToForm={handleCardClick}
                      />
                    ),
                    // renderCard(item, "inactive")
                  )}
                </div>
              </>
            )}
          </>
        }

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

export default BranchList;
