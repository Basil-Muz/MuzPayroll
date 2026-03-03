import { useEffect, useState } from 'react';
import './StickyActionBar.css';

const StickyActionBar = ({ 
  changedCount, 
  onSave, 
  onDiscard,
  isSaving = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(changedCount > 0);
  }, [changedCount]);

  if (!isVisible) return null;

  return (
    <div className="sticky-action-bar">
      <div className="action-bar-content">
        <div className="changes-info">
          <span className="changes-count">{changedCount}</span>
          <span>change{changedCount !== 1 ? 's' : ''} pending</span>
        </div>
        <div className="action-buttons">
          <button 
            className="btn-discard" 
            onClick={onDiscard}
            disabled={isSaving}
          >
            Discard
          </button>
          <button 
            className="btn-save" 
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyActionBar;