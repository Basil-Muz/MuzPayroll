// React & hooks
import React, { useEffect, useState, useCallback } from "react";

// Third-party libraries
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";

import { toast } from "react-hot-toast";

// Styles
import "./usergroup.css";

// Shared components
import Search from "../../components/search/Search";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";

import { useSidebarPermissions } from "../../hooks/useSidebarPermissions";

// Local components
import ListItemForm from "../../components/ListItemForm/ListItemForm";
import { ListCard } from "../../components/List Card/ListCard";

// Context / hooks
import { useAuth } from "../../context/AuthProvider";
import { useLoader } from "../../context/LoaderContext";

// Utils
import { ensureMinDuration } from "../../utils/loaderDelay";
import { handleApiError } from "../../utils/errorToastResolver";
import { getFloatingActions } from "../../utils/setActionButtons";

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
  // const [showForm, setShowForm] = useState(false);
  const [groupByStatus, setGroupByStatus] = useState(false);
  const [activeUserGroups, setActiveUserGroups] = useState([]);
  const [inactiveUserGroups, setInactiveUserGroups] = useState([]);
  const [searchData, setSearchdata] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [backendPermissions, setBackendPermissions] = useState();

  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const optionid = searchParams.get("opid");
  const entityId = user?.userEntityHierarchyId;

  const { setSidebar } = useSidebarPermissions();

  useEffect(() => {
    setSidebar(
      "OPTION_RIGHTS",
      "",
      user.userMstId,
      user.solutionId,
      optionid,
      user.userEntityHierarchyId,
      setBackendPermissions,
    );
  }, [optionid]);
  // console.log("Backed menu",backendPermissions)
  const getAllUserGroups = async (loadFirst) => {
    const startTime = Date.now();
    if (loadFirst === true) {
      // show loader
      showRailLoader("Retrieving available user groups…");
    }
    try {
      const response = await getUserGroupsList(entityId, true);
      setUserGroupList(response.data);
      // console.log("user Group", response);
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

    // Cleanup to cancel any previous timeout to avoid multiple calls
    return () => clearTimeout(handler);
  }, [searchData, searchdata]);

  useEffect(() => {
    getAllUserGroups(true);
  }, []);

  // const toggleForm = () => {
  //   setShowForm((prev) => !prev);
  // };
  const handleNew = () => {
    setSelectedItem({});
  };
  // const formData = useMemo(() => {
  //   if (!selectedItem) return null;
  //   return { ...selectedItem, id: selectedItem.mstID };
  // }, [selectedItem]);

  const handleSaveUserGroup = async (formData) => {
    const currentUser =
      user || JSON.parse(localStorage.getItem("user") || "{}");

    const today = new Date().toISOString().split("T")[0];

    const sendData = new FormData();

    sendData.append("ugmCode", formData.get("ugmCode"));
    sendData.append("ugmName", formData.get("ugmName"));
    sendData.append("ugmShortName", formData.get("ugmShortName"));
    sendData.append("ugmDesc", formData.get("ugmDesc"));
    sendData.append("userId", currentUser.userMstId);
    sendData.append("userCode", currentUser.userCode);
    sendData.append("entityId", currentUser.userEntityHierarchyId);
    sendData.append("entityMst", currentUser.userEntityHierarchyId);

    sendData.append("activeDate", today);
    sendData.append("withaffectdate", today);
    sendData.append("authorizationDate", today);
    sendData.append("authorizationStatus", false);
    sendData.append("UgmActiveYN", true);

    // IMPORTANT FIX
    const id = formData.get("id");
    if (id) {
      sendData.append("ugmUserGroupID", id); //  REQUIRED FOR UPDATE
    }

    const finalMode = id ? "UPDATE" : "INSERT";

    try {
      const res = await saveUserGroup(sendData, finalMode);

      if (res?.data?.success) {
        const saved = res.data.data;

        if (finalMode === "INSERT") {
          setUserGroupList((prev) => [...prev, saved]);
        } else {
          setUserGroupList((prev) =>
            prev.map((item) => (item.mstID === saved.mstID ? saved : item)),
          );
        }
        await getAllUserGroups(false);

        setSelectedItem(null);

        toast.success(
          finalMode === "INSERT" ? "User Group added" : "User Group updated",
        );
        return res;
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleDataToForm = async (item) => {
    console.log("Clicked Item:", item);

    let fullData = {};

    try {
      if (typeof item === "number") {
        const res = await getUserGroupById(item);
        fullData = res.data;
      } else {
        fullData = item;
      }

      // MAP DATA HERE
      setSelectedItem({
        id: fullData.ugmUserGroupID,

        // IMPORTANT: ADD THIS LINE
        code: fullData.ugmCode, // <-- THIS prevents API recall

        [USER_GROUP_FIELD_MAP.code]: fullData.ugmCode,
        [USER_GROUP_FIELD_MAP.name]: fullData.ugmName,
        [USER_GROUP_FIELD_MAP.shortName]: fullData.ugmShortName,
        [USER_GROUP_FIELD_MAP.description]: fullData.ugmDesc,
        [USER_GROUP_FIELD_MAP.activeDate]: fullData.activeDate,
      })
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    }
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
      handleApiError(err);
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
                >
                  <div>{item.description}</div>
                </ListCard>
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
                  >
                    {" "}
                    <div>{item.description}</div>
                  </ListCard>
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
                  >
                    {" "}
                    <div>{item.description}</div>
                  </ListCard>
                ))}
              </div>
            ) : (
              <div className="no-data-found">No usergroups available</div>
            )}
          </>
        )}

        {/* <FloatingActionBar
          actions={{
            save: {
              // onClick: () => handleSaveUserGroup(selectedItem, "ADD"),
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
        /> */}
        <FloatingActionBar
          actions={getFloatingActions(
            backendPermissions,
            {
              // handleSave,
              handleClear,
              // handleRefresh,
              // handleSearch,
              handleNew: handleNew,
              // handleDelete,
              // handlePrint,
            },
            {
              canNew:false, //  add is disable by backed
              canSave: true, // because disabled: canSave
              // canSearch: true, // true → disabled
              canClear: false, // false → enabled
              // canRefresh: false, // false → enabled
              canDelete: true,
              
            },
            ["new", "save", "clear", "print", "delete"],
          )}
        />
        {showForm && (
          <ListItemForm
            entity="User Group"
            data={selectedItem}
            toggleForm={() => {
              setSelectedItem(null);
            }}
            saveEntity={(data) => handleSaveUserGroup(data)}
            fetchEntityById={getUserGroupById}
            ENTITY_FIELD_MAP={USER_GROUP_FIELD_MAP}
          >
            {({ register, errors, isVarified }) => (
              <div className="main-model-content">
                {/* HIDDEN ID */}
                <input type="hidden" {...register("id")} />


                {/* Group Code */}
                <div className="full-content">
                  <div className="form-row">
                    <label className="form-label required">Group Code</label>

                    <input
                      type="text"
                      className={`form-control ${
                        errors[USER_GROUP_FIELD_MAP.code] ? "error" : ""
                      } ${isVarified ? "read-only" : ""}`}
                      placeholder="Enter Group Code"
                      disabled={isVarified}
                      {...register(USER_GROUP_FIELD_MAP.code, {
                        required: "Group Code is required",
                      })}
                    />

                  <textarea
                    className={`form-control ${
                      errors[USER_GROUP_FIELD_MAP.description] ? "error" : ""
                    } ${isVarified ? "read-only" : ""}`}
                    placeholder="Enter Description"
                    disabled={isVarified}
                    {...register(USER_GROUP_FIELD_MAP.description)}
                  />


                    {errors[USER_GROUP_FIELD_MAP.code] && (
                      <span className="error-message">
                        {errors[USER_GROUP_FIELD_MAP.code].message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Group Name */}
                <div className="full-content">
                  <div className="form-row">
                    <label className="group-form-label required">
                      Group Name
                    </label>

                    <input
                      type="text"
                      className={`form-control ${
                        errors[USER_GROUP_FIELD_MAP.name] ? "error" : ""
                      } ${isVarified ? "read-only" : ""}`}
                      placeholder="Enter Group Name"
                      disabled={isVarified}
                      {...register(USER_GROUP_FIELD_MAP.name, {
                        required: "Group Name is required",
                      })}
                    />

                    {errors[USER_GROUP_FIELD_MAP.name] && (
                      <span className="error-message">
                        {errors[USER_GROUP_FIELD_MAP.name].message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Short Name */}
                <div className="full-content">
                  <div className="form-row">
                    <label className="group-form-label required">
                      Short Name
                    </label>

                    <input
                      type="text"
                      className={`form-control ${
                        errors[USER_GROUP_FIELD_MAP.shortName] ? "error" : ""
                      } ${isVarified ? "read-only" : ""}`}
                      placeholder="Enter Short Name"
                      disabled={isVarified}
                      {...register(USER_GROUP_FIELD_MAP.shortName, {
                        required: "Short Name is required",
                      })}
                    />

                    {errors[USER_GROUP_FIELD_MAP.shortName] && (
                      <span className="error-message">
                        {errors[USER_GROUP_FIELD_MAP.shortName].message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="full-content">
                  <div className="form-row">
                    <label className="group-form-label">Description</label>

                    <textarea
                      className={`form-control ${
                        errors[USER_GROUP_FIELD_MAP.description] ? "error" : ""
                      } ${isVarified ? "read-only" : ""}`}
                      placeholder="Enter Description"
                      disabled={isVarified}
                      {...register(USER_GROUP_FIELD_MAP.description)}
                    />

                    {errors[USER_GROUP_FIELD_MAP.description] && (
                      <span className="error-message">
                        {errors[USER_GROUP_FIELD_MAP.description].message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </ListItemForm>
        )}
        {/* {flag && <Loading />} */}
        <BackToTop />
      </div>
    </>
  );
}

export default UserGroup;
