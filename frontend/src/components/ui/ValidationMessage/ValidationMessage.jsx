import React from 'react';
import './ValidationMessage.css';

const ValidationMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="validation-message">
      {message}
    </div>
  );
};

export default ValidationMessage; 