import React from 'react';
import './LoadingScreen.css';
import loading1 from '../../../assets/loading1.gif';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-screen__content">
        <img src={loading1} alt="Loading..." className="loading-screen__animation" />
        <div className="loading-screen__brain-icon"></div>
      </div>
    </div>
  );
};

export default LoadingScreen; 