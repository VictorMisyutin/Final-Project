import React, { useState } from 'react';
import './Results.css';
import config from '../../config';

const Results: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [sport, setSport] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sports = ['Soccer', 'Basketball', 'Tennis', 'Baseball', 'Golf', 'Table Tennis'];

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (title) params.append('title', title);
      if (city) params.append('city', city);
      if (state) params.append('state', state);
      if (country) params.append('country', country);
      if (sport) params.append('sport', sport);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${config.backendUrl}/api/tournaments/?${params.toString()}`);
      const data = await response.json();

      if (data.message === 'OK') {
        setResults(data.data);
      } else {
        console.error('Failed to fetch tournament results');
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="hero">
        <h1>Tournament Results</h1>
      </div>
      <div className="search-filters">
        <input
          type="text"
          className="search-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="search-input"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          className="search-input"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <input
          type="text"
          className="search-input"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <select
          className="search-dropdown"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
        >
          {sports.map((s) => (
            <option value={s}>{s}</option>
          ))}
        </select>
        <input
          type="date"
          className="search-input"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="search-input"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <div className="results-section">
        {results.length > 0 ? (
          <>
            <div className="data-header">
              <div className="tournament-title">Title</div>
              <div className="tournament-location">Location</div>
              <div className="tournament-dates">Dates</div>
              <div className="tournament-sport">Sport</div>
            </div>
            {results.map((tournament, index) => (
              <div className="tournament-row" key={index}>
                <div className="tournament-title">{tournament.title}</div>
                <div className="tournament-location">
                  {tournament.City}, {tournament.State}, {tournament.Country}
                </div>
                <div className="tournament-dates">
                  {new Date(tournament.startDate).toLocaleDateString()} -{' '}
                  {new Date(tournament.endDate).toLocaleDateString()}
                </div>
                <div className="tournament-sport">{tournament.Sport}</div>
              </div>
            ))}
          </>
        ) : (
          <p className="no-results">{isLoading ? '' : 'No tournaments found. Try different filters.'}</p>
        )}
      </div>
    </div>
  );
};

export default Results;
