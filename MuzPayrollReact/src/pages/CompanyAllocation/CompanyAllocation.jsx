import { useMemo, useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useLoader } from "../../context/LoaderContext.jsx";
import { ensureMinDuration } from "../../utils/loaderDelay";
import { useSearchParams } from "react-router-dom";

// Components
import { LocationGroupMultiSelect } from "../../components/multiSelectHeader/LocationGroupMultiSelect";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import CompanyAllocationModal from "../../components/CompanyModel/CompanyAllocationModal.jsx";
import { useAuth } from "../../context/AuthProvider";

import { useSidebarPermissions } from "../../hooks/useSidebarPermissions.js";

//service
import { getUserTypesList } from "../../services/usertype.service.js";
import { getUserGroupsList } from "../../services/usergroup.service.js";
import { fetchLocaion } from "../../services/location.service.js";
import {
  getUserSettingsList,
  saveUserSettings,
} from "../../services/userSettings.service.js";

// Utils(Helpers)
import { handleApiError } from "../../utils/errorToastResolver";
import { extractIds } from "../../utils/idFrommultiSelect.js";
import { getFloatingActions } from "../../utils/setActionButtons";

import "./CompanyAllocation.css";
const PAGE_SIZE = 8;
const companies = [
  {
    companyId: 101,
    companyName: "4C GEMS AGENCY",
    groups: [{ id: 1, name: "Admin" }],
    locations: [{ id: 11, name: "Kochi" }],
    enabled: true,
  },
  {
    companyId: 102,
    companyName: "A1 EQUIPMENTS",
    groups: [],
    locations: [],
    enabled: false,
  },
  {
    companyId: 103,
    companyName: "AADHYA CONSTRUCTIONS",
    groups: [{ id: 2, name: "Manager" }],
    locations: [{ id: 12, name: "Trivandrum" }],
    enabled: true,
  },
];
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

  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [companyRows, setCompanyRows] = useState([companies]);
  const [backendPermissions, setBackendPermissions] = useState();

  const [showFilters, setShowFilters] = useState(true); // Toggle the filter component
  const [isSearchApplied, setIsSearchApplied] = useState(false); //  Load the table data

  const [userTypes, setUserTypes] = useState([]);
  const [userGrp, setUserGrp] = useState([]);

  const { user } = useAuth();

  const [searchParams] = useSearchParams();
  const optionid = searchParams.get("opid");

  const { setSidebar } = useSidebarPermissions();

  // const userId = user.userMstId;
  // const companyId = user.userEntityHierarchyId;

  useEffect(() => {
    fetchDropDown();
  }, []);
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

  // console.log("User", user);
  const fetchDropDown = async () => {
    const startTime = Date.now();
    showRailLoader("Loading required data...");
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
  };
  const {
    register,
    // handleSubmit,
    // trigger,
    setError,
    clearErrors,
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

  // const openConfigModal = (row) => {
  //   setActiveUser(row);
  //   setShowConfigModal(true);
  // };

  // const closeConfigModal = () => {
  //   setActiveUser(null);
  //   setShowConfigModal(false);
  // };

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

  const buildFilterPayload = () => ({
    companyId: user.userEntityHierarchyId,
    userCode: getValues("UserCode"),
    userTypeId: extractIds(selectedUserTypes),
    userGrpId: extractIds(bulkGroup),
    locationId: extractIds(selectedLocation),
  });

  const fetchFilteredRows = async () => {
    const startTime = Date.now();
    showRailLoader("Loading required data...");
    try {
      const payload = buildFilterPayload();
      // console.log("payload", payload);

      // Replace with real API
      const res = await getUserSettingsList(payload);
      // console.log("Response", res.data);
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
      // setShowFilters(true);
      // console.log("UDHINBF",res.data[0].id)
      if (res.data.length > 0) setSelectedRowIds(new Set([res.data[0].id]));
      else setShowFilters(true);
    } catch (error) {
      handleApiError(error);
      console.error("Error fetching userTypes or Location:", error);
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }
  };

  const handleApplySearch = async () => {
    if (selectedUserTypes.length === 0) {
      // toast.error("User type is requred");

      setError("userType", {
        type: "manual",
        message: "User type is required",
      });
      return;
    }
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

    // setError("userType", {
    //   type: "manual",
    //   message: "",
    // });
    setSelectedUserTypes([]);
    setSelectedLocation([]);
  };

  const applyBulk = () => {
    if (!bulkGroup.length || !selectedRowIds.size || !location.length) return;

    setRows((prev) =>
      prev.map((row) => {
        if (!selectedRowIds.has(row.id)) return row;

        if (!originalMap.has(row.id)) {
          setOriginalMap((m) => {
            const next = new Map(m);
            next.set(row.id, {
              groups: row.groups,
              entity: row.entity,
            });
            return next;
          });
        }

        return {
          ...row,
          groups: bulkGroup,
          entity: location,
          _dirty: true,
        };
      }),
    );

    setSaveSelection((prev) => {
      const next = new Set(prev);
      selectedRowIds.forEach((id) => next.add(id));
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
    if (!isSearchApplied) fetchDropDown();
    else fetchFilteredRows();
  };
  const handleClear = () => {
    fetchDropDown();
    setValue("businessSolution", null);
    setValue("userGrp", null);
    setValue("UserCode", null);
    clearErrors("userType");
    // Warn but DO NOT block
    if (saveSelection.size) {
      toast("Unsaved changes will be cleared.", {
        icon: "⚠️",
      });
    }

    // Reset search state
    setIsSearchApplied(false);
    setShowFilters(true);

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
    setSelectedUserTypes([]);
    setSelectedLocation([]);
    // Optional: clear undo snapshots
    setOriginalMap(new Map());
  };

  const handleSave = async () => {
    if (!saveSelection.size) return;

    // collect dirty rows
    const dirtyRows = rows.filter((r) => saveSelection.has(r.id));
    // console.log("Dirty row", dirtyRows);
    // build payload
    const payload = dirtyRows.map((r) => ({
      id: r.id,
      groups: r.groups.map((g) => ({
        id: g.id,
        name: g.name,
      })),

      entity: r.entity.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    }));
    const startTime = Date.now();
    showRailLoader("Saving selected records...");
    try {
      // console.log("Saving payload:", payload);

      // API call
      await saveUserSettings(payload, "INSERT");

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
      setSelectedUserTypes([]);
      setSelectedLocation([]);
      setOriginalMap(new Map());
    } catch (error) {
      handleApiError(error);
      console.error("Error saving user settings:", error);
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
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
              <h2>Company Allocation</h2>
              <p>
                Assign user groups and locations for the selected user's
                companies
              </p>
            </div>
            <div className="filter-save">
              {/* <button
                className={`filter-toggle ${showFilters ? "active" : ""}`}
                onClick={() => setShowFilters((s) => !s)}
              >
                <FaFilter />
                <span>Filters</span>
              </button> */}

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

          {/* Table */}

          <div className="card">
            <table className="grid">
              <thead>
                <tr>
                  <th>User Code</th>
                  <th>User Name</th>
                  <th className="group-fixed">Companys</th>
                  {/* <th className="assign-fixed">Assign</th> */}
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {isSearchApplied ? (
                  pageRows.length ? (
                    pageRows.map((r) => (
                      <tr key={r.id} className={r._dirty ? "dirty" : ""}>
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
                          <button
                            className="btn btn-config"
                            onClick={() => {
                              setModalUser(r);
                              setCompanyRows(r.companies || []);
                              setShowModal(true);
                            }}
                          >
                            Configure
                          </button>
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
          {showModal && (
            <CompanyAllocationModal
              user={modalUser}
              companies={companyRows}
              groupOptions={branchOptions}
              locationOptions={LocationOptions}
              onClose={() => setShowModal(false)}
              onSave={(rows) => {
                setRows((prev) =>
                  prev.map((r) =>
                    r.id === modalUser.id ? { ...r, companies: rows } : r,
                  ),
                );

                toast.success("Company allocations updated");

                setShowModal(false);
              }}
            />
          )}
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
            actions={getFloatingActions(
              backendPermissions,
              {
                handleSave: handleSave,
                handleClear,
                handleRefresh,
                // handleSearch,
                // handleNew,
                // handleDelete,
                // handlePrint,
              },
              {
                canSave: !saveSelection.size, // because disabled: canSave
                canSearch: true, // true → disabled
                canClear: false, // false → enabled
                canRefresh: false, // false → enabled
              },
              ["print", "save", "clear", "search", "refresh"],
            )}
          />
        </aside>
      </div>
    </>
  );
}
