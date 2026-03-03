import { useState, useEffect } from 'react';
import './PermissionToggle.css';

const PermissionToggle = ({ value, onChange, disabled = false }) => {
  const [isOn, setIsOn] = useState(value);

  useEffect(() => {
    setIsOn(value);
  }, [value]);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isOn;
    setIsOn(newValue);
    onChange(newValue);
  };

  return (
    <button
      type="button"
      className={`permission-toggle ${isOn ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleToggle}
      disabled={disabled}
      aria-pressed={isOn}
    >
      <span className="toggle-slider" />
      <span className="toggle-label">{isOn ? 'ON' : 'OFF'}</span>
    </button>
  );
};

export default PermissionToggle;