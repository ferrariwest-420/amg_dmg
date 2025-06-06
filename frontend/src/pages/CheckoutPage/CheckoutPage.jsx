import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import WindowTab from '../../components/layout/WindowTab/WindowTab';
import PaymentMethodDropdown from './PaymentMethodDropdown';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ValidationMessage from '../../components/ui/ValidationMessage/ValidationMessage';
import loading1 from '../../assets/loading1.gif';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { calculateTotal, cartItems } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    country: '',
    fullAddress: '',
    paymentMethod: 'paypal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    country: '',
    fullAddress: ''
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && user) {
      const updates = {};
      if (user.email) updates.email = user.email;
      if (user.country) updates.country = user.country;
      if (user.full_address) updates.fullAddress = user.full_address;

      if (Object.keys(updates).length > 0) {
        setFormData(prev => ({
          ...prev,
          ...updates
        }));
      }
    }
  }, [user, authLoading]);

  const validateForm = () => {
    const newFieldErrors = {
      email: '',
      country: '',
      fullAddress: ''
    };
    let isValid = true;

    if (!formData.email || formData.email.trim() === '') {
      newFieldErrors.email = 'Email is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newFieldErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    if (!formData.country || formData.country.trim() === '') {
      newFieldErrors.country = 'Country is required';
      isValid = false;
    }

    if (!formData.fullAddress || formData.fullAddress.trim() === '') {
      newFieldErrors.fullAddress = 'Full address is required';
      isValid = false;
    }

    setFieldErrors(newFieldErrors);
    if (!isValid) {
      setError(Object.values(newFieldErrors).find(error => error) || '');
    }
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          delivery_address: formData.fullAddress,
          payment_method: formData.paymentMethod,
          email: formData.email,
          country: formData.country
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      navigate(`/profile/orders/${data.order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to process payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <OSWindow>
        <WindowTab title="Checkout">
          <div className="checkout-form__loading">
            <img src={loading1} alt="Loading..." draggable="false" />
            <div className="checkout-form__loading-text">Loading...</div>
          </div>
        </WindowTab>
      </OSWindow>
    );
  }

  return (
    <OSWindow>
      <WindowTab title="Checkout">
        <div className="checkout-container">
          <ValidationMessage message={error} />
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <div className="checkout-form__field" style={{ marginTop: 30 }}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={fieldErrors.email ? 'error' : ''}
              />
            </div>
            <div className="checkout-form__field">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={fieldErrors.country ? 'error' : ''}
              />
            </div>
            <div className="checkout-form__field">
              <label htmlFor="fullAddress">Full Address</label>
              <input
                type="text"
                id="fullAddress"
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleChange}
                className={fieldErrors.fullAddress ? 'error' : ''}
              />
            </div>
            <PaymentMethodDropdown 
              value={formData.paymentMethod} 
              onChange={handlePaymentMethodChange} 
            />
            <div className="checkout-form__total-container">
              <div className="checkout-form__total-label-container">
                <span className="checkout-form__total-label">Total Amount:</span>
              </div>
              <div className="checkout-form__total-value-container">
                <span className="checkout-form__total-value">${calculateTotal()}</span>
              </div>
            </div>
            {isSubmitting ? (
              <div className="checkout-form__loading">
                <img src={loading1} alt="Loading..." draggable="false" />
                <div className="checkout-form__loading-text">
                  Processing...
                </div>
              </div>
            ) : (
              <button 
                type="submit" 
                className="checkout-form__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Payment'}
              </button>
            )}
          </form>
        </div>
      </WindowTab>
    </OSWindow>
  );
};

export default CheckoutPage; 