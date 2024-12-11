import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import config from '../../config';

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const response = await fetch(config.backendUrl + '/api/verify/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [location]);

  if (isAuthenticated === null) {
    return (
      <header>
        <Link to="/" className="title">Tourney Tally</Link>
        <div className="right-side">
          <p>Loading...</p>
        </div>
      </header>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/'); 
  };

  return (
    <header>
      <Link to="/" className="title">Tourney Tally</Link>
      <div className="right-side">
        <Link to="/" className="link">Home</Link>
        {isAuthenticated && <Link to="/dashboard" className="link">Dashboard</Link>}
        <Link to="/players" className="link">Players</Link>
        <Link to="/results" className="link">Results</Link>
        { isAuthenticated && <Link to="/add-match" className="link">Submit Match</Link>}
        { isAuthenticated && <Link to="/add-tournament" className="link">Add Tournament</Link>}
        {isAuthenticated ? (
          <input
            className="log-button"
            type="submit"
            value="Log Out"
            onClick={handleLogout} 
          />
        ) : (
          <Link to="/login">
            <input className="log-button" type="submit" value="Log In" />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
