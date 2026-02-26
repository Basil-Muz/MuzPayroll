import React, { useState, useEffect } from "react";
// import "../designation/designation.css"
import axios from "axios";

import Header from "../../components/Header/Header";
import Search from "../../components/search/Search";
import DepartmentForm from "./DepartmentForm";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import Loading from "../../components/Loaders/Loading";

import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";


const Department = () => {
    const [departments, setDepartments] = useState([]);
    const [boxView, setBoxView] = useState(true);
    const [listView, setListView] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchData, setSearchData] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [headerError, setHeaderError] = useState([]);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:8087/department/list");
            setDepartments(res.data || []);
        } catch (err) {
            setHeaderError(["Failed to fetch departments"]);
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchData.trim()) {
            fetchDepartments();
        }
    }, [searchData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchData.trim()) {
                handleSearch();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchData]);

    const handleSearch = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8087/department/search?query=${searchData}`);
            setDepartments(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const toggleForm = () => {
        setShowForm((prev) => !prev);
        if (showForm) setSelectedItem(null);
    };

    const openDepartment = (item) => {
        setSelectedItem(item);
        setShowForm(true);
    };
    const handleClear = () => setSearchData(`http://localhost:8087/department/search?query=${searchData}`);
    const handleDelete = async () => {
        if (!selectedItem) return;
        try {
            await axios.delete(`http://localhost:8087/department/${selectedItem.code}`);
            fetchDepartments();
            toggleForm();
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <>
            <Header backendError={headerError} />

            <div className="department-page">
                {/* Header */}
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

                        {/*  Search */}
                        <div className="search-box">
                            <IoIosSearch size={18} />
                            <input
                                type="text"
                                placeholder="Search department…"
                                value={searchData}
                                onChange={(e) => setSearchData(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Advanced search */}
                <div className={`slide-container ${showSearch ? "show" : "hide"}`}>
                    <Search />
                </div>

                {/*  Cards */}
                {loading ? (
                    <Loading />
                ) : (
                    <div className={`card-grid ${listView ? "list" : "tile"}`}>
                        {departments.map((item) => (
                            <div
                                key={item.code}
                                className={`advance-card ${item.inActiveDate ? "inactive" : "active"
                                    }`}
                            >
                                <div className="card-header">
                                    <span className="code" onClick={() => openDepartment(item)}>
                                        {item.code}
                                    </span>

                                    <div className="status">
                                        {item.inActiveDate ? (
                                            <div className="status-item inactive">
                                                <RxCross2 />
                                                Inactive
                                            </div>
                                        ) : (
                                            <div className="status-item active">
                                                <TiTick />
                                                Active
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div
                                    className="card-title"
                                    onClick={() => openDepartment(item)}
                                >
                                    {item.name}
                                </div>

                                <div className="card-shortname">{item.shortName}</div>
                                <div className="card-description">{item.description}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Floating buttons */}
                <FloatingActionBar
                    actions={{
                        clear: { onClick: handleClear },
                        delete: { onClick: handleDelete, disabled: !selectedItem },
                        new: { onClick: toggleForm },
                    }}
                />

                {/* Form */}
                {showForm && (
                    <DepartmentForm
                        data={selectedItem}
                        onClose={toggleForm}
                        refresh={fetchDepartments}
                    />
                )}

                <BackToTop />
            </div>
        </>
    );
};

export default Department;


