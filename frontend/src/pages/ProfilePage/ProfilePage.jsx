import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile">
      <div className="profile__window">
        <div className="profile__header">
          <h2 className="profile__title">Profile</h2>
          <button 
            className="profile__close"
            onClick={() => navigate('/')}
          >×</button>
        </div>

        <div className="profile__content">
          <div className="profile__info">
            <div className="profile__info-group">
              <label className="profile__label">Username</label>
              <p className="profile__value">{user?.username}</p>
            </div>

            <div className="profile__info-group">
              <label className="profile__label">Email</label>
              <p className="profile__value">{user?.email}</p>
            </div>

            <div className="profile__info-group">
              <label className="profile__label">Country</label>
              <p className="profile__value">{user?.country}</p>
            </div>

            <div className="profile__info-group">
              <label className="profile__label">Full Address</label>
              <p className="profile__value">{user?.fullAddress}</p>
            </div>
          </div>

          <div className="profile__actions">
            <button 
              className="profile__action-btn profile__action-btn--orders"
              onClick={() => navigate('/orders')}
            >
              Orders History
            </button>
            
            <button 
              className="profile__action-btn profile__action-btn--edit"
              onClick={() => navigate('/profile/edit')}
            >
              Edit Profile
            </button>
            
            <button 
              className="profile__action-btn profile__action-btn--logout"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 