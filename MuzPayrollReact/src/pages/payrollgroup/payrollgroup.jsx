// React & hooks
import React, { useEffect, useState, useCallback } from "react";

// Icons
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

// Shared components
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import Search from "../../components/search/Search";
import ListItemForm from "../../components/ListItemForm/ListItemForm";
import { ListCard } from "../../components/List Card/ListCard";

// Services
import {
  getPayrollGroupsList,
  getPayrollGroupById,
  savePayrollGroup,
  searchPayrollGroup,
} from "../../services/payrollgroup.service";
import { PAYROLL_GROUP_FIELD_MAP } from "../../constants/payrollGroupMap";
import { useAuth } from "../../context/AuthProvider";

import "./payrollgroup.css";

function PayrollGroup() {
  const { user } = useAuth();
  const companyId = user?.companyId;

  const [payrollGroupList, setPayrollGroupList] = useState([]);

  const [boxView, setBoxView] = useState(true);
  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [groupByStatus, setGroupByStatus] = useState(false);

  const [activePayrollGroups, setActivePayrollGroups] = useState([]);
  const [inactivePayrollGroups, setInactivePayrollGroups] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* ================= FETCH ALL ================= */

  const getAllPayrollGroups = async (activeStatusYN = null) => {
    try {
      const response = await getPayrollGroupsList(companyId, activeStatusYN);
      setPayrollGroupList(response.data);
    } catch (error) {
      console.error("Error fetching payroll groups", error);
    }
  };

  useEffect(() => {
    getAllPayrollGroups(null);
  }, [showForm]);

  /* ================= SEARCH ================= */

  const searchData = useCallback(async () => {
    if (searchText.trim()) {
      const response = await searchPayrollGroup(searchText);
      setPayrollGroupList(response.data.content);
    } else {
      getAllPayrollGroups(null);
    }
  }, [searchText, companyId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      searchData();
    }, 400);

    return () => clearTimeout(handler);
  }, [searchText]);

  /* ================= GROUPING ================= */

  const handleGroupSubmit = async (checked) => {
    setGroupByStatus(checked);
    setShowSearch(false);

    if (!checked) {
      getAllPayrollGroups(null);
      return;
    }

    try {
      const [activeRes, inactiveRes] = await Promise.all([
        getPayrollGroupsList(companyId, 1),
        getPayrollGroupsList(companyId, 0),
      ]);

      setActivePayrollGroups(activeRes.data);
      setInactivePayrollGroups(inactiveRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= HANDLERS ================= */

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleNew = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleDataToForm = (mstID) => {
    setSelectedItem(mstID);
    setShowForm(true);
  };

  return (
    <>
      <Header backendError={[]} />

      <div className="payroll-group-page">
        {/* ================= HEADER ================= */}
        <div className="header-section">
          <h2 className="page-title">Payroll Group</h2>

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
                placeholder="Search payroll group…"
                value={searchText}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        {/* ================= GROUP SLIDE ================= */}
        <div className={`slide-container ${showSearch ? "show" : "hide"}`}>
          <Search onSubmit={handleGroupSubmit} initialChecked={groupByStatus} />
        </div>

        {/* ================= NORMAL VIEW ================= */}
        {!groupByStatus &&
          (payrollGroupList.length > 0 ? (
            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {payrollGroupList.map((item) => (
                <ListCard
                  key={item.mstID}
                  item={item}
                  status="active"
                  handleDataToForm={handleDataToForm}
                >
                  <div>{item.description}</div>
                </ListCard>
              ))}
            </div>
          ) : (
            <div className="no-data-found">No payroll groups available</div>
          ))}

        {/* ================= GROUPED VIEW ================= */}
        {groupByStatus && (
          <>
            <h3 className="group-title active">Active</h3>
            {activePayrollGroups.length > 0 ? (
              <div className={`card-grid ${listView ? "list" : "tile"}`}>
                {activePayrollGroups.map((item) => (
                  <ListCard
                    key={item.mstID}
                    item={item}
                    status="active"
                    handleDataToForm={handleDataToForm}
                  >
                    <div>{item.description}</div>
                  </ListCard>
                ))}
              </div>
            ) : (
              <div className="no-data-found">No active payroll groups</div>
            )}

            <h3 className="group-title inactive">Inactive</h3>
            {inactivePayrollGroups.length > 0 ? (
              <div className={`card-grid ${listView ? "list" : "tile"}`}>
                {inactivePayrollGroups.map((item) => (
                  <ListCard
                    key={item.mstID}
                    item={item}
                    status="inactive"
                    handleDataToForm={handleDataToForm}
                  >
                    <div>{item.description}</div>
                  </ListCard>
                ))}
              </div>
            ) : (
              <div className="no-data-found">No inactive payroll groups</div>
            )}
          </>
        )}

        {/* ================= FLOATING ACTION BAR ================= */}
        <FloatingActionBar
          actions={{
            save: { disabled: true },
            clear: {
              onClick: () => getAllPayrollGroups(null),
            },
            delete: { disabled: true },
            print: { disabled: true },
            new: {
              onClick: handleNew,
            },
          }}
        />

        {showForm && (
          <ListItemForm
            entity="Payroll Group"
            data={selectedItem}
            toggleForm={toggleForm}
            saveEntity={savePayrollGroup}
            fetchEntityById={getPayrollGroupById}
            ENTITY_FIELD_MAP={PAYROLL_GROUP_FIELD_MAP}
          >
            {({ register, errors, isVarified }) => (
              <div className="main-model-content">
                {/* CODE */}
                <div className="full-content">
                  <div className="form-row">
                    <label className="group-form-label">Code</label>
                    <input
                      className={`form-control ${
                        errors[PAYROLL_GROUP_FIELD_MAP.code] ? "error" : ""
                      } ${isVarified ? "read-only" : ""}`}
                      disabled={isVarified}
                      {...register(PAYROLL_GROUP_FIELD_MAP.code, {
                        required: "Code is required",
                      })}
                    />
                    {errors[PAYROLL_GROUP_FIELD_MAP.code] && (
                      <span className="error-message">
                        {errors[PAYROLL_GROUP_FIELD_MAP.code].message}
                      </span>
                    )}
                  </div>
                </div>

                {/* NAME */}
                <div className="full-content">
                  <div className="form-row">
                    <label className="group-form-label">Name</label>
                    <input
                      className={`form-control ${
                        errors[PAYROLL_GROUP_FIELD_MAP.name] ? "error" : ""
                      } ${isVarified ? "read-only" : ""}`}
                      disabled={isVarified}
                      {...register(PAYROLL_GROUP_FIELD_MAP.name, {
                        required: "Name is required",
                      })}
                    />
                    {errors[PAYROLL_GROUP_FIELD_MAP.name] && (
                      <span className="error-message">
                        {errors[PAYROLL_GROUP_FIELD_MAP.name].message}
                      </span>
                    )}
                  </div>
                </div>

                {/* SHORT NAME */}
                <div className="full-content">
                  <div className="form-row">
                    <label className="group-form-label">Short Name</label>
                    <input
                      className={`form-control ${
                        errors[PAYROLL_GROUP_FIELD_MAP.shortName] ? "error" : ""
                      } ${isVarified ? "read-only" : ""}`}
                      disabled={isVarified}
                      {...register(PAYROLL_GROUP_FIELD_MAP.shortName, {
                        required: "Short Name is required",
                      })}
                    />
                    {errors[PAYROLL_GROUP_FIELD_MAP.shortName] && (
                      <span className="error-message">
                        {errors[PAYROLL_GROUP_FIELD_MAP.shortName].message}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="full-content">
                  <div className="form-row">
                    <label className="group-form-label">Description</label>

                    <textarea
                      className={`form-control ${
                        errors[PAYROLL_GROUP_FIELD_MAP.desc] ? "error" : ""
                      } ${isVarified ? "read-only" : ""}`}
                      placeholder="Enter Description"
                      disabled={isVarified}
                      {...register(PAYROLL_GROUP_FIELD_MAP.desc)}
                    />

                    {errors[PAYROLL_GROUP_FIELD_MAP.desc] && (
                      <span className="error-message">
                        {errors[PAYROLL_GROUP_FIELD_MAP.desc].message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </ListItemForm>
        )}
      </div>
    </>
  );
}

export default PayrollGroup;
