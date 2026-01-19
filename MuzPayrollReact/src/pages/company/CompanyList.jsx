import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";

import Header from "../../components/Header/Header";
import Search from "../../components/search/Search";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import Loading from "../../components/Loading/Loading";

import "./CompanyList.css";

const CompanyList = () => {
  const navigate = useNavigate();
  const groupBtnRef = useRef(null);

  /* ================= STATE ================= */
  const [companies, setCompanies] = useState([]);
  const [inactiveCompanies, setInactiveCompanies] = useState([]);
  const [boxView, setBoxView] = useState(true);
  const [listView, setListView] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [loading, setLoading] = useState(false);

  /* GROUPING */
  const [showSearch, setShowSearch] = useState(false);
  const [groupApplied, setGroupApplied] = useState(false);

  /* ================= API ================= */
  const fetchCompanies = () => {
    setLoading(true);
    axios.get("http://localhost:8087/company/companylist").then((res) => {
      setCompanies(res.data);
      setLoading(false);
    });
  };

  const fetchInactiveCompanies = () => {
    axios
      .get("http://localhost:8087/company/inactivecompanylist")
      .then((res) => setInactiveCompanies(res.data));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  /* ================= HANDLERS ================= */
  const handleGroupingSubmit = (checked) => {
    setGroupApplied(checked);

    if (checked) {
      fetchInactiveCompanies();
    }

    setShowSearch(false);

    // restore focus to group button after a short delay
    setTimeout(() => {
      groupBtnRef.current?.focus();
    }, 100);
  };

  const handleClear = () => {
    setLoading(true); // show loading immediately

    setTimeout(() => {
      // Reset grouping state
      setGroupApplied(false);

      // Close grouping popup if open
      setShowSearch(false);

      // Clear inactive companies
      setInactiveCompanies([]);

      // Clear search input
      setSearchData("");

      // Refetch active companies
      fetchCompanies();
    }, 500); // short delay for UX effect
  };

  /* ================= FILTER ================= */
  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchData.toLowerCase()) ||
      c.code.toLowerCase().includes(searchData.toLowerCase()),
  );

  const filteredInactiveCompanies = inactiveCompanies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchData.toLowerCase()) ||
      c.code.toLowerCase().includes(searchData.toLowerCase()),
  );

  /* ================= RENDER ================= */
  return (
    <>
      <Header />

      <div className="company-page">
        {/* HEADER */}
        <div className="header-section">
          <h2 className="page-title">Company List</h2>

          <div className="header-actions">
            <div className="view-toggle">
              {/* Tile / List view */}
              <button
                className={`icon-btn ${boxView ? "active" : ""}`}
                onClick={() => {
                  setBoxView(true);
                  setListView(false);
                }}
              >
                <BsGrid3X3GapFill />
              </button>

              <button
                className={`icon-btn ${listView ? "active" : ""}`}
                onClick={() => {
                  setListView(true);
                  setBoxView(false);
                }}
              >
                <FaListUl />
              </button>

              {/* Group button */}
              <button
                ref={groupBtnRef}
                className="icon-btn"
                onClick={() => setShowSearch(true)}
              >
                <FaRegObjectGroup />
              </button>
            </div>

            {/* Search box */}
            <div className="search-box">
              <IoIosSearch />
              <input
                placeholder="Search company…"
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Grouping popup */}
        <div className={`slide-container ${showSearch ? "show" : "hide"}`}>
          <Search
            onSubmit={handleGroupingSubmit}
            initialChecked={groupApplied}
          />
        </div>

        {/* Active heading (only if grouped) */}
        {groupApplied && <h2 className="active-head">Active</h2>}

        {/* ACTIVE COMPANIES */}
        {loading ? (
          <Loading />
        ) : (
          <div className={`card-grid ${listView ? "list" : "tile"}`}>
            {filteredCompanies.map((item) => (
              <div className="advance-card" key={item.mstID}>
                <div className="card-header">
                  <span className="code">{item.code}</span>
                  <div className="activedate">
                    <TiTick className="check-icon" />
                    <span>{item.activeDate}</span>
                  </div>
                </div>

                <div
                  className="card-title"
                  onClick={() => navigate(`/company/${item.mstID}`)}
                >
                  {item.name}
                </div>

                <div className="card-shortname">{item.shortName}</div>
                <div className="card-description">{item.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* INACTIVE COMPANIES (only if grouped) */}
        {/* INACTIVE COMPANIES (only if grouped) */}
        {groupApplied && !loading && (
          <div className="inactive">
            <h2 className="inactive-head">Inactive</h2>
            <div className={`card-grid ${listView ? "list" : "tile"}`}>
              {filteredInactiveCompanies.map((item) => (
                <div className="advance-card" key={item.mstID}>
                  <div className="card-header">
                    <span className="code">{item.code}</span>

                    {/* Active and inactive dates stacked */}
                    <div className="date-column">
                      <div className="activedate">
                        <TiTick className="check-icon" />
                        <span>{item.activeDate}</span>
                      </div>
                      <div className="inActivedate">
                        <IoClose className="check-icon-danger" />
                        <span>{item.inactiveDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-title">{item.name}</div>
                  <div className="card-shortname">{item.shortName}</div>
                  <div className="card-description">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating Action Buttons */}
        <FloatingActionBar
          actions={{
            clear: {
              onClick: handleClear,
              disabled: false,
            },
            save: { disabled: true },
            search: { disabled: true },
            delete: { disabled: true },
          }}
        />

        <BackToTop />
      </div>
    </>
  );
};

export default CompanyList;
