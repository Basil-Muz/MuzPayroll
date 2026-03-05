// import { useMemo } from 'react';
import Select from 'react-select';
import { presetOptions, applyPreset } from '../../utils/permissionPresets';

const PermissionPreset = ({ value, onChange, modules, onApplyPreset }) => {
  const handlePresetChange = (selected) => {
    onChange(selected);
    if (selected && modules) {
      const updatedModules = applyPreset(selected.value, modules);
      onApplyPreset(updatedModules);
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '38px',
      borderRadius: '20px',
      borderColor: '#e4e4e7',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#a855f7',
      },
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected 
        ? 'linear-gradient(135deg, #a855f7, #ec4899)'
        : isFocused 
          ? '#f3e8ff' 
          : 'white',
      color: isSelected ? 'white' : '#1f2937',
    }),
  };

  return (
    <div className="permission-preset">
      <Select
        options={presetOptions}
        value={value}
        onChange={handlePresetChange}
        placeholder="Permission Preset"
        isClearable
        styles={customStyles}
        className="preset-select"
        classNamePrefix="preset"
      />
    </div>
  );
};

export default PermissionPreset;