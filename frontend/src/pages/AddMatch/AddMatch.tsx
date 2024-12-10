import React, { useState, useEffect } from 'react';
import './AddMatch.css';
import config from '../../config';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  sport: string[];
  elo: number;
  dateOfBirth: string;
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
  const [playerOneBirthYear, setPlayerOneBirthYear] = useState<string>('');
  const [playerTwoBirthYear, setPlayerTwoBirthYear] = useState<string>('');
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

  const getBirthYearByID = (playerID: string) => {
    const player = players.find((p) => p._id === playerID)
    return player ? player.dateOfBirth.substring(0,4) : null;
  }

  const getRatingByID = (playerID: string) => {
    const player = players.find((p) => p._id === playerID)
    return player ? player.elo : null;
  }


  const handleAddMatch = async () => {
    if (!playerOneId || !playerTwoId || !playerOneBirthYear || !playerTwoBirthYear || !tournamentId || !startDate) {
      setMessage('Please fill in all fields');
      return;
    }

    if (getBirthYearByID(playerOneId) !== playerOneBirthYear.trim() || getBirthYearByID(playerTwoId) !== playerTwoBirthYear.trim()) {
      setMessage('Incorrect birth year field(s)');
      return;
    }

    let r1 = getRatingByID(playerOneId);
    let r2 = getRatingByID(playerTwoId);
    if (!r1 || !r2) {
      setMessage('Internal Error');
      return;
    }
    let e1 = 1/(1+10**((r2-r1)/400))
    let e2 = 1/(1+10**((r1-r2)/400))
    // NEW RATINGS FOR PLAYERS 1/2
    let newr1 = r1 + 32 * (1-e1)
    let newr2 = r2 + 32 * (0-e2)

    

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
          <label>Winner</label>
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
          <label>Birth Year</label>
          <input
            type='text'
            value={playerOneBirthYear}
            onChange={(e) => setPlayerOneBirthYear(e.target.value)}
            placeholder='YYYY'
            required>
          </input>
        </div>

        <div className="form-group">
          <label>Opponent</label>
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
          <label>Birth Year</label>
          <input
            type='text'
            value={playerTwoBirthYear}
            onChange={(e) => setPlayerTwoBirthYear(e.target.value)}
            placeholder='YYYY'
            required>
          </input>
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
          <label>Date</label>
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
