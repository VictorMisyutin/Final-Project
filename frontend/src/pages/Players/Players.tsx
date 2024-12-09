import React, { useState } from 'react';
import './Players.css';
import config from '../../config';

const Players: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [gender, setGender] = useState<string>(''); // '' represents no filter.
  const [minRating, setMinRating] = useState<number | ''>('');
  const [maxRating, setMaxRating] = useState<number | ''>('');
  const [sport, setSport] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sports = ['Soccer', 'Basketball', 'Tennis', 'Baseball', 'Golf', 'Table Tennis'];

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (firstName) params.append('firstName', firstName);
      if (lastName) params.append('lastName', lastName);
      if (gender) params.append('gender', gender);
      if (minRating !== '') params.append('minRating', minRating.toString());
      if (maxRating !== '') params.append('maxRating', maxRating.toString());
      if (sport) params.append('sport', sport);

      const response = await fetch(`${config.backendUrl}/api/users?${params.toString()}`);
      const data = await response.json();

      if (data.message === 'OK') {
        setSearchResults(data.data);
        console.log(data.data)
      } else {
        console.error('Failed to fetch players');
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="players-page-container">
      <div className="hero">
        <div className="left-side">
          <h1 className="title">Player Search</h1>
        </div>
        <div className="right-side">
          <p className="description">
            Search for players by name, rating, gender, and sport. View profiles and meet the competition.
          </p>
        </div>
      </div>
      <div className="search-filters">
        <input
          type="text"
          className="search-input"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          className="search-input"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="number"
          className="search-input"
          placeholder="Min Rating"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value) || '')}
        />
        <input
          type="number"
          className="search-input"
          placeholder="Max Rating"
          value={maxRating}
          onChange={(e) => setMaxRating(Number(e.target.value) || '')}
        />
        <select
          className="search-dropdown"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Any Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <select
          className="search-dropdown"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
        >
          {sports.map((s) => (
            <option value={s}>{s}</option>
          ))}
        </select>
        
    
        <button className="search-button" onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <div className="results-section">
        {searchResults.length > 0 ? (
          <>
            <ul className="data-header">
              <li className="header-item">First Name</li>
              <li className="header-item">Last Name</li>
              <li className="header-item">Gender</li>
              <li className="header-item">Rating</li>
              <li className="header-item">Actions</li>
            </ul>
            {searchResults.map((player, index) => (
              <ul className="player-row" key={index}>
                <li className="player-item">{player.firstName || '--'}</li>
                <li className="player-item">{player.lastName || '--'}</li>
                <li className="player-item">{player.gender || '--'}</li>
                <li className="player-item">{player.rating ?? '--'}</li>
                <li className="player-item">
                  <button className="action-button">View Profile</button>
                </li>
              </ul>
            ))}
          </>
        ) : (
          <p className="no-results">{isLoading ? '' : 'No players found. Try different filters.'}</p>
        )}
      </div>
    </div>
  );
};

export default Players;
