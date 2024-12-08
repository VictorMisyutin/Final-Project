const Match = require('../models/match');
const User = require('../models/user');
const Tournament = require('../models/tournament');
const Sport = require('../models/sport');



exports.createMatch = (req, res) => {
    const { playerOneId, playerTwoId, tournamentId, startDate, endDate } = req.body;

    if (!playerOneId || !playerTwoId || !tournamentId) {
        return res.status(400).json({ message: 'Player IDs and Tournament ID are required' });
    }

    Promise.all([
        User.findById(playerOneId),
        User.findById(playerTwoId),
        Tournament.findById(tournamentId)
    ])
    .then(([playerOne, playerTwo, tournament]) => {
        if (!playerOne || !playerTwo) {
            return res.status(404).json({ message: 'Player not found' });
        }
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        if (!tournament.Sport) {
            return res.status(400).json({ message: 'Tournament must have a sport associated with it' });
        }

        const newMatch = new Match({
            playerOne: playerOneId,
            playerTwo: playerTwoId,
            TournamentId: tournamentId,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            Winner: null,
            RatingChangeForWinner: 0,
        });

        return newMatch.save();
    })
    .then(match => res.status(201).json({ message: 'Match created', data: match }))
    .catch(err => res.status(500).json({ message: 'Error creating match', data: err }));
};



// Get all matches in a tournament
exports.getMatchesByTournament = (req, res) => {
    const tournamentId = req.params.tournamentId;

    Match.find({ TournamentId: tournamentId })
        .populate('playerOne playerTwo', 'firstName lastName elo') 
        .populate('TournamentId', 'title Sport') 
        .then(matches => res.json({ message: 'OK', data: matches }))
        .catch(err => res.status(500).json({ message: 'Error fetching matches', data: err }));
};

// Get recent matches for a specific user
exports.getRecentMatchesByUser = (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    Match.find({ $or: [{ playerOne: userId }, { playerTwo: userId }] })
        .sort({ startDate: -1 })
        .limit(6)
        .populate('playerOne', 'firstName lastName elo')  
        .populate('playerTwo', 'firstName lastName elo')
        .populate('TournamentId', 'title Sport')
        .then(matches => {
            if (matches.length === 0) {
                return res.json({ message: 'No recent matches found', data: [] });
            }

            const recentMatches = matches.map(match => {
                if (!match.playerOne || !match.playerTwo) {
                    console.error('Missing player data in match:', match);
                    return null;
                }

                const isPlayerOne = match.playerOne._id.toString() === userId;
                const opponent = isPlayerOne ? match.playerTwo : match.playerOne;

                const opponentName = opponent ? `${opponent.firstName} ${opponent.lastName}` : 'Unknown';
                let calculatedResult = ""; 
                if (match.winnezr == userId)
                    calculatedResult = "Win"; 
                else
                calculatedResult = "Lose"
                return {
                    opponent: opponentName, 
                    opponent_rating: opponent.elo,
                    result: calculatedResult,
                    rating_change: match.ratingChange,
                    tournament: match.TournamentId.title,
                    sport: match.TournamentId.Sport.sport, 
                    start_date: match.startDate
                };
            }).filter(Boolean);

            res.json({ message: 'OK', data: recentMatches });
        })
        .catch(err => {
            console.error('Error fetching matches:', err);
            res.status(500).json({ message: 'Error fetching matches', data: err });
        });
};


// Get a match by ID
exports.getMatchById = (req, res) => {
    const matchId = req.params.matchId;

    Match.findById(matchId)
        .then(match => {
            if (!match) {
                return res.status(404).json({ message: 'Match not found' });
            }
            res.json({ message: 'OK', data: match });
        })
        .catch(err => res.status(500).json({ message: 'Error fetching match', data: err }));
};

// Update match details
exports.updateMatch = (req, res) => {
    const matchId = req.params.matchId;
    const { endDate, winnerId, ratingChange } = req.body;

    if (!endDate && !winnerId) {
        return res.status(400).json({ message: 'End date and winner are required to update' });
    }

    Match.findByIdAndUpdate(matchId, { endDate, Winner: winnerId, RatingChangeForWinner: ratingChange }, { new: true, runValidators: true })
        .then(updatedMatch => {
            if (!updatedMatch) {
                return res.status(404).json({ message: 'Match not found' });
            }
            res.json({ message: 'Match updated successfully', data: updatedMatch });
        })
        .catch(err => res.status(500).json({ message: 'Error updating match', data: err }));
};

// Delete a match
exports.deleteMatch = (req, res) => {
    const matchId = req.params.matchId;

    Match.findByIdAndDelete(matchId)
        .then(match => {
            if (!match) {
                return res.status(404).json({ message: 'Match not found' });
            }
            res.json({ message: 'Match deleted', data: {} });
        })
        .catch(err => res.status(500).json({ message: 'Error deleting match', data: err }));
};
