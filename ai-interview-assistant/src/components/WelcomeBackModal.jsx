import React from 'react';

const WelcomeBackModal = ({ onClose }) => (
  <div className="modal show d-block">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Welcome Back!</h5>
        </div>
        <div className="modal-body">
          <p>You have an unfinished interview session. Would you like to continue?</p>
          <button className="btn btn-primary" onClick={onClose}>Continue</button>
        </div>
      </div>
    </div>
  </div>
);

export default WelcomeBackModal;
