const bcrypt = require('bcryptjs');
const db = require('../database/db');
const jwtService = require('../services/jwtService')
const { promisify } = require('util');
const User = require('../models/userModel');

// instead of using db.get, we can wrap it in a Promise with promisify
const dbGet = promisify(db.get).bind(db);

/**
 * Authenticates a user and generates a JWT token.
 *
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {string} The generated JWT token.
 */
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  // pre-promise wrapping: 
  // db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
  try {
    
    // const user = await dbGet(`SELECT * FROM users WHERE username = ?`, [username]);
    const user = await User.findByUsername(username);

    if (!user) {
      return res.status(400).send('Invalid username or password');
    }

    if (user.isApproved === 0) {
      return res.status(403).send('Your account is awaiting approval.');
    }

    // verify the entered password, and reject if it doesn't match
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid username or password');
    }

    const token = jwtService.generateToken({ username: user.username, isAdmin: user.isAdmin });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Server error'});
  }
};

/** Note: for jwt, logout can be handled on the client-side by deleting the token.  
/*  Alternatively, implement token blacklisting on the server-side if necessary.
 */
exports.logoutUser = (req, res) => {
  // req.logout();
  // res.redirect('/');\\ 
  res.send('Logout successful');
}

// TODO: password reset logic