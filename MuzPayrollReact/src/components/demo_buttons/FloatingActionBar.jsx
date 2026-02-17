import {
  FiSave,
  FiSearch,
  FiX,
  FiTrash2,
  FiPrinter,
  FiPlus,
} from "react-icons/fi";
import { HiOutlineRefresh } from "react-icons/hi";
import { useState } from "react";
import "./FloatingActionBar.css";
import { IoMenu } from "react-icons/io5";
const FloatingActionBar = ({ actions = {} }) => {
  const [fabOpen, setFabOpen] = useState(false);
  // console.log("Save disabled:", actions.save.disabled);

  return (
    <div className={`floating-action-bar ${fabOpen ? "open" : ""}`}>
      {/* Mobile toggle */}
      <button
        className="fab-toggle"
        onClick={() => setFabOpen((prev) => !prev)}
        aria-label="Actions"
      >
        <IoMenu size={23} />
      </button>

      {/* Action buttons */}
      <div className="fab-actions">
        {renderBtn(actions.save, "Save", <FiSave />, "primary")}
        {renderBtn(actions.search, "Search", <FiSearch />)}
        {renderBtn(actions.clear, "Clear", <FiX />)}
        {renderBtn(actions.delete, "Delete", <FiTrash2 />, "danger")}
        {renderBtn(actions.print, "Print", <FiPrinter />)}
        {renderBtn(actions.new, "New Page", <FiPlus />, "accent")}
        {renderBtn(actions.refresh, "Refresh", <HiOutlineRefresh />, "accent")}
      </div>
    </div>
  );
};

const renderBtn = (config, label, icon, variant = "") => {
  if (!config) return null;

  return (
    <button
      className={`fab-btn ${variant}`}
      // title={label}
      onClick={config.onClick}
      disabled={config.disabled}
      aria-label={label}
    >
      {icon}
      <span className="tooltip">
        {config.disabled ? `${label} (Disabled)` : label}
      </span>
    </button>
  );
};

export default FloatingActionBar;
