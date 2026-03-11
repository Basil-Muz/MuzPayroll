import React, { useState, useEffect } from "react";

import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

import Search from "../../components/search/Search";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import ListItemForm from "../../components/ListItemForm/ListItemForm";
import { Controller } from "react-hook-form";
import Select from "react-select";
import {
  getUsersList,
  getUserById,
  saveUser,
} from "../../services/user.service";
import "./user.css";

import { USER_FIELD_MAP } from "../../constants/userMap";

const User = () => {
  /* ================= STATES ================= */

  const [users, setUsers] = useState([]);

  const [boxView, setBoxView] = useState(true);
  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [searchData, setSearchData] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [headerError] = useState([]);

  const [groupByStatus, setGroupByStatus] = useState(false);

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsersList(1, true);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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
    setSearchData(e.target.value);
  };

  const handleGroupSubmit = (value) => {
    setGroupByStatus(value);
  };

  /* ================= FORM HANDLING ================= */

  const toggleForm = () => {
    setSelectedUser(null);
  };

  const handleDataToForm = (userCode) => {
    const selected = users.find((item) => item.userCode === userCode);
    setSelectedUser(selected);
  };

  const handleNew = () => {
    setSelectedUser({});
  };

  /* ================= FILTER USERS ================= */

  const activeUsers = users.filter((user) => !user.inActiveDate);
  const inactiveUsers = users.filter((user) => user.inActiveDate);

  return (
    <>
      <Header backendError={headerError} />

      <div className="user-page">
        {/* ================= HEADER ================= */}

        <div className="header-section">
          <h2 className="page-title">User</h2>

          <div className="header-actions">
            {/* VIEW BUTTONS */}

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

            {/* SEARCH */}

            <div className="search-box">
              <IoIosSearch size={18} />

              <input
                type="text"
                placeholder="Search..."
                value={searchData}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        {/* ================= GROUP FILTER ================= */}

        <div className={`slide-container ${showSearch ? "show" : "hide"}`}>
          <Search onSubmit={handleGroupSubmit} initialChecked={groupByStatus} />
        </div>

        {/* ================= NORMAL VIEW ================= */}

        {!groupByStatus &&
          (users.length > 0 ? (
            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {users.map((user) => (
                <div
                  key={user.userCode}
                  className={`user-card ${user.inActiveDate ? "inactive" : "active"}`}
                  onClick={() => handleDataToForm(user.userCode)}
                >
                  <div className="card-header">
                    <span className="code">{user.userCode}</span>
                  </div>

                  <div>
                    <div className="card-title">{user.userName}</div>
                    <div className="card-shortname">{user.mobile}</div>
                    <div className="card-description">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data-found">No users available</div>
          ))}

        {/* ================= GROUPED VIEW ================= */}

        {groupByStatus && (
          <>
            {/* ACTIVE */}

            <h3 className="group-title active">Active Users</h3>

            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {activeUsers.map((user) => (
                <div
                  key={user.userCode}
                  className="user-card active"
                  onClick={() => handleDataToForm(user.userCode)}
                >
                  <div className="card-header">
                    <span className="code">{user.userCode}</span>
                  </div>

                  <div>
                    <div className="card-title">{user.userName}</div>
                    <div className="card-shortname">{user.mobile}</div>
                    <div className="card-description">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* INACTIVE */}

            <h3 className="group-title inactive">Inactive Users</h3>

            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {inactiveUsers.map((user) => (
                <div
                  key={user.userCode}
                  className="user-card inactive"
                  onClick={() => handleDataToForm(user.userCode)}
                >
                  <div className="card-header">
                    <span className="code">{user.userCode}</span>
                  </div>

                  <div>
                    <div className="card-title">{user.userName}</div>
                    <div className="card-shortname">{user.mobile}</div>
                    <div className="card-description">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= FLOATING BUTTONS ================= */}

        <FloatingActionBar
          actions={{
            save: { onClick: handleSave, disabled: true },
            search: { onClick: handleSearch, disabled: true },
            clear: { onClick: handleClear },
            delete: { onClick: handleDelete, disabled: true },
            new: { onClick: handleNew },
          }}
        />

        {/* ================= FORM ================= */}

        {selectedUser !== null && (
          <ListItemForm
            entity="User"
            toggleForm={toggleForm}
            data={selectedUser}
            saveEntity={saveUser}
            fetchEntityById={getUserById}
            ENTITY_FIELD_MAP={USER_FIELD_MAP}
            showCode={false}
            showName={false}
            showShortName={false}
          >
            {({ register, control }) => (
              <div className="user-form-wrapper">
                {/* LEFT SIDE FIELDS */}
                <div className="user-fields">
                  {/* USER CODE */}
                  <div className="full-content user-code-section">
                    <div className="form-row-fields">
                      <div className="form-row">
                        <label>User Code</label>
                        {/* <div className="code-group"> */}
                        <input
                          className="form-control"
                          {...register("userCode")}
                        />
                        {/* <span className="code-suffix">@NRMS</span> */}
                      </div>
                      <div className="form-row">
                        <label>User Name</label>
                        <input
                          className="form-control"
                          {...register("userName")}
                        />
                      </div>
                      <div className="form-row">
                        <label>User Type</label>

                        <Controller
                          name="userType"
                          control={control}
                          render={({ field }) => {
                            const options = [
                              { value: "ADMIN", label: "Admin" },
                              { value: "USER", label: "User" },
                            ];

                            return (
                              <Select
                                classNamePrefix="form-control-select"
                                options={options}
                                isSearchable={false}
                                value={options.find(
                                  (opt) => opt.value === field.value,
                                )}
                                onChange={(option) =>
                                  field.onChange(option.value)
                                }
                              />
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-row-image">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="user"
                        className="user-image-section"
                      />
                    </div>
                  </div>
                </div>

                {/* MOBILE */}
                <div className="full-content">
                  <div className="form-row">
                    <label>Mobile No</label>
                    <div>
                      <input className="form-control" {...register("mobileNo")} />
                    </div>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="full-content">
                  <div className="form-row">
                    <label>Email</label>
                    <div>
                      <input className="form-control" {...register("email")} />
                    </div>
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="full-content">
                  <div className="form-row">
                    <label>Password</label>
                    <div>
                      <input
                        type="password"
                        className="form-control"
                        {...register("password")}
                      />

                      <small className="password-hint">
                        Password must be 5+ characters with a letter, number,
                        and special character.
                      </small>
                    </div>
                  </div>
                </div>

                {/* CHANGE PASSWORD */}
                <div className="full-content change-password-row">
                  <div className="form-row">
                    <label>Change password on next login</label>

                    <input
                      type="checkbox"
                      className="change-password-checkbox"
                      {...register("changePasswordNextLogin")}
                    />
                  </div>
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

export default User;
