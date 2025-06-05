import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import loadingGif from '../../../assets/loading1.gif';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { 
    id,
    name, 
    price, 
    catalog_image_url
  } = product;
  
  const isLoading = name === '* file not found *';
  const [imageError, setImageError] = useState(false);

  // Добавляем базовый URL для изображений
  const baseUrl = 'http://localhost:3001';
  // Используем loadingGif для состояния загрузки
  const imageUrl = isLoading ? loadingGif : `${baseUrl}${catalog_image_url}`;

  useEffect(() => {
    console.log('Product card rendered:', {
      name,
      imageUrl,
      originalUrl: catalog_image_url
    });
  }, [name, imageUrl, catalog_image_url]);

  const handleImageError = () => {
    console.error('Failed to load image:', imageUrl);
    setImageError(true);
  };

  const handleClick = () => {
    if (!isLoading) {
      navigate(`/product/${id}`);
    }
  };

  return (
    <div 
      className={`product-card ${!isLoading ? 'product-card--clickable' : ''}`}
      onClick={handleClick}
    >
      {/* Фото товара */}
      <img 
        src={imageUrl}
        alt={isLoading ? "Loading..." : name}
        className={isLoading ? "product-card__loading-image" : "product-card__image"}
        onError={handleImageError}
      />
      
      {/* Задний фон */}
      <div className={`product-card__background ${isLoading ? 'product-card__background--loading' : ''}`}></div>
      
      {/* Название товара */}
      <div className="product-card__name-container">
        <div className="product-card__name-text">
          {name}
        </div>
      </div>
      
      {/* Цена товара */}
      {!isLoading && price && (
        <div className="product-card__price-container">
          <div className="product-card__price-text">
            ${price}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
