/**
 * @module models/userModel.js
 * 
 * @todo Abstract SQL calls with a dedicated service. 
 * This might make sense to refactor into authService?
 * 
 */
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
User.create = (username, email, password, isAdmin = 0, isApproved = 0) => {
    return new Promise(async (resolve, reject) => {    
    const hashedPassword = await bcrypt.hash(password, 10);
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
User.getByUsername = (username) => {
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
 * Retrieves a user from the database by their unique userId
 * @param {string} userId 
 * @returns 
 */
User.getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    db.get(
        `SELECT * FROM users WHERE id = ?`,[userId], (err, user) => {
            if (err) {
                // console.error('Failed to find user with given id:', err);
                reject(err);
            } else {
                resolve(user);
            }
        }
    );
  });
}

/**
 * Counts the number of users.
 *
 * @returns {Promise<number>} A promise that resolves to the number of users.
 */
User.countUsers = () => {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as userCount FROM users', [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.userCount);
        }
      });
    });
  };

  
// TODO: finish implementing
// User.getAllUsers= () => {
//     // wrap in a promise to keep the UX flow smoother
//     return new Promise(async (resolve, reject) => {

//       db.get('SELECT * FROM users', [] (err,row) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(row.userCount);
//         }
//       });
//     });
  
// }




module.exports = User;
