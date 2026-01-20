import React from "react";
import { useState, useEffect } from "react";
import "./designation.css";
import Main from "../../components/MainButtons/MainButtons";
import axios from "axios";

import { RxCross2 } from "react-icons/rx";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import Search from "../../components/search/Search";
import DesignationForm from "./desinationFrom";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import Loading from "../../components/Loading/Loading";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
const Designation = () => {
  const [advanceTypes, setAdvanceTypes] = useState([
    {
      code: "DES001",
      activeDate: "2024-01-15",
      name: "HR EXECUTIVE",
      shortName: "HR",
      description: "HR EXECUTIVE",
    },
    {
      code: "DES002",
      activeDate: "2024-02-01",
      name: "ASSISTANT ACCOUNTANT",
      shortName: "AACT",
      description: "ASSISTANT ACCOUNTANT",
    },
    // {
    //   code: "DES003",
    //   activeDate: "2024-03-10",

    //   inActiveDate: "2025-03-10",
    //   name: "MANAGER ADMIN",
    //   shortName: "MADMIN",
    //   description: "MANAGER ADMIN",
    // },
    {
      code: "DES004",
      activeDate: "2024-04-05",
      name: "JR.SOFTWARE ANALYST",
      shortName: "SOFT_ANALIST",
      description: "JR.SOFTWARE ANALYST",
    },
    {
      code: "DES005",
      activeDate: "2024-05-20",
      name: "ASSISTANT MANAGER SALES",
      shortName: "ASTMS",
      description: "ASSISTANT MANAGER",
    },
  ]);
  const [boxView, setBoxView] = useState(true);
  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchData, setSearchdata] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false); // new state for flag from child
  const [headerError, setHeaderError] = useState([]);

  // const isNewRecord = !designationId;  //Is this form creating a new record, or editing an existing one?

  // const hasDeletePermission = user.permissions.includes("DESIGNATION_DELETE");   //Is this user allowed to delete this record?

  // const isViewMode = mode === "VIEW";   //Is the form in view-only mode?

  // const isSubmitted = designationData?.status === "SUBMITTED"; //Has the designation been submitted/finalized?

  // useEffect(() => {
  //   if (!searchData.trim()) { // Only fetch all if search is empty
  //     axios.get("http://localhost:9082/viewAdvanceType")
  //       .then(res => setAdvanceTypes(res.data))
  //       .catch(console.error);
  //   }
  // }, []);

  const handleSave = () => {
    console.log("Save clicked");
    // API call / form submit logic
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

  const handlePrint = () => {
    console.log("Print clicked");
  };

  // const handleNewPage = () => {
  //   console.log("New page clicked");
  // };

  //   const handleFlagChange = (newFlag) => {
  //   setFlag(newFlag);  // update parent state
  //     setTimeout(() => {
  //       setFlag(false); // reset flag after 2 seconds
  //     }, 1000);
  // };
  const handleSearchChange = (e) => {
    setSearchdata(e.target.value);
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchData.trim()) {
        // axios.get(`http://localhost:9082/searchAdvanceType?data=${searchData}`)
        // .then((res) => setAdvanceTypes(res.data))
        // .catch(console.error);
      } else {
        // If searchData is empty, get all advance types
        // axios.get("http://localhost:9082/viewAdvanceType")
        // .then((res) => setAdvanceTypes(res.data))
        // .catch(console.error);
      }
    }, 200); // debounce delay
    return () => clearTimeout(delayDebounceFn);
  }, [searchData]);

  useEffect(() => {
    if (showForm) {
      setLoading(true);
      // reset loading
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timer); // clean up on unmount
    } else {
      //       axios.get("http://localhost:9082/viewAdvanceType")
      // .then((res) => setAdvanceTypes(res.data))
      // .catch(console.error);
    }
  }, [showForm]);
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showForm) {
      setSelectedItem(null);
    }
  };
  const containerStyle = { display: "flex" };

  const hanbleSearchChange = (item) => {
    setSelectedItem(item);
    toggleForm();
  };

  return (
    <>
      <Header backendError={headerError} />
      <div className="designation-page">
        <div className="header-section">
          <h2 className="page-title">Designation</h2>

          <div className="header-actions">
            <div className="view-toggle">
              <button
                className={`icon-btn ${boxView ? "active" : ""}`}
                title="Tile View"
                onClick={() => {
                  setBoxView(true);
                  setListView(false);
                }}
              >
                <BsGrid3X3GapFill size={18} />
              </button>
              <button
                className={`icon-btn ${listView ? "active" : ""}`}
                title="List View"
                onClick={() => {
                  setListView(true);
                  setBoxView(false);
                }}
              >
                <FaListUl size={18} />
              </button>

              <button
                className={`icon-btn ${showSearch ? "active" : ""}`}
                title="Grouping"
                onClick={() => setShowSearch(!showSearch)}
              >
                <FaRegObjectGroup size={18} />
              </button>
            </div>

            <div className="search-box">
              <IoIosSearch size={18} />
              <input
                type="text"
                placeholder="Search designation…"
                value={searchData}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className={`slide-container ${showSearch ? "show" : "hide"}`}>
          <Search />
        </div>
        <div className={`card-grid ${listView ? "list" : "tile"}`}>
          {advanceTypes.map((item) => (
            <div
              className={`advance-card ${item.inActiveDate ? "inactive" : "active"}`}
              key={item.code}
            >
              <div className="card-header">
                <span className="code" onClick={() => hanbleSearchChange(item)}>
                  {item.code}
                </span>

                <div className="status">
                  {item.inActiveDate ? (
                    <div className="status-stack inactive">
                      <div className="status-item inactive">
                        <RxCross2 className="check-icon" />
                        <span className="status-text">Inactive</span>
                        <span className="date">{item.inActiveDate}</span>
                      </div>

                      <div className="status-sub">
                        <TiTick className="check-icon muted" />
                        <span className="status-text muted">Active from</span>
                        <span className="date muted">{item.activeDate}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="status-item active">
                      <TiTick className="check-icon" />
                      <span className="status-text">Active</span>
                      <span className="date">{item.activeDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="card-title"
                style={listView ? containerStyle : null}
                onClick={() => hanbleSearchChange(item)}
              >
                {item.name}
              </div>

              <div
                className="card-shortname"
                style={listView ? containerStyle : null}
              >
                {item.shortName}
              </div>

              <div
                className="card-description"
                style={listView ? containerStyle : null}
              >
                {item.description}
              </div>
            </div>
          ))}
        </div>

        {/* <Main toggleForm={toggleForm} onFlagChange={handleFlagChange}/> */}
        <FloatingActionBar
          actions={{
            save: {
              onClick: handleSave,
              disabled: true,
              // disabled: isViewMode || isSubmitted
            },
            search: {
              onClick: handleSearch,
              disabled: true,
            },
            clear: {
              onClick: handleClear,
              // disabled:true,
            },
            delete: {
              onClick: handleDelete,
              // disabled: !hasDeletePermission
              disabled: true,
            },

            // print: {
            //   onClick: handlePrint,
            //   // disabled: isNewRecord
            //   disabled: true,
            // },
            new: {
              onClick: toggleForm, //to toggle the designation form
            },
            // refresh: {
            //   onClick: () => window.location.reload(),  // Refresh the page
            // },
          }}
        />

        {showForm && selectedItem && loading && <Loading />}
        {showForm && !loading && selectedItem && (
          <DesignationForm data={selectedItem} toggleForm={toggleForm} />
        )}
        {showForm && !selectedItem && (
          <DesignationForm data={selectedItem} toggleForm={toggleForm} />
        )}
        {flag && <Loading />}
        <BackToTop />
      </div>
    </>
  );
};

export default Designation;
