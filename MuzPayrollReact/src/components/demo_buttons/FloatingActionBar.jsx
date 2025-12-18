import {
  FiSave,
  FiSearch,
  FiX,
  FiTrash2,
  FiPrinter,
  FiPlus
} from "react-icons/fi";
import "./FloatingActionBar.css";

const FloatingActionBar = ({ actions = {} }) => {
  return (
    <div className="floating-action-bar">
      {renderBtn(actions.save, "Save", <FiSave />, "primary")}
      {renderBtn(actions.search, "Search", <FiSearch />)}
      {renderBtn(actions.clear, "Clear", <FiX />)}
      {renderBtn(actions.delete, "Delete", <FiTrash2 />, "danger")}
      {renderBtn(actions.print, "Print", <FiPrinter />)}
      {renderBtn(actions.new, "New Page", <FiPlus />, "accent")}
    </div>
  );
};

const renderBtn = (config, label, icon, variant = "") => {
  if (!config) return null;

  return (
    <button
      className={`fab-btn ${variant}`}
      title={label}
      onClick={config.onClick}
      disabled={config.disabled}
    >
      {icon}
      <span className="tooltip">
        {config.disabled ? `${label} (Disabled)` : label}
      </span>
    </button>
  );
};


export default FloatingActionBar;
