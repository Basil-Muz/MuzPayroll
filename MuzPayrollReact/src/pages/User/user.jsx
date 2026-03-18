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
import { getUserTypesList } from "../../services/usertype.service";

import { USER_FIELD_MAP } from "../../constants/userMap";
import "./user.css";

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
  const [userTypes, setUserTypes] = useState([]);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    fetchUsers();
    fetchUserTypes();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsersList(1, true);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchUserTypes = async () => {
    try {
      const res = await getUserTypesList();
      const formatted = res.data.map((item) => ({
        value: item.ugmUserGroupID,
        label: item.utmName,
      }));
      setUserTypes(formatted);
    } catch (error) {
      console.error("Error fetching user types:", error);
    }
  };

  /* ================= ACTION HANDLERS ================= */
  const handleSave = async (formData, mode) => {
    const res = await saveUser(formData, mode);
    await fetchUsers(); // force refresh
    return res;
  };
  const handleSearch = () => {};
  const handleClear = () => fetchUsers();
  const handleDelete = () => {};
  const handleSearchChange = (e) => setSearchData(e.target.value);
  const handleGroupSubmit = (value) => setGroupByStatus(value);

  const toggleForm = () => setSelectedUser(null);

  const handleNew = () => setSelectedUser({}); // empty object = new user

  /* ================= FILTER USERS ================= */
  const activeUsers = users.filter((u) => !u.inActiveDate);
  const inactiveUsers = users.filter((u) => u.inActiveDate);

  return (
    <>
      <Header backendError={headerError} />

      <div className="user-page">
        {/* HEADER */}
        <div className="header-section">
          <h2 className="page-title">User</h2>
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
                placeholder="Search..."
                value={searchData}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        {/* GROUP FILTER */}
        <div className={`slide-container ${showSearch ? "show" : "hide"}`}>
          <Search onSubmit={handleGroupSubmit} initialChecked={groupByStatus} />
        </div>

        {/* NORMAL VIEW */}
        {!groupByStatus &&
          (users.length > 0 ? (
            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {users.map((user) => (
                <div
                  key={user.userMstId}
                  className={`user-card ${user.inActiveDate ? "inactive" : "active"}`}
                  onClick={() => setSelectedUser({ id: user.userMstId })}
                >
                  <div className="card-header">
                    <span className="code">{user.userCode}</span>
                  </div>
                  <div>
                    <div className="card-title">{user.userName}</div>
                    <div className="card-shortname">{user.mobileNo}</div>
                    <div className="card-description">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data-found">No users available</div>
          ))}

        {/* GROUPED VIEW */}
        {groupByStatus && (
          <>
            <h3 className="group-title active">Active Users</h3>
            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {activeUsers.map((user) => (
                <div
                  key={user.userMstId}
                  className="user-card active"
                  onClick={() => setSelectedUser({ id: user.userMstId })}
                >
                  <div className="card-header">
                    <span className="code">{user.userCode}</span>
                  </div>
                  <div>
                    <div className="card-title">{user.userName}</div>
                    <div className="card-shortname">{user.mobileNo}</div>
                    <div className="card-description">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="group-title inactive">Inactive Users</h3>
            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {inactiveUsers.map((user) => (
                <div
                  key={user.userMstId}
                  className="user-card inactive"
                  onClick={() => setSelectedUser({ id: user.userMstId })}
                >
                  <div className="card-header">
                    <span className="code">{user.userCode}</span>
                  </div>
                  <div>
                    <div className="card-title">{user.userName}</div>
                    <div className="card-shortname">{user.mobileNo}</div>
                    <div className="card-description">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* FLOATING BUTTONS */}
        <FloatingActionBar
          actions={{
            save: { onClick: handleSave, disabled: true },
            search: { onClick: handleSearch, disabled: true },
            clear: { onClick: handleClear },
            delete: { onClick: handleDelete, disabled: true },
            new: { onClick: handleNew },
          }}
        />

        {/* FORM */}
        {selectedUser !== null && (
          <ListItemForm
            entity="User"
            data={selectedUser}
            toggleForm={toggleForm}
            saveEntity={handleSave}
            fetchEntityById={getUserById}
            ENTITY_FIELD_MAP={USER_FIELD_MAP}
          >
            {({ register, control }) => (
              <>
                {/* User Code */}
                <div className="form-row">
                  <label>User Code</label>
                  <input className="form-control" {...register("userCode")} />
                </div>

                {/* User Name */}
                <div className="form-row">
                  <label>User Name</label>
                  <input className="form-control" {...register("userName")} />
                </div>

                {/* User Type */}
                <div className="form-row">
                  <label>User Type</label>
                  <Controller
                    name="userTypeId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        classNamePrefix="form-control-select"
                        options={userTypes}
                        isSearchable={false}
                        value={
                          userTypes.find((opt) => opt.value === field.value) ||
                          null
                        }
                        onChange={(option) => field.onChange(option.value)}
                      />
                    )}
                  />
                </div>

                {/* Mobile */}
                <div className="form-row">
                  <label>Mobile No</label>
                  <input className="form-control" {...register("mobileNo")} />
                </div>

                {/* Email */}
                <div className="form-row">
                  <label>Email</label>
                  <input className="form-control" {...register("email")} />
                </div>

                {/* Password */}
                <div className="form-row">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    {...register("password")}
                  />
                </div>

                {/* Change Password */}
                <div className="form-row">
                  <label>Change password on next login</label>
                  <input
                    type="checkbox"
                    {...register("changePasswordNextLogin")}
                  />
                </div>
                <div className="form-row">
                  <label>Active</label>
                  <input type="checkbox" {...register("activeYN")} />
                </div>
              </>
            )}
          </ListItemForm>
        )}

        <BackToTop />
      </div>
    </>
  );
};

export default User;
