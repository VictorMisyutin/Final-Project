import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Players.css';
import config from '../../config';

interface Sport {
  _id: string;
  sport: string;
}

const Players: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [gender, setGender] = useState<string>(''); // '' represents no filter.
  const [minRating, setMinRating] = useState<number | ''>('');
  const [maxRating, setMaxRating] = useState<number | ''>('');
  const [sport, setSport] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sports, setSports] = useState<Sport[]>([])

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/sports`);
        if (!response.ok) throw new Error('Failed to fetch sports');
        const data = await response.json();
        if (data.message === 'OK') {
          setSports(data.data);
        } else {
          console.error('Failed to fetch sports data');
        }
      } catch (err) {
        console.error('Error fetching sports:', err);
      }
    };

    fetchSports();
  }, []);

  const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSport(e.target.value)
  }

  const getSportNameByID = (sportID: string) => {
    const sportName = sports.find((s) => s._id === sportID[0]);
    return sportName ? sportName.sport : '--';
  }
  const filterResultsByRating = (players: any[]) => {
    return players.filter(player => {
      const elo = player.elo || 0;
      const isAboveMinRating = minRating !== '' ? elo >= minRating : true;
      const isBelowMaxRating = maxRating !== '' ? elo <= maxRating : true;
      return isAboveMinRating && isBelowMaxRating;
    });
  };
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const where: Record<string, any> = {};
      
      if (firstName) where['firstName'] = firstName;
      if (lastName) where['lastName'] = lastName;
      if (gender) where['gender'] = gender;
      if (sport) where ['sport'] = sport;
      const params = new URLSearchParams();
      params.append('where', JSON.stringify(where));
      const response = await fetch(`${config.backendUrl}/api/users?${params.toString()}`);
      const data = await response.json();

      if (data.message === 'OK') {
        const filteredPlayers = filterResultsByRating(data.data)
        setSearchResults(filteredPlayers);
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

          value={sport}
          onChange={handleSportChange}
        >
          <option value="">Select Sport</option>
          {sports.map((s) => (
            <option value={s._id} key={s._id}>{s.sport}</option>
          ))}
        </select>
        <select
          className="search-dropdown"
          
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Any Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <select
          className="search-dropdown"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
        >
          {sports.map((s) => (
            <option value={s._id}>{s.sport}</option>
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
              <li className="header-item">Sport</li>
              <li className="header-item">Rating</li>
              <li className="header-item">Actions</li>
            </ul>
            {searchResults.map((player, index) => (
              <ul className="player-row" key={index}>
                <li className="player-item">{player.firstName || '--'}</li>
                <li className="player-item">{player.lastName || '--'}</li>
                <li className="player-item">{player.gender || '--'}</li>
                <li className="player-item">{getSportNameByID(player.sport)} </li>
                <li className="player-item">{player.elo ?? '--'}</li>
                <li className="player-item">
                  <Link to={`/profile/${player._id}`} className="action-button">View Profile</Link>
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
