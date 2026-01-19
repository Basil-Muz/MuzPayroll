import React, { useState, useEffect } from "react";
import "./search.css";

function Search({ onSubmit, initialChecked = false }) {
  const [groupChecked, setGroupChecked] = useState(initialChecked);

  // Reset checkbox if initialChecked changes (for clearing)
  useEffect(() => {
    setGroupChecked(initialChecked);
  }, [initialChecked]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(groupChecked); // Pass the checked state back
  };

  return (
    <div className="search-container show">
      <div className="sub-container">
        <div className="heading">Grouping</div>
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-items">
            <label htmlFor="activeInactive">Active-Inactive</label>
            <input
              type="checkbox"
              id="activeInactive"
              checked={groupChecked}
              onChange={(e) => setGroupChecked(e.target.checked)}
            />
          </div>
          <button className="search-button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Search;
