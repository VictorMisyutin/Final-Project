// controllers/sportController.js
const Sport = require('../models/sport');

// Get all sports
exports.getSports = (req, res) => {
    Sport.find()
        .then(sports => res.json({ message: 'OK', data: sports }))
        .catch(err => res.status(500).json({ message: 'Error fetching sports', data: err }));
};

// Get a sport by ID
exports.getSportById = (req, res) => {
    Sport.findById(req.params.id)
        .then(sport => {
            if (!sport) {
                return res.status(404).json({ message: 'Sport not found', data: {} });
            }
            res.json({ message: 'OK', data: sport });
        })
        .catch(err => res.status(500).json({ message: 'Error fetching sport', data: err }));
};
