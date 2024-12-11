const Match = require('../models/match');
const User = require('../models/user');
const Tournament = require('../models/tournament');
const Sport = require('../models/sport');

const calculateEloChange = (playerRating, opponentRating, isWinner, K = 32) => {
    let e1 = 1 / (1 + 10 ** ((opponentRating - playerRating) / 400));
    let e2 = 1 / (1 + 10 ** ((playerRating - opponentRating) / 400));
    
    let updatep1 = K * (1 - e1);
    let updatep2 = K * (0 - e2);
    return isWinner ? Math.round(updatep1) : Math.round(updatep2);
};



// Updated createMatch function
exports.createMatch = (req, res) => {
    const { winnerId, loserId, tournamentId, startDate, endDate } = req.body;

    if (!winnerId || !loserId || !tournamentId) {
        return res.status(400).json({ message: 'Player IDs, Winner ID, and Tournament ID are required' });
    }

    if (winnerId === loserId) {
        return res.status(400).json({ message: 'Player 1 and Player 2 cannot be the same' });
    }

    Promise.all([ 
        User.findById(winnerId),
        User.findById(loserId),
        Tournament.findById(tournamentId)
    ])
    .then(([winner, loser, tournament]) => {
        if (!winner || !loser) {
            return res.status(404).json({ message: 'Player not found' });
        }
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        if (!tournament.Sport) {
            return res.status(400).json({ message: 'Tournament must have a sport associated with it' });
        }

        const ratingChangeForWinner = calculateEloChange(winner.elo, loser.elo, true);
        const ratingChangeForLoser = calculateEloChange(loser.elo, winner.elo, false);

        winner.elo += ratingChangeForWinner;
        loser.elo += ratingChangeForLoser;

        return Promise.all([ 
            winner.save(),
            loser.save()
        ])
        .then(() => {
            const newMatch = new Match({
                winner: winnerId,
                loser: loserId,
                TournamentId: tournamentId,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                RatingChangeForWinner: ratingChangeForWinner,
                RatingChangeForLoser: ratingChangeForLoser
            });

            return newMatch.save();
        })
        .then(match => res.status(201).json({ message: 'Match created', data: match }))
        .catch(err => res.status(500).json({ message: 'Error creating match', data: err }));
    })
    .catch(err => res.status(500).json({ message: 'Error creating match', data: err }));
};



// Get all matches in a tournament
exports.getMatchesByTournament = (req, res) => {
    const tournamentId = req.params.tournamentId;

    Match.find({ TournamentId: tournamentId })
        .populate('winner loser', 'firstName lastName elo') 
        .populate('TournamentId', 'title Sport') 
        .then(matches => res.json({ message: 'OK', data: matches }))
        .catch(err => res.status(500).json({ message: 'Error fetching matches', data: err }));
};

// Get recent matches for a specific user
exports.getRecentMatchesByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Fetch matches where the user is either the winner or loser
        const matches = await Match.find({
            $or: [
                { winner: userId },
                { loser: userId }
            ]
        })
            .populate('winner', 'firstName lastName elo')
            .populate('loser', 'firstName lastName elo')
            .populate({ path: 'TournamentId', select: 'title Sport' })
            .populate({ path: 'TournamentId.Sport', select: 'name' }) // Populate sport name
            .sort({ startDate: -1 }); // Sort by start date (most recent first)

        // Format the data
        const formattedMatches = matches.map(match => {
            if (!match.TournamentId) {
                console.warn(`Match with ID ${match._id} has no TournamentId.`);
                return null;
            }
            if (!match.TournamentId.Sport) {
                console.warn(`Match with ID ${match._id} has no Sport associated with TournamentId.`);
                return null;
            }

            const isWinner = match.winner._id.toString() === userId;
            const opponent = isWinner ? match.loser : match.winner;
            const ratingChange = isWinner ? match.RatingChangeForWinner : match.RatingChangeForLoser;

            return {
                opponent: `${opponent.firstName} ${opponent.lastName}`,
                opponent_rating: opponent.elo,
                result: isWinner ? 'Win' : 'Loss',
                rating_change: ratingChange,
                tournament: match.TournamentId.title,
                sport: match.TournamentId.Sport.name,
                start_date: match.startDate
            };
        }).filter(match => match !== null);

        res.json({
            message: 'OK',
            data: formattedMatches
        });
    } catch (error) {
        console.error('Error fetching recent matches:', error);
        res.status(500).json({
            message: 'Error fetching recent matches',
            error: error.message
        });
    }
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

    if (!endDate || !winnerId) {
        return res.status(400).json({ message: 'End date and winner are required to update' });
    }

    Match.findByIdAndUpdate(matchId, { endDate, winner: winnerId, RatingChangeForWinner: ratingChange }, { new: true, runValidators: true })
        .then(updatedMatch => {
            if (!updatedMatch) {
                return res.status(404).json({ message: 'Match not found' });
            }
            const loserId = (winnerId === updatedMatch.winner.toString()) ? updatedMatch.loser : updatedMatch.winner;
            updatedMatch.loser = loserId;

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