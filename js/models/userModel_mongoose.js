const mongoose = require('mongoose');

/**
 * Defines a User object, who area able to log in and view Files.
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    /**
     * We *could* have something to resolve IP addresses
     * to a general location, so we could send an alert if 
     * a breach is suspected
     */
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('user', userSchema);
