import { useState } from 'react';
import PermissionToggle from './PermissionToggle';
import './ModulePermissionCard.css';

const PERMISSION_COLUMNS = [
  { key: 'allow', label: 'Allow' },
  { key: 'add', label: 'Add' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
  { key: 'print', label: 'Print' },
  { key: 'save', label: 'Save' },
];

const ModulePermissionCard = ({ 
  module, 
  screens, 
  onPermissionChange,
  isChanged = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectAll, setSelectAll] = useState({});

  const handleSelectAll = (column) => {
    const newValue = !selectAll[column];
    setSelectAll(prev => ({ ...prev, [column]: newValue }));
    
    // Apply to all screens in this module
    screens.forEach(screen => {
      onPermissionChange(module.id, screen.id, column, newValue);
    });
  };

  const getEnabledCount = () => {
    return screens.filter(s => s.permissions.allow).length;
  };

  return (
    <div className={`module-card ${isChanged ? 'changed' : ''}`}>
      <div className="module-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="module-title">
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
            ▶
          </span>
          <h3>{module.name}</h3>
          <span className="screen-count">
            ({getEnabledCount()}/{screens.length} Screens Enabled)
          </span>
        </div>
        {isChanged && <span className="changed-badge">Modified</span>}
      </div>

      {isExpanded && (
        <div className="permission-table-container">
          <table className="permission-table">
            <thead>
              <tr>
                <th className="screen-column">Screen</th>
                {PERMISSION_COLUMNS.map(col => (
                  <th key={col.key} className="permission-column">
                    <div className="column-header">
                      <span>{col.label}</span>
                      <button
                        className="select-all-btn"
                        onClick={() => handleSelectAll(col.key)}
                        title={`Select all ${col.label}`}
                      >
                        Select All
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {screens.map(screen => (
                <tr 
                  key={screen.id} 
                  className={screen.isChanged ? 'changed-row' : ''}
                >
                  <td className="screen-name">
                    {screen.name}
                    {screen.description && (
                      <span className="screen-tooltip">ⓘ</span>
                    )}
                  </td>
                  {PERMISSION_COLUMNS.map(col => (
                    <td key={col.key}>
                      <PermissionToggle
                        value={screen.permissions[col.key]}
                        onChange={(value) => 
                          onPermissionChange(module.id, screen.id, col.key, value)
                        }
                        disabled={col.key !== 'allow' && !screen.permissions.allow}
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