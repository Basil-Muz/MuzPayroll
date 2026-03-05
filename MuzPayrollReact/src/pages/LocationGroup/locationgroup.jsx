/* ================= REACT ================= */
import React, { useState, useEffect, useCallback } from "react";

/* ================= THIRD PARTY ================= */
import { toast } from "react-hot-toast";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

/* ================= CONTEXT / HOOKS ================= */
import { useAuth } from "../../context/AuthProvider";
import { useLoader } from "../../context/LoaderContext";

/* ================= SERVICES ================= */
import {
  getLocationGroupsList,
  searchLocationGroup,
  saveLocationGroup,
  getLocationGroupById,
} from "../../services/locationGroup.service";

/* ================= UTILS ================= */
import { handleApiError } from "../../utils/errorToastResolver";
import { ensureMinDuration } from "../../utils/loaderDelay";

/* ================= CONSTANTS ================= */
import { LOCATION_GROUP_FIELD_MAP } from "../../constants/locationGroupMap";

/* ================= COMPONENTS ================= */
import Search from "../../components/search/Search";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import { ListCard } from "../../components/List Card/ListCard";
import Header from "../../components/Header/Header";
import ListItemForm from "../../components/ListItemForm/ListItemForm";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";

/* ================= STYLES ================= */
import "./locationgroup.css";

