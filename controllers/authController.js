const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
    if (err || !user) {
      return res.status(400).send('Invalid username or password');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid username or password');
    }

    res.json({ token });
  });
};