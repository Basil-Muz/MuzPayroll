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

//service
import { getSolutionList } from "../../services/LocationGroupRightsMapping.service.js";
import { getBranchList } from "../../services/LocationGroupRightsMapping.service.js";
// Utils(Helpers)
import { handleApiError } from "../../utils/errorToastResolver";

// Styles
import "./LocationGroupRightsMapping.css";

/* =========================================
   Main Page
========================================= */
const GROUPS = [
  { id: 1002, name: "ALAPPUZHA" },
  { id: 1003, name: "CALICUT" },
  { id: 1004, name: "ERNAKULAM" },
  { id: 1005, name: "IDUKKI" },
  { id: 1007, name: "KANNUR" },
  { id: 1012, name: "KASARAGOD" },
  { id: 1016, name: "KOCHI" },
  { id: 1022, name: "KOLLAM" },
  { id: 1023, name: "KOTTAYAM" },
  { id: 1042, name: "MALAPPURAM" },
  { id: 1025, name: "PALAKKAD" },
  { id: 1019, name: "PATHANAMTHITTA" },
  { id: 1018, name: "THRISSUR" },
  { id: 1028, name: "TRIVANDRUM" },
  { id: 1027, name: "WAYANAD" },
];

const initData = [
  {
    id: 1,
    businessSolution: { id: 1, name: "Employee portal" },
    branch: {
      id: 1,
      name: "Norms Management Pvt Ltd",
    },
    location: {
      id: "1002",
      name: "ALAPPUZHA",
    },
    group: [{ id: 1027, name: "WAYANAD" }],
    // _original: [],
    _dirty: false,
  },
  // {
  //   id: 7,
  //   businessSolution: { id: 2, name: "Employee portal" },
  //   branch: {
  //     id: 1,
  //     name: "Norms Management Pvt Ltd",
  //   },
  //   location: {
  //     id: "1002",
  //     name: "ALAPPUZHA",
  //   },
  //   group: [{ id: 1027, name: "WAYANAD" }],
  //   // _original: [],
  //   _dirty: false,
  // },
  // {
  //   id: 2,
  //   businessSolution: { id: 2, name: "Employee portal" },
  //   branch: {
  //     id: 1,
  //     name: "Norms Management Pvt Ltd",
  //   },
  //   location: {
  //     id: "103",
  //     name: "CALICUT",
  //   },
  //   group: [
  //     { id: 1022, name: "KOLLAM" },
  //     { id: 1004, name: "ERNAKULAM" },
  //   ],

  //   // _original: [],
  //   _dirty: false,
  // },
  // {
  //   id: 3,
  //   businessSolution: { id: 2, name: "Employee portal" },
  //   branch: {
  //     id: 2,
  //     name: "Norms Tech Solutions",
  //   },
  //   location: {
  //     id: "201",
  //     name: "BANGALORE",
  //   },
  //   group: [{ id: 1003, name: "CALICUT" }],
  //   // _original: [],
  //   _dirty: false,
  // },
  // {
  //   id: 4,
  //   businessSolution: { id: 1, name: "Employee portal" },
  //   branch: {
  //     id: 2,
  //     name: "Norms Tech Solutions",
  //   },
  //   location: {
  //     id: "202",
  //     name: "MYSORE",
  //   },
  //   group: [
  //     { id: 1019, name: "PATHANAMTHITTA" },
  //     { id: 1018, name: "THRISSUR" },
  //   ],
  //   // _original: [],
  //   _dirty: false,
  // },
  // {
  //   id: 10,
  //   businessSolution: { id: 2, name: "Employee portal" },
  //   branch: {
  //     id: 1,
  //     name: "Norms Management Pvt Ltd",
  //   },
  //   location: {
  //     id: "1002",
  //     name: "ALAPPUZHA",
  //   },
  //   group: [{ id: 1027, name: "WAYANAD" }],
  //   // _original: [],
  //   _dirty: false,
  // },
  // {
  //   id: 18,
  //   businessSolution: { id: 1, name: "Employee portal" },
  //   branch: {
  //     id: 1,
  //     name: "Norms Management Pvt Ltd",
  //   },
  //   location: {
  //     id: "1002",
  //     name: "ALAPPUZHA",
  //   },
  //   group: [{ id: 1027, name: "WAYANAD" }],
  //   // _original: [],
  //   _dirty: false,
  // },
  // {
  //   id: 16,

  //   businessSolution: { id: 1, name: "Employee portal" },
  //   branch: {
  //     id: 1,
  //     name: "Norms Management Pvt Ltd",
  //   },
  //   location: {
  //     id: "1002",
  //     name: "ALAPPUZHA",
  //   },
  //   group: [{ id: 1027, name: "WAYANAD" }],
  //   // _original: [],
  //   _dirty: false,
  // },

  // {
  //   id: 12,
  //   businessSolution: { id: 1, name: "Employee portal" },
  //   branch: {
  //     id: 1,
  //     name: "Norms Management Pvt Ltd",
  //   },
  //   location: {
  //     id: "1002",
  //     name: "ALAPPUZHA",
  //   },
  //   group: [{ id: 1027, name: "WAYANAD" }],
  //   // _original: [],
  //   _dirty: false,
  // },
];

