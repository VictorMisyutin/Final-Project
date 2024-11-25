const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tournamentController = require('../controllers/tournamentController');


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

module.exports = router;