function LocationGroup() {
  const [locationGroupList, setLocationGroupList] = useState([]);

  const [boxView, setBoxView] = useState(true);
  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchData, setSearchdata] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [groupByStatus, setGroupByStatus] = useState(false);
  const [activeLocations, setActiveLocations] = useState([]);
  const [inactiveLocations, setInactiveLocations] = useState([]);
  // const [[], set[]] = useState([]);
  const { showRailLoader, hideLoader } = useLoader();
  const { user } = useAuth();

  const entityId = user.userEntityHierarchyId;

  const getAllLocationGroups = async (loadFirst) => {
    const startTime = Date.now();
    if (loadFirst === true)
      // show loader
      showRailLoader("Retrieving available location groups…");
    try {
      const response = await getLocationGroupsList(entityId, null);
      setLocationGroupList(response.data);
      // console.log("Location Group", response);
    } catch (error) {
      handleApiError(error, { entity: "Location Group" });
    } finally {
      if (loadFirst === true) {
        await ensureMinDuration(startTime, 800);
        hideLoader();
      }
    }
  };

  useEffect(() => {
    getAllLocationGroups(true);
  }, [showForm]);

  const handleNew = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleDataToForm = (item) => {
    setSelectedItem(item);
    toggleForm();
  };

  // const handleSave = () => {
  //   console.log("Save clicked");
  //   // API call / form submit logic
  // };

  // const handleSearch = () => {
  //   console.log("Search clicked");
  // };

  const handleClear = async () => {
    await getAllLocationGroups(true);
    setGroupByStatus(false);
    toast.success("Location groups have been updated.");
  };

  // const handleDelete = () => {
  //   console.log("Delete clicked");
  // };

  const handleSearchChange = (e) => {
    setSearchdata(e.target.value);
  };
  const fetchSearchData = useCallback(async () => {
    if (searchData.trim()) {
      const response = await searchLocationGroup(searchData);
      setLocationGroupList(response.data.content);
    } else {
      const response = await getLocationGroupsList(entityId, true);
      setLocationGroupList(response.data);
    }
  }, [searchData, entityId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchData.trim() !== "") {
        fetchSearchData();
      } else {
        getAllLocationGroups(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchData]);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showForm) {
      setSelectedItem(null);
    }
  };

  /* ================= GROUPING ================= */
  const handleGroupSubmit = async (checked) => {
    setGroupByStatus(checked);
    setShowSearch(false);

    if (!checked) {
      const res = await getLocationGroupsList(entityId, null);
      setLocationGroupList(res.data);
      return;
    }

    const startTime = Date.now();
    // show loader
    showRailLoader("Retrieving available locations…");
    try {
      const [activeRes, inactiveRes] = await Promise.all([
        getLocationGroupsList(entityId, 1),
        getLocationGroupsList(entityId, 0),
      ]);
      // console.log("inActive Locations", inactiveRes);
      setTimeout(() => {
        setActiveLocations(activeRes.data);
        setInactiveLocations(inactiveRes.data);
        // console.log("Active locations", activeLocations);
      }, 800);
    } catch (err) {
      console.error(err);
    } finally {
      await ensureMinDuration(startTime, 800);
      // hide loader ONLY at the end
      hideLoader();
    }
  };

  // const containerStyle = { display: "flex" };

  return (
    <>
      <Header backendError={[]} />
      <div className="locationgroup-page">
        <div className="header-section">
          <h2 className="page-title">Location Group</h2>

          <div className="header-actions">
            <div className="view-toggle">
              <button
                className={`icon-btn ${boxView ? "active" : ""}`}
                title="Tile View"
                onClick={() => {
                  setBoxView(true);
                  setListView(false);
                }}
              >
                <BsGrid3X3GapFill size={18} />
              </button>

              <button
                className={`icon-btn ${listView ? "active" : ""}`}
                title="List View"
                onClick={() => {
                  setListView(true);
                  setBoxView(false);
                }}
              >
                <FaListUl size={18} />
              </button>

              <button
                className={`icon-btn ${showSearch ? "active" : ""}`}
                title="Grouping"
                onClick={() => setShowSearch(!showSearch)}
              >
                <FaRegObjectGroup size={18} />
              </button>
            </div>

            <div className="search-box">
              <IoIosSearch size={18} />
              <input
                type="text"
                placeholder="Search here…"
                value={searchData}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className={`slide-container ${showSearch ? "show" : "hide"}`}>
          <Search onSubmit={handleGroupSubmit} initialChecked={groupByStatus} />
        </div>

        {!groupByStatus &&
          (locationGroupList.length > 0 ? (
            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {locationGroupList.map((item) => (
                <ListCard
                  key={item.mstID}
                  item={item}
                  status={item.inactiveDate ? "inactive" : "active"}
                  handleDataToForm={handleDataToForm}
                />
              ))}
            </div>
          ) : (
            <div className="no-data-found">
              No location groups available yet
            </div>
          ))}
        {groupByStatus && (
          <>
            <h3 className="group-title active">Active</h3>
            {activeLocations && (
              <div className={`card-grid ${listView ? "list" : "tile"}`}>
                {activeLocations.map((item) => (
                  <ListCard
                    key={item.mstID}
                    item={item}
                    status="active"
                    handleDataToForm={handleDataToForm}
                  />
                ))}
              </div>
            )}

            <h3 className="group-title inactive">Inactive</h3>
            {inactiveLocations.length > 0 ? (
              <div className={`card-grid ${listView ? "list" : "tile"}`}>
                {inactiveLocations.map((item) => (
                  <ListCard
                    key={item.mstID}
                    item={item}
                    status="inactive"
                    handleDataToForm={handleDataToForm}
                  />
                ))}
              </div>
            ) : (
              <div className="no-data-found">
                No location groups available yet
              </div>
            )}
          </>
        )}

        <FloatingActionBar
          actions={{
            save: {
              // onClick: handleSave,
              disabled: true,
              // disabled: isViewMode || isSubmitted
            },
            search: {
              // onClick: handleSearch,
              disabled: true,
            },
            clear: {
              onClick: handleClear,
              // disabled:true,
            },
            delete: {
              // onClick: handleDelete,
              // disabled: !hasDeletePermission
              disabled: true,
            },
            new: {
              onClick: handleNew, //to toggle the locationgroup form
            },
          }}
        />

        {showForm && (
          <ListItemForm
            entity="Location Group"
            data={selectedItem}
            toggleForm={toggleForm}
            saveEntity={saveLocationGroup}
            fetchEntityById={getLocationGroupById}
            ENTITY_FIELD_MAP={LOCATION_GROUP_FIELD_MAP}
          />
        )}

        {/* {flag && <Loading />} */}
        <BackToTop />
      </div>
    </>
  );
}

export default LocationGroup;
