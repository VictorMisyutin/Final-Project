import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import './Profile.css';
import config from '../../config';

const Profile: React.FC = () => {
    const { userid } = useParams<{ userid: string }>();
    const [userName, setUserName] = useState<string>('');
    const [userRating, setUserRating] = useState<number>(0);
    const [matches, setMatches] = useState<any[]>([]);
    const [opponentNames, setOpponentNames] = useState<string[]>([]);

    useEffect(() => {
        if (!userid) {
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(config.backendUrl + `/api/users/${userid}`);
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
        try {
            const response = await fetch(config.backendUrl + `/api/matches/recent/${userid}`);
            const data = await response.json();

            if (data.message === 'OK') {
            const pastMatches = data.data.filter((match: any) => new Date(match.start_date) < new Date());
            setMatches(pastMatches);
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
    }, [userid]);

    return (
        <div className="profile-page-container">
            <div className="hero">
                <div className="left-side">
                <h1>Profile View</h1>
                </div>
                <div className="right-side">
                <p className="player-name">Player: {userName || 'Loading...'}</p>
                <p className="player-rating">Current Rating: {userRating || '--'}</p>
                </div>
            </div>
            
            <div className="recent-matches-section-container">
                {/* Data Header */}
                <div className="data-header">
                    <div className="match-opponent">Opponent</div>
                    <div className="match-rating">Opponent Rating</div>
                    <div className="match-result">Result</div>
                    <div className="match-rating-change">Rating Change</div>
                    <div className="match-date">Date</div>
                </div>
                {/* Scrollable Matches Section */}
                <div className="recent-matches-section">
                    {matches.map((match, index) => (
                        <div className="match-row" key={index}>
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

export default Profile;