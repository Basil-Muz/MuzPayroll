import React from "react";
import { useState, useEffect, useCallback } from "react";
import "./locationgroup.css";

import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import Search from "../../components/search/Search";
import LocationGroupForm from "./locationgroupform";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import Loading from "../../components/Loaders/Loading";
import Header from "../../components/Header/Header";
import ListItemForm from "../../components/ListItemForm/ListItemForm";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";

import { toast } from "react-hot-toast";

import { AuthProvider } from "../../context/AuthProvider";
import { useAuth } from "../../context/AuthProvider";
import { useLoader } from "../../context/LoaderContext";

import { handleApiError } from "../../utils/errorToastResolver";
import { ensureMinDuration } from "../../utils/loaderDelay";

import { LOCATION_GROUP_FIELD_MAP } from "../../constants/locationGroupMap";

import {
  getLocationGroupsList,
  searchLocationGroup,
  saveLocationGroup,
  getLocationGroupById,
} from "../../services/locationGroup.service";

function LocationGroup() {
  const [locationGroupList, setLocationGroupList] = useState([]);

  const [boxView, setBoxView] = useState(true);
  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchData, setSearchdata] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const [headerError, setHeaderError] = useState([]);
  const { showRailLoader, hideLoader } = useLoader();
  const { user } = useAuth();
  console.log("Entutirjgfdg", user);

  const entityId = user.userEntityHierarchyId;

  const getAllLocationGroups = async (loadFirst) => {
    const startTime = Date.now();
    if (loadFirst === true)
      // show loader
      showRailLoader("Retrieving available location groups…");
    try {
      const response = await getLocationGroupsList(entityId, true);
      setLocationGroupList(response.data);
      console.log("Location Group", response);
    } catch (error) {
      handleApiError(error, { entity: "Location Group" });
    } finally {
      if (loadFirst === true) {
        await ensureMinDuration(startTime, 700);
        hideLoader();
      }
    }
  };

  useEffect(() => {
    getAllLocationGroups();
  }, [showForm]);

  const handleNew = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleDataToForm = (item) => {
    setSelectedItem(item);
    toggleForm();
  };

  const handleSave = () => {
    console.log("Save clicked");
    // API call / form submit logic
  };

  const handleSearch = () => {
    console.log("Search clicked");
  };

  const handleClear = async () => {
    await getAllLocationGroups();
    toast.success("Location groups have been updated.");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  // const handlePrint = () => {
  //     console.log("Print clicked");
  // };

  // const handleNewPage = () => {
  //     console.log("New page clicked");
  // };

  // const handleFlagChange = (newFlag) => {
  //     setFlag(newFlag);  // update parent state
  //     setTimeout(() => {
  //         setFlag(false); // reset flag after 2 seconds
  //     }, 1000);
  // };
  const handleSearchChange = (e) => {
    setSearchdata(e.target.value);
  };
  const searchdata = useCallback(async () => {
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
        searchdata();
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
  const containerStyle = { display: "flex" };

  //   const hanbleSearchChange = (item) => {
  //     setSelectedItem(item);
  //     toggleForm();
  //   };

  return (
    <>
      <Header backendError={headerError} />
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
          <Search />
        </div>

        <div className={`card-grid ${listView ? "list" : "tile"}`}>
          {locationGroupList.map((item) => (
            <div className="advance-card" key={item.code}>
              <div className="card-header">
                <span
                  className="code"
                  onClick={() => handleDataToForm(item.mstID)}
                >
                  {item.code}
                </span>

                <div className="status">
                  <TiTick className="check-icon" />
                  <span className="date">{item.activeDate}</span>
                </div>
              </div>

              <div
                className="card-title"
                style={listView ? containerStyle : null}
                onClick={() => handleDataToForm(item.mstID)}
              >
                {item.name}
              </div>

              <div
                className="card-shortname"
                style={listView ? containerStyle : null}
              >
                {item.shortName}
              </div>

              <div
                className="card-description"
                style={listView ? containerStyle : null}
              >
                {item.description}
              </div>
            </div>
          ))}
        </div>

        {/* <Main toggleForm={toggleForm} onFlagChange={handleFlagChange}/> */}
        <FloatingActionBar
          actions={{
            save: {
              onClick: handleSave,
              disabled: true,
              // disabled: isViewMode || isSubmitted
            },
            search: {
              onClick: handleSearch,
              disabled: true,
            },
            clear: {
              onClick: handleClear,
              // disabled:true,
            },
            delete: {
              onClick: handleDelete,
              // disabled: !hasDeletePermission
              disabled: true,
            },
            // print: {
            //     onClick: handlePrint,
            //     // disabled: isNewRecord
            //     disabled: true,
            // },
            new: {
              onClick: handleNew, //to toggle the locationgroup form
            },
            // refresh: {
            //   onClick: () => window.location.reload(),  // Refresh the page
            // },
          }}
        />

        {/* {showForm && selectedItem && loading && <Loading />}
        {showForm && !loading && selectedItem && (
          <LocationGroupForm data={selectedItem} toggleForm={toggleForm} />
        )}
        {showForm && !selectedItem && (
          <LocationGroupForm data={selectedItem} toggleForm={toggleForm} />
        )} */}

        {showForm && (
          <ListItemForm
            entity="User Group"
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
