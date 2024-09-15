const bcrypt = require('bcrypt');
const db = require('../database/db');

/**
 * Register a new user.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise} A promise that resolves when the user is registered.
 */
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], (err) => {
    if (err) {
      return res.status(400).send('Username already exists.');
    }
    res.status(201).send('User registered successfully');
  });
};

exports.getUserProfile = (req, res) => {
  const username = req.user.username;

  db.get(`SELECT username FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) {
      return res.status(500).send('Server error');
    }
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json({ username: user.username });
  });
};

// TODO: delete user, update user profile