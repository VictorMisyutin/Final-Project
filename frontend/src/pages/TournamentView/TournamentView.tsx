import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import './TournamentView.css';
import config from '../../config';

interface Tournament {
    _id: string;
    title: string;
    Country: string;
    City: string;
    State: string;
    startDate: Date;
    endDate: Date;
    Sport: {
        sport: string;
    };
}

const TournamentView: React.FC = () => {
    const { tournamentid } = useParams<{ tournamentid: string }>();
    const [tournament, setTournament] = useState<Tournament>()
    const [tournamentTitle, setTournamentTitle] = useState<string>('');
    const [tournamentCity, setTournamentCity] = useState<string>('');
    const [tournamentCountry, setTournamentCountry] = useState<string>('');
    const [tournamentState, setTournamentState] = useState<string>('');
    const [tournamentSport, setTournamentSport] = useState<string>('');
    const [tournamentStartDate, setTournamentStartDate] = useState<Date>();
    const [tournamentEndDate, setTournamentEndDate] = useState<Date>();
    const [matches, setMatches] = useState<any[]>([]);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);

    useEffect(() => {
        if (!tournamentid) {
            return;
        }

        const fetchTournamentData = async () => {
            try {
                const response = await fetch(config.backendUrl + `/api/tournaments/`, {
                    method: 'GET',
                    headers: {
                        'ngrok-skip-browser-warning': 'true',  // Skip the Ngrok warning page
                        'Content-Type': 'application/json',    // Ensure the response is treated as JSON
                    },
                });
                const data = await response.json();
                
                if (data.message === 'OK') {
                    setTournaments(data.data);
                    const tournament = data.data.find((t: Tournament) => t._id === tournamentid);
                    if (tournament) {
                        setTournament(tournament); 
                        setTournamentTitle(tournament.title);
                        setTournamentCountry(tournament.Country);
                        setTournamentCity(tournament.City);
                        setTournamentState(tournament.State);
                        setTournamentStartDate(tournament.startDate);
                        setTournamentEndDate(tournament.endDate);
                        setTournamentSport(tournament.Sport.sport);
                    } else {
                        console.error('Tournament not found for the provided ID');
                    }
                } else {
                    console.error('Failed to fetch tournament data');
                }
            } catch (error) {
                console.error('Error fetching tournament data:', error);
            }
        };

        const fetchMatches = async () => {
            try {
                const response = await fetch(config.backendUrl + `/api/tournaments/${tournamentid}/matches`, {
                    method: 'GET',
                    headers: {
                        'ngrok-skip-browser-warning': 'true',  // Skip the Ngrok warning page
                        'Content-Type': 'application/json',    // Ensure the response is treated as JSON
                    },
                });
                const data = await response.json();

                if (data.message === 'OK') {
                    setMatches(data.data);
                } else {
                    console.error('Failed to fetch recent matches');
                }
            } catch (error) {
                console.error('Error fetching recent matches:', error);
            }
        };

        fetchTournamentData();
        fetchMatches();
    }, [tournamentid]);

    return (
        <div className="tournament-view-page-container">
            <div className="hero">
                <div className="left-side">
                    <h1>{tournamentTitle}</h1>
                </div>
                <div className="right-side">
                    <p className="description-row">Sport: {tournamentSport || '--'}</p>
                    <p className="description-row">City: {tournamentCity || '--'}</p>
                    <p className="description-row">State: {tournamentState || '--'}</p>
                    <p className="description-row">Country: {tournamentCountry || '--'}</p>
                    <p className="description-row">Dates: { new Date(tournamentStartDate ?? '--').toLocaleDateString()} - {new Date(tournamentEndDate ?? '--').toLocaleDateString()}</p>
                </div>
            </div>
            
            <div className="recent-matches-section">
                <div className="data-header">
                    <div className="match-rating">Winner First Name</div>
                    <div className="match-rating">Winner Last Name</div>
                    <div className="match-rating">Current Rating</div>
                    <div className="match-rating">Points Won</div>
                    <div className="match-rating">Opponent First Name</div>
                    <div className="match-rating">Opponent Last Name</div>
                    <div className="match-rating">Current Rating</div>
                    <div className="match-rating">Points Lost</div>
                    <div className="match-date">Date</div>
                </div>
                
                {matches.map((match) => (
                    <div className="tournament" key={match._id}>
                        <div className="match-rating">{match.winner.firstName ?? '--'}</div>
                        <div className="match-result">{match.winner.lastName ?? '--'}</div>
                        <div className="match-rating">{match.winner.elo ?? '--'}</div>
                        <div className="match-result">{match.RatingChangeForWinner ?? '--'}</div>
                        <div className="match-rating">{match.loser.firstName ?? '--'}</div>
                        <div className="match-result">{match.loser.lastName ?? '--'}</div>
                        <div className="match-rating">{match.loser.elo ?? '--'}</div>
                        <div className="match-result">{match.RatingChangeForLoser ?? '--'}</div>
                        <div className="match-date">{new Date(match.startDate ?? '--').toLocaleDateString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TournamentView;
