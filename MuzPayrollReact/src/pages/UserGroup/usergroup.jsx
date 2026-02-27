// React & hooks
import React, { useEffect, useState, useCallback} from "react";

// Third-party libraries
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import { toast } from "react-hot-toast";
// Styles
import "./usergroup.css";

// Shared components
import Search from "../../components/search/Search";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";

// Local components
import ListItemForm from "../../components/ListItemForm/ListItemForm";

// Context / hooks
import { useAuth } from "../../context/AuthProvider";
import { useLoader } from "../../context/LoaderContext";

// Utils
import { ensureMinDuration } from "../../utils/loaderDelay";
import { handleApiError } from "../../utils/errorToastResolver";

// Services
import {
  getUserGroupById,
  getUserGroupsList,
  saveUserGroup,
  searchUserGroup,
} from "../../services/usergroup.service";
import { USER_GROUP_FIELD_MAP } from "../../constants/userGroupMap";

function UserGroup() {
  const { showRailLoader, hideLoader } = useLoader(); //Import functions from context

  const [userGroupList, setUserGroupList] = useState([]);

  const [boxView, setBoxView] = useState(true);
  const [listView, setListView] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchData, setSearchdata] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [flag, setFlag] = useState(false); // new state for flag from child

  const { user } = useAuth();
  // console.log("Entutirjgfdg", user);

  const entityId = user.userEntityHierarchyId;

  const getAllUserGroups = async (loadFirst) => {
     const startTime = Date.now();
    if(loadFirst === true){
         
    // show loader
    showRailLoader("Retrieving available user groups…");
    }
    try {
      const response = await getUserGroupsList(entityId, true);
      setUserGroupList(response.data);
      console.log("user Group", response);
    } catch (error) {
      handleApiError(error);
    } finally {
      if(loadFirst){
        await ensureMinDuration(startTime, 700);
      hideLoader();
      }
    }
  };

  //   const handleSearch = () => {
  //     console.log("Search clicked");
  //   };

  const handleClear = async () => {
    await getAllUserGroups(true);
    toast.success("User groups have been updated.");
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
const searchdata = useCallback(async () => {
  if (searchData.trim()) {
    const response = await searchUserGroup(searchData);
    setUserGroupList(response.data.content);
  } else {
    const response = await getUserGroupsList(entityId, true);
    setUserGroupList(response.data);
  }
}, [searchData, entityId]);

useEffect(() => {
  const handler = setTimeout(() => {
    if (searchData.trim() !== "") {
      searchdata();
    } else {
      getAllUserGroups(false);
    }
  }, 400);

  return () => clearTimeout(handler);
}, [searchData]);

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     if (searchData.trim()) {
  //       // axios.get(`http://localhost:9082/searchAdvanceType?data=${searchData}`)
  //       // .then((res) => setUserGroupList(res.data))
  //       // .catch(console.error);
  //     } else {
  //       // If searchData is empty, get all advance types
  //       // axios.get("http://localhost:9082/viewAdvanceType")
  //       // .then((res) => setUserGroupList(res.data))
  //       // .catch(console.error);
  //     }
  //   }, 200); // debounce delay
  //   return () => clearTimeout(delayDebounceFn);
  // }, [searchData]);

  useEffect(() => {
    getAllUserGroups(true);
  }, [showForm]);

  const toggleForm = () => {
    setShowForm((prev) => !prev);

    //Api call for fetching the usergroup with mstId

    //  console.log("slecteditem",selectedItem)
  };
  const handleNew = () => {
    setSelectedItem(null);
    setShowForm(true);
  };
  const containerStyle = { display: "flex" };

  const handleDataToForm = (item) => {
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
                placeholder="Search groups…"
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
                <span
                  className="code"
                  onClick={() => handleDataToForm(item.mstID)}
                >
                  {item.code}
                </span>
                {/* {console.log("Data in list",item)} */}
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
                onClick={() => handleDataToForm(item.mstID)}
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
              // onClick: handleSave,
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
              onClick: handleNew, //to toggle the usergroup form
            },
            // refresh: {
            //   onClick: () => window.location.reload(),  // Refresh the page
            // },
          }}
        />

        {/* {showForm && selectedItem && loading && <Loading />} */}
        {/* {showForm && !loading && selectedItem && (
          <UserGroupForm data={selectedItem} toggleForm={toggleForm} />
        )} */}
        {/* {showForm && (
          <UserGroupForm data={selectedItem} toggleForm={toggleForm} />
        )} */}

        {showForm && (
          <ListItemForm
            entity="User Group"
            data={selectedItem}
            toggleForm={toggleForm}
            saveEntity={saveUserGroup}
            fetchEntityById={getUserGroupById}
            ENTITY_FIELD_MAP={USER_GROUP_FIELD_MAP}
          />
        )}
        {/* {flag && <Loading />} */}
        <BackToTop />
      </div>
    </>
  );
}

export default UserGroup;
