const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config();    // load environment variables


/**
 * Register a new user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.registerUser = async (req, res) => {
  const { username, email, password, adminCode } = req.body;
  try {    
    // without requiring an admin code, we can do a two-in-one and admin-ify the first 
    // user that's added.
    const numUsers = await User.countUsers();
    let isAdmin = 0;
    let isApproved = 0;

    // check if the user should be an admin
    if (adminCode && adminCode === process.env.ADMIN_CODE) {
      isAdmin = 1;
      isApproved = 1;
    } else if (numUsers === 0) {
        // first user is an admin
        isAdmin = 1;
        isApproved = 1;
      }
      else {
        // standard users are assumed anonymous (i.e a QR code at a local cafe)
        // and require approval for any sort of access.
        isApproved = 0;
      }

    // With the role sorted out, we can proceed with creating the user 
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(username, email, hashedPassword, isAdmin, isApproved);

    res.status(201).json({
      message: 'User successfully registered!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        isApproved: user.isApproved,
      },
    });
  } catch (err) {     // print an error here for easier stack trace readability
    console.error('Registration error:', err);
    if (err.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Username/email already in use' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

/**
 * Get user profile information.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getUserProfile = async (req, res) => {
  
  // const username = req.user;
  const username = req.user.username; // populated from authMiddleware and jwtService
  // try to find the username, error if we can't find them
  try {
    const user = await User.findByUsername(username);
    if(user) {
      res.json({ username: user.username, email: user.email, isAdmin: user.isAdmin });
    } else {
      res.status(404).json({error: 'User not found'});
    }
  }
  catch {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Internal server error!'});
  }
};

// TODO: delete user, update user profile, profile page