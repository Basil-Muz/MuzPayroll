import { useMemo, useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";

import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";

import { useLoader } from "../../context/LoaderContext.jsx";
import { useAuth } from "../../context/AuthProvider";
import { useSidebarPermissions } from "../../hooks/useSidebarPermissions";

import {
  getCompanyList,
  getInitDataList,
  saveLicenseAgreementData,
} from "../../services/licenseAgreement.service.js";

import { handleApiError } from "../../utils/errorToastResolver";
import { ensureMinDuration } from "../../utils/loaderDelay";
import { getFloatingActions } from "../../utils/setActionButtons";

import { useSearchParams } from "react-router-dom";

import "./LicenseAgreement.css";

export default function LicenseAgreement() {
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [company, setCompany] = useState([]);
  const [saveSelection, setSaveSelection] = useState(new Set());

  const [showFilters, setShowFilters] = useState(true);
  const [isSearchApplied, setIsSearchApplied] = useState(false);

  const { showRailLoader, hideLoader } = useLoader();
  const { user } = useAuth();

  const userId = user.userMstId;

  const [searchParams] = useSearchParams();
  const optionid = searchParams.get("opid");

  const [backendPermissions, setBackendPermissions] = useState();

  const { setSidebar } = useSidebarPermissions();

  /* ---------------------------
     React Hook Form
  --------------------------- */

  const {
    trigger,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const companyFilter = watch("company");

  /* ---------------------------
     Load Initial Dropdowns
  --------------------------- */

  useEffect(() => {
    loadInitialDropdowns();
  }, []);

  const loadInitialDropdowns = async () => {
    const startTime = Date.now();
    showRailLoader("Fetching companies...");

    try {
      const companyRes = await getCompanyList(userId);
      setCompany(companyRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      await ensureMinDuration(startTime, 1000);
      hideLoader();
    }
  };

  /* ---------------------------
     Company Dropdown
  --------------------------- */

  const companyOptions = useMemo(() => {
    return company.map((c) => ({
      value: c.entityHierarchyId,
      label: c.entityName,
    }));
  }, [company]);

  /* ---------------------------
     Fetch License Data
  --------------------------- */

  const fetchLicenseAgreementData = async () => {
    const startTime = Date.now();
    showRailLoader("Loading license agreement...");

    try {
      const res = await getInitDataList(companyFilter);
      const data = res.data[0];

      const transformedRows = [
        {
          id: "branch",
          parameter: "No. of Branches",
          value: data.licBranchs ?? 0,
          entityId: data.licEntityHierarchyID,
        },

        {
          id: "locations",
          parameter: "No. of Locations",
          value: data.licLocations ?? 0,
          entityId: data.licEntityHierarchyID,
        },

        {
          id: "users",
          parameter: "No. of Active Users",
          value: data.licUsers ?? 0,
          entityId: data.licEntityHierarchyID,
        },
      ];

      setRows(transformedRows);
      setOriginalRows(transformedRows);
    } catch (err) {
      handleApiError(err);
    } finally {
      await ensureMinDuration(startTime, 800);
      hideLoader();
    }
  };

  /* ---------------------------
     Detect Value Change
  --------------------------- */

  const handleValueChange = (id, newValue) => {
    const updatedRows = rows.map((row) =>
      row.id === id
        ? { ...row, value: newValue === "" ? "" : Number(newValue) }
        : row,
    );

    setRows(updatedRows);

    const changed = updatedRows.some((row) => {
      const original = originalRows.find((r) => r.id === row.id);

      const currentValue = row.value === "" ? 0 : row.value;

      return original?.value !== currentValue;
    });

    setSaveSelection(changed ? new Set([1]) : new Set());
  };

  const handleBlur = (id) => {
    setRows((prev) => {
      const updated = prev.map((row) => {
        if (row.id !== id) return row;

        if (row.value === "" || row.value === null) {
          return { ...row, value: 0 };
        }

        return row;
      });

      const changed = updated.some((row) => {
        const original = originalRows.find((r) => r.id === row.id);
        const currentValue = row.value === "" ? 0 : row.value;
        return original?.value !== currentValue;
      });

      setSaveSelection(changed ? new Set([1]) : new Set());

      return updated;
    });
  };

  const handleFocus = (id) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        if (row.value === 0) {
          return { ...row, value: "" };
        }

        return row;
      }),
    );
  };

  /* ---------------------------
     Apply Search
  --------------------------- */

  const handleApplySearch = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    setIsSearchApplied(true);
    setShowFilters(false);

    await fetchLicenseAgreementData();
  };

  /* ---------------------------
     Save Data
  --------------------------- */

  const handleSave = async () => {
    try {
      const payload = new FormData();

      let entityId = null;

      rows.forEach((r) => {
        if (!entityId) entityId = r.entityId;

        const val = r.value === "" ? 0 : r.value;

        if (r.id === "branch") payload.append("licBranchs", val);
        if (r.id === "locations") payload.append("licLocations", val);
        if (r.id === "users") payload.append("licUsers", val);
      });

      payload.append("licEntityHierarchyID", entityId);

      await saveLicenseAgreementData(payload);

      toast.success("Saved successfully");

      setOriginalRows(rows);
      setSaveSelection(new Set());
    } catch (err) {
      handleApiError(err);
    }
  };

  /* ---------------------------
     Clear Page
  --------------------------- */

  const handleClear = () => {
    loadInitialDropdowns();

    setValue("company", null);

    setRows([]);
    setOriginalRows([]);

    setIsSearchApplied(false);
    setShowFilters(true);

    setSaveSelection(new Set());
  };

  /* ---------------------------
     Refresh
  --------------------------- */

  const handleRefresh = () => {
    if (isSearchApplied) {
      fetchLicenseAgreementData();
    } else {
      loadInitialDropdowns();
    }
  };

  /* ---------------------------
     Sidebar Permissions
  --------------------------- */

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

  /* ---------------------------
     UI
  --------------------------- */

  return (
    <div className="lgr-layout">
      <div className="lgr-main">
        <Header backendError={[]} />

        {/* Header */}

        <div className="lgr-header">
          <h2>License Agreement</h2>

          <button
            className={`filter-toggle ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters((s) => !s)}
          >
            <FaFilter /> Filters
          </button>
        </div>

        {/* Filters */}

        {showFilters && (
          <div className="lgr-filters">
            <div className="filter-item">
              <Controller
                name="company"
                control={control}
                rules={{ required: "Company is required" }}
                render={({ field }) => (
                  <Select
                    options={companyOptions}
                    classNamePrefix="form-control-select"
                    isDisabled={isSearchApplied}
                    value={
                      companyOptions.find((opt) => opt.value === field.value) ||
                      null
                    }
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />

              {errors.company && (
                <span className="error-message">{errors.company.message}</span>
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

        {/* Table */}

        <div className="card">
          <table className="grid">
            <thead>
              <tr>
                <th>No.</th>
                <th>Resource</th>
                <th>Value</th>
              </tr>
            </thead>

            <tbody>
              {isSearchApplied ? (
                rows.map((r, index) => (
                  <tr key={r.id}>
                    <td>{index + 1}</td>

                    <td>{r.parameter}</td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={r.value}
                        min="0"
                        onFocus={() => handleFocus(r.id)}
                        onChange={(e) =>
                          handleValueChange(r.id, e.target.value)
                        }
                        onBlur={() => handleBlur(r.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="no-table-data">
                    Select filters and click Apply
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Buttons */}

      <aside className="lgr-actions">
        <FloatingActionBar
          actions={getFloatingActions(
            backendPermissions,
            {
              handleSave,
              handleClear,
            },
            {
              canSave: saveSelection.size === 0,
              canSearch: true,
              canClear: false,
              canRefresh: true,
            },
            ["print", "save", "clear", "search"],
          )}
        />
      </aside>
    </div>
  );
}
