import { useMemo, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useLoader } from "../../context/LoaderContext.jsx";
import { ensureMinDuration } from "../../utils/loaderDelay.js";

// Components
import Header from "../../components/Header/Header.jsx";
import ModulePermissionCard from "../../components/permissions/ModulePermissionCard";
import PermissionToolbar from "../../components/permissions/PermissionToolbar";
import StickyActionBar from "../../components/permissions/StickyActionBar";
import { LocationGroupMultiSelect } from "../../components/multiSelectHeader/LocationGroupMultiSelect.jsx";

// Services
import { getSolutionList } from "../../services/LocationGroupRightsMapping.service.js";
import { getLocationGroupsList } from "../../services/locationGroup.service.js";

// Utils
import { handleApiError } from "../../utils/errorToastResolver.js";
import { PRESETS } from "../../utils/permissionPresets.js";

// Styles
import "./LocationGroupRights.css";

// Mock Data Structure
const MODULES_DATA = [
  {
    id: 1,
    name: "Payroll",
    screens: [
      { id: 101, name: "My Dashboard", permissions: { allow: true, add: false, edit: false, delete: false, print: false, save: false } },
      { id: 102, name: "Leave Application", permissions: { allow: true, add: true, edit: true, delete: false, print: false, save: true } },
      { id: 103, name: "Salary Slip", permissions: { allow: true, add: false, edit: false, delete: false, print: true, save: false } },
      { id: 104, name: "Tax Declaration", permissions: { allow: true, add: true, edit: true, delete: false, print: true, save: true } },
    ]
  },
  {
    id: 2,
    name: "HR Management",
    screens: [
      { id: 201, name: "Employee Directory", permissions: { allow: true, add: false, edit: false, delete: false, print: true, save: false } },
      { id: 202, name: "Attendance Regularization", permissions: { allow: true, add: true, edit: true, delete: false, print: false, save: true } },
      { id: 203, name: "Shift Management", permissions: { allow: false, add: false, edit: false, delete: false, print: false, save: false } },
    ]
  },
  {
    id: 3,
    name: "Reports",
    screens: [
      { id: 301, name: "Payroll Summary", permissions: { allow: true, add: false, edit: false, delete: false, print: true, save: false } },
      { id: 302, name: "Attendance Report", permissions: { allow: true, add: false, edit: false, delete: false, print: true, save: false } },
      { id: 303, name: "Tax Report", permissions: { allow: true, add: false, edit: false, delete: false, print: true, save: false } },
    ]
  }
];

