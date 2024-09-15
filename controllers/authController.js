const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');



/**
 * Generates a JSON Web Token for the given username.
 *
 * @param {string} username - The username to include in the JWT payload.
 * @returns {string} The generated JWT.
 */
const token = jwt.sign({ username }, 'your_jwt_secret_key', { expiresIn: '1h' });

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

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid username or password');
    }

    res.json({ token });
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