import React, { useState, useEffect } from "react";
import "./designation.css";
import axios from "axios";

import { ListCard } from "../../components/List Card/ListCard";

import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

import Search from "../../components/search/Search";
// import DesignationForm from "./desinationFrom";
import ListItemForm from "../../components/ListItemForm/ListItemForm";
import {
  getDesignationList,
  getDesignationById,
  saveDesignation,
  searchDesignation,
} from "../../services/designation.service";
import { DESIGNATION_FIELD_MAP } from "../../constants/designationMap"; 
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import Loading from "../../components/Loaders/Loading";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";

const Designation = () => {
  const [advanceTypes, setAdvanceTypes] = useState([]);

  const [boxView, setBoxView] = useState(true);
  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [searchData, setSearchdata] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const [loading, setLoading] = useState(false);
  const [headerError] = useState([]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!searchData.trim()) {
      axios
        .get("http://localhost:8087/company/companyList")
        .then((res) => setAdvanceTypes(res.data))
        .catch(console.error);
    }
  }, [searchData]);

  /* ================= ACTION HANDLERS ================= */

  const handleSave = () => {
    console.log("Save clicked");
  };

  const handleSearch = () => {
    console.log("Search clicked");
  };

  const handleClear = () => {
    console.log("Clear clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const handleSearchChange = (e) => {
    setSearchdata(e.target.value);
  };

  /* ================= FORM HANDLING ================= */

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleDataToForm = (mstID) => {
    const selected = advanceTypes.find((item) => item.code === mstID);
    setSelectedItem(selected);
    setShowForm(true);
  };

  const handleNew = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  /* ================= LOADING SIMULATION ================= */

  useEffect(() => {
    if (showForm) {
      setLoading(true);

      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showForm]);

  return (
    <>
      <Header backendError={headerError} />

      <div className="designation-page">
        {/* ================= HEADER ================= */}

        <div className="header-section">
          <h2 className="page-title">Designation</h2>

          <div className="header-actions">
            <div className="view-toggle">
              <button
                className={`icon-btn ${boxView ? "active" : ""}`}
                onClick={() => {
                  setBoxView(true);
                  setListView(false);
                }}
              >
                <BsGrid3X3GapFill size={18} />
              </button>

              <button
                className={`icon-btn ${listView ? "active" : ""}`}
                onClick={() => {
                  setListView(true);
                  setBoxView(false);
                }}
              >
                <FaListUl size={18} />
              </button>

              <button
                className={`icon-btn ${showSearch ? "active" : ""}`}
                onClick={() => setShowSearch(!showSearch)}
              >
                <FaRegObjectGroup size={18} />
              </button>
            </div>

            <div className="search-box">
              <IoIosSearch size={18} />

              <input
                type="text"
                placeholder="Search designation..."
                value={searchData}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        {/* ================= GROUP SEARCH ================= */}

        <div className={`slide-container ${showSearch ? "show" : "hide"}`}>
          <Search />
        </div>

        {/* ================= CARD GRID ================= */}

        <div className={`card-grid ${listView ? "list" : "tile"}`}>
          {advanceTypes.map((item) => (
            <ListCard
              key={item.code}
              item={{
                mstID: item.code,
                code: item.code,
                name: item.name,
                shortName: item.shortName,
                activeDate: item.activeDate,
                inactiveDate: item.inActiveDate,
              }}
              status={item.inActiveDate ? "inactive" : "active"}
              handleDataToForm={handleDataToForm}
            >
              <div className="card-description">{item.description}</div>
            </ListCard>
          ))}
        </div>

        {/* ================= FLOATING BUTTONS ================= */}

        <FloatingActionBar
          actions={{
            save: {
              onClick: handleSave,
              disabled: true,
            },
            search: {
              onClick: handleSearch,
              disabled: true,
            },
            clear: {
              onClick: handleClear,
            },
            delete: {
              onClick: handleDelete,
              disabled: true,
            },
            new: {
              onClick: handleNew,
            },
          }}
        />

        {/* ================= FORM ================= */}

        {showForm && loading && <Loading />}

        {showForm && (
          <ListItemForm
            entity="Designation"
            data={selectedItem}
            toggleForm={toggleForm}
            saveEntity={saveDesignation}
            fetchEntityById={getDesignationById}
            ENTITY_FIELD_MAP={DESIGNATION_FIELD_MAP}
          >
            {({ register, errors, isVarified }) => (
              <div className="full-content">
                <div className="form-row">

                  <label className="group-form-label">Description</label>

                  <textarea
                    className={`form-control ${errors[DESIGNATION_FIELD_MAP.desc] ? "error" : ""
                      } ${isVarified ? "read-only" : ""}`}
                    placeholder="Enter description"
                    disabled={isVarified}
                    {...register(DESIGNATION_FIELD_MAP.desc)}
                  />

                  {errors[DESIGNATION_FIELD_MAP.desc] && (
                    <span className="error-message">
                      {errors[DESIGNATION_FIELD_MAP.desc].message}
                    </span>
                  )}

                </div>
              </div>
            )}
          </ListItemForm>
        )}

        <BackToTop />
      </div>
    </>
  );
};

export default Designation;