export default function LocationGroupRights() {
  const [modules, setModules] = useState(MODULES_DATA);
  const [originalModules, setOriginalModules] = useState(MODULES_DATA);
  const [selectedLocationGroup, setSelectedLocationGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [preset, setPreset] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [changedScreens, setChangedScreens] = useState(new Set());
  
  const { showRailLoader, hideLoader } = useLoader();

  // Filter modules based on search and module filter
  const filteredModules = useMemo(() => {
    return modules
      .filter(module => !moduleFilter || module.id === Number(moduleFilter))
      .map(module => ({
        ...module,
        screens: module.screens.filter(screen =>
          screen.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }))
      .filter(module => module.screens.length > 0);
  }, [modules, searchTerm, moduleFilter]);

  // Track changes
  const changedCount = changedScreens.size;

  const handlePermissionChange = (moduleId, screenId, permission, value) => {
    setModules(prev => {
      const newModules = prev.map(module => {
        if (module.id !== moduleId) return module;
        
        return {
          ...module,
          screens: module.screens.map(screen => {
            if (screen.id !== screenId) return screen;
            
            // If allow is turned off, disable all other permissions
            const newPermissions = { ...screen.permissions };
            
            if (permission === 'allow' && !value) {
              // Turn off all permissions when allow is disabled
              newPermissions.allow = false;
              newPermissions.add = false;
              newPermissions.edit = false;
              newPermissions.delete = false;
              newPermissions.print = false;
              newPermissions.save = false;
            } else {
              newPermissions[permission] = value;
            }
            
            return {
              ...screen,
              permissions: newPermissions
            };
          })
        };
      });
      
      // Update changed screens set
      const newChangedScreens = new Set();
      newModules.forEach(module => {
        module.screens.forEach(screen => {
          const originalScreen = originalModules
            .find(m => m.id === module.id)
            ?.screens.find(s => s.id === screen.id);
            
          if (JSON.stringify(screen.permissions) !== JSON.stringify(originalScreen?.permissions)) {
            newChangedScreens.add(`${module.id}-${screen.id}`);
          }
        });
      });
      
      setChangedScreens(newChangedScreens);
      
      // If preset was selected but we made manual changes, show "Custom"
      if (preset && newChangedScreens.size > 0) {
        setPreset({ value: 'custom', label: 'Custom' });
      }
      
      return newModules;
    });
  };

  const handleApplyPreset = (updatedModules) => {
    setModules(updatedModules);
    
    // Track changes
    const newChangedScreens = new Set();
    updatedModules.forEach(module => {
      module.screens.forEach(screen => {
        const originalScreen = originalModules
          .find(m => m.id === module.id)
          ?.screens.find(s => s.id === screen.id);
          
        if (JSON.stringify(screen.permissions) !== JSON.stringify(originalScreen?.permissions)) {
          newChangedScreens.add(`${module.id}-${screen.id}`);
        }
      });
    });
    
    setChangedScreens(newChangedScreens);
  };

  const handleSave = async () => {
    if (changedCount === 0) return;
    
    setIsSaving(true);
    showRailLoader("Saving permissions...");
    
    try {
      // Prepare payload
      const payload = modules.map(module => ({
        moduleId: module.id,
        screens: module.screens.map(screen => ({
          screenId: screen.id,
          permissions: screen.permissions
        }))
      }));
      
      console.log("Saving permissions:", payload);
      
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update original state after successful save
      setOriginalModules(JSON.parse(JSON.stringify(modules)));
      setChangedScreens(new Set());
      
      toast.success("Permissions saved successfully!");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSaving(false);
      hideLoader();
    }
  };

  const handleDiscard = () => {
    if (changedCount === 0) return;
    
    // Revert to original state
    setModules(JSON.parse(JSON.stringify(originalModules)));
    setChangedScreens(new Set());
    setPreset(null);
    
    toast.success("Changes discarded");
  };

  const handleLocationGroupChange = (group) => {
    setSelectedLocationGroup(group);
    // In real app, fetch permissions for this location group
    toast.success(`Loading permissions for ${group?.name || 'selected group'}`);
  };

  return (
    <div className="lgr-container">
      <Header backendError={[]} />
      
      <div className="lgr-content">
        <div className="lgr-header-section">
          <div>
            <h1 className="page-title">Location Group Rights</h1>
            <p className="page-subtitle">
              Manage screen-level permissions for selected location group
            </p>
          </div>
          
          <div className="location-group-selector">
            <LocationGroupMultiSelect
              options={GROUPS}
              value={selectedLocationGroup ? [selectedLocationGroup] : []}
              onChange={(groups) => handleLocationGroupChange(groups[0])}
              placeholder="Select Location Group"
              isMulti={false}
            />
          </div>
        </div>

        <PermissionToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          moduleFilter={moduleFilter}
          onModuleFilterChange={setModuleFilter}
          modules={modules}
          preset={preset}
          onPresetChange={setPreset}
          onApplyPreset={handleApplyPreset}
          onSave={handleSave}
        />

        <div className="modules-container">
          {filteredModules.length > 0 ? (
            filteredModules.map(module => (
              <ModulePermissionCard
                key={module.id}
                module={module}
                screens={module.screens}
                onPermissionChange={handlePermissionChange}
                isChanged={module.screens.some(screen => 
                  changedScreens.has(`${module.id}-${screen.id}`)
                )}
              />
            ))
          ) : (
            <div className="no-results">
              <p>No screens found matching your criteria</p>
            </div>
          )}
        </div>

        <StickyActionBar
          changedCount={changedCount}
          onSave={handleSave}
          onDiscard={handleDiscard}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}