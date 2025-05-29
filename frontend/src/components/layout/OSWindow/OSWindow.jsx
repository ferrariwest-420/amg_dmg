import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import Header from '../Header/Header';
import ProtectedHeader from '../ProtectedHeader/ProtectedHeader';
import './OSWindow.css';

const OSWindow = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="os-window-wrapper">
      <div className="os-window">
        {isAuthenticated ? <ProtectedHeader /> : <Header />}
        <div className="os-window__content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OSWindow; 