import React, { useState } from 'react';
import downIcon from '../../assets/icons/checkout-menu-down.svg';
import upIcon from '../../assets/icons/checkout-menu-up.svg';
import './PaymentMethodDropdown.css';

const PaymentMethodDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (method) => {
    onChange(method);
    setOpen(false);
  };

  return (
    <div className="payment-method-dropdown">
      <label className="payment-method-dropdown__label">Payment Method</label>
      <div className="payment-method-dropdown__field">
        <span className="payment-method-dropdown__selected">
          {value === 'card' ? 'Debit Card' : 'PayPal'}
        </span>
        <button
          type="button"
          className="payment-method-dropdown__toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close payment methods menu' : 'Open payment methods menu'}
        >
          <img
            src={open ? upIcon : downIcon}
            alt="toggle dropdown"
            width={10}
            height={6}
          />
        </button>
      </div>
      {open && (
        <div className="payment-method-dropdown__menu">
          <div 
            className="payment-method-dropdown__option"
            onClick={() => handleSelect('paypal')}
          >
            PayPal
          </div>
          <div className="payment-method-dropdown__divider" />
          <div 
            className="payment-method-dropdown__option"
            onClick={() => handleSelect('card')}
          >
            Debit Card
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodDropdown; 