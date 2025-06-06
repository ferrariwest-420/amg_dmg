import React from 'react';
import { useAuth } from '../../context/AuthContext';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import FolderIcon from '../../components/ui/FolderIcon/FolderIcon';
import pixelLogo from '../../assets/images/pixel-logo.png';
import catalogIcon from '../../assets/icons/catalog.svg';
import galleryIcon from '../../assets/icons/gallery.svg';
import profileIcon from '../../assets/icons/profile.svg';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <OSWindow>
      <div className="home-page">
        <img 
          src={pixelLogo} 
          alt="Doll Life" 
          className={`home-page__logo ${isAuthenticated ? 'home-page__logo--faded' : ''}`}
          draggable="false"
        />
        
        {isAuthenticated && (
          <div className="home-page__icons">
            <FolderIcon
              icon={<img src={catalogIcon} alt="Catalog" draggable="false" />}
              label="Catalog"
              to="/catalog"
              style={{ left: '33px', top: '30px' }}
            />
            <FolderIcon
              icon={<img src={galleryIcon} alt="Gallery" draggable="false" />}
              label="Gallery"
              to="/gallery"
              style={{ left: '151px', top: '30px' }}
            />
            <FolderIcon
              icon={<img src={profileIcon} alt="Profile" draggable="false" />}
              label="Profile"
              to="/profile"
              style={{ left: '269px', top: '30px' }}
            />
          </div>
        )}
      </div>
    </OSWindow>
  );
};

export default HomePage; 