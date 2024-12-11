import React, { useState, useEffect } from 'react';
import './AddTournament.css';
import config from '../../config';

interface Sport {
  _id: string;
  sport: string;
}

const AddTournament: React.FC = () => {
  const [Title, setTitle] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [sport, setSport] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [sports, setSports] = useState<Sport[]>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
        const data = await response.json();
        setSports(data.data);
      } catch (error) {
        console.error('Error fetching sports:', error);
      }
    };

    fetchSports();
  }, []);

  const handleAddTournament = async () => {
    if (!Title || !city || !country || !sport || !password) {
      setMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(config.backendUrl + '/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',  // Skip the Ngrok warning page
        },
        body: JSON.stringify({
          title: Title,
          City: city,
          State: state,
          Country: country,
          Sport: sport,
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.message === 'Tournament created') {
        setMessage('Tournament added successfully');
        setTitle('');
        setCity('');
        setState('');
        setCountry('');
        setSport('');
        setStartDate('');
        setEndDate('');
        setPassword('');
      } else {
        setMessage('Error creating tournament');
      }
    } catch (error) {
      setMessage('Error creating tournament');
      console.error('Error adding tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-tournament-container">
      <h2>Add New Tournament</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={Title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tournament Title"
            required
          />
        </div>

        <div className="form-group">
          <label>City *</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            required
          />
        </div>

        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
          />
        </div>

        <div className="form-group">
          <label>Country *</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            required
          />
        </div>

        <div className="form-group">
          <label>Sport *</label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            required
          >
            <option value="">Select Sport</option>
            {sports.map((sport) => (
              <option key={sport._id} value={sport._id}>
                {sport.sport}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tournament Password"
            required
          />
        </div>

        <button
          type="button"
          onClick={handleAddTournament}
          disabled={loading}
        >
          {loading ? 'Creating Tournament...' : 'Add Tournament'}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddTournament;
