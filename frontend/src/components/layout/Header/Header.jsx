import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logoImage from '../../../assets/images/logo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="header__content">
        <Link to="/" className="header__logo-link">
          <img src={logoImage} alt="Doll Life" className="header__logo" draggable="false" />
        </Link>
        
        <nav className="header__nav">
          <Link to="/login" className="header__button">
            Login
          </Link>
          <Link to="/register" className="header__button">
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 