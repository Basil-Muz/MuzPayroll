// React & hooks
import React, { useEffect, useState } from "react";

// Third-party libraries
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";

// Styles
import "./usergroup.css";

// Shared components
import Search from "../../components/search/Search";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import Loading from "../../components/Loaders/Loading";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";

// Local components
import UserGroupForm from "./usergroupform";

// Context / hooks
import { useLoader } from "../../context/LoaderContext";
import { useAuth } from "../../context/AuthProvider";

// Utils
import { ensureMinDuration } from "../../utils/loaderDelay";
import { handleApiError } from "../../utils/errorToastResolver";

// Services
import { getUserGroupsList } from "../../services/user.service";

function UserGroup() {
  const { showRailLoader, hideLoader } = useLoader(); //Import functions from context

  const [userGroupList, setUserGroupList] = useState([
    // {
    //   code: "UG001",
    //   name: "Admin Group",
    //   shortname: "Admin",
    //   description: "Group with all admin rights",
    //   ActiveDate: "01-01-2024",
    // },
    // {
    //   code: "UG002",
    //   name: "HR Group",
    //   shortname: "HR",
    //   description: "Group with HR related rights",
    //   ActiveDate: "12-03-2024",
    //   inActiveDate :"12-03-2028",
    // },
    // {
    //   code: "UG003",
    //   name: "Accounts Group",
    //   shortname: "Accounts",
    //   description: "Group with finance related rights",
    //   ActiveDate: "15-02-2024",
    // },
  ]);

  const [boxView, setBoxView] = useState(true);
  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchData, setSearchdata] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false); // new state for flag from child
  //   const [[], set[]] = useState([]);

  const { user } = useAuth();
  // console.log("Entutirjgfdg", user);

  const entityId = user.userEntityHierarchyId;

  const getAllUserGroups = async () => {
    const startTime = Date.now();
    // show loader
    showRailLoader("Retrieving available user groups…");

    // if (showForm) {
    //

    //   // hide loader ONLY at the end

    // } else {
    //       axios.get("http://localhost:9082/userGrp/userGrplist/{ugmEntityHierarchyID}")
    // .then((res) => setUserGroupList(res.data))
    // .catch(console.error);
    // }
    try {
      const response = await getUserGroupsList(entityId);
      setUserGroupList(response.data);
      console.log("user Group",response)
    } catch (error) {
      handleApiError(error);
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }
  };

  const handleSave = () => {
    // console.log("Save clicked");
    // API call / form submit logic
  };

  //   const handleSearch = () => {
  //     console.log("Search clicked");
  //   };

  const handleClear = () => {
    console.log("Clear clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const handlePrint = () => {
    console.log("Print clicked");
  };

  //   const handleNewPage = () => {
  //     console.log("New page clicked");
  //   };

  //   const handleFlagChange = (newFlag) => {
  //     setFlag(newFlag); // update parent state
  //     setTimeout(() => {
  //       setFlag(false); // reset flag after 2 seconds
  //     }, 1000);
  //   };
  const handleSearchChange = (e) => {
    setSearchdata(e.target.value);
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchData.trim()) {
        // axios.get(`http://localhost:9082/searchAdvanceType?data=${searchData}`)
        // .then((res) => setUserGroupList(res.data))
        // .catch(console.error);
      } else {
        // If searchData is empty, get all advance types
        // axios.get("http://localhost:9082/viewAdvanceType")
        // .then((res) => setUserGroupList(res.data))
        // .catch(console.error);
      }
    }, 200); // debounce delay
    return () => clearTimeout(delayDebounceFn);
  }, [searchData]);

  useEffect(() => {
    getAllUserGroups();
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
      <Header backendError={[]} />
      <div className="usergroup-page">
        <div className="header-section">
          <h2 className="page-title">User Group</h2>

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
                placeholder="Search …"
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
          {userGroupList.map((item) => (
            <div
              className={`advance-card ${item.inactiveDate ? "inactive" : "active"}`}
              key={item.mstID}
            >
              <div className="card-header">
                <span className="code" onClick={() => hanbleSearchChange(item)}>
                  {item.code}
                </span>

                <div className="status">
                  {item.inactiveDate ? (
                    <div className="status-stack inactive">
                      <div className="status-item inactive">
                        <RxCross2 className="check-icon" />
                        <span className="status-text">Inactive</span>
                        <span className="date">{item.inactiveDate}</span>
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
            // search: {
            //     onClick: handleSearch,
            //     disabled: true,
            // },
            clear: {
              onClick: handleClear,
              // disabled:true,
            },
            delete: {
              onClick: handleDelete,
              // disabled: !hasDeletePermission
              disabled: true,
            },
            print: {
              onClick: handlePrint,
              // disabled: isNewRecord
              disabled: true,
            },
            new: {
              onClick: toggleForm, //to toggle the usergroup form
            },
            // refresh: {
            //   onClick: () => window.location.reload(),  // Refresh the page
            // },
          }}
        />

        {/* {showForm && selectedItem && loading && <Loading />} */}
        {showForm && !loading && selectedItem && (
          <UserGroupForm data={selectedItem} toggleForm={toggleForm} />
        )}
        {showForm && !selectedItem && (
          <UserGroupForm data={selectedItem} toggleForm={toggleForm} />
        )}
        {flag && <Loading />}
        <BackToTop />
      </div>
    </>
  );
}

export default UserGroup;
