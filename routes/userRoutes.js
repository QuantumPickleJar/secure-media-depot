/**
 * @module routes/userRoutes
 * Responsible for defining the server's response to request and responses
 * related to user data. 
 * 
 * Operations include handling: 
 * - new account registration requests
 * - modifying a user's own profile information
 * - (once implemented) through a to-be-implemented service, notify the user
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../auth/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiter for registration
const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many accounts created from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
  });

/**
 * Route for user registration.
 * @name POST /register
 * @function
 * @memberof module:userRoutes
 * @param {function} userController.registerUser 
 * The controller function for user registration.
 */
router.post('/register', registrationLimiter, userController.registerUser);

/**
 * Route for getting user profile.
 * @name POST /profile
 * @function
 * @memberof module:userRoutes
 * @param {function} authenticateJWT 
 * The middleware function for authenticating JWT.
 * @param {function} userController.getUserProfile 
 * The controller function for getting user profile.
 */
router.get('/profile', authenticateJWT, userController.getUserProfile);

module.exports = router;