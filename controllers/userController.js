const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

/**
 * Register a new user.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise} A promise that resolves when the user is registered.
 */
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userCount = await User.countUsers();  // Assuming this returns the total user count
    const isAdmin = userCount === 0 ? 1 : 0;      // First user is admin
    const isApproved = userCount === 0 ? 1 : 0;   // First user is auto-approved

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(username, email, hashedPassword, isAdmin, isApproved);
    res.status(201).json({
      message: 'User successfully registered!',
      user
    });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Username/email already in use' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};


exports.getUserProfile = async (req, res) => {
  const username = req.user;
  // try to find the username, error if we can't find them
  try {
    const user = await User.findByUsername;
    if(user) {
      res.json({ username: user.username, email: user.email });
    }
    if (err || !user) {
      res.status(404).send('User not found');
    }
  }
  catch {
    res.status(500).json({ error: 'Internal server error!'});
  }
};

// TODO: delete user, update user profile, profile page