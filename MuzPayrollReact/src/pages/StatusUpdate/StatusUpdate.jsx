import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import StatusSearch from "./StatusSearch";
import Header from "../../components/Header/Header";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import "./StatusUpdate.css";

const StatusUpdate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [renderSearch, setRenderSearch] = useState(false);

  // Open on page load
  useEffect(() => {
    setRenderSearch(true);
    setIsOpen(true);
  }, []);

  // Toggle popup
  const toggleSearch = () => {
    if (isOpen) {
      // start close animation
      setIsOpen(false);

      // unmount after animation
      setTimeout(() => {
        setRenderSearch(false);
      }, 400);
    } else {
      setRenderSearch(true);
      setIsOpen(true);
    }
  };

  const handleFilterApply = (filters) => {
    console.log(filters);

    // close after apply
    setIsOpen(false);
    setTimeout(() => {
      setRenderSearch(false);
    }, 400);
  };

  return (
    <>
      <Header />

      <div className="statusupdate-page">
        <div className="header-section">
          <h2 className="page-title">Status Update</h2>
        </div>
        <div className="actions">
          <button
            className={`icon-btn ${isOpen ? "active" : ""}`}
            onClick={toggleSearch}
          >
            <FaSearch />
          </button>
        </div>

        {/* Popup */}
        {renderSearch && (
          <StatusSearch isOpen={isOpen} onApply={handleFilterApply} />
        )}

        <FloatingActionBar
          actions={{
            clear: { disabled: false },
            save: { disabled: false },
            delete: { disabled: true },
            search: { disabled: true },
            refresh: { disabled: false },
          }}
        />

        <BackToTop />
      </div>
    </>
  );
};

export default StatusUpdate;
