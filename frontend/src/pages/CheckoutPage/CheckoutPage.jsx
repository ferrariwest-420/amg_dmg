import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import WindowTab from '../../components/layout/WindowTab/WindowTab';
import PaymentMethodDropdown from './PaymentMethodDropdown';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();
  const { calculateTotal, cartItems } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    country: '',
    fullAddress: '',
    paymentMethod: 'paypal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (user) {
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
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Your cart is empty');
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
      alert('Failed to process payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <OSWindow>
        <WindowTab title="Checkout">
          <div className="checkout-form">
            Loading...
          </div>
        </WindowTab>
      </OSWindow>
    );
  }

  return (
    <OSWindow>
      <WindowTab title="Checkout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-form__field" style={{ marginTop: 30 }}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
              required
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
              required
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
          <button 
            type="submit" 
            className="checkout-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Payment'}
          </button>
        </form>
      </WindowTab>
    </OSWindow>
  );
};

export default CheckoutPage; 