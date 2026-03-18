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

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatLocalDate } from "../../utils/dateFormater.js";
import {
  getOptionList,
  getInitDataList,
  saveLicenseAgreementData,
} from "../../services/statusupdate.service.js";

import { handleApiError } from "../../utils/errorToastResolver";
import { ensureMinDuration } from "../../utils/loaderDelay";
import { getFloatingActions } from "../../utils/setActionButtons";

import { useSearchParams } from "react-router-dom";

import "./StatusUpdate.css";

export default function StatusUpdate() {
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [screen, setScreen] = useState([]);
  const [saveSelection, setSaveSelection] = useState(new Set());

  const [showFilters, setShowFilters] = useState(true);
  const [isSearchApplied, setIsSearchApplied] = useState(false);

  const { showRailLoader, hideLoader } = useLoader();
  const { user } = useAuth();

  const userId = user.userMstId;

  const [searchParams] = useSearchParams();
  const optionid = searchParams.get("opid");

  const [backendPermissions, setBackendPermissions] = useState();

  const [active, setActive] = useState("true");
  const [selectAll, setSelectAll] = useState(false);

  const { setSidebar } = useSidebarPermissions();

  const {
    trigger,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const screenFilter = watch("screen");

  /* ---------------------------
     Load Initial Dropdowns (Dummy)
  --------------------------- */

  useEffect(() => {
    loadInitialDropdowns();
  }, []);

  const loadInitialDropdowns = async () => {
    const startTime = Date.now();
    showRailLoader("Fetching...");

    try {
      const options = await getOptionList(userId);
      setScreen(options.data);
    } catch (err) {
      console.error(err);
    } finally {
      await ensureMinDuration(startTime, 1000);
      hideLoader();
    }
  };

  const screenOptions = useMemo(() => {
    return screen.map((c) => ({
      value: c.opmOptionID,
      label: c.opmName,
    }));
  }, [screen]);

  /* ---------------------------
     Fetch Data (Dummy)
  --------------------------- */

  const fetchStatusUpdateData = async () => {
    const startTime = Date.now();
    showRailLoader("Loading...");

    try {
      // ✅ Dummy table data
      const transformedRows = [
        {
          id: 1,
          code: "BR001",
          name: "Head Office",
          activeDate: "2024-01-01",
          inactiveDate: "",
        },
        {
          id: 2,
          code: "BR002",
          name: "Kochi Branch",
          activeDate: "2024-02-10",
          inactiveDate: "2024-01-01",
        },
        {
          id: 3,
          code: "BR003",
          name: "Trivandrum Branch",
          activeDate: "2024-03-15",
          inactiveDate: "2024-02-10",
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
     Date Change
  --------------------------- */

  const handleDateChange = (id, field, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row,
    );

    setRows(updatedRows);

    setSaveSelection((prev) => {
      const next = new Set(prev);

      if (value) next.add(id);
      else next.delete(id);

      const allSelected =
        updatedRows.length > 0 && updatedRows.every((r) => next.has(r.id));

      setSelectAll(allSelected);

      return next;
    });
  };
  /* ---------------------------
     Apply SelectAll
  --------------------------- */
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = rows.map((r) => r.id);
      setSaveSelection(new Set(allIds));
      setSelectAll(true);
    } else {
      setSaveSelection(new Set());
      setSelectAll(false);
    }
  };

  /* ---------------------------
     Apply Search
  --------------------------- */

  const handleApplySearch = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    setIsSearchApplied(true);
    setShowFilters(false);

    await fetchStatusUpdateData();
  };

  const handleRowSelect = (id, checked) => {
    setSaveSelection((prev) => {
      const next = new Set(prev);

      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      const allSelected = rows.length > 0 && rows.every((r) => next.has(r.id));

      setSelectAll(allSelected);

      return next;
    });
  };

  /* ---------------------------
     Save
  --------------------------- */

  const handleSave = async () => {
    // ✅ get selected rows
    const selectedRows = rows.filter((r) => saveSelection.has(r.id));

    // ❗ validation: inactiveDate required
    const invalidRows = selectedRows.filter((r) => !r.inactiveDate);

    if (invalidRows.length > 0) {
      toast.error("Please select inactive date for selected rows");
      return;
    }

    // ✅ success
    toast.success("Saved successfully");

    setOriginalRows(rows);
    setSaveSelection(new Set());
    setSelectAll(false);
  };

  /* ---------------------------
     Clear
  --------------------------- */

  const handleClear = () => {
    loadInitialDropdowns();

    setValue("screen", null);

    setRows([]);
    setOriginalRows([]);

    setIsSearchApplied(false);
    setShowFilters(true);

    setSaveSelection(new Set());
  };

    const handleRefresh = () => {
    if (isSearchApplied == true) {
      fetchStatusUpdateData();
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

        <div className="lgr-header">
          <h2>Status Update</h2>

          <button
            className={`filter-toggle ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters((s) => !s)}
          >
            <FaFilter /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="lgr-filters">
            <div className="filter-item">
              <Controller
                name="screen"
                control={control}
                rules={{ required: "Option is required" }}
                render={({ field }) => (
                  <Select
                    options={screenOptions}
                    classNamePrefix="form-control-select"
                    isDisabled={isSearchApplied}
                    value={
                      screenOptions.find((opt) => opt.value === field.value) ||
                      null
                    }
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />

              {errors.screen && (
                <span className="error-message">{errors.screen.message}</span>
              )}
            </div>

            <div className="status-radio">
              <label>
                <input
                  type="radio"
                  name="status"
                  value="true"
                  checked={active === "true"}
                  disabled={isSearchApplied}
                  onChange={(e) => setActive(e.target.value)}
                />
                Active
              </label>

              <label>
                <input
                  type="radio"
                  name="status"
                  value="false"
                  checked={active === "false"}
                  disabled={isSearchApplied}
                  onChange={(e) => setActive(e.target.value)}
                />
                Inactive
              </label>
            </div>

            <div className="search-actions">
              {!isSearchApplied ? (
                <button className="btn btn-apply" onClick={handleApplySearch}>
                  Apply
                </button>
              ) : (
                <button
                  className="btn btn-change"
                  onClick={() => setIsSearchApplied(false)}
                >
                  Change Search
                </button>
              )}
            </div>
          </div>
        )}

        <div className="card">
          <table className="grid">
            <thead>
              <tr>
                <th>No</th>
                <th>Code</th>
                <th>Name</th>
                <th>Active Date</th>
                <th>Inactive Date</th>
                <th>
                  Save
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={!isSearchApplied}
                  />
                </th>
              </tr>
            </thead>

            <tbody>
              {isSearchApplied ? (
                rows.length ? (
                  rows.map((r, index) => (
                    <tr key={r.id}>
                      <td>{index + 1}</td>
                      <td>{r.code}</td>
                      <td>{r.name}</td>
                      <td>
                        <input
                          type="date"
                          className="form-control"
                          value={r.activeDate || ""}
                          disabled
                        />
                      </td>

                      <td>
                        <DatePicker
                          placeholderText="Select date"
                          disabled={
                            !!originalRows.find((o) => o.id === r.id)
                              ?.inactiveDate
                          }
                          className="form-control datepicker-input"
                          selected={
                            r.inactiveDate ? new Date(r.inactiveDate) : null
                          }
                          onChange={(date) =>
                            handleDateChange(
                              r.id,
                              "inactiveDate",
                              date ? formatLocalDate(date) : "",
                            )
                          }
                          dateFormat="dd/MM/yyyy"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          calendarClassName="custom-datepicker"
                          popperClassName="custom-datepicker-popper"
                        />
                      </td>

                      <td>
                        <input
                          type="checkbox"
                          checked={saveSelection.has(r.id)}
                          onChange={(e) =>
                            handleRowSelect(r.id, e.target.checked)
                          }
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="no-table-data">
                      No mapping details found
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={6} className="no-table-data">
                    Select filters and click <strong>Apply</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="lgr-actions">
        <FloatingActionBar
          actions={getFloatingActions(
            backendPermissions,
            {
              handleSave,
              handleClear,
              handleRefresh,
            },
            {
              canSave: saveSelection.size === 0,
              canSearch: true,
              canClear: false,
              canRefresh: false,
            },
            ["print", "save", "clear", "search", "refresh"],
          )}
        />
      </aside>
    </div>
  );
}
