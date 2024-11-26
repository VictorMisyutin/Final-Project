var mongoose = require('mongoose');

var MatchSchema = new mongoose.Schema({
    playerOne: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    playerTwo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    TournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
    Winner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    RatingChangeForWinner: {type: Number},
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Match', MatchSchema);
