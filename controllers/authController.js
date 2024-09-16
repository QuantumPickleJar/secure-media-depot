const bcrypt = require('bcryptjs');
const db = require('../database/db');
const jwtService = require('../services/jwtService')


/**
 * Authenticates a user and generates a JWT token.
 *
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {string} The generated JWT token.
 */
exports.loginUser = (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
  
    if (err) {
      return res.status(500).send('Server error');
    }

    if (!user) {
      return res.status(400).send('Invalid username or password');
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).send('Invalid username or password');
      }

      const token = jwtService.generateToken({ username });
      res.json({ token });
    } catch (error) {
      res.status(500).send('Server error');
  }
  });
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