import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import config from '../../config';

const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [userRating, setUserRating] = useState<number>(0);
  const userId = "674082564cab72df408cf8dc"; // Replace with the actual user ID from context or props

  useEffect(() => {
    // Fetch user data (name and rating)
    const fetchUserData = async () => {
      try {
        const response = await fetch(config.backendUrl + `/api/users/${userId}`);
        const data = await response.json();
        if (data.message === 'OK') {
          setUserName(data.data.name); // Assuming the user's name is stored in `data.data.name`
          setUserRating(data.data.rating); // Assuming the user's rating is stored in `data.data.rating`
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch recent matches of the user
    const fetchRecentMatches = async () => {
      try {
        const response = await fetch(config.backendUrl + `/api/matches/${userId}`);
        const data = await response.json();
        if (data.message === 'OK') {
          setMatches(data.data); // Store the fetched matches
        } else {
          console.error('Failed to fetch recent matches');
        }
      } catch (error) {
        console.error('Error fetching recent matches:', error);
      }
    };

    fetchUserData();
    fetchRecentMatches();
  }, [userId]); // Trigger the fetch when the userId changes

  return (
    <div className="page-container">
      <div className="hero">
        <div className="left-side">
          <h1>Dashboard</h1>
        </div>
        <div className="right-side">
          {/* Display user's name and rating dynamically */}
          <p className="player-welcome">Welcome {userName || 'Loading...'}</p>
          <p className="player-rating">Your Current Rating is: {userRating || '--'}</p>
        </div>
      </div>
      <div className="recent-matches-section">
        <div className="data-header">
          <div className="match-opponent">Opponent</div>
          <div className="match-rating">Opponent Rating</div>
          <div className="match-result">Result</div>
          <div className="match-rating-change">Rating Change</div>
          <div className="match-date">Date</div>
        </div>
        {matches.map((match, index) => (
          <div className="tournament" key={index}>
            <div className="match-opponent">{match.opponent ?? '--'}</div>
            <div className="match-rating">{match.opponent_rating ?? '--'}</div>
            <div className="match-result">{match.winner ?? '--'}</div>
            <div className="match-rating-change">{match.rating_change ?? '--'}</div>
            <div className="match-date">{new Date(match.start_date ?? '--').toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
