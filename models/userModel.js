// models/userModel.js
const db = require('../database/db');
const bcrypt = require('bcryptjs');

const User = {};

/**
 * Creates a new user.
 *
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} A promise that resolves to the created user object.
 */
User.create = async (username, email, password, isAdmin = 0, isApproved = 0) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO users (username, email, password, isAdmin, isApproved) VALUES (?, ?, ?)`,
            [username, email, hashedPassword, isAdmin, isApproved],
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
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<Object>} A promise that resolves to the found user object, or null if not found.
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

/**
 * Counts the number of users.
 *
 * @returns {Promise<number>} A promise that resolves to the number of users.
 */
User.countUsers = () => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT COUNT(*) as count FROM users`,
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count);
                }
            }
        );
    });
}

module.exports = User;
