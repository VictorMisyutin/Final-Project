import React, { useState, useEffect } from 'react';
import './Register.css';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    sport: '',
    elo: 0,
    gender: '',
    dateOfBirth: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sports, setSports] = useState<{ _id: string; sport: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch(config.backendUrl + '/api/sports', {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true',  // Skip the Ngrok warning page
            'Content-Type': 'application/json',    // Ensure the response is treated as JSON
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch sports');
        }
        const data = await response.json();
        setSports(data.data);
      } catch (error) {
        setError('Error fetching sports');
      }
    };

    fetchSports();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const strippedFormData = {
      ...formData,
      firstName: formData.firstName.trim(),
      middleName: formData.middleName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      sport: [formData.sport.trim()],
      gender: formData.gender.trim(),
      dateOfBirth: formData.dateOfBirth.trim()
    };

    const dataToSend = strippedFormData;

    try {
      const response = await fetch(config.backendUrl + '/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',  // Skip the Ngrok warning page
        },
        body: JSON.stringify(dataToSend)
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
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="middleName">Middle Name (Optional)</label>
            <input
              type="text"
              id="middleName"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
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
                <option key={sport._id} value={sport._id}>
                  {sport.sport}
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

          <div className="form-group">
            <label htmlFor="gender">Gender *</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
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
