import React, { useState, useEffect } from 'react';
import './RegisterPage.css';
import loading1 from '../../assets/loading1.gif';

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('Initial loading state:', isLoading);
    
    setTimeout(() => {
      console.log('Timer finished, setting loading to false');
      setIsLoading(false);
    }, 1500);
  }, []); // Removed the timer cleanup since we only want it to run once

  console.log('Current loading state:', isLoading);

  if (isLoading) {
    return (
      <div className="window-tab__content">
        <div className="register-loading">
          <img src={loading1} alt="Loading..." />
        </div>
      </div>
    );
  }

  return (
    <div className="window-tab__content">
      <form className="register-form">
        <div className="register-form__field">
          <label>Username</label>
          <input type="text" />
        </div>
        <div className="register-form__field">
          <label>E-mail</label>
          <input type="email" />
        </div>
        <div className="register-form__field">
          <label>Password</label>
          <input type="password" />
        </div>
        <div className="register-form__field">
          <label>Country</label>
          <input type="text" />
        </div>
        <div className="register-form__field">
          <label>Full Address</label>
          <input type="text" />
        </div>
        <button type="submit" className="register-form__submit">
          Save info
        </button>
      </form>
    </div>
  );
};

export default RegisterPage; 