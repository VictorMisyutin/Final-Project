var mongoose = require('mongoose');

var TournamentsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    City: { type: String, required: true },
    State: { type: String },
    Country: { type: String, required: true },
    Sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 

});

module.exports = mongoose.model('Tournament', TournamentsSchema);