const PAGE_SIZE = 8;

export default function LocationGroupRightsMapping() {
  const [rows, setRows] = useState(initData);

  // const [branchFilter, setBranchFilter] = useState("ALL");

  // const [locationQuery, setLocationQuery] = useState("");
  const { showRailLoader, hideLoader } = useLoader();
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [saveSelection, setSaveSelection] = useState(new Set());
  const [originalMap, setOriginalMap] = useState(new Map()); // Capture the first state before edit

  const [bulkGroup, setBulkGroup] = useState([]);

  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [showFilters, setShowFilters] = useState(true); // Toggle the filter component
  const [isSearchApplied, setIsSearchApplied] = useState(false); //  Load the table data

  const [solutions, setSolutions] = useState([]);
  const [branches, setBranches] = useState([]);

  const userId = 3;
  const companyId = 4;

  useEffect(() => {
    fetchDropDown();
  }, []);

  const fetchDropDown = async () => {
    const startTime = Date.now();
    showRailLoader("Fetching details…");
    try {
      const solutions = await getSolutionList();
      setSolutions(solutions.data);

      const branchs = await getBranchList(userId, companyId);
      // const branchdata = Array.isArray(branchs.data)
      //   ? branchs.data
      //   : [branchs.data];
      setBranches(branchs.data);
    } catch (error) {
      console.error("Error fetching solutions:", error);
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }
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
    // getValues,
    watch,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      authorizationDate: new Date().toISOString().split("T")[0],
      authorizationStatus: 0,
      activeStatusYN: 1,
    },
  });
  const branchFilter = watch("branches");
  const locationQuery = watch("location");
  const businessSolution = watch("businessSolution");
  // const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  // const pageRows = useMemo(() => {
  //   const start = (page - 1) * PAGE_SIZE;
  //   return rows.slice(start, start + PAGE_SIZE);
  // }, [rows, page]);

  const solutionOptions = useMemo(
    () =>
      solutions.map((s) => ({
        value: s.somSolutionID,
        label: s.somSolutionName,
      })),
    [solutions],
  );

  const branchOptions = useMemo(() => {
    return [
      { value: "ALL", label: "All branches" },
      ...branches.map((s) => ({
        value: s.entityHierarchyId,
        label: s.entityName,
      })),
    ];
  }, [branches]);
  console.log("branches listaedfwef", branchOptions);
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
    businessSolutionId: businessSolution || null,
    branchId: branchFilter === "ALL" ? null : Number(branchFilter),
    location: locationQuery?.trim() || null,
    page,
    pageSize: PAGE_SIZE,
  });

  const fetchFilteredRows = async () => {
    try {
      const payload = buildFilterPayload();

      // Replace with real API
      // const res = await api.post("/location-group/filter", payload);

      // MOCK (simulate backend pagination)
      const start = (page - 1) * PAGE_SIZE;
      const pagedData = initData.slice(start, start + PAGE_SIZE);

      const res = {
        data: {
          rows: pagedData,
          totalCount: initData.length,
        },
      };

      setRows(res.data.rows);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleApplySearch = async () => {
    const isValid = await trigger();
    if (!isValid) return;

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
    setSelectedRowIds(new Set(filteredRows.map((r) => r.id)));
  };

  const clearSelection = () => {
    setSelectedRowIds(new Set());
    setBulkGroup([]);
  };

  const applyBulk = () => {
    if (!bulkGroup.length || !selectedRowIds.size) return;

    setRows((prev) =>
      prev.map((row) => {
        if (!selectedRowIds.has(row.id)) return row;

        // capture original ONLY once
        if (!row._dirty) {
          setOriginalMap((m) => {
            const next = new Map(m);
            next.set(row.id, [...row.group]); // defensive copy
            return next;
          });
        }

        return {
          ...row,
          group: bulkGroup,
          _dirty: true,
        };
      }),
    );

    // mark rows as pending save
    setSaveSelection((prev) => {
      const next = new Set(prev);
      selectedRowIds.forEach((id) => next.add(id));
      return next;
    });
    // toast.success("Location groups updated. Previous groups were replaced.");
    toast.success("Location groups changed to the new selection.");
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
    setValue("branches", null);
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
      initData.map((r) => ({
        ...r,
        group: [...r.group],
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

    // build payload
    const payload = dirtyRows.map((r) => ({
      branchId: r.branch.id,
      locationId: r.location.id,
      groupIds: r.group.map((g) => g.id),
    }));

    try {
      console.log("Saving payload:", payload);

      // API call
      // await saveLocationGroupMapping(payload);

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
      <div className="lgr-layout">
        <div className="lgr-main">
          {/* Header */}
          <Header backendError={[]} />
          <div className="lgr-header">
            <div>
              <h2>Location and Group Permissions</h2>
              <p>Assign and manage location groups across branches</p>
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
              <div>
                <Controller
                  name="businessSolution"
                  control={control}
                  rules={{ required: "Business solution is required" }}
                  render={({ field }) => (
                    <Select
                      options={solutionOptions}
                      placeholder="Select business solution"
                      isSearchable={false}
                      isDisabled={isSearchApplied}
                      classNamePrefix="form-control-select"
                      className={`
  ${errors.businessSolution ? "error" : ""}
  ${isSearchApplied ? "read-only" : ""}
`}
                      value={
                        solutionOptions.find(
                          (opt) => opt.value === field.value,
                        ) || null
                      }
                      onChange={(option) => field.onChange(option?.value)}
                    />
                  )}
                />
                {errors.businessSolution && (
                  <span className="error-message">
                    {errors.businessSolution.message}
                  </span>
                )}
              </div>

              <div className="filter-item">
                <Controller
                  name="branches"
                  control={control}
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <Select
                      isDisabled={isSearchApplied}
                      classNamePrefix="form-control-select"
                      className={`
        ${errors.branches ? "error" : ""}
        ${isSearchApplied ? "read-only" : ""}
      `}
                      options={branchOptions}
                      /* 🔥 IMPORTANT FIX */
                      value={
                        branchOptions.find(
                          (opt) => opt.value === field.value,
                        ) || null
                      }
                      onChange={(option) => field.onChange(option?.value)}
                    />
                  )}
                />

                {errors.branches && (
                  <span className="error-message">
                    {errors.branches.message}
                  </span>
                )}
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
                  options={GROUPS}
                  value={bulkGroup}
                  onChange={setBulkGroup}
                  placeholder="Assign location groups"
                />
                <button
                  className="btn btn-apply"
                  disabled={!bulkGroup.length}
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
                  <th>Branch</th>
                  <th>Location</th>
                  <th className="group-fixed">Location Groups</th>
                  <th className="assign-fixed">Assign</th>
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
                        <td>{r.branch.name}</td>
                        <td>{r.location.name}</td>
                        <td className="muted">
                          {r.group.length
                            ? r.group.map((g) => g.name).join(", ")
                            : "Not assigned"}
                        </td>
                        <td>
                          <LocationGroupMultiSelect
                            options={GROUPS}
                            value={r.group}
                            onChange={(value) => {
                              setSelectedRowIds((p) => new Set(p).add(r.id));

                              setRows((prev) =>
                                prev.map((row) => {
                                  if (row.id !== r.id) return row;

                                  if (!row._dirty) {
                                    setOriginalMap((m) => {
                                      const next = new Map(m);
                                      next.set(r.id, row.group);
                                      return next;
                                    });
                                  }

                                  return {
                                    ...row,
                                    group: value,
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
                                        group:
                                          originalMap.get(r.id) ?? row.group,
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
                      <td colSpan={6} className="no-table-data">
                        No mapping details found for selected criteria
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan={6} className="no-table-data">
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
