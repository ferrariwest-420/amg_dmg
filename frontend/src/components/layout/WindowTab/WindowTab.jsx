import React from 'react';
import { useNavigate } from 'react-router-dom';
import closeIcon from '../../../assets/images/button.svg';
import './WindowTab.css';

const WindowTab = ({ title, onClose, children }) => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="window-tab">
      <div className="window-tab__header">
        <div className="window-tab__title-bar">
          <div className="window-tab__black-bg" />
          <div className="window-tab__title-container">
            <span className="window-tab__title">{title}</span>
          </div>
          <button className="window-tab__close-btn" onClick={handleClose}>
            <img src={closeIcon} alt="Close" className="window-tab__close-icon" />
          </button>
        </div>
      </div>
      <div className="window-tab__content">
        {children}
      </div>
    </div>
  );
};

export default WindowTab; 