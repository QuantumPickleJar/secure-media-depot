/**
 * @module controllers/authController
 * Responsible for defining the server's response to request and responses
 * related to authentication (logging in/out)
 */
const bcrypt = require('bcryptjs');
const jwtService = require('../services/jwtService');
const User = require('../models/userModel');

/**
 * Authenticates a user and generates a JWT token.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.getByUsername(username);

    if (!user) {
      return res.status(400).send('Invalid username or password');
    }

    if (user.isApproved === 0) {
      return res.status(403).send('Your account is awaiting approval.');
    }

    // Verify the entered password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid username or password');
    }

    const token = jwtService.generateToken({ username: user.username, isAdmin: user.isAdmin });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/** Note: For JWT, logout can be handled on the client-side by deleting the token.  
 * Alternatively, implement token blacklisting on the server-side if necessary.
 */
exports.logoutUser = (req, res) => {
  res.send('Logout successful');
};

// TODO: Password reset logic
