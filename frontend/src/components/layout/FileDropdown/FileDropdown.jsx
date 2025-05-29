import React, { useEffect, useRef } from 'react';
import { printAscii } from '../../../utils/printAscii';
import './FileDropdown.css';

const FileDropdown = ({ isOpen, onClose }) => {
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

  const handleOpenInnerArchive = () => {
    // Handle opening inner archive
    onClose();
  };

  const handlePrint = async () => {
    await printAscii();
    onClose();
  };

  return (
    <div className="file-dropdown" ref={dropdownRef}>
      <button className="file-dropdown__button" onClick={handleOpenInnerArchive}>
        <div className="file-dropdown__center-container">
          <div className="file-dropdown__text-container">
            Open Inner Archive
          </div>
        </div>
      </button>
      <div className="file-dropdown__divider" />
      <button className="file-dropdown__button" onClick={handlePrint}>
        <div className="file-dropdown__center-container">
          <div className="file-dropdown__text-container">
            Print
          </div>
        </div>
      </button>
    </div>
  );
};

export default FileDropdown; 