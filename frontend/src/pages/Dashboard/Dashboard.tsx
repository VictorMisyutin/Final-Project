import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import config from '../../config';

const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [userRating, setUserRating] = useState<number>(0);
  const [opponentNames, setOpponentNames] = useState<string[]>([]);

  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(config.backendUrl + `/api/users/${userId}`);
        const data = await response.json();
        if (data.message === 'OK') {
          setUserName(`${data.data.firstName} ${data.data.lastName}`);
          setUserRating(data.data.elo);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchRecentMatches = async () => {
      if (!userId) return;

      try {
        const response = await fetch(config.backendUrl + `/api/matches/${userId}`);
        const data = await response.json();

        if (data.message === 'OK') {
          const pastMatches = data.data.filter((match: any) => new Date(match.start_date) < new Date());

          setMatches(pastMatches);
          console.log(pastMatches)
          const names = pastMatches.map((match: any) => match.opponent);
          setOpponentNames(names);
        } else {
          console.error('Failed to fetch recent matches');
        }
      } catch (error) {
        console.error('Error fetching recent matches:', error);
      }
    };

    fetchUserData();
    fetchRecentMatches();
  }, [userId]);

  return (
    <div className="dashboard-page-container">
      <div className="hero">
        <div className="left-side">
          <h1>Dashboard</h1>
        </div>
        <div className="right-side">
          <p className="player-welcome">Welcome {userName || 'Loading...'}</p>
          <p className="player-rating">Your Current Rating is: {userRating || '--'}</p>
        </div>
      </div>
      <div className="recent-matches-container">
        {/* Header */}
        <div className="data-header">
          <div className="match-opponent">Opponent</div>
          <div className="match-rating">Opponent Rating</div>
          <div className="match-result">Result</div>
          <div className="match-rating-change">Rating Change</div>
          <div className="match-date">Date</div>
        </div>
        {/* Scrollable Section */}
        <div className="recent-matches-section">
          {matches.map((match, index) => (
            <div className="tournament" key={index}>
              <div className="match-opponent">
                {opponentNames[index] ?? '-'}
              </div>
              <div className="match-rating">{match.opponent_rating ?? '--'}</div>
              <div className="match-result">{match.result ?? '--'}</div>
              <div className="match-rating-change">{match.rating_change ?? '--'}</div>
              <div className="match-date">{new Date(match.start_date ?? '--').toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
