import React, { useEffect, useRef } from 'react';
import './ViewDropdown.css';

const ViewDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleShowCredits = () => {
    // Handle showing credits
    onClose();
  };

  const handleAbout = () => {
    onClose();
  };

  return (
    <div className="view-dropdown" ref={dropdownRef}>
      <button className="view-dropdown__button" onClick={handleShowCredits}>
        <div className="view-dropdown__center-container">
          <div className="view-dropdown__text-container">
            Show Credits
          </div>
        </div>
      </button>
      <div className="view-dropdown__divider" />
      <button className="view-dropdown__button" onClick={handleAbout}>
        <div className="view-dropdown__center-container">
          <div className="view-dropdown__text-container">
            About
          </div>
        </div>
      </button>
    </div>
  );
};

export default ViewDropdown; 