import React, { useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import './Results.css';
import config from '../../config';

interface Sport {
  _id: string;
  sport: string;
}

interface Tournament {
  _id: string;
  title: string;
  City: string;
  State: string;
  Country: string;
  Sport: {
    _id: string;
    sport: string;
  };
  startDate: string;
  endDate: string;
}

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
  const [sports, setSports] = useState<Sport[]>([])

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/sports`, {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true',  // Skip the Ngrok warning page
            'Content-Type': 'application/json',    // Ensure the response is treated as JSON
          },
        });
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

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      const where: Record<string, any> = {};

      if (title) where['title'] = title;
      if (city) where['City'] = city;
      if (state) where['State'] = state;
      if (country) where['Country'] = country;
      if (sport) where['Sport'] = sport;
      if (startDate) where['startDate'] = { $gte: startDate }; 
      if (endDate) where['endDate'] = { $lte: endDate };

      const params = new URLSearchParams();
      params.append('where', JSON.stringify(where));

      const response = await fetch(`${config.backendUrl}/api/tournaments?${params.toString()}`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',  // Skip the Ngrok warning page
          'Content-Type': 'application/json',    // Ensure the response is treated as JSON
        },
      });
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
    <div className="results-page-container">
      <div className="hero">
        <div className="left-side">
          <h1 className="title">Tournament Results</h1>
        </div>
        <div className="right-side">
          <p className="description">
            Search for tournaments by name, city, state, country, sport, start date, and end date.
          </p>
        </div>
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
          onChange={handleSportChange}
        >
          <option value="">Select Sport</option>
          {sports.map((s) => (
            <option value={s._id} key={s._id}>{s.sport}</option>
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
      <div className="results-section-container">
        <div className="data-header" id="tourny-data-header">
          <div className="header-item">Title</div>
          <div className="header-item">City</div>
          <div className="header-item">State</div>
          <div className="header-item">Country</div>
          <div className="header-item">Sport</div>
          <div className="header-item">Start Date</div>
          <div className="header-item">End Date</div>
          <div className="header-item">Actions</div>
        </div>
        <div className="results-section">
          {results.length > 0 ? (
            results.map((tournament, index) => (
              <div className="tournament-row" key={index}>
                <div className="tournament-item">{tournament.title || '--'}</div>
                <div className="tournament-item">{tournament.City || '--'}</div>
                <div className="tournament-item">{tournament.State || '--'}</div>
                <div className="tournament-item">{tournament.Country || '--'}</div>
                <div className="tournament-item">{tournament.Sport.sport || '--'}</div>

                <div className="tournament-item">{new Date(tournament.startDate).toLocaleDateString() || '--'}</div>
                <div className="tournament-item">{new Date(tournament.endDate).toLocaleDateString() || '--'}</div>
                <div className="tournament-item"><Link to={`/tournament/${tournament._id}`} className="action-button">View Matches</Link></div>
              </div>
            ))
          ) : (
            <p className="no-results">No tournaments found. Try different filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
