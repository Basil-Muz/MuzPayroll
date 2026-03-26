import React, { useEffect, useState, useCallback } from "react";

import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import Search from "../../components/search/Search";
import ListItemForm from "../../components/ListItemForm/ListItemForm";
import { ListCard } from "../../components/List Card/ListCard";
import { Controller } from "react-hook-form";
import TimePicker from "react-time-picker";
import { GrSun, GrMoon } from "react-icons/gr";
import { LiaAdjustSolid } from "react-icons/lia";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

import {
  getShiftGroupsList,
  getShiftGroupById,
  saveShiftGroup,
  searchShiftGroup,
} from "../../services/shiftgroup.service";

import { SHIFT_GROUP_FIELD_MAP } from "../../constants/shiftGroupMap";
import { useAuth } from "../../context/AuthProvider";

import "./shiftgroup.css";

function ShiftGroup() {
  const { user } = useAuth();
  const companyId = user?.companyId;

  const [shiftGroupList, setShiftGroupList] = useState([]);

  const [boxView, setBoxView] = useState(true);
  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [groupByStatus, setGroupByStatus] = useState(false);

  const [activeShiftGroups, setActiveShiftGroups] = useState([]);
  const [inactiveShiftGroups, setInactiveShiftGroups] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* ================= FETCH ALL ================= */

  const getAllShiftGroups = async (activeStatusYN = null) => {
    try {
      const response = await getShiftGroupsList(companyId, activeStatusYN);
      setShiftGroupList(response.data);
    } catch (error) {
      console.error("Error fetching shift groups", error);
    }
  };

  useEffect(() => {
    getAllShiftGroups(null);
  }, [showForm]);

  /* ================= SEARCH ================= */

  const searchData = useCallback(async () => {
    if (searchText.trim()) {
      const response = await searchShiftGroup(searchText);
      setShiftGroupList(response.data.content);
    } else {
      getAllShiftGroups(null);
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
      getAllShiftGroups(null);
      return;
    }

    try {
      const [activeRes, inactiveRes] = await Promise.all([
        getShiftGroupsList(companyId, 1),
        getShiftGroupsList(companyId, 0),
      ]);

      setActiveShiftGroups(activeRes.data);
      setInactiveShiftGroups(inactiveRes.data);
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

      <div className="shift-group-page">
        {/* ================= HEADER ================= */}
        <div className="header-section">
          <h2 className="page-title">Shift Group</h2>

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
                placeholder="Search shift group…"
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
          (shiftGroupList.length > 0 ? (
            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {shiftGroupList.map((item) => (
                <ListCard
                  key={item.mstID}
                  item={item}
                  status="active"
                  handleDataToForm={handleDataToForm}
                >
                  <div>{item.shiftType}</div>
                  <div>{item.timeFrom}</div>
                  <div>{item.timeTo}</div>
                </ListCard>
              ))}
            </div>
          ) : (
            <div className="no-data-found">No shift groups available</div>
          ))}

        {/* ================= GROUPED VIEW ================= */}
        {groupByStatus && (
          <>
            <h3 className="group-title active">Active</h3>
            {activeShiftGroups.length > 0 ? (
              <div className={`card-grid ${listView ? "list" : "tile"}`}>
                {activeShiftGroups.map((item) => (
                  <ListCard
                    key={item.mstID}
                    item={item}
                    status="active"
                    handleDataToForm={handleDataToForm}
                  >
                    <div>{item.shiftType}</div>
                    <div>{item.timeFrom}</div>
                    <div>{item.timeTo}</div>
                  </ListCard>
                ))}
              </div>
            ) : (
              <div className="no-data-found">No active shift groups</div>
            )}

            <h3 className="group-title inactive">Inactive</h3>
            {inactiveShiftGroups.length > 0 ? (
              <div className={`card-grid ${listView ? "list" : "tile"}`}>
                {inactiveShiftGroups.map((item) => (
                  <ListCard
                    key={item.mstID}
                    item={item}
                    status="inactive"
                    handleDataToForm={handleDataToForm}
                  >
                    <div>{item.shiftType}</div>
                    <div>{item.timeFrom}</div>
                    <div>{item.timeTo}</div>
                  </ListCard>
                ))}
              </div>
            ) : (
              <div className="no-data-found">No inactive shift groups</div>
            )}
          </>
        )}

        {/* ================= FLOATING ACTION BAR ================= */}
        <FloatingActionBar
          actions={{
            save: { disabled: true },
            clear: {
              onClick: () => getAllShiftGroups(null),
            },
            delete: { disabled: true },
            print: { disabled: true },
            new: { onClick: handleNew },
          }}
        />

        {/* ================= FORM ================= */}
        {showForm && (
          <ListItemForm
            entity="Shift Group"
            data={selectedItem}
            toggleForm={toggleForm}
            saveEntity={saveShiftGroup}
            fetchEntityById={getShiftGroupById}
            ENTITY_FIELD_MAP={SHIFT_GROUP_FIELD_MAP}
          >
            {({ register, control, errors, setValue, watch, isVarified }) => (
              <>
                <div className="main-model-content">
                  {/* CODE */}
                  <div className="full-content">
                    <div className="form-row">
                      <label className="group-form-label">Code</label>
                      <input
                        className={`form-control ${
                          errors[SHIFT_GROUP_FIELD_MAP.code] ? "error" : ""
                        } ${isVarified ? "read-only" : ""}`}
                        disabled={isVarified}
                        {...register(SHIFT_GROUP_FIELD_MAP.code, {
                          required: "Code is required",
                        })}
                      />
                      {errors[SHIFT_GROUP_FIELD_MAP.code] && (
                        <span className="error-message">
                          {errors[SHIFT_GROUP_FIELD_MAP.code].message}
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
                          errors[SHIFT_GROUP_FIELD_MAP.name] ? "error" : ""
                        } ${isVarified ? "read-only" : ""}`}
                        disabled={isVarified}
                        {...register(SHIFT_GROUP_FIELD_MAP.name, {
                          required: "Name is required",
                        })}
                      />
                      {errors[SHIFT_GROUP_FIELD_MAP.name] && (
                        <span className="error-message">
                          {errors[SHIFT_GROUP_FIELD_MAP.name].message}
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
                          errors[SHIFT_GROUP_FIELD_MAP.shortName] ? "error" : ""
                        } ${isVarified ? "read-only" : ""}`}
                        disabled={isVarified}
                        {...register(SHIFT_GROUP_FIELD_MAP.shortName, {
                          required: "Short Name is required",
                        })}
                      />
                      {errors[SHIFT_GROUP_FIELD_MAP.shortName] && (
                        <span className="error-message">
                          {errors[SHIFT_GROUP_FIELD_MAP.shortName].message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* TIME FROM */}
                  <div className="full-content">
                    <div className="form-row">
                      <label className="group-form-label required">
                        Time From
                      </label>

                      <Controller
                        name={SHIFT_GROUP_FIELD_MAP.timeFrom}
                        control={control}
                        rules={{ required: "Time From is required" }}
                        render={({ field }) => (
                          <TimePicker
                            {...field}
                            format="HH:mm"
                            disableClock={true}
                            clearIcon={null}
                            clockIcon={null}
                            className={`custom-time-picker ${
                              errors[SHIFT_GROUP_FIELD_MAP.timeFrom]
                                ? "error"
                                : ""
                            }`}
                            disabled={isVarified}
                          />
                        )}
                      />

                      {errors[SHIFT_GROUP_FIELD_MAP.timeFrom] && (
                        <span className="error-message">
                          {errors[SHIFT_GROUP_FIELD_MAP.timeFrom].message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* TIME TO */}
                  <div className="full-content">
                    <div className="form-row">
                      <label className="group-form-label required">
                        Time To
                      </label>

                      <Controller
                        name={SHIFT_GROUP_FIELD_MAP.timeTo}
                        control={control}
                        rules={{ required: "Time To is required" }}
                        render={({ field }) => (
                          <TimePicker
                            {...field}
                            format="HH:mm"
                            disableClock={true}
                            clearIcon={null}
                            clockIcon={null}
                            className={`custom-time-picker ${
                              errors[SHIFT_GROUP_FIELD_MAP.timeTo]
                                ? "error"
                                : ""
                            }`}
                            disabled={isVarified}
                          />
                        )}
                      />

                      {errors[SHIFT_GROUP_FIELD_MAP.timeTo] && (
                        <span className="error-message">
                          {errors[SHIFT_GROUP_FIELD_MAP.timeTo].message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* SHIFT TYPE ICONS */}
                  <div className="full-content">
                  <div className="full-content">
                    <div className="form-row">
                      <label className="group-form-label required">
                        Shift Type
                      </label>

                      <div className="shift-type-container">
                        {/* DAY */}
                        <div
                          className={`shift-type ${
                            watch(SHIFT_GROUP_FIELD_MAP.shiftType) === "DAY"
                              ? "active"
                              : ""
                          } ${isVarified ? "disabled" : ""}`}
                          onClick={() =>
                            !isVarified &&
                            setValue(SHIFT_GROUP_FIELD_MAP.shiftType, "DAY", {
                              shouldValidate: true,
                            })
                          }
                        >
                          <GrSun />
                        </div>

                        {/* NIGHT */}
                        <div
                          className={`shift-type ${
                            watch(SHIFT_GROUP_FIELD_MAP.shiftType) === "NIGHT"
                              ? "active"
                              : ""
                          } ${isVarified ? "disabled" : ""}`}
                          onClick={() =>
                            !isVarified &&
                            setValue(SHIFT_GROUP_FIELD_MAP.shiftType, "NIGHT", {
                              shouldValidate: true,
                            })
                          }
                        >
                          <GrMoon />
                        </div>

                        {/* GENERAL */}
                        <div
                          className={`shift-type ${
                            watch(SHIFT_GROUP_FIELD_MAP.shiftType) === "GENERAL"
                              ? "active"
                              : ""
                          } ${isVarified ? "disabled" : ""}`}
                          onClick={() =>
                            !isVarified &&
                            setValue(
                              SHIFT_GROUP_FIELD_MAP.shiftType,
                              "GENERAL",
                              {
                                shouldValidate: true,
                              },
                            )
                          }
                        >
                          <LiaAdjustSolid />
                        </div>
                      </div>
                    </div>

                    {/* Hidden RHF input */}
                    <input
                      type="hidden"
                      {...register(SHIFT_GROUP_FIELD_MAP.shiftType, {
                        required: "Shift Type is required",
                      })}
                    />

                    {errors[SHIFT_GROUP_FIELD_MAP.shiftType] && (
                      <span className="error-message">
                        {errors[SHIFT_GROUP_FIELD_MAP.shiftType].message}
                      </span>
                    )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </ListItemForm>
        )}
      </div>
    </>
  );
}

export default ShiftGroup;
