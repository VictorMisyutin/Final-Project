import React, { useState, useEffect } from 'react';
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
  const [sports, setSports] = useState<Sport[]>([]);

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
    setSport(e.target.value);
  };

  const getSportNameByID = (sportID: string) => {
    const sportName = sports.find((s) => s._id === sportID);
    return sportName ? sportName.sport : '--';
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const where: Record<string, any> = {};

      if (firstName) where['firstName'] = firstName;
      if (lastName) where['lastName'] = lastName;
      if (gender) where['gender'] = gender;
      if (sport) where['sport'] = sport;

      const params = new URLSearchParams();
      params.append('where', JSON.stringify(where));
      const response = await fetch(`${config.backendUrl}/api/users?${params.toString()}`);
      const data = await response.json();

      if (data.message === 'OK') {
        const filteredPlayers = data.data.filter((player: any) => {
          const elo = player.elo || 0;
          const isAboveMinRating = minRating !== '' ? elo >= minRating : true;
          const isBelowMaxRating = maxRating !== '' ? elo <= maxRating : true;
          return isAboveMinRating && isBelowMaxRating;
        });
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
          onChange={handleSportChange}
        >
          <option value="">Select Sport</option>
          {sports.map((s) => (
            <option value={s._id} key={s._id}>{s.sport}</option>
          ))}
        </select>
        <button className="search-button" onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <div className="results-section-container">
        {/* Data Header */}
        <div className="data-header">
          <div className="header-item">First Name</div>
          <div className="header-item">Last Name</div>
          <div className="header-item">Gender</div>
          <div className="header-item">Sport</div>
          <div className="header-item">Rating</div>
          <div className="header-item">Actions</div>
        </div>
        {/* Scrollable Results Section */}
        <div className="results-section">
          {searchResults.length > 0 ? (
            searchResults.map((player, index) => (
              <div className="player-row" key={index}>
                <div className="player-item">{player.firstName || '--'}</div>
                <div className="player-item">{player.lastName || '--'}</div>
                <div className="player-item">{player.gender || '--'}</div>
                <div className="player-item">{getSportNameByID(player.sport)}</div>
                <div className="player-item">{player.elo ?? '--'}</div>
                <div className="player-item">
                  <button className="action-button">View Profile</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No players found. Try different filters.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Players;
