import React from 'react';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import WindowTab from '../../components/layout/WindowTab/WindowTab';
import FolderIcon from '../../components/ui/FolderIcon/FolderIcon';
import posterIcon from '../../assets/icons/poster.svg';
import './GalleryPage.css';

const GalleryPage = () => {
  const folders = [
    { name: 'IMG_01.png', to: '/gallery/img01' },
    { name: 'IMG_02.png', to: '/gallery/img02' },
    { name: 'IMG_03.png', to: '/gallery/img03' }
  ];

  return (
    <OSWindow>
      <WindowTab title="Gallery">
        <div className="gallery-page">
          <div className="gallery-page__folders">
            {folders.map((folder, index) => (
              <FolderIcon
                key={folder.name}
                icon={<img src={posterIcon} alt={folder.name} />}
                label={folder.name}
                to={folder.to}
                style={{ marginLeft: index > 0 ? '50px' : '0' }}
              />
            ))}
          </div>
        </div>
      </WindowTab>
    </OSWindow>
  );
};

export default GalleryPage; 