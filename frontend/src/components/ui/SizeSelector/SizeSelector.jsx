import React from 'react';
import './SizeSelector.css';

const SizeSelector = ({ selectedSize, onSizeSelect, sizes = ['S', 'M', 'L', 'XL'] }) => {
  return (
    <div className="size-selector">
      <div className="size-selector__label-container">
        <div className="size-selector__label">Size</div>
      </div>
      <div className="size-selector__buttons">
        {sizes.map((size) => (
          <button
            key={size}
            className={`size-selector__button ${size === 'XL' ? 'size-selector__button--xl' : ''} ${selectedSize === size ? 'size-selector__button--selected' : ''}`}
            onClick={() => onSizeSelect(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector; 