const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;

/**
 * Generates a JWT token with the given payload
 * @param {Object} payload - The payload to be included in the token.
 * @returns {string} - The generated JWT token.
 */
function generateToken(payload) {
   return jwt.sign(payload, secretKey, { expiresIn: '1h' });
//    return jwt.sign(
//   return jwt.sign(payload, secretKey, { expiresIn: '1h' });    secretKey,
//     { expiresIn: '1h'}
//    );
};

/**
 * Verifies the validity of a JWT token.
 * @param {string} token - The JWT token to be verified.
 * @returns {Object} - The decoded payload if the token is valid.
 * @throws {Error} - If the token is invalid or has expired.
 */
function verifyToken(token) {
    return jwt.verify(token, secretKey);
};
module.exports = {
    verifyToken,
    generateToken
}
