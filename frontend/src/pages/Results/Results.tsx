import React, { useState, useEffect} from 'react';
import './Results.css';
import config from '../../config';

interface Sport {
  _id: string;
  sport: string;
}

interface Tournament {
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

      const response = await fetch(`${config.backendUrl}/api/tournaments?${params.toString()}`);
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
            <option value={s._id} key ={s._id}>{s.sport}</option>
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
      <div className="tournament-results-section">
        {results.length > 0 ? (
          <>
            <ul className="data-header">
              <li className="header-item">Title</li>
              <li className="header-item">Location</li>
              <li className="header-item">Dates</li>
              <li className="header-item">Sport</li>
            </ul>
            {results.map((tournament, index) => (
              <ul className="tournament-row" key={index}>
                <li className="tournament-item">{tournament.title}</li>
                <li className="tournament-item">
                  {tournament.City}, {tournament.State}, {tournament.Country}
                </li>
                <li className="tournament-item">
                  {new Date(tournament.startDate).toLocaleDateString()} -{' '}
                  {new Date(tournament.endDate).toLocaleDateString()}
                </li>
                <li className="tournament-item">{tournament.Sport.sport}</li>
              </ul>
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
