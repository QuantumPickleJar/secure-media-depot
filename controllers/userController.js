const bcrypt = require('bcrypt');
const db = require('./db');

/**
 * Registers a new user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
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