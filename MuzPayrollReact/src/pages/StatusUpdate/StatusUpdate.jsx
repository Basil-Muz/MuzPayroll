import React, { useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import StatusSearch from "./StatusSearch";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import Loading from "../../components/Loaders/Loading";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLoader } from "../../context/LoaderContext";
import { ensureMinDuration } from "../../utils/loaderDelay";
import "./StatusUpdate.css";

const StatusUpdate = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [statusType, setStatusType] = useState("Active");

  const searchRef = useRef(null);
  const { showRailLoader, hideLoader } = useLoader();

  /* ===== APPLY SEARCH ===== */
  const handleApply = (data, status) => {
    setStatusType(status || "Active");

    const formatted = data.map((row) => ({
      ...row,
      inactiveDate: row.inactiveDate || "",
      saveChecked: false,
      dateError: false,
    }));

    setTableData(formatted);
    setIsOpen(false);
  };

  /* ===== DATE CHANGE ===== */
  const handleDateChange = (code, value) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.code === code
          ? {
              ...row,
              inactiveDate: value,
              saveChecked: value ? true : false,
              dateError: false,
            }
          : row,
      ),
    );
  };

  /* ===== SINGLE CHECK ===== */
  const handleSaveCheck = (code) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.code === code ? { ...row, saveChecked: !row.saveChecked } : row,
      ),
    );
  };

  /* ===== SELECT ALL ===== */
  const isAllSelected =
    tableData.length > 0 &&
    tableData.every(
      (row) => row.saveChecked && (statusType !== "Active" || row.inactiveDate),
    );

  const handleSelectAll = (checked) => {
    setTableData((prev) =>
      prev.map((row) => ({
        ...row,
        saveChecked: checked && (statusType !== "Active" || row.inactiveDate),
      })),
    );
  };

  /* ===== SAVE ===== */
  const handleSave = async () => {
    let hasError = false;

    const validated = tableData.map((row) => {
      if (statusType === "Active" && row.saveChecked && !row.inactiveDate) {
        hasError = true;
        return { ...row, dateError: true };
      }
      return { ...row, dateError: false };
    });

    setTableData(validated);
    if (hasError) return;

    const payload = validated.filter((r) => r.saveChecked);
    if (!payload.length) return;

    const startTime = Date.now();
    showRailLoader("Saving");

    try {
      await axios.post(
        statusType === "Active"
          ? "http://localhost:8087/company/saveActive"
          : "http://localhost:8087/company/saveInactive",
        payload,
      );

      alert("Saved successfully");
      handleClear();
    } catch {
      alert("Save failed");
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }
  };

  /* ===== CLEAR ===== */
  const handleClear = async () => {
    const startTime = Date.now();
    showRailLoader("Clearing");

    setIsOpen(true);
    setTableData([]);
    searchRef.current?.clearSearch();

    await ensureMinDuration(startTime, 600);
    hideLoader();
  };

  /* ===== REFRESH ===== */
  const handleRefresh = async () => {
    const startTime = Date.now();
    showRailLoader("Refresh");
    searchRef.current?.refreshSearch();
    await ensureMinDuration(startTime, 600);
    hideLoader();
  };

  return (
    <>
      <Header />
      <div className="statusupdate-page">
        <div className="head-main-section">
          <h2 className="page-title">Status Update</h2>
          <button
            className={`button-icon ${isOpen ? "active" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <IoIosSearch />
          </button>
        </div>

        <StatusSearch
          ref={searchRef}
          isOpen={isOpen}
          onApply={handleApply}
          hasData={tableData.length > 0}
        />

        {tableData.length > 0 && (
          <div className="statusupdate-table">
            <table>
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
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                </tr>
              </thead>

              <tbody>
                {tableData.map((item, index) => (
                  <tr key={item.code}>
                    <td>{index + 1}</td>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.activeDate}</td>

                    <td>
                      {statusType === "Active" ? (
                        <>
                          <DatePicker
                            selected={
                              item.inactiveDate
                                ? new Date(item.inactiveDate)
                                : null
                            }
                            onChange={(date) =>
                              handleDateChange(
                                item.code,
                                date ? date.toISOString().split("T")[0] : "",
                              )
                            }
                            placeholderText="Select date"
                            dateFormat="dd/MM/yyyy"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            calendarClassName="custom-datepicker"
                            popperClassName="custom-datepicker-popper"
                            customInput={
                              <input
                                className={`form-control datepicker-input ${
                                  item.dateError ? "error" : ""
                                }`}
                              />
                            }
                          />
                          {item.dateError && (
                            <div className="field-error">
                              Inactive date is required
                            </div>
                          )}
                        </>
                      ) : (
                        item.inactiveDate || "-"
                      )}
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={item.saveChecked}
                        onChange={() => handleSaveCheck(item.code)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <FloatingActionBar
          actions={{
            clear: { onClick: handleClear },
            refresh: { onClick: handleRefresh },
            save: {
              onClick: handleSave,
              disabled: !tableData.some((r) => r.saveChecked),
            },
            delete: { disabled: true },
            print: { disabled: true },
          }}
        />
      </div>
    </>
  );
};

export default StatusUpdate;
