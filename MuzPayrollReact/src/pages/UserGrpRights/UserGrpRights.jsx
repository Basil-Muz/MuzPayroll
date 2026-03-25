import { useMemo, useState, useEffect } from "react";
import { FaFilter, FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { useLoader } from "../../context/LoaderContext.jsx";

import { getFloatingActions } from "../../utils/setActionButtons";
import { ensureMinDuration } from "../../utils/loaderDelay";

// Components
import { LocationGroupMultiSelect } from "../../components/multiSelectHeader/LocationGroupMultiSelect";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import { useSidebarPermissions } from "../../hooks/useSidebarPermissions";
//service
import { getSolutionList } from "../../services/LocationGroupRightsMapping.service.js";
import { getUserGroupsList } from "../../services/usergroup.service.js";
import {
  getUserGrpRightsList,
  saveUserGrpRights,
} from "../../services/userGrpRights.service.js";

import { useAuth } from "../../context/AuthProvider.jsx";

// Utils(Helpers)
import { handleApiError } from "../../utils/errorToastResolver";
import {
  OPTION_TYPE_MAP,
  PERMISSION_PRESETS_USER,
} from "../../constants/permissionPresets.js";

const MODULES_PER_PAGE = 3;

export default function LocationGroupRights() {
  const { showRailLoader, hideLoader } = useLoader();
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  // const [bulkGroup, setBulkGroup] = useState([]);
  const [modules, setModules] = useState([]);
  const [originalModules, setOriginalModules] = useState([]);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const [isSearchApplied, setIsSearchApplied] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const [userGrpRights, setUserGrpRights] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [backendPermissions, setBackendPermissions] = useState();
  // New state for UX improvements
  const [moduleSearch, setModuleSearch] = useState({});
  const [collapsedModules, setCollapsedModules] = useState({});

  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const optionid = searchParams.get("opid");

  const { setSidebar } = useSidebarPermissions();
  // console.log("User",user)
  // const companyId = 4;

  // Track changed screens count
  const [changedScreensCount, setChangedScreensCount] = useState(0);

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

  // Calculate changed screens whenever modules change
  useEffect(() => {
    if (!originalModules.length || !modules.length) {
      setChangedScreensCount(0);
      return;
    }

    let changed = 0;
    modules.forEach((module) => {
      module.screens.forEach((screen) => {
        const originalScreen = originalModules
          .find((m) => m.id === module.id)
          ?.screens.find(
            (s) => s.ugrUserGroupRightID === screen.ugrUserGroupRightID,
          );

        if (
          originalScreen &&
          (screen.ugrView !== originalScreen.ugrView ||
            screen.ugrAdd !== originalScreen.ugrAdd ||
            screen.ugrEdit !== originalScreen.ugrEdit ||
            screen.ugrDelete !== originalScreen.ugrDelete ||
            screen.ugrPrint !== originalScreen.ugrPrint)
        ) {
          changed++;
        }
      });
    });
    setChangedScreensCount(changed);
  }, [modules, originalModules]);

  const fetchDropDown = async () => {
    const startTime = Date.now();
    showRailLoader("Loading group details...");
    try {
      const solutions = await getSolutionList();
      setSolutions(solutions.data);

      const userGroup = await getUserGroupsList(
        user.userEntityHierarchyId,
        true,
      );
      //   console.log("User",user)
      setUserGrpRights(userGroup.data);
    } catch (error) {
      console.error("Error fetching solutions:", error);
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }
  };

  const {
    // register,
    trigger,
    setValue,
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

  const locationGrpRights = watch("userGrpRights");
  const businessSolution = watch("businessSolution");

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
      ...userGrpRights.map((s) => ({
        value: s.mstID,
        label: s.name,
      })),
    ];
  }, [userGrpRights]);

  const groupByModule = (data) => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.moduleName]) {
        acc[item.moduleName] = {
          id: item.moduleName,
          name: item.moduleName.toUpperCase(),
          screens: [],
        };
      }

      const mappedItem = {
        ...item,
        optionType: OPTION_TYPE_MAP[item.optionType] || item.optionType,
      };

      acc[item.moduleName].screens.push(mappedItem);

      return acc;
    }, {});

    return Object.values(grouped);
  };

  const handlePermissionChange = (moduleId, screenId, permission, value) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id !== moduleId) return module;

        return {
          ...module,
          screens: module.screens.map((screen) => {
            if (screen.ugrUserGroupRightID !== screenId) return screen;

            const updated = { ...screen };

            if (permission === "ugrView" && !value) {
              updated.ugrView = false;
              updated.ugrAdd = false;
              updated.ugrEdit = false;
              updated.ugrDelete = false;
              updated.ugrPrint = false;
            } else {
              updated[permission] = value;
            }

            return updated;
          }),
        };
      }),
    );
    setSelectedPreset(null);
  };
  // console.log("user",user)

  // Toggle entire column permission for a module
  // const toggleColumnPermission = (moduleId, permission, value) => {
  //   setModules((prev) =>
  //     prev.map((module) => {
  //       if (module.id !== moduleId) return module;

  //       return {
  //         ...module,
  //         screens: module.screens.map((screen) => ({
  //           ...screen,
  //           [permission]: value,
  //         })),
  //       };
  //     }),
  //   );
  //   setSelectedPreset(null);
  // };

  // Toggle module collapse
  const toggleModule = (id) => {
    setCollapsedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Get filtered screens based on module search
  const getFilteredScreens = (module) => {
    const searchTerm = moduleSearch[module.id] || "";
    if (!searchTerm) return module.screens;

    return module.screens.filter(
      (screen) =>
        screen.optionCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screen.optionType?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const applyPresetToSelection = () => {
    if (!selectedPreset || !selectedRowIds.size) return;

    const preset = PERMISSION_PRESETS_USER.find((p) => p.id === selectedPreset);
    if (!preset) return;

    setModules((prev) =>
      prev.map((module) => ({
        ...module,
        screens: module.screens.map((screen) => {
          if (selectedRowIds.has(screen.ugrUserGroupRightID)) {
            return {
              ...screen,
              ...preset.permissions,
            };
          }
          return screen;
        }),
      })),
    );

    toast.success(
      `Applied "${preset.name}" preset to ${selectedRowIds.size} screens`,
    );
    setSelectedPreset(null);
  };

  const applyPresetToAll = () => {
    if (!selectedPreset) return;

    const preset = PERMISSION_PRESETS_USER.find((p) => p.id === selectedPreset);
    if (!preset) return;

    setModules((prev) =>
      prev.map((module) => ({
        ...module,
        screens: module.screens.map((screen) => ({
          ...screen,
          ...preset.permissions,
        })),
      })),
    );

    toast.success(`Applied "${preset.name}" preset to all screens`);
    setSelectedPreset(null);
  };

  const fetchFilteredRows = async () => {
    const startTime = Date.now();
    // show loader
    showRailLoader("Loading permissions...");
    try {
      const res = await getUserGrpRightsList(
        businessSolution,
        locationGrpRights,
      );

      const grouped = groupByModule(res.data);
      console.log("DEMO", grouped);
      setModules(grouped);
      setOriginalModules(JSON.parse(JSON.stringify(grouped)));

      // Clear selections when new data loads
      setSelectedRowIds(new Set());
      // setBulkGroup([]);
      setSelectedPreset(null);
      setModuleSearch({});
      const collapseState = {};
      grouped.forEach((module, index) => {
        collapseState[module.id] = index !== 0;
      });

      setCollapsedModules(collapseState);
      //   console.log("DEMO", collapsedModules);
      setPage(1);
      if (res.data.length > 0) setSelectedRowIds(new Set([res.data[0].id]));
    } catch (err) {
      handleApiError(err);
    } finally {
      await ensureMinDuration(startTime, 800);
      // hide loader ONLY at the end
      hideLoader();
    }
  };

  const handleApplySearch = async () => {
    const isValid = await trigger(["businessSolution", "userGrpRights"]);
    if (!isValid) return;

    setIsSearchApplied(true);
    setShowFilters(false);
    setPage(1);
    await fetchFilteredRows();
  };

  // Get all screen IDs from modules for selection
  const allScreenIds = useMemo(() => {
    const ids = [];
    modules.forEach((module) => {
      module.screens.forEach((screen) => {
        ids.push(screen.ugrUserGroupRightID);
      });
    });
    return ids;
  }, [modules]);

  const toggleSet = (id) => {
    setSelectedRowIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const selectAllOnPage = () => {
    const ids = new Set(selectedRowIds);

    paginatedModules.forEach((module) => {
      const isCollapsed = collapsedModules[module.id] === true;

      // skip closed modules
      if (isCollapsed) return;

      const screens = getFilteredScreens(module);

      screens.forEach((screen) => {
        ids.add(screen.ugrUserGroupRightID);
      });
    });

    setSelectedRowIds(ids);
  };
  const selectAllAcrossPages = () => {
    const ids = new Set(selectedRowIds);

    modules.forEach((module) => {
      // const isCollapsed = collapsedModules[module.id] === true;

      // if (isCollapsed) return;

      const screens = getFilteredScreens(module);

      screens.forEach((screen) => {
        ids.add(screen.ugrUserGroupRightID);
      });
    });

    setSelectedRowIds(ids);
  };

  const clearSelection = () => {
    setSelectedRowIds(new Set());
    // setBulkGroup([]);
    setSelectedPreset(null);
  };

  const handleRefresh = () => {
    fetchFilteredRows();
  };

  const handleClear = () => {
    fetchDropDown();
    setValue("businessSolution", null);
    setValue("userGrpRights", null);

    if (changedScreensCount) {
      toast("You have unsaved changes", {
        icon: "⚠️",
      });
    }

    setIsSearchApplied(false);
    setShowFilters(true);
    setModules([]);
    setOriginalModules([]);
    setPage(1);
    setSelectedRowIds(new Set());
    // setBulkGroup([]);
    setChangedScreensCount(0);
    setSelectedPreset(null);
    setModuleSearch({});
    setCollapsedModules({});
  };

  const handleSave = async () => {
    const changed = [];

    modules.forEach((module) => {
      module.screens.forEach((screen) => {
        const originalScreen = originalModules
          .find((m) => m.id === module.id)
          ?.screens.find(
            (s) => s.ugrUserGroupRightID === screen.ugrUserGroupRightID,
          );

        if (
          originalScreen &&
          (screen.ugrView !== originalScreen.ugrView ||
            screen.ugrAdd !== originalScreen.ugrAdd ||
            screen.ugrEdit !== originalScreen.ugrEdit ||
            screen.ugrDelete !== originalScreen.ugrDelete ||
            screen.ugrPrint !== originalScreen.ugrPrint)
        ) {
          changed.push(screen);
        }
      });
    });

    console.log("Changed payload:", changed);
    const startTime = Date.now();
    // show loader
    showRailLoader("Saving permission changes...");
    try {
      await saveUserGrpRights(changed);
      toast.success(`Saved ${changed.length} changes`);
      setChangedScreensCount(0);
    } catch (error) {
      handleApiError(error);
    } finally {
      await ensureMinDuration(startTime, 800);
      // hide loader ONLY at the end
      hideLoader();
    }
  };

  // Get paginated modules based on current page
  const paginatedModules = useMemo(() => {
    const start = (page - 1) * MODULES_PER_PAGE;
    const end = start + MODULES_PER_PAGE;
    return modules.slice(start, end);
  }, [modules, page]);

  // // Calculate total pages based on modules count
  // const totalPages = Math.ceil(modules.length / MODULES_PER_PAGE) || 1;

  // const goToPage = (newPage) => {
  //   setPage(newPage);
  // };

  return (
    <>
      <div className="lgrs-layout">
        <div className="lgrs-main">
          <Header backendError={[]} />

          <div className="lgrs-header">
            <div>
              <h2>User Group Rights</h2>
              <p>Manage screen-level permissions for selected user group</p>
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
                className={`save-indicator ${changedScreensCount ? "active" : ""}`}
                aria-live="polite"
              >
                <span className="dot" />
                {changedScreensCount} screen
                {changedScreensCount !== 1 ? "s" : ""} changed
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="lgrs-filters">
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
                  name="userGrpRights"
                  control={control}
                  rules={{ required: "Location group is required" }}
                  render={({ field }) => (
                    <Select
                      isDisabled={isSearchApplied}
                      classNamePrefix="form-control-select"
                      className={`
                        ${errors.userGrpRights ? "error" : ""}
                        ${isSearchApplied ? "read-only" : ""}
                      `}
                      options={branchOptions}
                      value={
                        branchOptions.find(
                          (opt) => opt.value === field.value,
                        ) || null
                      }
                      onChange={(option) => field.onChange(option?.value)}
                    />
                  )}
                />

                {errors.userGrpRights && (
                  <span className="error-message">
                    {errors.userGrpRights.message}
                  </span>
                )}
              </div>

              <div className="search-actions">
                {!isSearchApplied ? (
                  <button className="btn btn-apply" onClick={handleApplySearch}>
                    Apply
                  </button>
                ) : (
                  <button
                    className="btn btn-change"
                    onClick={() => {
                      if (changedScreensCount) {
                        if (!confirm("You have unsaved changes. Continue?")) {
                          return;
                        }
                      }
                      setIsSearchApplied(false);
                      setShowFilters(true);
                      setSelectedRowIds(new Set());
                      // setBulkGroup([]);
                      setSelectedPreset(null);
                    }}
                  >
                    Change Search
                  </button>
                )}
              </div>
            </div>
          )}

          {selectedRowIds.size > 0 && (
            <div
              className="bulk-bar"
              role="region"
              aria-label="Bulk assignment controls"
              aria-live="polite"
            >
              <div className="bulk-info">
                <strong>{selectedRowIds.size}</strong>
                <span>screens selected for bulk assignment</span>
              </div>

              <div
                className="bulk-actions"
                role="group"
                aria-label="Bulk selection actions"
              >
                <button className="link" onClick={selectAllOnPage}>
                  Select rows in open modules
                </button>

                <button className="link" onClick={selectAllAcrossPages}>
                  Select all ({allScreenIds.length})
                </button>

                <button className="link danger" onClick={clearSelection}>
                  Clear selection
                </button>
              </div>

              <div className="bulk-assign">
                <div className="preset-selector">
                  <Select
                    options={PERMISSION_PRESETS_USER.map((preset) => ({
                      value: preset.id,
                      label: preset.name,
                      description: preset.description,
                    }))}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      menu: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    placeholder="Apply permission preset..."
                    isSearchable={false}
                    value={
                      selectedPreset
                        ? {
                            value: selectedPreset,
                            label: PERMISSION_PRESETS_USER.find(
                              (p) => p.id === selectedPreset,
                            )?.name,
                          }
                        : null
                    }
                    onChange={(option) => setSelectedPreset(option?.value)}
                    className="preset-select"
                    classNamePrefix="form-control-select"
                    formatOptionLabel={(option) => (
                      <div className="preset-option">
                        <div className="preset-name">{option.label}</div>
                        <div className="preset-description">
                          {option.description}
                        </div>
                      </div>
                    )}
                  />
                  <button
                    className="btn btn-apply"
                    disabled={!selectedPreset}
                    onClick={applyPresetToSelection}
                  >
                    Apply to Selected
                  </button>
                  <button
                    className="btn btn-apply-outline"
                    disabled={!selectedPreset}
                    onClick={applyPresetToAll}
                  >
                    Apply to All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Module Pagination
          {isSearchApplied && modules.length > 0 && (
            <div className="pager">
              <button
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
                aria-label="Previous page"
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
                <span className="page-info">
                  {" "}
                  (Showing modules {(page - 1) * MODULES_PER_PAGE + 1} -{" "}
                  {Math.min(page * MODULES_PER_PAGE, modules.length)} of{" "}
                  {modules.length})
                </span>
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )} */}

          {isSearchApplied ? (
            modules.length ? (
              paginatedModules.map((module) => {
                const filteredScreens = getFilteredScreens(module);
                const isCollapsed = collapsedModules[module.id];

                return (
                  <div
                    className={`card ${isCollapsed ? "collapsed" : ""}`}
                    key={module.id}
                  >
                    <div
                      className={`module-header ${isCollapsed ? "collapsed" : ""}`}
                      onClick={() => toggleModule(module.id)}
                    >
                      {/* <input
                        type="checkbox"
                        // checked={selectedRowIds.has(screen.ugrUserGroupRightID)}
                        onChange={() => toggleColumnPermission(module.id,screen.ugrUserGroupRightID)}
                      /> */}
                      <h4 className="module-title">
                        {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
                        {module.name}
                        <span className="screen-count">
                          ({filteredScreens.length} of {module.screens.length}{" "}
                          screens)
                        </span>
                      </h4>
                      {!isCollapsed && (
                        <div className="module-toolbar">
                          <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                              type="text"
                              placeholder="Search screens..."
                              value={moduleSearch[module.id] || ""}
                              onChange={(e) =>
                                setModuleSearch((prev) => ({
                                  ...prev,
                                  [module.id]: e.target.value,
                                }))
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                            {moduleSearch[module.id] && (
                              <button
                                className="clear-search"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModuleSearch((prev) => ({
                                    ...prev,
                                    [module.id]: "",
                                  }));
                                }}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {!isCollapsed && (
                      <>
                        {/* Module Toolbar with Search */}

                        {filteredScreens.length > 0 ? (
                          <table className="grid">
                            <thead>
                              <tr>
                                <th>Select</th>
                                <th>Option Type</th>
                                <th>Option Name</th>
                                <th className="permission-header">
                                  View
                                  {/* <input
                                    type="checkbox"
                                    onChange={(e) =>
                                      toggleColumnPermission(
                                        module.id,
                                        "ugrView",
                                        e.target.checked,
                                      )
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  /> */}
                                </th>
                                <th className="permission-header">
                                  Add
                                  {/* <input
                                    type="checkbox"
                                    onChange={(e) =>
                                      toggleColumnPermission(
                                        module.id,
                                        "ugrAdd",
                                        e.target.checked,
                                      )
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  /> */}
                                </th>
                                <th className="permission-header">
                                  Edit
                                  {/* <input
                                    type="checkbox"
                                    onChange={(e) =>
                                      toggleColumnPermission(
                                        module.id,
                                        "ugrEdit",
                                        e.target.checked,
                                      )
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  /> */}
                                </th>
                                <th className="permission-header">
                                  Delete
                                  {/* <input
                                    type="checkbox"
                                    onChange={(e) =>
                                      toggleColumnPermission(
                                        module.id,
                                        "ugrDelete",
                                        e.target.checked,
                                      )
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  /> */}
                                </th>
                                <th className="permission-header">
                                  Print
                                  {/* <input
                                    type="checkbox"
                                    onChange={(e) =>
                                      toggleColumnPermission(
                                        module.id,
                                        "ugrPrint",
                                        e.target.checked,
                                      )
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  /> */}
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {filteredScreens.map((screen) => (
                                <tr key={screen.ugrUserGroupRightID}>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={selectedRowIds.has(
                                        screen.ugrUserGroupRightID,
                                      )}
                                      onChange={() =>
                                        toggleSet(screen.ugrUserGroupRightID)
                                      }
                                    />
                                  </td>

                                  <td>{screen.optionType}</td>
                                  <td className="option-name">
                                    <div className="option-title">
                                      {screen.optionCode}
                                    </div>
                                  </td>
                                  {/* <td>{screen.optionCode}</td> */}

                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={screen.ugrView}
                                      onChange={(e) =>
                                        handlePermissionChange(
                                          module.id,
                                          screen.ugrUserGroupRightID,
                                          "ugrView",
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  </td>

                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={screen.ugrAdd}
                                      onChange={(e) =>
                                        handlePermissionChange(
                                          module.id,
                                          screen.ugrUserGroupRightID,
                                          "ugrAdd",
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  </td>

                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={screen.ugrEdit}
                                      onChange={(e) =>
                                        handlePermissionChange(
                                          module.id,
                                          screen.ugrUserGroupRightID,
                                          "ugrEdit",
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  </td>

                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={screen.ugrDelete}
                                      onChange={(e) =>
                                        handlePermissionChange(
                                          module.id,
                                          screen.ugrUserGroupRightID,
                                          "ugrDelete",
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  </td>

                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={screen.ugrPrint}
                                      onChange={(e) =>
                                        handlePermissionChange(
                                          module.id,
                                          screen.ugrUserGroupRightID,
                                          "ugrPrint",
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="no-search-results">
                            No screens found matching "{moduleSearch[module.id]}
                            "
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="no-table-data">
                No mapping details found for selected criteria
              </div>
            )
          ) : (
            <div className="no-table-data">
              Select filters and click <strong>Apply</strong> to view mappings
            </div>
          )}
        </div>

        <aside className="lgrs-actions">
          <FloatingActionBar
            actions={getFloatingActions(
              backendPermissions,
              {
                handleSave,
                handleClear: handleRefresh,
                handleRefresh,
                // handleSearch,
                handleNew: handleClear,
                // handleDelete,
                // handlePrint,
              },
              {
                canSave: !changedScreensCount, // because disabled: canSave
                canSearch: true, // true → disabled
                canClear: false, // false → enabled
                canRefresh: false, // false → enabled
              },
              ["new", "save", "clear", "search", "refresh"],
            )}
          />
        </aside>
      </div>
    </>
  );
}
