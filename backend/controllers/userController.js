const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Secret key for JWT (should be stored in environment variables)
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

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ message: 'Error comparing passwords' });
                }

                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }

                const token = jwt.sign(
                    { userId: user._id },
                    'your_jwt_secret', 
                    { expiresIn: '1h' }
                );

                res.json({
                    message: 'Login successful',
                    data: {
                        token,
                        user: {
                            name: user.name,
                            email: user.email,
                            sport: user.sport,
                            elo: user.elo
                        }
                    }
                });
            });
        })
        .catch(err => res.status(500).json({ message: 'Error logging in', data: err }));
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


exports.createUser = (req, res) => {
    const { name, email, password, sport, elo } = req.body;

    if (!name || !email || !password || !sport || !elo) {
        return res.status(400).json({ message: 'Name, Email, Password, and Sport are required', data: {} });
    }

    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists', data: {} });
            }

            const newUser = new User({ name, email, password, sport, elo }); 
            newUser.save()
                .then(user => res.status(201).json({ message: 'User created', data: user }))
                .catch(err => res.status(500).json({ message: 'Error creating user', data: err }));
        })
        .catch(err => res.status(500).json({ message: 'Error checking user existence', data: err }));
};


exports.updateUser = (req, res) => {
    const { name, email, password, sport, elo } = req.body;

    if (!name || !email || !password || !sport || !elo) {
        return res.status(400).json({ message: 'Name, Email, Password, Sport, elo are required', data: {} });
    }

    User.findByIdAndUpdate(req.params.id, { name, email, password, sport, elo }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found', data: {} });
            }
            res.json({ message: 'User updated', data: user });
        })
        .catch(err => res.status(500).json({ message: 'Error updating user', data: err }));
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
