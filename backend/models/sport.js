var mongoose = require('mongoose');

var SportSchema = new mongoose.Schema({
    Sport: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Sport', SportSchema);
