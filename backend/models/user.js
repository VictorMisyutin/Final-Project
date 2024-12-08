const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sport: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sport' }],
    elo: { type: Number, required: true },
    dateCreated: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next(); 
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        this.password = hashedPassword;
        next();
    });
});

module.exports = mongoose.model('User', UserSchema);
