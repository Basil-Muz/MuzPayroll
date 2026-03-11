import { useMemo, useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { useLoader } from "../../context/LoaderContext.jsx";
import { ensureMinDuration } from "../../utils/loaderDelay";

// Components
import { LocationGroupMultiSelect } from "../../components/multiSelectHeader/LocationGroupMultiSelect";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import { useAuth } from "../../context/AuthProvider";

//service
import { getUserTypesList } from "../../services/usertype.service.js";
import { getUserGroupsList } from "../../services/usergroup.service.js";
import { fetchLocaion } from "../../services/location.service.js";
import { getUserSettingsList } from "../../services/userSettings.service.js";
// Utils(Helpers)
import { handleApiError } from "../../utils/errorToastResolver";
import { extractIds } from "../../utils/idFrommultiSelect.js";
import "./UserSettings.css";
/* =========================================
   Main Page
========================================= */
const GROUPS = [
  // { id: 1027, name: "WAYANAD" },
  { id: 1026, name: "KANNUR" },
];
// const [] = [
//   {
//     id: 1,
//     businessSolution: { id: 1, name: "Employee portal" },
//     branch: {
//       id: 1,
//       name: "Norms Management Pvt Ltd",
//     },
//     location: {
//       id: "1002",
//       name: "ALAPPUZHA",
//     },
//     group: [{ id: 1027, name: "WAYANAD" }],
//     // _original: [],
//     _dirty: false,
//   },
// ];

const PAGE_SIZE = 8;

export default function UserSettings() {
  const [rows, setRows] = useState([]);

  // const [branchFilter, setBranchFilter] = useState("ALL");

  // const [locationQuery, setLocationQuery] = useState("");
  const { showRailLoader, hideLoader } = useLoader();
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [saveSelection, setSaveSelection] = useState(new Set());
  const [originalMap, setOriginalMap] = useState(new Map()); // Capture the first state before edit
  const [selectedUserTypes, setSelectedUserTypes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [bulkGroup, setBulkGroup] = useState([]);
  const [location, setLocation] = useState([]);
  const [locations, setLocations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [showFilters, setShowFilters] = useState(true); // Toggle the filter component
  const [isSearchApplied, setIsSearchApplied] = useState(false); //  Load the table data

  const [userTypes, setUserTypes] = useState([]);
  const [userGrp, setUserGrp] = useState([]);

  const { user } = useAuth();

  // const userId = user.userMstId;
  // const companyId = user.userEntityHierarchyId;

  useEffect(() => {
    fetchDropDown();
  }, []);
  // console.log("User", user);
  const fetchDropDown = async () => {
    const startTime = Date.now();
    showRailLoader("Fetching details…");
    try {
      const userTypes = await getUserTypesList();
      // console.log("Usertypes", userTypes.data);
      setUserTypes(userTypes.data);

      const userGrp = await getUserGroupsList(user.userEntityHierarchyId, true);
      // console.log("User", user);
      setUserGrp(userGrp.data);
      // User_group=userGrp.data;
      const res = await fetchLocaion(
        user.userMstId,
        user.userEntityHierarchyId,
        user.branchEntityHierarchyId,
      );
      setLocations(res.data);
      // Location = res.data;
      //  console.log("res", res.data);
    } catch (error) {
      handleApiError(error);
      console.error("Error fetching userTypes or Location:", error);
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }

    // try {
    //   // const branchs = await getBranchList(userId, companyId);
    //   // // console.log("userGrp fetched:", branchs);
    //   // setUserGrp(branchs.data);
    // } catch (err) {
    //   console.error("Branch fetch failed:", err);
    // }
  };
  const {
    register,
    // handleSubmit,
    trigger,
    // setError,
    // clearErrors,
    setValue,
    // reset,
    // setFocus,
    getValues,
    // watch,
    // control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      authorizationDate: new Date().toISOString().split("T")[0],
      authorizationStatus: 0,
      activeStatusYN: 1,
    },
  });
  // const branchFilter = watch("userGrp");
  // const locationQuery = watch("location");
  // const businessSolution = watch("businessSolution");
  // const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  // const pageRows = useMemo(() => {
  //   const start = (page - 1) * PAGE_SIZE;
  //   return rows.slice(start, start + PAGE_SIZE);
  // }, [rows, page]);

  //   const userTGrpOptions = useMemo(
  //   () =>
  //     userGrp.map((s) => ({
  //       id: s.ugmUserGroupID,
  //       name: s.utmName,
  //     })),
  //   [userGrp],
  // );

  // console.log("Suer grp",userTGrpOptions);

  const userTypeOptions = useMemo(
    () =>
      userTypes.map((s) => ({
        id: s.ugmUserGroupID,
        name: s.utmName,
      })),
    [userTypes],
  );

  const branchOptions = useMemo(() => {
    return [
      // { value: "ALL", label: "All userGrp" },
      ...userGrp.map((s) => ({
        id: s.mstID,
        name: s.name,
      })),
    ];
  }, [userGrp]);

  const LocationOptions = useMemo(() => {
    return [
      ...locations.map((s) => ({
        id: s.entityHierarchyId,
        name: s.entityName,
      })), 
    ];
  }, [locations]);

  // console.log("userGrp listaedfwef", branchOptions);
  // const filteredRows = useMemo(() => {
  //   if (!isSearchApplied) return [];
  //   trigger();
  //   // console.log("Branch: ", branchFilter);
  //   return rows.filter((r) => {
  //     const branchMatch =
  //       branchFilter === "ALL" || r.branch.id === Number(branchFilter);

  //     const businessMatch =
  //       !businessSolution || r.businessSolution.id === Number(businessSolution);

  //     const locationMatch =
  //       !locationQuery ||
  //       r.location.name.toLowerCase().includes(locationQuery.toLowerCase());

  //     return branchMatch && businessMatch && locationMatch;
  //   });
  // }, [rows, branchFilter, businessSolution, locationQuery, isSearchApplied]);

  const buildFilterPayload = () => ({
    companyId: user.userEntityHierarchyId,
    userCode: getValues("UserCode"),
    userTypeId: extractIds(selectedUserTypes),
    userGrpId: extractIds(bulkGroup),
    locationId: extractIds(selectedLocation),
  });

  const fetchFilteredRows = async () => {
    try {
      // const userTypes = getValues("UserCode");
      // const userTypes = extractIds(bulkGroup);

      const payload = buildFilterPayload();
      // console.log("payload",payload);

      // Replace with real API
      const res = await getUserSettingsList(payload);
      console.log("Response", res.data);
      // setRows(res.data);
      // MOCK (simulate backend pagination)
      const start = (page - 1) * PAGE_SIZE;
      const pagedData = res.data.slice(start, start + PAGE_SIZE);
      const normalizedRows = pagedData.map((r) => ({
        ...r,
        groups: r.groups || [],
        entity: r.entity || [],
        _dirty: false,
      }));

      setRows(normalizedRows);
      const customRes = {
        data: {
          rows: pagedData,
          totalCount: res.data.length,
        },
      };
      setTotalCount(customRes.data.totalCount);
    } catch (err) {
      console.log("ERROR", err);
      handleApiError(err);
    }
  };

  const handleApplySearch = async () => {
    const isValid = await trigger();
    if (!isValid) return;
    // console.log("Usertype",selectedUserTypes)
    setIsSearchApplied(true);
    setShowFilters(false);
    setPage(1); // always reset page

    await fetchFilteredRows();
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const pageRows = useMemo(() => rows, [rows]);

  // useEffect(() => {
  //   setPage(1);
  //   setSelectedRowIds(new Set());
  // }, [branchFilter, locationQuery]);

  const toggleSet = (id) => {
    setSelectedRowIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const selectAllOnPage = () => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      pageRows.forEach((r) => next.add(r.id));
      return next;
    });
  };
  const selectAllAcrossPages = () => {
    setSelectedRowIds(new Set(rows.map((r) => r.id)));
  };

  const clearSelection = () => {
    setSelectedRowIds(new Set());
    setBulkGroup([]);
  };

  const applyBulk = () => {
  if (!bulkGroup.length || !selectedRowIds.size || !location.length) return;

  setRows(prev =>
    prev.map(row => {
      if (!selectedRowIds.has(row.id)) return row;

      if (!originalMap.has(row.id)) {
        setOriginalMap(m => {
          const next = new Map(m);
          next.set(row.id, {
            groups: row.groups,
            entity: row.entity
          });
          return next;
        });
      }

      return {
        ...row,
        groups: bulkGroup,
        entity: location,
        _dirty: true
      };
    })
  );

  setSaveSelection(prev => {
    const next = new Set(prev);
    selectedRowIds.forEach(id => next.add(id));
    return next;
  });

  toast.success("User settings updated for selected rows.");
};

  // const undoRow = (id) => {
  //   setRows((prev) =>
  //     prev.map((r) =>
  //       r.id === id ? { ...r, group: r._original, _dirty: false } : r,
  //     ),
  //   );
  //   setSaveSelection((prev) => {
  //     const n = new Set(prev);
  //     n.delete(id);
  //     return n;
  //   });
  // };
  const handleRefresh = () => {
    fetchDropDown();
  };
  const handleClear = () => {
    fetchDropDown();
    setValue("businessSolution", null);
    setValue("userGrp", null);
    // Warn but DO NOT block
    if (saveSelection.size) {
      toast("You have unsaved changes", {
        icon: "⚠️",
      });
    }

    // Reset search state
    setIsSearchApplied(false);
    setShowFilters(true);

    // Clear search inputs
    // setBusinessSolution("");
    // setBranchFilter("");
    // setLocationQuery("");

    //  RESET SELECT BOX IN TABLE DATA
    setRows(
      rows.map((r) => ({
        ...r,
        groups: [...r.groups],
        entity: [...r.entity],
        _dirty: false,
      })),
    );

    // Reset table-related state
    setPage(1);
    setSelectedRowIds(new Set());
    setSaveSelection(new Set());
    setBulkGroup([]);

    // Optional: clear undo snapshots
    setOriginalMap(new Map());
  };

  const handleSave = async () => {
    if (!saveSelection.size) return;

    // collect dirty rows
    const dirtyRows = rows.filter((r) => saveSelection.has(r.id));
    console.log("Dirty row",dirtyRows)
    // build payload
    const payload = dirtyRows.map((r) => ({
      userId: r.id,
      groupIds: r.groups.map((g) => g.id),
      entityIds: r.entity.map((e) => e.id),
    }));

    try {
      console.log("Saving payload:", payload);

      // API call
      await saveUserSettings(payload);

      // Commit state on success
      setRows((prev) =>
        prev.map((row) =>
          saveSelection.has(row.id)
            ? {
                ...row,
                _dirty: false,
              }
            : row,
        ),
      );

      // cleanup control state
      setSaveSelection(new Set());
      setSelectedRowIds(new Set());
      setBulkGroup([]);
      setOriginalMap(new Map());
    } catch (err) {
      handleApiError(err);
      console.error("Save failed", err);
      // TODO: show toast / banner
    }
  };

  useEffect(() => {
    if (isSearchApplied) {
      fetchFilteredRows();
    }
  }, [page]);

  return (
    <>
      <div className="lgr-layout us">
        <div className="lgr-main">
          {/* Header */}
          <Header backendError={[]} />
          <div className="lgr-header">
            <div>
              <h2>User Settings</h2>
              <p>Manage user group and location assignments for users</p>
            </div>
            <div className="filter-save">
              <button
                className={`filter-toggle ${showFilters ? "active" : ""}`}
                onClick={() => setShowFilters((s) => !s)}
              >
                <FaFilter />
                <span>Filters</span>
              </button>

              <div
                className={`save-indicator ${saveSelection.size ? "active" : ""}`}
                aria-live="polite"
              >
                {/* {saveSelection.size > 0 ? ( */}
                {/* <> */}
                <span className="dot" />
                {saveSelection.size} row{saveSelection.size > 1 ? "s" : ""}{" "}
                changed
                {/* </> */}
                {/* ) : (
                "No pending chnages"
              )} */}
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="lgr-filters">
              <div className="us-filter-item">
                <LocationGroupMultiSelect
                  options={userTypeOptions}
                  value={selectedUserTypes}
                  onChange={setSelectedUserTypes}
                  placeholder="Select User Types"
                  disabled={isSearchApplied}
                />
                {errors.businessSolution && (
                  <span className="error-message">
                    {errors.businessSolution.message}
                  </span>
                )}
              </div>
              <div className="us-filter-item">
                <input
                  type="text"
                  // ref={nameInputRef}
                  className={`form-control ${errors.UserCode ? "error" : ""} ${isSearchApplied ? "read-only" : ""}`}
                  placeholder="Enter User Code"
                  disabled={isSearchApplied}
                  {...register("UserCode", {
                    // required: `User code is required`,
                    pattern: {
                      value: /^[a-zA-Z0-9\s.-]+$/,
                      message:
                        "Only letters, numbers, spaces, dots, and hyphens are allowed",
                    },
                  })}
                />
                {errors.UserCode && (
                  <span className="error-message">
                    {errors.UserCode.message}
                  </span>
                )}
              </div>
              <div className="us-filter-item">
                <LocationGroupMultiSelect
                  options={branchOptions}
                  value={bulkGroup}
                  onChange={setBulkGroup}
                  placeholder="Select User Groups"
                  disabled={isSearchApplied}
                />
              </div>
              <div className="us-filter-item">
                <LocationGroupMultiSelect
                  options={LocationOptions}
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  placeholder="Select Location Groups"
                  disabled={isSearchApplied}
                />
              </div>

              {/* <div>
                <input
                  type="search"
                  disabled={isSearchApplied}
                  className={`form-control input${errors.location ? "error" : ""} ${isSearchApplied ? "read-only" : ""}`}
                  placeholder="Search by location"
                  {...register("location")}
                />
              </div> */}

              <div className="search-actions">
                {!isSearchApplied ? (
                  <button className="btn btn-apply" onClick={handleApplySearch}>
                    Apply
                  </button>
                ) : (
                  <button
                    className="btn btn-change"
                    onClick={() => {
                      if (saveSelection.size) {
                        alert("You have unsaved changes");
                        return;
                      }
                      setIsSearchApplied(false);

                      setSelectedRowIds(new Set());
                      setBulkGroup([]);
                    }}
                  >
                    Change Search
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Bulk Panel */}
          {/* {selectedRowIds.size === 0 && (
            <div className="bulk-hint" role="status" aria-live="polite">
              Select one or more rows to enable bulk actions
            </div>
          )} */}

          {/* ===== Bulk Context Bar ===== */}
          {selectedRowIds.size > 0 && (
            <div
              className="bulk-bar"
              role="region"
              aria-label="Bulk assignment controls"
              aria-live="polite"
            >
              <div className="bulk-info">
                <strong>{selectedRowIds.size}</strong>
                <span>locations selected for bulk assignment</span>
              </div>

              <div
                className="bulk-actions"
                role="group"
                aria-label="Bulk selection actions"
              >
                <button className="link" onClick={selectAllOnPage}>
                  Select all on page
                </button>

                <button className="link" onClick={selectAllAcrossPages}>
                  Select all across pages
                </button>

                <button className="link danger" onClick={clearSelection}>
                  Clear selection
                </button>
              </div>

              <div className="bulk-assign">
                <LocationGroupMultiSelect
                  options={branchOptions}
                  value={bulkGroup}
                  onChange={setBulkGroup}
                  placeholder="Assign User Groups"
                />
                <LocationGroupMultiSelect
                  options={LocationOptions}
                  value={location}
                  onChange={setLocation}
                  placeholder="Assign Location"
                />
                <button
                  className="btn btn-apply"
                  disabled={!bulkGroup.length || !location.length}
                  onClick={applyBulk}
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Table */}

          <div className="card">
            <table className="grid">
              <thead>
                <tr>
                  <th>Set</th>
                  <th>User Code</th>
                  <th>User Name</th>
                  <th>User Group</th>
                  <th className="group-fixed">User Groups</th>
                  <th>Location</th>
                  <th className="group-fixed">Locations</th>
                  {/* <th className="assign-fixed">Assign</th> */}
                  <th>Save</th>
                </tr>
              </thead>

              <tbody>
                {isSearchApplied ? (
                  pageRows.length ? (
                    pageRows.map((r) => (
                      <tr key={r.id} className={r._dirty ? "dirty" : ""}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRowIds.has(r.id)}
                            onChange={() => toggleSet(r.id)}
                          />
                        </td>
                        <td>{r.code}</td>
                        <td>{r.name}</td>
                        <td className="muted">
                          {r.groups.length
                            ? r.groups.map((g) => g.name).join(", ")
                            : "Not assigned"}
                        </td>
                        <td className="multi-select">
                          <LocationGroupMultiSelect
                            options={branchOptions}
                            value={r.groups}
                            placeholder="Assign user groups"
                            onChange={(value) => {
                              setSelectedRowIds((p) => new Set(p).add(r.id));

                              setRows((prev) =>
                                prev.map((row) => {
                                  if (row.id !== r.id) return row;

                                  
                                    setOriginalMap((m) => {
                                      const next = new Map(m);
                                      next.set(r.id, row.groups);
                                      return next;
                                    });
                                  return {
                                    ...row,
                                    groups: value,
                                    _dirty: true,
                                  };
                                }),
                              );

                              setSaveSelection((p) => new Set(p).add(r.id));
                            }}
                            onCancel={() => {
                              setRows((prev) =>
                                prev.map((row) =>
                                  row.id === r.id
                                    ? {
                                        ...row,
                                        groups:
                                          originalMap.get(r.id) ?? row.groups,
                                        _dirty: false,
                                      }
                                    : row,
                                ),
                              );

                              setSaveSelection((prev) => {
                                const next = new Set(prev);
                                next.delete(r.id);
                                return next;
                              });

                              setOriginalMap((m) => {
                                const next = new Map(m);
                                next.delete(r.id);
                                return next;
                              });
                            }}
                          />
                          {/* {r._dirty && (
                        <button className="link" onClick={() => undoRow(r.id)}>
                          Undo
                        </button>
                      )} */}
                        </td>
                        <td className="muted">
                          {r.entity.length
                            ? r.entity.map((g) => g.name).join(", ")
                            : "Not assigned"}
                        </td>
                        <td>
                          <LocationGroupMultiSelect
                            options={LocationOptions}
                            value={r.entity}
                            onChange={(value) => {
                              setSelectedRowIds((p) => new Set(p).add(r.id));

                              setRows((prev) =>
                                prev.map((row) => {
                                  if (row.id !== r.id) return row;

                                  if (!row._dirty) {
                                    setOriginalMap((m) => {
                                      const next = new Map(m);
                                      next.set(r.id, row.entity);
                                      return next;
                                    });
                                  }

                                  return {
                                    ...row,
                                    entity: value,
                                    _dirty: true,
                                  };
                                }),
                              );

                              setSaveSelection((p) => new Set(p).add(r.id));
                            }}
                            onCancel={() => {
                              setRows((prev) =>
                                prev.map((row) =>
                                  row.id === r.id
                                    ? {
                                        ...row,
                                        entity:
                                          originalMap.get(r.id) ?? row.entity,
                                        _dirty: false,
                                      }
                                    : row,
                                ),
                              );

                              setSaveSelection((prev) => {
                                const next = new Set(prev);
                                next.delete(r.id);
                                return next;
                              });

                              setOriginalMap((m) => {
                                const next = new Map(m);
                                next.delete(r.id);
                                return next;
                              });
                            }}
                          />
                          {/* {r._dirty && (
                        <button className="link" onClick={() => undoRow(r.id)}>
                          Undo
                        </button>
                      )} */}
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            disabled={!r._dirty}
                            checked={saveSelection.has(r.id)}
                            readOnly
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="no-table-data">
                        No mapping details found for selected criteria
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan={8} className="no-table-data">
                      Select filters and click <strong>Apply</strong> to view
                      mappings
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pager">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              aria-label="Previous page"
            >
              Prev
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>

        <aside className="lgr-actions">
          <FloatingActionBar
            actions={{
              save: {
                onClick: handleSave,
                disabled: !saveSelection.size,
                // disabled: isViewMode || isSubmitted
              },
              search: {
                //onClick: handleSearch,
                disabled: true,
              },
              clear: {
                onClick: handleClear,
                // disabled:true,
              },
              delete: {
                //onClick: handleDelete,
                // disabled: !hasDeletePermission
                disabled: true,
              },

              // print: {
              //   onClick: handlePrint,
              //   // disabled: isNewRecord
              //   disabled: true,
              // },
              // new: {
              //    onClick: toggleForm, //to toggle the designation form
              // },
              refresh: {
                onClick: handleRefresh,
              },
            }}
          />
        </aside>
      </div>
    </>
  );
}
