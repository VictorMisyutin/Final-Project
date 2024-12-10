const Tournament = require('../models/tournament');
const User = require('../models/user');
const Sport = require('../models/sport');

// Get all tournaments
exports.getTournaments = (req, res) => {
    const query = req.query.where ? JSON.parse(req.query.where) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort) : {};
    const select = req.query.select ? JSON.parse(req.query.select) : {};
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const count = req.query.count === 'true';

    if (count) {
        Tournament.countDocuments(query)
            .then(count => res.json({ message: 'OK', data: count }))
            .catch(err => res.status(500).json({ message: 'Error counting tournaments', data: err }));
    } else {
        Tournament.find(query)
            .sort(sort)
            .select(select)
            .skip(skip)
            .limit(limit)
            .populate('Sport', 'sport')
            .then(tournaments => res.json({ message: 'OK', data: tournaments }))
            .catch(err => res.status(500).json({ message: 'Error fetching tournaments', data: err }));
    }
};


// Create a new tournament
exports.createTournament = async (req, res) => {
    const { title, City, State, Country, Sport, startDate, endDate, password } = req.body;

    if (!title || !City || !Country || !Sport || !password) {
        return res.status(400).json({ message: 'Title, City, Country, Sport, and Password are required fields' });
    }

    try {
        const sport = await Sport.findById(Sport);
        if (!sport) {
            return res.status(400).json({ message: 'Invalid Sport ID', data: {} });
        }

        const newTournament = new Tournament({
            title,
            City,
            State,
            Country,
            Sport,
            startDate,
            endDate,
            password,
            dateCreated: Date.now(),
            users: []
        });

        await newTournament.save();
        res.status(201).json({ message: 'Tournament created successfully', data: newTournament });
    } catch (err) {
        res.status(500).json({ message: 'Error creating tournament', data: err });
    }
};

// check if tournament password is correct
exports.verifyTournamentPassword = async (req, res) => {
    const { tournamentId } = req.params;
    const { password } = req.body;

    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        const isMatch = await bcrypt.compare(password, tournament.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        res.json({ message: 'Password verified successfully', data: {} });
    } catch (err) {
        res.status(500).json({ message: 'Error verifying password', data: err });
    }
};

// Update an existing tournament
exports.updateTournament = async (req, res) => {
    const tournamentId = req.params.tournamentId;
    const updates = req.body;

    if (!Object.keys(updates).length) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    if (updates.Sport) {
        const sport = await Sport.findById(updates.Sport);
        if (!sport) {
            return res.status(400).json({ message: 'Invalid Sport ID', data: {} });
        }
    }

    try {
        const updatedTournament = await Tournament.findByIdAndUpdate(tournamentId, updates, { new: true, runValidators: true });
        if (!updatedTournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        res.json({ message: 'Tournament updated successfully', data: updatedTournament });
    } catch (err) {
        res.status(500).json({ message: 'Error updating tournament', data: err });
    }
};


// Register a user for a tournament
exports.registerUserForTournament = (req, res) => {
    const tournamentId = req.params.tournamentId;
    const userId = req.body.userId;

    Promise.all([
        Tournament.findById(tournamentId),
        User.findById(userId)
    ])
    .then(([tournament, user]) => {
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (tournament.users.includes(userId)) {
            return res.status(400).json({ message: 'User already registered for this tournament' });
        }

        tournament.users.push(userId);

        return tournament.save();
    })
    .then(updatedTournament => {
        res.json({ message: 'User successfully registered for tournament', data: updatedTournament });
    })
    .catch(err => res.status(500).json({ message: 'Error registering user', data: err }));
};


// Unregister a user from a tournament
exports.unregisterUserFromTournament = (req, res) => {
    const tournamentId = req.params.tournamentId;
    const userId = req.body.userId;

    Promise.all([
        Tournament.findById(tournamentId),
        User.findById(userId)
    ])
    .then(([tournament, user]) => {
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!tournament.users.includes(userId)) {
            return res.status(400).json({ message: 'User is not registered for this tournament' });
        }

        tournament.users.pull(userId);

        return tournament.save();
    })
    .then(updatedTournament => {
        res.json({ message: 'User successfully unregistered from tournament', data: updatedTournament });
    })
    .catch(err => res.status(500).json({ message: 'Error unregistering user', data: err }));
};
