import React from "react";
import { useState, useEffect } from "react";
import "./usergroup.css";
import axios from 'axios';
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import Search from "../../components/search/Search";
import UserGroupForm from "./usergroupform";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import Loading from "../../components/Loading/Loading";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";


function UserGroup() {

    const [advanceTypes, setAdvanceTypes] = useState([
        {
            GroupCode: "UG001",
            GroupName: "Admin Group",
            ShortName: "Admin",
            Description: "Group with all admin rights",
            ActiveDate: "01-01-2024"

        },
        {
            GroupCode: "UG002",
            GroupName: "HR Group",
            ShortName: "HR",
            Description: "Group with HR related rights",
            ActiveDate: "12-03-2024"
        },
        {
            GroupCode: "UG003",
            GroupName: "Accounts Group",
            ShortName: "Accounts",
            Description: "Group with finance related rights",
            ActiveDate: "15-02-2024"
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

    const handleNewPage = () => {
        console.log("New page clicked");
    };

    const handleFlagChange = (newFlag) => {
        setFlag(newFlag);  // update parent state
        setTimeout(() => {
            setFlag(false); // reset flag after 2 seconds
        }, 1000);
    };
    const handleSearchChange = (e) => {
        setSearchdata(e.target.value);

    }
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
        }
        else {
            //       axios.get("http://localhost:9082/viewAdvanceType")
            // .then((res) => setAdvanceTypes(res.data))
            // .catch(console.error);
        }

    }, [showForm]);
    const toggleForm = () => {
        setShowForm(prev => !prev);
        if (showForm) {
            setSelectedItem(null);
        }
    }
    const containerStyle = { display: 'flex' }

    const hanbleSearchChange = (item) => {
        setSelectedItem(item);
        toggleForm();
    }

    return (
        <>
            <Header backendError={headerError} />
            <div className="usergroup-page">
                <div className="header-section">
                    <h2 className="page-title">User Group</h2>

                    <div className="header-actions">
                        <div className="view-toggle">
                            <button
                                className={`icon-btn ${boxView ? "active" : ""}`}
                                title="Tile View"
                                onClick={() => { setBoxView(true); setListView(false); }}>
                                <BsGrid3X3GapFill size={18} />
                            </button>

                            <button
                                className={`icon-btn ${listView ? "active" : ""}`}
                                title="List View"
                                onClick={() => { setListView(true); setBoxView(false); }}>
                                <FaListUl size={18} />
                            </button>

                            <button
                                className={`icon-btn ${showSearch ? "active" : ""}`}
                                title="Grouping"
                                onClick={() => setShowSearch(!showSearch)}>
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
                <div className={`slide-container ${showSearch ? 'show' : 'hide'}`}>
                    <Search />
                </div>

                <div className={`card-grid ${listView ? 'list' : 'tile'}`}>
                    {advanceTypes.map((item) => (
                        <div className="advance-card" key={item.GroupCode} >

                            <div className="card-header">
                                <span className="code" onClick={() => hanbleSearchChange(item)}>
                                    {item.GroupCode}
                                </span>

                                <div className="status">
                                    <TiTick className="check-icon" />
                                    <span className="date">{item.ActiveDate}</span>
                                </div>
                            </div>

                            <div className="card-title" style={listView ? containerStyle : null}
                                onClick={() => hanbleSearchChange(item)}>
                                {item.GroupName}
                            </div>

                            <div className="card-shortname" style={listView ? containerStyle : null}>
                                {item.ShortName}
                            </div>

                            <div className="card-description" style={listView ? containerStyle : null}>
                                {item.Description}
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
                            onClick: toggleForm,  //to toggle the usergroup form
                        },
                        // refresh: {
                        //   onClick: () => window.location.reload(),  // Refresh the page
                        // },
                    }} />

                {showForm && selectedItem && loading && <Loading />}
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