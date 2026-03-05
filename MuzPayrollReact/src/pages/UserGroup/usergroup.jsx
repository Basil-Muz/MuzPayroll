// React & hooks
import React, { useEffect, useState, useCallback } from "react";

// Third-party libraries
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

import { toast } from "react-hot-toast";
// Styles
import "./usergroup.css";

// Shared components
import Search from "../../components/search/Search";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";

// Local components
import ListItemForm from "../../components/ListItemForm/ListItemForm";
import { ListCard } from "../../components/List Card/ListCard";

// Context / hooks
import { useAuth } from "../../context/AuthProvider";
import { useLoader } from "../../context/LoaderContext";

// Utils
import { ensureMinDuration } from "../../utils/loaderDelay";
import { handleApiError } from "../../utils/errorToastResolver";

// Services
import {
  getUserGroupById,
  getUserGroupsList,
  saveUserGroup,
  searchUserGroup,
} from "../../services/usergroup.service";
import { USER_GROUP_FIELD_MAP } from "../../constants/userGroupMap";

function UserGroup() {
  const { showRailLoader, hideLoader } = useLoader(); //Import functions from context

  const [userGroupList, setUserGroupList] = useState([]);

  const [boxView, setBoxView] = useState(true);
  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [groupByStatus, setGroupByStatus] = useState(false);
  const [activeUserGroups, setActiveUserGroups] = useState([]);
  const [inactiveUserGroups, setInactiveUserGroups] = useState([]);
  const [searchData, setSearchdata] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [flag, setFlag] = useState(false); // new state for flag from child

  const { user } = useAuth();

  const entityId = user?.userEntityHierarchyId;

  const getAllUserGroups = async (loadFirst) => {
    const startTime = Date.now();
    if (loadFirst === true) {
      // show loader
      showRailLoader("Retrieving available user groups…");
    }
    try {
      const response = await getUserGroupsList(entityId, true);
      setUserGroupList(response.data);
      console.log("user Group", response);
    } catch (error) {
      handleApiError(error);
    } finally {
      if (loadFirst) {
        await ensureMinDuration(startTime, 700);
        hideLoader();
      }
    }
  };

  const handleClear = async () => {
    await getAllUserGroups(true);
    setGroupByStatus(false);
    toast.success("User groups have been updated.");
  };

  // const handleDelete = () => {
  //   console.log("Delete clicked");
  // };

  // const handlePrint = () => {
  //   console.log("Print clicked");
  // };

  //   const handleFlagChange = (newFlag) => {
  //     setFlag(newFlag); // update parent state
  //     setTimeout(() => {
  //       setFlag(false); // reset flag after 2 seconds
  //     }, 1000);
  //   };
  const handleSearchChange = (e) => {
    setSearchdata(e.target.value);
  };

  const searchdata = useCallback(async () => {
    if (searchData.trim()) {
      const response = await searchUserGroup(searchData);
      setUserGroupList(response.data.content);
    } else {
      const response = await getUserGroupsList(entityId, true);
      setUserGroupList(response.data);
    }
  }, [searchData, entityId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchData.trim() !== "") {
        searchdata();
      } else {
        getAllUserGroups(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchData]);

  useEffect(() => {
    getAllUserGroups(true);
  }, [showForm]);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };
  const handleNew = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleDataToForm = (item) => {
    setSelectedItem(item);
    toggleForm();
  };

  /* ================= GROUPING ================= */
  const handleGroupSubmit = async (checked) => {
    setGroupByStatus(checked);
    setShowSearch(false);

    if (!checked) {
      const res = await getUserGroupsList(entityId, null);
      setUserGroupList(res.data);
      return;
    }

    const startTime = Date.now();
    // show loader
    showRailLoader("Retrieving available locations…");
    try {
      const [activeRes, inactiveRes] = await Promise.all([
        getUserGroupsList(entityId, 1),
        getUserGroupsList(entityId, 0),
      ]);
      // console.log("inActive Locations", inactiveRes);
      setTimeout(() => {
        setActiveUserGroups(activeRes.data);
        setInactiveUserGroups(inactiveRes.data);
        // console.log("Active locations", activeUserGroups);
      }, 800);
    } catch (err) {
      console.error(err);
    } finally {
      await ensureMinDuration(startTime, 800);
      // hide loader ONLY at the end
      hideLoader();
    }
  };

  return (
    <>
      <Header backendError={[]} />
      <div className="usergroup-page">
        <div className="header-section">
          <h2 className="page-title">User Group</h2>

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
                placeholder="Search groups…"
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
          (userGroupList.length > 0 ? (
            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {userGroupList.map((item) => (
                <ListCard
                  key={item.mstID}
                  item={item}
                  status="active"
                  handleDataToForm={handleDataToForm}
                
                />
              ))}
            </div>
          ) : (
            <div className="no-data-found">No usergroups available yet</div>
          ))}
        {groupByStatus && (
          <>
            <h3 className="group-title active">Active</h3>
            {activeUserGroups.length > 0 ? (
              <div className={`card-grid ${listView ? "list" : "tile"}`}>
                {activeUserGroups.map((item) => (
                  <ListCard
                    key={item.mstID}
                    item={item}
                    status="active"
                    handleDataToForm={handleDataToForm}
                  />
                ))}
              </div>
            ) : (
              <div className="no-data-found">No usergroups available</div>
            )}

            <h3 className="group-title inactive">Inactive</h3>
            {inactiveUserGroups.length > 0 ? (
              <div className={`card-grid ${listView ? "list" : "tile"}`}>
                {inactiveUserGroups.map((item) => (
                  <ListCard
                    key={item.mstID}
                    item={item}
                    status="inactive"
                    handleDataToForm={handleDataToForm}
                  />
                ))}
              </div>
            ) : (
              <div className="no-data-found">No usergroups available</div>
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
            // search: {
            //     onClick: handleSearch,
            //     disabled: true,
            // },
            clear: {
              onClick: handleClear,
              // disabled:true,
            },
            delete: {
              // onClick: handleDelete,
              // disabled: !hasDeletePermission
              disabled: true,
            },
            print: {
              // onClick: handlePrint,
              // disabled: isNewRecord
              disabled: true,
            },
            new: {
               onClick: handleNew, //to toggle the usergroup form
            },
            // refresh: {
            //   onClick: () => window.location.reload(),  // Refresh the page
            // },
          }}
        />

        {showForm && (
          <ListItemForm
            entity="User Group"
            data={selectedItem}
            toggleForm={toggleForm}
            saveEntity={saveUserGroup}
            fetchEntityById={getUserGroupById}
            ENTITY_FIELD_MAP={USER_GROUP_FIELD_MAP}
          />
        )}
        {/* {flag && <Loading />} */}
        <BackToTop />
      </div>
    </>
  );
}

export default UserGroup;
