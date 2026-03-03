import { FaSearch } from 'react-icons/fa';
import PermissionPreset from './PermissionPreset';
import './PermissionToolbar.css';

const PermissionToolbar = ({
  searchTerm,
  onSearchChange,
  moduleFilter,
  onModuleFilterChange,
  modules,
  preset,
  onPresetChange,
  onApplyPreset,
  onSave
}) => {
  return (
    <div className="permission-toolbar">
      <div className="toolbar-left">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search screens..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>

        <select 
          className="module-filter"
          value={moduleFilter}
          onChange={(e) => onModuleFilterChange(e.target.value)}
        >
          <option value="">All Modules</option>
          {modules.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="toolbar-right">
        <PermissionPreset
          value={preset}
          onChange={onPresetChange}
          modules={modules}
          onApplyPreset={onApplyPreset}
        />
        
        <button className="btn-save-toolbar" onClick={onSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PermissionToolbar;