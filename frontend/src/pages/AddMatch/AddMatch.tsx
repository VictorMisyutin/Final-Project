import React, { useState, useEffect } from 'react';
import './AddMatch.css';
import config from '../../config';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  sport: string[];
}

interface Tournament {
  _id: string;
  title: string;
  sport: string;
}

const AddMatch: React.FC = () => {
  const [players, setPlayers] = useState<User[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [playerOneId, setPlayerOneId] = useState<string>('');
  const [playerTwoId, setPlayerTwoId] = useState<string>('');
  const [tournamentId, setTournamentId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(config.backendUrl + '/api/users');
        const data = await response.json();
        setPlayers(data.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    const fetchTournaments = async () => {
      try {
        const response = await fetch(config.backendUrl + '/api/tournaments');
        const data = await response.json();
        setTournaments(data.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };

    fetchUsers();
    fetchTournaments();
  }, []);

  const handleAddMatch = async () => {
    if (!playerOneId || !playerTwoId || !tournamentId || !startDate) {
      setMessage('Please fill in all fields');
      return;
    }

    if (playerOneId === playerTwoId) {
      setMessage('Player 1 and Player 2 cannot be the same');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(config.backendUrl + '/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerOneId,
          playerTwoId,
          tournamentId,
          startDate: new Date(startDate).toISOString(),
        }),
      });

      const data = await response.json();

      if (data.message === 'Match created') {
        setMessage('Match added successfully');
        setPlayerOneId('');
        setPlayerTwoId('');
        setTournamentId('');
        setStartDate('');
      } else {
        setMessage('Error creating match');
      }
    } catch (error) {
      setMessage('Error creating match');
      console.error('Error adding match:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-match-container">
      <h2>Add New Match</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Player 1</label>
          <select
            value={playerOneId}
            onChange={(e) => setPlayerOneId(e.target.value)}
            required
          >
            <option value="">Select Player 1</option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.firstName} {player.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Player 2</label>
          <select
            value={playerTwoId}
            onChange={(e) => setPlayerTwoId(e.target.value)}
            required
          >
            <option value="">Select Player 2</option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.firstName} {player.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tournament</label>
          <select
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            required
          >
            <option value="">Select Tournament</option>
            {tournaments.map((tournament) => (
              <option key={tournament._id} value={tournament._id}>
                {tournament.title}
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
            required
          />
        </div>

        <button
          type="button"
          onClick={handleAddMatch}
          disabled={loading}
        >
          {loading ? 'Creating Match...' : 'Add Match'}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddMatch;
