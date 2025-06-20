import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import WindowTab from '../../components/layout/WindowTab/WindowTab';
import loading1 from '../../assets/loading1.gif';
import './RegisterPage.css';

const ValidationMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="validation-message">
      {message}
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    country: '',
    full_address: '',
    password: '',
    passwordRepeat: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
    full_address: '',
    country: ''
  });

  // Получение текущего сообщения валидации для отображения
  const getCurrentValidationMessage = () => {
    if (error) return error;
    if (fieldErrors.username) return fieldErrors.username;
    if (fieldErrors.email) return fieldErrors.email;
    if (fieldErrors.password) return fieldErrors.password;
    if (fieldErrors.passwordRepeat) return fieldErrors.passwordRepeat;
    if (fieldErrors.full_address) return fieldErrors.full_address;
    if (fieldErrors.country) return fieldErrors.country;
    return '';
  };

  const validateUsername = (username) => {
    if (!username || username.trim() === '') {
      setFieldErrors(prev => ({
        ...prev,
        username: 'Username is required'
      }));
      return false;
    }
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      setFieldErrors(prev => ({
        ...prev,
        username: 'Username can only contain Latin letters and numbers'
      }));
      return false;
    }
    setFieldErrors(prev => ({ ...prev, username: '' }));
    return true;
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      setFieldErrors(prev => ({
        ...prev,
        email: 'Email is required'
      }));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
      return false;
    }
    setFieldErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  const validatePassword = (password) => {
    if (!password || password.trim() === '') {
      setFieldErrors(prev => ({
        ...prev,
        password: 'Password is required'
      }));
      return false;
    }
    if (password.length < 6) {
      setFieldErrors(prev => ({
        ...prev,
        password: 'Password must be at least 6 characters long'
      }));
      return false;
    }
    setFieldErrors(prev => ({ ...prev, password: '' }));
    return true;
  };

  const validatePasswordMatch = (password, passwordRepeat) => {
    if (!passwordRepeat || passwordRepeat.trim() === '') {
      setFieldErrors(prev => ({
        ...prev,
        passwordRepeat: 'Please repeat your password'
      }));
      return false;
    }
    if (password !== passwordRepeat) {
      setFieldErrors(prev => ({
        ...prev,
        passwordRepeat: 'Passwords do not match'
      }));
      return false;
    }
    setFieldErrors(prev => ({ ...prev, passwordRepeat: '' }));
    return true;
  };

  const validateAddress = (address) => {
    if (!address || address.trim() === '') {
      setFieldErrors(prev => ({
        ...prev,
        full_address: 'Full address is required'
      }));
      return false;
    }
    setFieldErrors(prev => ({ ...prev, full_address: '' }));
    return true;
  };

  const validateCountry = (country) => {
    if (!country || country.trim() === '') {
      setFieldErrors(prev => ({
        ...prev,
        country: 'Country is required'
      }));
      return false;
    }
    setFieldErrors(prev => ({ ...prev, country: '' }));
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Сброс общей ошибки при вводе пользователем
    setError('');

    // Валидация полей при изменении
    switch (name) {
      case 'username':
        validateUsername(value);
        break;
      case 'email':
        validateEmail(value);
        break;
      case 'password':
        validatePassword(value);
        if (formData.passwordRepeat) {
          validatePasswordMatch(value, formData.passwordRepeat);
        }
        break;
      case 'passwordRepeat':
        validatePasswordMatch(formData.password, value);
        break;
      case 'full_address':
        validateAddress(value);
        break;
      case 'country':
        validateCountry(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Валидация всех полей перед отправкой
    const isUsernameValid = validateUsername(formData.username);
    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);
    const isPasswordMatchValid = validatePasswordMatch(formData.password, formData.passwordRepeat);
    const isAddressValid = validateAddress(formData.full_address);
    const isCountryValid = validateCountry(formData.country);

    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isPasswordMatchValid || !isAddressValid || !isCountryValid) {
      return;
    }

    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        country: formData.country || '',
        full_address: formData.full_address
      };

      const result = await register(registrationData);

      if (result.success) {
        navigate('/');
      } else {
        // Обработка конкретных сообщений об ошибках от сервера
        if (result.error.includes('username')) {
          setFieldErrors(prev => ({
            ...prev,
            username: 'This username is already taken'
          }));
        } else if (result.error.includes('email')) {
          setFieldErrors(prev => ({
            ...prev,
            email: 'This email is already registered'
          }));
        } else if (result.error.includes('full_address')) {
          setFieldErrors(prev => ({
            ...prev,
            full_address: 'Full address is required'
          }));
        } else {
          setError(result.error || 'Failed to register');
        }
      }
    } catch (err) {
      if (err.message.includes('full_address')) {
        setFieldErrors(prev => ({
          ...prev,
          full_address: 'Full address is required'
        }));
      } else {
        setError('An error occurred during registration');
      }
    }
  };

  return (
    <OSWindow>
      <WindowTab title="Register">
        {isPageLoading ? (
          <div className="register-loading">
            <img src={loading1} alt="Loading..." draggable="false" />
          </div>
        ) : (
          <div className="register-container">
            <ValidationMessage message={getCurrentValidationMessage()} />
            <form onSubmit={handleSubmit} className="register-form" noValidate>
              <div className="register-form__field">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={fieldErrors.username ? 'error' : ''}
                />
              </div>

              <div className="register-form__field">
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
                <label htmlFor="full_address">Full Address</label>
                <input
                  type="text"
                  id="full_address"
                  name="full_address"
                  value={formData.full_address}
                  onChange={handleChange}
                  className={fieldErrors.full_address ? 'error' : ''}
                />
              </div>

              <div className="register-form__field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={fieldErrors.password ? 'error' : ''}
                />
              </div>

              <div className="register-form__field">
                <label htmlFor="passwordRepeat">Repeat Password</label>
                <input
                  type="password"
                  id="passwordRepeat"
                  name="passwordRepeat"
                  value={formData.passwordRepeat}
                  onChange={handleChange}
                  className={fieldErrors.passwordRepeat ? 'error' : ''}
                />
              </div>

              <button type="submit" className="register-form__submit">
                Register
              </button>
            </form>
          </div>
        )}
      </WindowTab>
    </OSWindow>
  );
};

export default RegisterPage; 