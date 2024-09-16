// models/userModel.js
const db = require('../database/db');
const bcrypt = require('bcryptjs');

const User = {};

/**
 * Creates a new user.
 */
User.create = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, username, email });
        }
      }
    );
  });
};

/**
 * Finds a user by username.
 */
User.findByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM users WHERE username = ?`,
      [username],
      (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      }
    );
  });
};

module.exports = User;
