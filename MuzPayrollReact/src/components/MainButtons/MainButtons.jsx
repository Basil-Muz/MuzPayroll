// import React, { useState } from 'react';
import "../MainButtons/MainButtons.css"; // optional: external CSS
import { FaSave } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { MdAddCard } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdLocalPrintshop } from "react-icons/md";
import { GrNewWindow } from "react-icons/gr";

function ManinButtons({ toggleForm, onFlagChange }) {
  const sendFlagToParent = () => {
    // You can send true or false
    onFlagChange(true);
  };
  return (
    <div className="main-container">
      <div className="form-actions">
        <button type="submit" title="Save" disabled>
          {" "}
          <FaSave size={20} style={{ marginRight: "6px" }} />
          <span className="save">Save</span>
        </button>
      </div>
      <div onClick={sendFlagToParent} className="form-actions">
        <button type="reset" title="Cancel">
          {" "}
          <MdOutlineCancel size={20} style={{ marginRight: "6px" }} />
          <span className="cancel">Cancel</span>
        </button>
      </div>
      <div onClick={toggleForm} className="form-actions">
        <button type="new" title="New Page">
          {" "}
          <MdAddCard size={20} style={{ marginRight: "4px" }} />
          <span className="new">New Page</span>
        </button>
      </div>
      <div className="form-actions">
        <button type="search" title="Search" disabled>
          {" "}
          <FaSearch size={20} style={{ marginRight: "4px" }} />
          <span className="search">Search</span>
        </button>
      </div>
      <div className="form-actions">
        <button type="delete" title="Delete" disabled>
          {" "}
          <RiDeleteBinLine size={24} style={{ marginRight: "4px" }} />
          <span className="delete">Delete</span>
        </button>
      </div>
      <div className="form-actions">
        <button type="print" title="Print" disabled>
          {" "}
          <MdLocalPrintshop size={24} style={{ marginRight: "4px" }} />
          <span className="print">Print</span>
        </button>
      </div>
    </div>
  );
}

export default ManinButtons;
