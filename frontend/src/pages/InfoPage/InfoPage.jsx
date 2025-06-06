import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import WindowTab from '../../components/layout/WindowTab/WindowTab';
import ValidationMessage from '../../components/ui/ValidationMessage/ValidationMessage';
import loading1 from '../../assets/loading1.gif';
import './InfoPage.css';

const InfoPage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, loading: authLoading } = useAuth();
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    country: '',
    fullAddress: '',
    oldPassword: '',
    newPassword: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    country: '',
    fullAddress: ''
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        country: user.country || '',
        fullAddress: user.full_address || '',
        oldPassword: '',
        newPassword: ''
      });
    }
  }, [user, authLoading]);

  const validateForm = () => {
    const newFieldErrors = {
      country: '',
      fullAddress: ''
    };
    let isValid = true;

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
      setValidationError(Object.values(newFieldErrors).find(error => error) || '');
    }
    return isValid;
  };

  const validatePasswords = () => {
    if (formData.oldPassword && !formData.newPassword) {
      setPasswordError('Please enter a new password');
      return false;
    }
    if (!formData.oldPassword && formData.newPassword) {
      setPasswordError('Please enter your old password');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationError('');
    setError('');
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    if (name === 'oldPassword' || name === 'newPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationError('');
    setPasswordError('');

    if (!validateForm()) {
      return;
    }

    // Validate passwords if either field is filled
    if ((formData.oldPassword || formData.newPassword) && !validatePasswords()) {
      return;
    }

    try {
      const updateData = {
        country: formData.country,
        full_address: formData.fullAddress
      };

      // Only include password fields if both are provided
      if (formData.oldPassword && formData.newPassword) {
        updateData.old_password = formData.oldPassword;
        updateData.new_password = formData.newPassword;
      }

      console.log('Sending update data:', updateData);

      const response = await fetch('http://localhost:3001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('Server response:', data);
      } else {
        throw new Error('Server returned an invalid response');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      updateProfile(data);
      navigate('/profile');
    } catch (err) {
      if (err.message === 'Server returned an invalid response') {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'An error occurred while updating profile');
      }
      console.error('Update error:', err);
    }
  };

  const handleClose = () => {
    navigate('/profile');
  };

  if (authLoading) {
    return (
      <OSWindow>
        <WindowTab title="Info">
          <div className="info-loading">
            <img src={loading1} alt="Loading..." draggable="false" />
            <div className="info-loading-text">Loading...</div>
          </div>
        </WindowTab>
      </OSWindow>
    );
  }

  return (
    <OSWindow>
      <WindowTab title="Info" onClose={handleClose}>
        <div className="info-container">
          <ValidationMessage message={error || passwordError || validationError} />
          <form onSubmit={handleSubmit} className="register-form" noValidate>
            <div className="register-form__field">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                disabled
                className="register-form__input--disabled"
              />
            </div>

            <div className="register-form__field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="register-form__input--disabled"
              />
            </div>

            <div className="register-form__field">
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

            <div className="register-form__field">
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

            <div className="register-form__field">
              <label htmlFor="oldPassword">Old Password</label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
              />
            </div>

            <div className="register-form__field">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="register-form__submit">
              Save Changes
            </button>
          </form>
        </div>
      </WindowTab>
    </OSWindow>
  );
};

export default InfoPage; 