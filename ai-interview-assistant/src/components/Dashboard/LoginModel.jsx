import React, { useState } from 'react';

const LoginModal = ({ show, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!show) return null;

  const handleSubmit = () => {
    // Example credential check
    if (username === 'admin' && password === 'password123') {
      setError('');
      onLogin();
      onClose();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>Please login to continue</h5>
          {error && <div className="alert alert-danger">{error}</div>}
          <input
            className="form-control mb-2"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="btn btn-primary me-2" onClick={handleSubmit}>Login</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
