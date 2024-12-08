const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const Sport = require('../models/sport');

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';


exports.getUsers = (req, res) => {
    const query = req.query.where ? JSON.parse(req.query.where) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort) : {};
    const select = req.query.select ? JSON.parse(req.query.select) : {};
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const count = req.query.count === 'true';

    if (count) {
        User.countDocuments(query)
            .then(count => res.json({ message: 'OK', data: count }))
            .catch(err => res.status(500).json({ message: 'Error counting users', data: err }));
    } else {
        User.find(query)
            .sort(sort)
            .select(select)
            .skip(skip)
            .limit(limit)
            .then(users => res.json({ message: 'OK', data: users }))
            .catch(err => res.status(500).json({ message: 'Error fetching users', data: err }));
    }
};

exports.getUserById = (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found', data: {} });
            }
            res.json({ message: 'OK', data: user });
        })
        .catch(err => res.status(500).json({ message: 'Error fetching user', data: err }));
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    console.log("Received email:", normalizedEmail);

    try {
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id },
            SECRET_KEY, 
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    sport: user.sport,
                    elo: user.elo
                }
            }
        });
    } catch (err) {
        console.log("Error during login:", err);
        res.status(500).json({ message: 'Error logging in', data: err });
    }
};




exports.verifyUser = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Token is valid',
            user: { id: user._id, email: user.email, name: user.name },
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};


exports.createUser = async (req, res) => {
    const { firstName, middleName, lastName, gender, dateOfBirth, email, password, sport, elo } = req.body;

    const normalizedEmail = email.toLowerCase();

    if (!firstName || !lastName || !email || !password || !sport || !elo || !gender || !dateOfBirth) {
        return res.status(400).json({ message: 'All fields are required', data: {} });
    }

    try {
        const newUser = new User({
            firstName,
            middleName,
            lastName,
            gender,
            dateOfBirth,
            email: normalizedEmail,
            password,
            sport,
            elo
        });

        await newUser.save(); 

        res.status(201).json({ message: 'User created', data: newUser });
    } catch (err) {
        console.log("Error creating user:", err);
        res.status(500).json({ message: 'Error creating user', data: err });
    }
};





exports.updateUser = async (req, res) => {
    const { firstName, middleName, lastName, gender, dateOfBirth, email, password, sport, elo } = req.body;

    if (!firstName || !lastName || !email || !password || !sport || !elo || !gender || !dateOfBirth) {
        return res.status(400).json({ message: 'All fields are required', data: {} });
    }

    try {
        const sports = await Sport.find({ '_id': { $in: sport } });
        if (sports.length !== sport.length) {
            return res.status(400).json({ message: 'One or more sport IDs are invalid', data: {} });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, middleName, lastName, gender, dateOfBirth, email, password, sport, elo },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found', data: {} });
        }

        res.json({ message: 'User updated', data: updatedUser });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', data: err });
    }
};



exports.deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found', data: {} });
            }
            res.json({ message: 'User deleted', data: {} });
        })
        .catch(err => res.status(500).json({ message: 'Error deleting user', data: err }));
};
