const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

/**
 * Register a new user.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise} A promise that resolves when the user is registered.
 */
exports.registerUser = async (req, res) => {
  const { username, email, password, adminCode } = req.body;
  try {    
    const hashedPassword = await bcrypt.hash(password, 10);
    let isAdmin = 0;
    let isApproved = 0;

    // check if the user should be an admin
    if (adminCode && adminCode === process.env.ADMIN_CODE) {
      isAdmin = 1;
      isApproved = 1;
    } else {
      // WARNING: this should not be used at scale, or for any public-facing apps
      // if there's *NO* admin code set, authorize this user
      const numUsers = await User.countUsers();
      if (numUsers === 0) {
        isAdmin = 1;
        isApproved = 1;
      }
    }

    const user = await User.create(username, email, hashedPassword, isAdmin, isApproved);
    res.status(201).json({
      message: 'User successfully registered!',
      user,
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
  
  // const username = req.user;
  const username = req.user.username; // populated from authMiddleware and jwtService
  // try to find the username, error if we can't find them
  try {
    const user = await User.findByUsername(username);
    if(user) {
      res.json({ username: user.username, email: user.email });
    } else {
      res.status(404).send('User not found');
    }
  }
  catch {
    res.status(500).json({ error: 'Internal server error!'});
  }
};

// TODO: delete user, update user profile, profile page