import React, { useMemo } from 'react';
import upIcon from '../../../assets/icons/up.svg';
import downIcon from '../../../assets/icons/down.svg';
import closeIcon from '../../../assets/icons/close.svg';
import './CartItem.css';

const CartItem = ({ 
  product, // product contains both product data and cart item data
  onQuantityChange, 
  onSizeChange, 
  onRemove 
}) => {
  const baseUrl = 'http://localhost:3001';

  // Создаем отсортированный массив размеров один раз
  const orderedSizes = useMemo(() => {
    if (!product.has_size_selection || !Array.isArray(product.available_sizes)) {
      return ['OS'];
    }
    const sizeOrder = { 'S': 0, 'M': 1, 'L': 2, 'XL': 3 };
    return [...product.available_sizes].sort((a, b) => sizeOrder[a] - sizeOrder[b]);
  }, [product.has_size_selection, product.available_sizes]);

  const handleQuantityButton = (increment) => {
    if (!product.cart_item_id) {
      console.error('Invalid cart item ID');
      return;
    }

    const newValue = increment 
      ? Math.min(9, parseInt(product.quantity) + 1)
      : Math.max(1, parseInt(product.quantity) - 1);
    if (newValue !== product.quantity) {
      onQuantityChange(product.cart_item_id, newValue);
    }
  };

  const handleSizeButton = (increment) => {
    if (!product.cart_item_id) {
      console.error('Invalid cart item ID');
      return;
    }

    if (!product.has_size_selection || !Array.isArray(product.available_sizes)) return;
    
    const currentIndex = orderedSizes.indexOf(product.size);
    if (increment && currentIndex === orderedSizes.length - 1) return;
    if (!increment && currentIndex === 0) return;
    
    const newIndex = increment
      ? currentIndex + 1
      : currentIndex - 1;
    const newSize = orderedSizes[newIndex];
    if (newSize !== product.size) {
      onSizeChange(product.cart_item_id, newSize);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item__image-container">
        <img 
          src={`${baseUrl}${product.cart_image_url}`} 
          alt={product.name} 
          className="cart-item__image" 
        />
      </div>

      <div className={`cart-item__name-container ${product.name.includes('Socks') ? 'cart-item__name-container--socks' : ''}`}>
        <span className="cart-item__name">{product.name}</span>
      </div>

      <div className="cart-item__quantity-spinner">
        <div className="cart-item__quantity-input">
          <input
            type="text"
            value={product.quantity}
            readOnly
            className="cart-item__quantity-field"
          />
        </div>
        <div className="cart-item__quantity-buttons">
          <button 
            className="cart-item__quantity-button cart-item__quantity-button--up"
            onClick={() => handleQuantityButton(true)}
            disabled={product.quantity >= 9}
          >
            <img src={upIcon} alt="Increase quantity" />
          </button>
          <button 
            className="cart-item__quantity-button cart-item__quantity-button--down"
            onClick={() => handleQuantityButton(false)}
            disabled={product.quantity <= 1}
          >
            <img src={downIcon} alt="Decrease quantity" />
          </button>
        </div>
      </div>

      <div className="cart-item__price">
        ${product.price}
      </div>

      <div className="cart-item__size-spinner">
        <div className="cart-item__size-input">
          <input
            type="text"
            value={product.size}
            readOnly
            className="cart-item__size-field"
          />
        </div>
        <div className="cart-item__size-buttons">
          <button 
            className="cart-item__size-button cart-item__size-button--up"
            onClick={() => handleSizeButton(true)}
            disabled={!product.has_size_selection || orderedSizes.indexOf(product.size) === orderedSizes.length - 1}
          >
            <img src={upIcon} alt="Larger size" />
          </button>
          <button 
            className="cart-item__size-button cart-item__size-button--down"
            onClick={() => handleSizeButton(false)}
            disabled={!product.has_size_selection || orderedSizes.indexOf(product.size) === 0}
          >
            <img src={downIcon} alt="Smaller size" />
          </button>
        </div>
      </div>

      <button 
        className="cart-item__close-button"
        onClick={() => product.cart_item_id && onRemove(product.cart_item_id)}
      >
        <img src={closeIcon} alt="Remove item" className="cart-item__close-icon" />
      </button>
    </div>
  );
};

export default CartItem; 