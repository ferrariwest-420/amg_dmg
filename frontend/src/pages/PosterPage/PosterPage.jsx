import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import WindowTab from '../../components/layout/WindowTab/WindowTab';
import './PosterPage.css';

const PosterPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posterUrl, setPosterUrl] = useState(null);
  const posterNumber = id.replace('img', '');

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posters/${posterNumber}`);
        const data = await response.json();
        setPosterUrl(data.imageUrl);
      } catch (error) {
        console.error('Error fetching poster:', error);
      }
    };

    fetchPoster();
  }, [posterNumber]);

  const handleClose = () => {
    navigate('/gallery');
  };

  return (
    <OSWindow>
      <WindowTab title={`IMG_${posterNumber.padStart(2, '0')}.png`} onClose={handleClose}>
        <div className="poster-page">
          <div className="poster-page__container">
            {posterUrl && (
              <img 
                src={`http://localhost:3001${posterUrl}`}
                alt={`Poster ${posterNumber}`} 
                className="poster-page__image"
                draggable="false"
              />
            )}
          </div>
        </div>
      </WindowTab>
    </OSWindow>
  );
};

export default PosterPage; 