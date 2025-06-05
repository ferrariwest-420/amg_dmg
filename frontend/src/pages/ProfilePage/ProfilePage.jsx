import React from 'react';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import WindowTab from '../../components/layout/WindowTab/WindowTab';
import FolderIcon from '../../components/ui/FolderIcon/FolderIcon';
import documentIcon from '../../assets/icons/document.svg';
import catalogIcon from '../../assets/icons/catalog.svg';
import './ProfilePage.css';

const ProfilePage = () => {
  const folders = [
    { name: 'Info', to: '/profile/info', icon: documentIcon },
    { name: 'Orders', to: '/profile/orders', icon: catalogIcon }
  ];

  return (
    <OSWindow>
      <WindowTab title="Profile">
        <div className="profile-page">
          <div className="profile-page__folders">
            {folders.map((folder, index) => (
              <FolderIcon
                key={folder.name}
                icon={<img src={folder.icon} alt={folder.name} />}
                label={folder.name}
                to={folder.to}
                style={{ marginLeft: index > 0 ? '0px' : '0' }}
              />
            ))}
          </div>
        </div>
      </WindowTab>
    </OSWindow>
  );
};

export default ProfilePage; 