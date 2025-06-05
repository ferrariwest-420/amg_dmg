import React, { useState, useEffect } from 'react';
import scrollUpIcon from '../../../assets/icons/scrollup.svg';
import scrollDownIcon from '../../../assets/icons/scrolldown.svg';
import scrollThumbIcon from '../../../assets/icons/scrollthumb.svg';
import './Scrollbar.css';

const Scrollbar = ({ 
  containerRef,
  contentHeight,
  viewportHeight,
  onScroll 
}) => {
  const [thumbPosition, setThumbPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startThumbPosition, setStartThumbPosition] = useState(0);

  const scrollBarHeight = 394;
  const thumbHeight = 24;
  const trackHeight = 362;
  const maxThumbPosition = trackHeight - thumbHeight;

  const handleScrollUp = () => {
    const newPosition = Math.max(0, thumbPosition - 10);
    setThumbPosition(newPosition);
    const scrollPercent = newPosition / maxThumbPosition;
    onScroll(scrollPercent * (contentHeight - viewportHeight));
  };

  const handleScrollDown = () => {
    const newPosition = Math.min(maxThumbPosition, thumbPosition + 10);
    setThumbPosition(newPosition);
    const scrollPercent = newPosition / maxThumbPosition;
    onScroll(scrollPercent * (contentHeight - viewportHeight));
  };

  const handleThumbMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartThumbPosition(thumbPosition);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const delta = e.clientY - startY;
      const newPosition = Math.max(0, Math.min(maxThumbPosition, startThumbPosition + delta));
      setThumbPosition(newPosition);

      const scrollPercent = newPosition / maxThumbPosition;
      onScroll(scrollPercent * (contentHeight - viewportHeight));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startY, startThumbPosition, maxThumbPosition, contentHeight, viewportHeight, onScroll]);

  // Обновляем позицию ползунка при скролле контейнера
  useEffect(() => {
    const handleContainerScroll = () => {
      if (containerRef.current && !isDragging) {
        const scrollPercent = containerRef.current.scrollTop / (contentHeight - viewportHeight);
        setThumbPosition(scrollPercent * maxThumbPosition);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleContainerScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleContainerScroll);
      }
    };
  }, [containerRef, contentHeight, viewportHeight, isDragging, maxThumbPosition]);

  return (
    <div className="scrollbar">
      <button 
        className="scrollbar__button scrollbar__button--up"
        onClick={handleScrollUp}
      >
        <img src={scrollUpIcon} alt="Scroll up" />
      </button>

      <div className="scrollbar__track">
        <div 
          className="scrollbar__thumb"
          style={{ top: `${thumbPosition}px` }}
          onMouseDown={handleThumbMouseDown}
        >
          <img src={scrollThumbIcon} alt="" />
        </div>
      </div>

      <button 
        className="scrollbar__button scrollbar__button--down"
        onClick={handleScrollDown}
      >
        <img src={scrollDownIcon} alt="Scroll down" />
      </button>
    </div>
  );
};

export default Scrollbar; 