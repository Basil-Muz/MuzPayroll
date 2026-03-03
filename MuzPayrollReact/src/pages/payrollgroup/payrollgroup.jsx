import { useState } from "react";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import PayrollGroupSearch from "./payrollgroupsearch";
import PayrollGroupList from "./payrollgrouplist";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

import "./payrollgroup.css";

function PayrollGroup() {
  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState(null);
  const [headerError] = useState([]);

  // Dummy data
const payrollGroups = [
  {
    mstID: 1,
    code: "PG001",
    name: "Monthly Payroll",
    shortName: "MONTHLY",
    description: "Processes salary on a monthly basis.",
    activeDate: "01-01-2024",
    inactiveDate: null,
  },
  {
    mstID: 2,
    code: "PG002",
    name: "Weekly Payroll",
    shortName: "WEEKLY",
    description: "Processes salary every week.",
    activeDate: "01-03-2024",
    inactiveDate: null,
  },
  {
    mstID: 3,
    code: "PG003",
    name: "Minimum Wages",
    shortName: "MINWAGE",
    description: "Payroll group for minimum wage employees.",
    activeDate: "15-02-2024",
    inactiveDate: "31-12-2024",
  },
  {
    mstID: 4,
    code: "PG004",
    name: "Contract Payroll",
    shortName: "CONTRACT",
    description: "Payroll for contract-based employees.",
    activeDate: "01-04-2024",
    inactiveDate: null,
  },
  {
    mstID: 5,
    code: "PG005",
    name: "Executive Payroll",
    shortName: "EXEC",
    description: "Payroll group for executive employees.",
    activeDate: "10-01-2024",
    inactiveDate: "30-09-2024",
  },
];

  /* ================= HANDLERS ================= */

  const handleSearchApply = (searchFilters) => {
    setFilters(searchFilters);
    setShowSearch(false); // close slide search
  };

  const handleClear = () => {
    setFilters(null);
    setSearchText("");
    setShowSearch(true); // go back to search-only screen
  };

  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
  };

  const handleSelect = (item) => {
    console.log("Selected Payroll Group:", item);
  };

  const hasDataView = !showSearch;

  const handleDataToForm = (item) => {
    setSelectedItem(item);
    toggleForm();
  };

  return (
    <>
      <Header backendError={headerError} />

      <div className="payroll-group-page">
        {/* ================= HEADER (ONLY WHEN DATA SHOWN) ================= */}

        {hasDataView && (
          <div className="header-section">
            <h2 className="page-title">Payroll Group</h2>

            <div className="header-actions">
              {/* View Toggle */}
              <div className="view-toggle">
                <button
                  className={`icon-btn ${!listView ? "active" : ""}`}
                  title="Tile View"
                  onClick={() => setListView(false)}
                >
                  <BsGrid3X3GapFill size={18} />
                </button>
                <button
                  className={`icon-btn ${listView ? "active" : ""}`}
                  title="List View"
                  onClick={() => setListView(true)}
                >
                  <FaListUl size={18} />
                </button>

                {/*  SEARCH ICON (NO GROUP ICON) */}
                <button
                  className={`icon-btn ${showSearch ? "active" : ""}`}
                  title="Search"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <IoIosSearch size={18} />
                </button>
              </div>

              {/* Inline Search */}
              <div className="search-box">
                <IoIosSearch size={18} />
                <input
                  type="text"
                  placeholder="Search payroll group…"
                  value={searchText}
                  onChange={handleSearchInput}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SLIDE SEARCH ================= */}
        {showSearch && <PayrollGroupSearch onApply={handleSearchApply} />}

        {/* ================= LIST / TILE VIEW ================= */}
        {!showSearch && (
          <PayrollGroupList
            data={payrollGroups}
            view={listView ? "list" : "tile"}
            searchText={searchText}
            filters={filters}
            onSelect={handleSelect}
            handleDataToForm={handleDataToForm}
          />
        )}
        {/* {showForm && (
          <ListItemForm
            entity="User Group"
            data={selectedItem}
            toggleForm={toggleForm}
            saveEntity={saveUserGroup}
            fetchEntityById={getUserGroupById}
            ENTITY_FIELD_MAP={USER_GROUP_FIELD_MAP}
          />
        )} */}

        {/* ================= FLOATING ACTION BAR (DATA ONLY) ================= */}
        {!showSearch && (
          <FloatingActionBar
            actions={{
              save: {
                onClick: () => console.log("Save Payroll Group"),
                disabled: true,
              },
              // search: {
              //   onClick: () => setShowSearch(true),
              // },
              clear: {
                onClick: handleClear,
              },
              delete: {
                onClick: () => console.log("Delete Payroll Group"),
                disabled: true,
              },
              // print: {
              //   onClick: () => console.log("Print Payroll Group"),
              //   disabled: true,
              // },
              new: {
                onClick: () => console.log("New Payroll Group"),
              },
              refresh: {
                onClick: () => window.location.reload(),
              },
            }}
          />
        )}
      </div>
    </>
  );
}

export default PayrollGroup;
