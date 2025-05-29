import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import FileDropdown from '../FileDropdown/FileDropdown';
import ViewDropdown from '../ViewDropdown/ViewDropdown';
import './ProtectedHeader.css';
import logoImage from '../../../assets/images/logo.png';

const ProtectedHeader = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isFileDropdownOpen, setIsFileDropdownOpen] = useState(false);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleFileDropdown = () => {
    setIsFileDropdownOpen(!isFileDropdownOpen);
    setIsViewDropdownOpen(false);
  };

  const toggleViewDropdown = () => {
    setIsViewDropdownOpen(!isViewDropdownOpen);
    setIsFileDropdownOpen(false);
  };

  const handleOpenInnerArchive = () => {
    // Handle opening inner archive
    setIsFileDropdownOpen(false);
  };

  const handlePrint = () => {
    // Handle print functionality
    setIsFileDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="header__content">
        <Link to="/" className="header__logo-link">
          <img src={logoImage} alt="Doll Life" className="header__logo" />
        </Link>
        
        <nav className="header__nav">
          <div className="header__dropdown-container">
            <button 
              className={`header__button ${isFileDropdownOpen ? 'header__button--active' : ''}`}
              onClick={toggleFileDropdown}
            >
              File
            </button>
            <FileDropdown 
              isOpen={isFileDropdownOpen} 
              onClose={() => setIsFileDropdownOpen(false)}
            />
          </div>
          <div className="header__dropdown-container">
            <button 
              className={`header__button ${isViewDropdownOpen ? 'header__button--active' : ''}`}
              onClick={toggleViewDropdown}
            >
              View
            </button>
            <ViewDropdown 
              isOpen={isViewDropdownOpen} 
              onClose={() => setIsViewDropdownOpen(false)}
            />
          </div>
          <Link to="/cart" className="header__button">
            Cart
          </Link>
          <button onClick={handleLogout} className="header__button">
            Log Out
          </button>
        </nav>
      </div>
    </header>
  );
};

export default ProtectedHeader; 