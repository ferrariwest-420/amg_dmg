import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { name, description, image, price, sizes } = product;

  return (
    <div className="product-card">
      <div className="product-card__header">
        <h3 className="product-card__title">{name}</h3>
        <span className="product-card__price">{price}</span>
      </div>
      
      <div className="product-card__image-container">
        <img src={image} alt={name} className="product-card__image" />
      </div>
      
      <div className="product-card__details">
        <p className="product-card__description">{description}</p>
        
        <div className="product-card__sizes">
          {sizes.map((size) => (
            <button 
              key={size} 
              className="product-card__size-btn"
            >
              {size}
            </button>
          ))}
        </div>
        
        <button className="product-card__add-btn">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard; 