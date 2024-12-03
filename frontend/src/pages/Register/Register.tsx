import React, { useState } from 'react';
import './Register.css';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    sport: '',
    elo: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const sports = ['Soccer', 'Basketball', 'Tennis', 'Baseball', 'Golf'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(config.backendUrl + '/api/users', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const data = await response.json();
      navigate('/login');

    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="page-container">
      <div className="register-container">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sport">Sport *</label>
            <select
              id="sport"
              name="sport"
              value={formData.sport}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a sport</option>
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="elo">Elo Rating</label>
            <input
              type="number"
              id="elo"
              name="elo"
              value={formData.elo}
              onChange={handleInputChange}
            />
          </div>
          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button type="submit">Register</button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Register;
