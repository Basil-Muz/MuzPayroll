/* ================= REACT ================= */
import React, { useState, useEffect, useCallback } from "react";

/* ================= THIRD PARTY ================= */
import { toast } from "react-hot-toast";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
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
import { getFloatingActions } from "../../utils/setActionButtons";
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

import { useSidebarPermissions } from "../../hooks/useSidebarPermissions";

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

  const [backendPermissions, setBackendPermissions] = useState();

  // const [[], set[]] = useState([]);

  const { showRailLoader, hideLoader } = useLoader();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const optionid = searchParams.get("opid");

  const { setSidebar } = useSidebarPermissions();

  const entityId = user.userEntityHierarchyId;

  const userId = user?.userId;

  const saveLocationGroupWrapper = async (dataObj, mode) => {
    const newFormData = new FormData();
    const today = new Date().toISOString().split("T")[0];

    const getValue = (obj, key) => {
      if (obj instanceof FormData) return obj.get(key);
      return obj[key];
    };

    // ===== GET USER =====
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const finalUserId =
      storedUser?.userId ||
      storedUser?.userMstId ||
      user?.userId ||
      user?.userMstId;

    if (!finalUserId) {
      console.error("User ID missing!", { user, storedUser });
      toast.error("User not found. Please login again.");
      return;
    }

    const id = dataObj instanceof FormData ? dataObj.get("id") : dataObj?.id;

    // ===== MAIN FIELDS =====
    newFormData.append("ermCode", getValue(dataObj, "ermCode"));
    newFormData.append("ermName", getValue(dataObj, "ermName"));
    newFormData.append("ermShortName", getValue(dataObj, "ermShortName"));
    newFormData.append("ermDesc", getValue(dataObj, "ermDesc"));
    newFormData.append(
      "ermEntityRightsGroupID",
      getValue(dataObj, "ermEntityRightsGroupID"),
    );

    newFormData.append("ermActiveYN", true);
    newFormData.append("authorizationStatus", false);

    newFormData.append("userId", finalUserId);

    newFormData.append(
      "entityHierarchyInfoID",
      storedUser?.userEntityHierarchyId || user?.userEntityHierarchyId,
    );

    newFormData.append("activeDate", today);
    newFormData.append("withaffectdate", today);
    newFormData.append("authorizationDate", today);

    // ===== CHILD DTO =====
    newFormData.append("entityRightsGrpLogDTOs[0].userId", finalUserId);
    newFormData.append("entityRightsGrpLogDTOs[0].activeDate", today);
    newFormData.append("entityRightsGrpLogDTOs[0].authorizationDate", today);
    newFormData.append("entityRightsGrpLogDTOs[0].authorizationStatus", false);

    // ===== UPDATE CASE =====
    if (id) {
      newFormData.append("ermEntityRightsGroupID", id);

      // 🔥 VERY IMPORTANT: pass log ID if exists
      const logId =
        dataObj?.entityRightsGrpLogDTOs?.[0]?.entityRightsGrpLogID ||
        dataObj?.entityRightsGrpLogDTOs?.[0]?.id;

      if (logId) {
        newFormData.append(
          "entityRightsGrpLogDTOs[0].entityRightsGrpLogID",
          logId,
        );
      }
    }

    // ===== DEBUG =====
    console.log("AUTH USER:", user);
    console.log("STORED USER:", storedUser);
    console.log("FINAL USER ID:", finalUserId);

    console.log("FINAL PAYLOAD:");
    for (let pair of newFormData.entries()) {
      console.log(pair[0], pair[1]);
    }

    return await saveLocationGroup(newFormData, mode);
  };
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
  // useEffect(() => {
  //   getAllLocationGroups(true);
  // }, []);

  const handleNew = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleDataToForm = async (item) => {
    console.log("Clicked Item:", item);

    const today = new Date().toISOString().split("T")[0];

    let fullData = {};

    if (typeof item === "number") {
      try {
        const res = await getLocationGroupById(item);
        fullData = res.data;
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
        return;
      }
    } else {
      fullData = item;
    }

    setSelectedItem({
      ...fullData,

      id: fullData.ermEntityRightsGroupID || fullData.id || item,

      userId: user?.userMstId || user?.userId,
      entityRightsGrpLogDTOs: fullData.entityRightsGrpLogDTOs || [],

      [LOCATION_GROUP_FIELD_MAP.code]: fullData.ermCode || fullData.code,

      [LOCATION_GROUP_FIELD_MAP.name]: fullData.ermName || fullData.name,

      [LOCATION_GROUP_FIELD_MAP.shortName]:
        fullData.ermShortName || fullData.shortName,

      [LOCATION_GROUP_FIELD_MAP.description]:
        fullData.ermDesc || fullData.description,

      authorizationDate: fullData.authorizationDate || today,
    });

    setShowForm(true);
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
      handleApiError(err);
      console.error(err);
    } finally {
      await ensureMinDuration(startTime, 800);
      // hide loader ONLY at the end
      hideLoader();
    }
  };
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

  useEffect(() => {
    getAllLocationGroups(true);
  }, [showForm]);
  
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
                >
                  <div>{item.description}</div>
                </ListCard>
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
                  >
                    <div>{item.description}</div>
                  </ListCard>
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
                  >
                    <div>{item.description}</div>
                  </ListCard>
                ))}
              </div>
            ) : (
              <div className="no-data-found">
                No location groups available yet
              </div>
            )}
          </>
        )}

        {/* <FloatingActionBar
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
              canNew: false, //  add is disable by backed
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
            entity="Location Group"
            data={selectedItem}
            toggleForm={toggleForm}
            saveEntity={async (formData, mode) => {
              const res = await saveLocationGroupWrapper(formData, mode);

              if (res?.data?.success) {
                await getAllLocationGroups(false);
              }

              return res;
            }}
            fetchEntityById={getLocationGroupById}
            ENTITY_FIELD_MAP={LOCATION_GROUP_FIELD_MAP}
          >
            {({ register, errors, isVarified }) => (
              <div className="main-model-content">
                {/* Group Code */}
                <div className="full-content">
                  <div className="form-row">
                    <label className="form-label required">Group Code</label>

                    <input
                      type="text"
                      className={`form-control ${
                        errors[LOCATION_GROUP_FIELD_MAP.code] ? "error" : ""
                      } ${isVarified ? "read-only" : ""}`}
                      placeholder="Enter Group Code"
                      disabled={isVarified}
                      {...register(LOCATION_GROUP_FIELD_MAP.code, {
                        required: "Group Code is required",
                      })}
                    />

                    {errors[LOCATION_GROUP_FIELD_MAP.code] && (
                      <span className="error-message">
                        {errors[LOCATION_GROUP_FIELD_MAP.code].message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Group Name */}
                <div className="full-content">
                  <div className="form-row">
                    <label className="form-label required">Group Name</label>

                    <input
                      type="text"
                      className={`form-control ${
                        errors[LOCATION_GROUP_FIELD_MAP.name] ? "error" : ""
                      } ${isVarified ? "read-only" : ""}`}
                      placeholder="Enter Group Name"
                      disabled={isVarified}
                      {...register(LOCATION_GROUP_FIELD_MAP.name, {
                        required: "Group Name is required",
                      })}
                    />

                    {errors[LOCATION_GROUP_FIELD_MAP.name] && (
                      <span className="error-message">
                        {errors[LOCATION_GROUP_FIELD_MAP.name].message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Short Name */}
                <div className="full-content">
                  <div className="form-row">
                    <label className="form-label required">Short Name</label>

                    <input
                      type="text"
                      className={`form-control ${
                        errors[LOCATION_GROUP_FIELD_MAP.shortName]
                          ? "error"
                          : ""
                      } ${isVarified ? "read-only" : ""}`}
                      placeholder="Enter Short Name"
                      disabled={isVarified}
                      {...register(LOCATION_GROUP_FIELD_MAP.shortName, {
                        required: "Short Name is required",
                      })}
                    />

                    {errors[LOCATION_GROUP_FIELD_MAP.shortName] && (
                      <span className="error-message">
                        {errors[LOCATION_GROUP_FIELD_MAP.shortName].message}
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
                        errors[LOCATION_GROUP_FIELD_MAP.description]
                          ? "error"
                          : ""
                      } ${isVarified ? "read-only" : ""}`}
                      placeholder="Enter Description"
                      disabled={isVarified}
                      {...register(LOCATION_GROUP_FIELD_MAP.description)}
                    />

                    {errors[LOCATION_GROUP_FIELD_MAP.description] && (
                      <span className="error-message">
                        {errors[LOCATION_GROUP_FIELD_MAP.description].message}
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

export default LocationGroup;
