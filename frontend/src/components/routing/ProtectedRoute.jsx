import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import loading1 from '../../assets/loading1.gif';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'transparent',
        pointerEvents: 'none'
      }}>
        <img src={loading1} alt="Loading..." style={{ width: '70px', height: '64px', imageRendering: 'pixelated' }} draggable="false" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Сохраняем URL для перенаправления после входа
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 