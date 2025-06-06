import React from 'react';
import { Link } from 'react-router-dom';
import './FolderIcon.css';

const FolderIcon = ({ icon, label, to, style }) => {
  return (
    <Link 
      to={to} 
      className="folder-icon" 
      style={style}
      draggable="false"
    >
      <div className="folder-icon__icon">
        {icon}
      </div>
      <div className="folder-icon__label">
        <span>{label}</span>
      </div>
    </Link>
  );
};

export default FolderIcon; 