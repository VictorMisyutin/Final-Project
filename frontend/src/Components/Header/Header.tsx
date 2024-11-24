import React from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  // const loggedIn = false;
  // if logged in show "Dashboard" and "Logout "else hide Dashboard and show "Log In button"
  const hideLogoutPaths = ['/', '/login', '/register'];
  const isLoginPage = hideLogoutPaths.includes(location.pathname);

  return (
    <header>
      <Link to="/" className="title">Tourney Tally</Link>
      <div className="right-side">
        <Link to="/" className="link">Home</Link>
        <Link to="/dashboard" className="link">Dashboard</Link>
        <Link to="/" className="link">Players</Link>
        <Link to="/" className="link">Results</Link>
        {isLoginPage ? (
          <Link to="/login">
            <input className="log-button" type="submit" value="Log In" />
          </Link>
        ) : (
          <input className="log-button" type="submit" value="Log Out" />
        )}
      </div>
    </header>
  );
};

export default Header;
