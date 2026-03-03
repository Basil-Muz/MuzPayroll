import { useState } from "react";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import ShiftGroupSearch from "./shiftgroupsearch";
import ShiftGroupList from "./shiftgrouplist";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import Loading from "../../components/Loaders/Loading";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import "./shiftgroup.css";
import ListItemForm from "../../components/ListItemForm/ListItemForm";

import {
  saveShiftGroup,
  getShiftGroupById,
} from "../../services/shiftgroup.service";

import { SHIFT_GROUP_FIELD_MAP } from "../../constants/shiftGroupMap";

function ShiftGroup() {
  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleForm = () => setShowForm((prev) => !prev);

  /* ================= DUMMY DATA ================= */
  const ShiftGroups = [
    {
      mstID: 1,
      code: "SG001",
      name: "Morning Shift",
      shortName: "MORN",
      timeFrom: "09:00",
      timeTo: "17:00",
      activeDate: "10-01-2024",
    },
     {
      mstID: 2,
      code: "SG002",
      name: "Night Shift",
      shortName: "NIGHT",
      timeFrom: "21:00",
      timeTo: "05:00",
      activeDate: "10-02-2024",
    },
  ];

  /* ================= HANDLERS ================= */

  const handleDataToForm = (mstID) => {
    setSelectedItem(mstID);
    setShowForm(true);
  };

  const handleNew = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleSearchApply = (searchFilters) => {
    setFilters(searchFilters);
    setShowSearch(false);
  };

  const handleClear = () => {
    setFilters(null);
    setSearchText("");
    setShowSearch(true);
  };

  const handleSearchInput = (e) => setSearchText(e.target.value);

  const hasDataView = !showSearch;

  return (
    <>
      <Header />

      <div className="shift-group-page">

        {/* HEADER */}
        {hasDataView && (
          <div className="header-section">
            <h2 className="page-title">Shift Group</h2>

            <div className="header-actions">
              <div className="view-toggle">
                <button
                  className={`icon-btn ${!listView ? "active" : ""}`}
                  onClick={() => setListView(false)}
                >
                  <BsGrid3X3GapFill size={18} />
                </button>

                <button
                  className={`icon-btn ${listView ? "active" : ""}`}
                  onClick={() => setListView(true)}
                >
                  <FaListUl size={18} />
                </button>

                <button
                  className={`icon-btn ${showSearch ? "active" : ""}`}
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <IoIosSearch size={18} />
                </button>
              </div>

              <div className="search-box">
                <IoIosSearch size={18} />
                <input
                  type="text"
                  placeholder="Search here…"
                  value={searchText}
                  onChange={handleSearchInput}
                />
              </div>
            </div>
          </div>
        )}

        {/* SEARCH PANEL */}
        {showSearch && <ShiftGroupSearch onApply={handleSearchApply} />}

        {/* LIST */}
        {!showSearch && (
          <ShiftGroupList
            data={ShiftGroups}
            view={listView ? "list" : "tile"}
            searchText={searchText}
            handleDataToForm={handleDataToForm}
          />
        )}

   

        {/* FLOATING BAR */}
        {!showSearch && (
          <FloatingActionBar
            actions={{
              clear: { onClick: handleClear },
              new: { onClick: handleNew },
              refresh: { onClick: () => window.location.reload() },
            }}
          />
        )}

        {loading && <Loading />}
             {/* FORM */}
        {showForm && (
          <ListItemForm
            entity="Shift Group"
            data={selectedItem}
            toggleForm={toggleForm}
            saveEntity={saveShiftGroup}
            fetchEntityById={getShiftGroupById}
            ENTITY_FIELD_MAP={SHIFT_GROUP_FIELD_MAP}
          />
        )}
        <BackToTop />
      </div>
    </>
  );
}

export default ShiftGroup;