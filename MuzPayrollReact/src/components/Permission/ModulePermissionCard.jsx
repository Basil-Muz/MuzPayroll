import { useState, useEffect } from "react";
import "./ModulePermissionCard.css";

const PERMISSION_COLUMNS = [
  { key: "egrView", label: "Allow" },
  { key: "egrAdd", label: "Add" },
  { key: "egrEdit", label: "Edit" },
  { key: "egrDelete", label: "Delete" },
  { key: "egrPrint", label: "Print" },
];

const ModulePermissionCard = ({
  module,
  screens,
  onPermissionChange,
  onSave,
  onSetPermissions,
  isChanged = false,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [localScreens, setLocalScreens] = useState(screens);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setLocalScreens(screens);
  }, [screens]);

  // Check for changes
  useEffect(() => {
    const changesExist = JSON.stringify(screens) !== JSON.stringify(localScreens);
    setHasChanges(changesExist);
  }, [localScreens, screens]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getEnabledCount = () => {
    return localScreens.filter((s) => s.egrView).length;
  };

  // Handle checkbox change for individual permissions
  const handlePermissionChange = (screenId, column, value) => {
    setLocalScreens(prevScreens =>
      prevScreens.map(screen =>
        screen.egrEntityGroupRightID === screenId
          ? { ...screen, [column]: value }
          : screen
      )
    );
  };

  // Handle select all screens
  const handleSelectAllScreens = () => {
    if (selectAll) {
      setSelectedScreens([]);
    } else {
      setSelectedScreens(localScreens.map(s => s.egrEntityGroupRightID));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual screen selection
  const handleScreenSelect = (screenId) => {
    setSelectedScreens(prev => {
      const newSelection = prev.includes(screenId)
        ? prev.filter(id => id !== screenId)
        : [...prev, screenId];
      
      // Update select all state
      setSelectAll(newSelection.length === localScreens.length);
      return newSelection;
    });
  };

  // Handle select all in column for selected screens only
  const handleSelectAllInColumn = (column) => {
    if (selectedScreens.length === 0) {
      alert("Please select at least one screen first");
      return;
    }

    const selectedScreensData = localScreens.filter(s => 
      selectedScreens.includes(s.egrEntityGroupRightID)
    );
    
    const currentValues = selectedScreensData.map(s => s[column]);
    const allEnabled = currentValues.every(v => v === true);
    const newValue = !allEnabled;

    // Apply to selected screens only
    setLocalScreens(prevScreens =>
      prevScreens.map(screen =>
        selectedScreens.includes(screen.egrEntityGroupRightID)
          ? { ...screen, [column]: newValue }
          : screen
      )
    );
  };

  // Handle set permissions for selected screens
  const handleSetPermissions = () => {
    if (selectedScreens.length === 0) {
      alert("Please select at least one screen to set permissions");
      return;
    }

    const selectedPermissions = localScreens
      .filter(s => selectedScreens.includes(s.egrEntityGroupRightID))
      .map(s => ({
        screenId: s.egrEntityGroupRightID,
        permissions: {
          egrView: s.egrView,
          egrAdd: s.egrAdd,
          egrEdit: s.egrEdit,
          egrDelete: s.egrDelete,
          egrPrint: s.egrPrint
        }
      }));

    onSetPermissions(module.id, selectedPermissions);
  };

  // Handle save all changes
  const handleSave = () => {
    // Find all changed screens
    const changedScreens = localScreens.filter((localScreen, index) => {
      const originalScreen = screens[index];
      return JSON.stringify(localScreen) !== JSON.stringify(originalScreen);
    });

    onSave(module.id, changedScreens);
    setHasChanges(false);
  };

  const areAllInColumnSelected = (column, screenList = localScreens) => {
    return screenList.length > 0 && screenList.every(s => s[column] === true);
  };

  const areAnyInColumnSelected = (column, screenList = localScreens) => {
    return screenList.some(s => s[column] === true);
  };

  return (
    <div className={`module-section ${isChanged || hasChanges ? "changed" : ""}`}>
      <div className="module-section-header" onClick={toggleExpand}>
        <div className="header-left">
          <button
            className={`expand-btn ${isExpanded ? "expanded" : ""}`}
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="chevron-icon"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="module-section-title">
            <h3>{module.name}</h3>
            <span className="enabled-badge">
              {getEnabledCount()}/{localScreens.length} Screens Enabled
            </span>
          </div>
        </div>

        <div className="header-right">
          {(isChanged || hasChanges) && (
            <span className="changed-indicator">● Modified</span>
          )}
          <span className="screen-count-mobile">{localScreens.length} screens</span>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="set-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSetPermissions();
              }}
              disabled={selectedScreens.length === 0}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V3M12 15L8 11M12 15L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Set Permissions
            </button>
            
            <button
              className="save-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              disabled={!hasChanges}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H16L20 8V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 4V8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="permission-grid-container">
          <table className="permission-grid">
            <thead>
              <tr>
                <th className="selection-column">
                  <div className="selection-header">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllScreens}
                      id={`select-all-${module.id}`}
                    />
                    <label htmlFor={`select-all-${module.id}`}>Select All</label>
                  </div>
                </th>
                <th className="option-type-column">Type</th>
                <th className="option-name-column">Option</th>

                {PERMISSION_COLUMNS.map((col) => (
                  <th key={col.key} className="permission-column">
                    <div className="column-header">
                      <span>{col.label}</span>
                      <button
                        className={`select-all-btn ${
                          areAllInColumnSelected(col.key, localScreens)
                            ? "all-selected"
                            : areAnyInColumnSelected(col.key, localScreens)
                              ? "some-selected"
                              : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAllInColumn(col.key);
                        }}
                      >
                        {areAllInColumnSelected(col.key, localScreens)
                          ? "✓ All"
                          : "Select All"}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {localScreens.map((screen) => (
                <tr 
                  key={screen.egrEntityGroupRightID}
                  className={selectedScreens.includes(screen.egrEntityGroupRightID) ? "selected-row" : ""}
                >
                  <td className="selection-cell">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedScreens.includes(screen.egrEntityGroupRightID)}
                      onChange={() => handleScreenSelect(screen.egrEntityGroupRightID)}
                      id={`screen-${screen.egrEntityGroupRightID}`}
                    />
                  </td>
                  <td className="option-type">{screen.optionType}</td>
                  <td className="option-name">
                    <span>{screen.optionCode}</span>
                  </td>

                  {PERMISSION_COLUMNS.map((col) => (
                    <td key={col.key}>
                      <input
                        type="checkbox"
                        className="permission-checkbox"
                        checked={screen[col.key] || false}
                        onChange={(e) =>
                          handlePermissionChange(
                            screen.egrEntityGroupRightID,
                            col.key,
                            e.target.checked
                          )
                        }
                        disabled={col.key !== "egrView" && !screen.egrView}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ModulePermissionCard;