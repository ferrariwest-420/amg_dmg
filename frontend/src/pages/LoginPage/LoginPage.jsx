import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import WindowTab from '../../components/layout/WindowTab/WindowTab';
import ValidationMessage from '../../components/ui/ValidationMessage/ValidationMessage';
import loading1 from '../../assets/loading1.gif';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [loading, isAuthenticated, navigate, location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const newFieldErrors = {
      email: '',
      password: ''
    };
    let isValid = true;

    if (!formData.email || formData.email.trim() === '') {
      newFieldErrors.email = 'Email is required';
      isValid = false;
    }

    if (!formData.password || formData.password.trim() === '') {
      newFieldErrors.password = 'Password is required';
      isValid = false;
    }

    setFieldErrors(newFieldErrors);
    if (!isValid) {
      setValidationError(Object.values(newFieldErrors).find(error => error) || '');
    }
    return isValid;
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationError('');
    
    if (!validateForm()) {
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } else {
      setError(result.error || 'Failed to login');
    }
  };

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff'
      }}>
        <img src={loading1} alt="Loading..." style={{ width: '70px', height: '64px', imageRendering: 'pixelated' }} draggable="false" />
      </div>
    );
  }

  return (
    <OSWindow>
      <WindowTab title="Login">
        {isPageLoading ? (
          <div className="login-loading">
            <img src={loading1} alt="Loading..." draggable="false" />
          </div>
        ) : (
          <div className="login-container">
            <ValidationMessage message={error || validationError} />
            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div className="login-form__field">
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

              <div className="login-form__field">
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

              <button type="submit" className="login-form__submit">
                Login
              </button>
            </form>
          </div>
        )}
      </WindowTab>
      <div className="login__footer">
        <Link to="/register" className="login__register-link">
          Register
        </Link>
      </div>
    </OSWindow>
  );
};

export default LoginPage; 