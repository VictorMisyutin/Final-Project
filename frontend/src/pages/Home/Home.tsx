import React, { useState, useEffect } from 'react';
import { FaChess, FaTableTennis } from 'react-icons/fa'; // import icons from react-icons
import { RiBilliardsFill, RiBoxingFill } from 'react-icons/ri';
import { IoGameController, IoTennisballSharp } from 'react-icons/io5';
import './Home.css';
import config from '../../config'


interface Tournament {
  title: string;
  City: string;
  State: string;
  Country: string;
  Sport: string;
  startDate: string;
  endDate: string;
}

const Home: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [limit, setLimit] = useState<number>(10); // You can change the limit as needed

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(config.backendUrl + `/api/tournaments?limit=${limit}`); 
        if (!response.ok) {
          throw new Error('Failed to fetch tournaments');
        }
        const data = await response.json();
        setTournaments(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [limit]);


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="hero">
        <div className="left-side">
          <h1 className="title">Tourney Tally</h1>
        </div>
        <div className="right-side">
          <p className="description">
            Create and manage tournaments for multiple sports. Featuring real-time result
            tracking and seamless updates. Automatically adjusts Elo ratings, efficient
            tournament pairings, and quick player lookups, all in real-time for a smooth and
            dynamic experience.
          </p>
          <div className="icons">
            <FaChess size={40} title="Chess" />
            <FaTableTennis size={40} title="table-tennis" />
            <IoTennisballSharp size={40} title="tennis" />
            <RiBilliardsFill size={40} title="billiard" />
            <IoGameController size={40} title="video-game-controller" />
            <RiBoxingFill size={40} title="boxing" />
          </div>
        </div>
      </div>
      <div className="upcoming-tournaments-section">
        <div className="data-header">
          <div className="tourney-title">Tournament</div>
          <div className="tourney-city">City</div>
          <div className="tourney-state">State</div>
          <div className="tourney-country">Country</div>
          <div className="tourney-sport">Sport</div>
          <div className="tourney-date">Date</div>
        </div>

        {tournaments.map((tournament, index) => (
          <div className="tournament" key={index}>
            <div className="tourney-title">{tournament.title}</div>
            <div className="tourney-city">{tournament.City}</div>
            <div className="tourney-state">{tournament.State}</div>
            <div className="tourney-country">{tournament.Country}</div>
            <div className="tourney-sport">{tournament.Sport}</div>
            <div className="tourney-date">{new Date(tournament.startDate).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
