// React
import React, { useEffect, useState, useCallback } from "react";

// Icons
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

// Components
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import Search from "../../components/search/Search";
import ListItemForm from "../../components/ListItemForm/ListItemForm";
import { ListCard } from "../../components/List Card/ListCard";

// Services
import {
  getDepartmentsList,
  getDepartmentById,
  saveDepartment,
  searchDepartment,
} from "../../services/department.service";

import { DEPARTMENT_FIELD_MAP } from "../../constants/departmentMap";

import { useAuth } from "../../context/AuthProvider";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";

import "./department.css";

function Department() {
  const { user } = useAuth();
  const companyId = user?.companyId;

  const [departmentList, setDepartmentList] = useState([]);

  const [boxView, setBoxView] = useState(true);
  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [groupByStatus, setGroupByStatus] = useState(false);

  const [activeDepartments, setActiveDepartments] = useState([]);
  const [inactiveDepartments, setInactiveDepartments] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* ================= FETCH ================= */

  const getAllDepartments = async (activeStatusYN = null) => {
    try {
      const response = await getDepartmentsList(companyId, activeStatusYN);
      setDepartmentList(response.data);
    } catch (error) {
      console.error("Error fetching departments", error);
    }
  };

  useEffect(() => {
    getAllDepartments(null);
  }, [showForm]);

  /* ================= SEARCH ================= */

  const searchData = useCallback(async () => {
    if (searchText.trim()) {
      const response = await searchDepartment(searchText);
      setDepartmentList(response.data.content);
    } else {
      getAllDepartments(null);
    }
  }, [searchText]);

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
      getAllDepartments(null);
      return;
    }

    try {
      const [activeRes, inactiveRes] = await Promise.all([
        getDepartmentsList(companyId, 1),
        getDepartmentsList(companyId, 0),
      ]);

      setActiveDepartments(activeRes.data);
      setInactiveDepartments(inactiveRes.data);
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

      <div className="department-page">

        {/* HEADER */}

        <div className="header-section">
          <h2 className="page-title">Department</h2>

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
                placeholder="Search department..."
                value={searchText}
                onChange={handleSearchChange}
              />
            </div>

          </div>
        </div>

        {/* GROUP SEARCH */}

        <div className={`slide-container ${showSearch ? "show" : "hide"}`}>
          <Search onSubmit={handleGroupSubmit} initialChecked={groupByStatus} />
        </div>

        {/* NORMAL VIEW */}

        {!groupByStatus &&
          (departmentList.length > 0 ? (
            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {departmentList.map((item) => (
                <ListCard
                  key={item.mstID}
                  item={item}
                  status={item.inactiveDate ? "inactive" : "active"}
                  handleDataToForm={handleDataToForm}
                >
                  <div>{item.depDesc}</div>
                </ListCard>
              ))}
            </div>
          ) : (
            <div className="no-data-found">
              No departments available
            </div>
          ))}

        {/* GROUP VIEW */}

        {groupByStatus && (
          <>
            <h3 className="group-title active">Active</h3>

            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {activeDepartments.map((item) => (
                <ListCard
                  key={item.mstID}
                  item={item}
                  status="active"
                  handleDataToForm={handleDataToForm}
                >
                  <div>{item.depDesc}</div>
                </ListCard>
              ))}
            </div>

            <h3 className="group-title inactive">Inactive</h3>

            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {inactiveDepartments.map((item) => (
                <ListCard
                  key={item.mstID}
                  item={item}
                  status="inactive"
                  handleDataToForm={handleDataToForm}
                >
                  <div>{item.depDesc}</div>
                </ListCard>
              ))}
            </div>
          </>
        )}

        {/* FLOATING BUTTON */}

        <FloatingActionBar
          actions={{
            save: { disabled: true },
            clear: { onClick: () => getAllDepartments(null) },
            delete: { disabled: true },
            print: { disabled: true },
            new: { onClick: handleNew },
          }}
        />

        {/* FORM */}

        {showForm && (
          <ListItemForm
            entity="Department"
            data={selectedItem}
            toggleForm={toggleForm}
            saveEntity={saveDepartment}
            fetchEntityById={getDepartmentById}
            ENTITY_FIELD_MAP={DEPARTMENT_FIELD_MAP}
          >
            
         </ListItemForm>
        )}

        <BackToTop />

      </div>
    </>
  );
}

export default Department;