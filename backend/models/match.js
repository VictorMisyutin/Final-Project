const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    playerOne: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    playerTwo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    TournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    Winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    RatingChangeForWinner: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Match', MatchSchema);
