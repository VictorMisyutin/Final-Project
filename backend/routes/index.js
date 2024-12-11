const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tournamentController = require('../controllers/tournamentController');
const matchController = require('../controllers/matchController')
const sportController = require('../controllers/sportController');

router.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// User Routes
router.route('/users')
.get(userController.getUsers)
    .post(userController.createUser);

router.route('/users/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

router.route('/verify/user').get(userController.verifyUser);

// Login Route
router.route('/users/login')
    .post(userController.loginUser); // Login route

// Tournament Routes
router.route('/tournaments')
    .get(tournamentController.getTournaments)
    .post(tournamentController.createTournament);

router.route('/tournaments/:tournamentId')
    .put(tournamentController.updateTournament);

router.route('/tournaments/:tournamentId/register')
    .post(tournamentController.registerUserForTournament);

router.route('/tournaments/:tournamentId/unregister')
    .post(tournamentController.unregisterUserFromTournament);

router.route('/tournaments/:tournamentId/verify-password')
    .post(tournamentController.verifyTournamentPassword);

// Match Routes
router.route('/matches')
.post(matchController.createMatch);

router.route('/matches/:matchId')
    .get(matchController.getMatchById)
    .put(matchController.updateMatch)
    .delete(matchController.deleteMatch);

router.route('/matches/recent/:userId')
    .get(matchController.getRecentMatchesByUser);

router.route('/tournaments/:tournamentId/matches')
.get(matchController.getMatchesByTournament);

// Sport Routes
router.route('/sports')
    .get(sportController.getSports);
    // .post(sportController.createSport);

router.route('/sports/:id')
    .get(sportController.getSportById);
    // .put(sportController.updateSport)
    // .delete(sportController.deleteSport);

module.exports = router;
