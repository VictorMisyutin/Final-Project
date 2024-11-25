import React from 'react';
import './Dashboard.css'

const Dashboard: React.FC = () => {

  return (
    <div className="page-container">
      <div className="hero">
        <div className="left-side">
          <h1>Dashboard</h1>
        </div>
        <div className="right-side">
          <p className="player-welcome">Welcome Victor Misyutin</p>
          <p className="player-rating">Your Current Rating is 1673</p>
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
        <div className="match">
          <div className="match-opponent">Dylan Powers</div>
          <div className="match-rating">1344</div>
          <div className="match-result win">Win</div>
          <div className="match-rating-change positive">+11</div>
          <div className="match-date">11/16/2024</div>
          </div>
        <div className="match">
          <div className="match-opponent">Macie Cortez</div>
          <div className="match-rating">1512</div>
          <div className="match-result loss">Loss</div>
          <div className="match-rating-change negative">-13</div>
          <div className="match-date">11/12/2024</div>
          </div>
        {/* {tournaments.map((tournament, index) => (
          <div className="tournament" key={index}>
            <div className="tourney-title">{tournament.title}</div>
            <div className="tourney-city">{tournament.City}</div>
            <div className="tourney-state">{tournament.State}</div>
            <div className="tourney-country">{tournament.Country}</div>
            <div className="tourney-sport">{tournament.Sport}</div>
            <div className="tourney-date">{new Date(tournament.startDate).toLocaleDateString()}</div>
          </div>
        ))} */}
      </div>
    </div>
  );

};

export default Dashboard;
