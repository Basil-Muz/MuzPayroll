import React, { useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import StatusSearch from "./StatusSearch";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import Loading from "../../components/Loading/Loading";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./StatusUpdate.css";

const StatusUpdate = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [statusType, setStatusType] = useState("Active");
  const searchRef = useRef(null);
  const datePickerRef = useRef(null);

  /* ===== APPLY SEARCH RESULT ===== */
  const handleApply = (data, status) => {
    console.log("Status received from StatusSearch:", status);
    setStatusType(status || "Active"); // safety fallback

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
          ? { ...row, inactiveDate: value, dateError: false }
          : row,
      ),
    );
  };

  /* ===== SINGLE SAVE CHECK ===== */
  const handleSaveCheck = (code) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.code === code ? { ...row, saveChecked: !row.saveChecked } : row,
      ),
    );
  };

  /* ===== SELECT ALL ===== */
  const isAllSelected =
    tableData.length > 0 && tableData.every((row) => row.saveChecked);

  const handleSelectAll = (checked) => {
    setTableData((prev) =>
      prev.map((row) => ({ ...row, saveChecked: checked })),
    );
  };

  /* ===== SAVE ===== */
  const handleSave = async () => {
    let hasError = false;

    const validated = tableData.map((row) => {
      if (
        statusType === "Active" &&
        row.saveChecked &&
        (!row.inactiveDate || row.inactiveDate.trim() === "")
      ) {
        hasError = true;
        return { ...row, dateError: true };
      }
      return { ...row, dateError: false };
    });

    setTableData(validated);
    if (hasError) return;

    const payload = validated.filter((row) => row.saveChecked);
    if (payload.length === 0) return;

    setLoading(true);
    try {
      await axios.post(
        statusType === "Active"
          ? "http://localhost:8087/company/saveActive"
          : "http://localhost:8087/company/saveInactive",
        payload,
      );

      alert("Saved successfully");
      handleClear();
    } catch (err) {
      console.error("Save error", err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===== CLEAR ===== */
  const handleClear = () => {
    setLoading(true);
    setIsOpen(true);
    setTableData([]);
    searchRef.current?.clearSearch();
    setTimeout(() => setLoading(false), 500);
  };

  /* ===== REFRESH ===== */
  const handleRefresh = () => {
    setLoading(true);
    searchRef.current?.refreshSearch();
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <>
      <Header />
      {loading && <Loading />}

      <div className="statusupdate-page">
        {/* HEADER */}
        <div className="head-main-section">
          <h2 className="page-title">Status Update</h2>
          <button
            className={`button-icon ${isOpen ? "active" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <IoIosSearch />
          </button>
        </div>

        {/* SEARCH */}
        <StatusSearch
          ref={searchRef}
          isOpen={isOpen}
          onApply={handleApply}
          hasData={tableData.length > 0}
        />

        {/* TABLE */}
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

                    {/* INACTIVE DATE */}
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

                    {/* SAVE CHECKBOX */}
                    <td>
                      <input
                        type="checkbox"
                        checked={item.saveChecked}
                        // disabled={statusType === "Active" && !item.inactiveDate}
                        onChange={() => handleSaveCheck(item.code)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ACTION BAR */}
        <FloatingActionBar
          actions={{
            clear: { onClick: handleClear },
            refresh: { onClick: handleRefresh },
            save: {
              onClick: handleSave,
              disabled: !tableData.some((row) => row.saveChecked),
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
