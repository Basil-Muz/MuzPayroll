import { useState } from "react";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import ShiftGroupSearch from "./shiftgroupsearch";
import ShiftGroupList from "./shiftgrouplist";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import ShiftGroupForm from "./shiftgroupform";
import Loading from "../../components/Loading/Loading";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import "./shiftgroup.css";

function ShiftGroup() {

  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState(null);
  const [headerError] = useState([]);

const [showForm, setShowForm] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [loading, setLoading] = useState(false);
const [flag, setFlag] = useState(false);

const toggleForm = () => {
  setShowForm(prev => !prev);
};


  // Dummy data
  const ShiftGroups = [
    { code: "SG001", name: "Morning Shift" },
    { code: "SG002", name: "Evening Shift" },
    { code: "SG003", name: "Night Shift" } ,
    { code: "SG001", name: "Morning Shift" },
    { code: "SG002", name: "Evening Shift" },
    { code: "SG003", name: "Night Shift" },
     { code: "SG001", name: "Morning Shift" },
    { code: "SG002", name: "Evening Shift" },
    { code: "SG003", name: "Night Shift" },
     { code: "SG001", name: "Morning Shift" },
    { code: "SG002", name: "Evening Shift" },
    { code: "SG003", name: "Night Shift" }
   
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
  setSelectedItem(item);   // pass data to form
  setShowForm(true);       // open modal
};


  const hasDataView = !showSearch; 

  return (
    <>
    
      <Header backendError={headerError} />

      <div className="shift-group-page">
            
              {/* ================= HEADER (ONLY WHEN DATA SHOWN) ================= */}
             
        {hasDataView && (
          <div className="header-section">
           <h2 className="page-title">Shift Group</h2>

            <div className="header-actions">
              {/* View Toggle */}
              <div className="view-toggle">
              <button className={`icon-btn ${!listView ? "active" : ""}`} 
              title="Tile View" onClick={() => setListView(false)}>
                <BsGrid3X3GapFill size={18} />
                </button>
                <button className={`icon-btn ${listView ? "active" : ""}`}
                title="List View" onClick={() => setListView(true)}>
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
                  placeholder="Search here…"
                  value={searchText}
                  onChange={handleSearchInput}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SLIDE SEARCH ================= */}
        {showSearch && (
          <ShiftGroupSearch onApply={handleSearchApply} />
        )}

        {/* ================= LIST / TILE VIEW ================= */}
        {!showSearch && (
          <ShiftGroupList
            data={ShiftGroups}
            view={listView ? "list" : "tile"}
            searchText={searchText}
            filters={filters}
            onSelect={handleSelect}
          />
        )}

        {/* ================= FLOATING ACTION BAR (DATA ONLY) ================= */}
        {!showSearch && (
          <FloatingActionBar
            actions={{
              save: {
                onClick: () => console.log("Save Shift Group"),
                disabled: true,
              },
              // search: {
              //   onClick: () => setShowSearch(true),
              // },
              clear: {
                onClick: handleClear,
              },
              delete: {
                onClick: () => console.log("Delete Shift Group"),
                disabled: true,
              },
              // print: {
              //   onClick: () => console.log("Print Shift Group"),
              //   disabled: true,
              // },
              new: {
                onClick: () => {
                    setSelectedItem(null);
                    setShowForm(true);
                },
              },
              refresh: {
                onClick: () => window.location.reload(),
              },
            }}
          />
          
        )}
{/* ================= SHIFT GROUP FORM ================= */}
{showForm && loading && <Loading />}

{showForm && !loading && (
  <ShiftGroupForm
    data={selectedItem}
    toggleForm={toggleForm}
  />
)}

{flag && <Loading />}

<BackToTop />

      </div>
    </>
  );
}

export default ShiftGroup;
